"""DayBreak alarm manager: storage, scheduling and running alarms."""

from __future__ import annotations

from collections.abc import Callable
from copy import deepcopy
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from functools import partial
import inspect
import logging
import re
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.const import (
    ATTR_ENTITY_ID,
    EVENT_CORE_CONFIG_UPDATE,
    STATE_OFF,
    STATE_ON,
)
from homeassistant.core import (
    CALLBACK_TYPE,
    Context,
    Event,
    EventStateChangedData,
    HomeAssistant,
    callback,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import (
    config_validation as cv,
    device_registry as dr,
    entity_registry as er,
)
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_call_later,
    async_track_point_in_utc_time,
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.script import Script, async_validate_actions_config
from homeassistant.helpers.storage import Store
from homeassistant.helpers.target import (
    TargetSelection,
    async_extract_referenced_entity_ids,
)
from homeassistant.util import dt as dt_util

from . import astro
from .const import (
    ACTIVE_STATES,
    DOMAIN,
    END_AUTO_STOP,
    END_AWAY,
    END_DISABLED,
    END_LAST_CALL_TIMEOUT,
    END_MANUAL_OFF,
    END_STOPPED,
    EVENT_ALARM_FINISHED,
    EVENT_ALARM_RINGING,
    EVENT_ALARM_SHIFTED,
    EVENT_ALARM_SKIPPED,
    EVENT_ALARM_SNOOZED,
    EVENT_ALARM_STOPPED,
    EVENT_LAST_CALL,
    EVENT_SUNRISE_STARTED,
    SIGNAL_ALARM_ADDED,
    SIGNAL_ALARMS_CHANGED,
    STATE_DISABLED,
    STATE_IDLE,
    STATE_LAST_CALL,
    STATE_RINGING,
    STATE_SCHEDULED,
    STATE_SNOOZED,
    STATE_SUNRISE,
    STORAGE_KEY,
    STORAGE_VERSION,
    signal_alarm_updated,
)
from .curve import Capabilities, LightCommand, command_at, to_brightness_255
from .models import (
    BUILTIN_LAST_CALL_PROFILES,
    BUILTIN_LIGHT_PROFILES,
    merge_alarm,
    migrate_store_v1,
    validate_alarm,
    validate_last_call_profile,
    validate_light_profile,
    validate_settings,
)
from .scheduler import SEARCH_DAYS, is_one_time, light_lead_on, next_occurrence
from .shift import ShiftInputs, ShiftResult, evaluate

_LOGGER = logging.getLogger(__name__)

# A test run rings this long at most before the last call / auto stop.
TEST_MAX_RING = timedelta(minutes=2)
# In a test run the last call lasts at most this long.
TEST_LAST_CALL = timedelta(minutes=1)
# "Switch off later" after stopping.
OFF_LATER = timedelta(minutes=30)
# How long the "OK to get up" light of a kids alarm stays green.
KIDS_GREEN = timedelta(minutes=30)
# Shift rules are checked this long before the light starts, and every few minutes.
SHIFT_LOOKAHEAD = timedelta(hours=3)
SHIFT_INTERVAL = timedelta(minutes=5)
# Ringing effects.
EFFECT_INTERVAL = timedelta(seconds=2)
PULSE_LOW = 0.35
# Snoozing dims to the level of this point of the curve.
SNOOZE_LEVEL = 0.5

KIDS_STAY = LightCommand(brightness_pct=15, kelvin=2000, rgb=(255, 40, 0))
KIDS_GO = LightCommand(brightness_pct=60, kelvin=5000, rgb=(40, 255, 60))

_HOME_STATES = {"home", STATE_ON}
_UNKNOWN_STATES = {"unknown", "unavailable"}
_SUPPORT_TRANSITION = 32  # LightEntityFeature.TRANSITION
_WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
_WARNING_LEVEL_RE = re.compile(r"^(warning_\d+_level|level|max_level)$")

_MESSAGES: dict[str, dict[str, str]] = {
    "skipped": {
        "en": "Skipped: nobody is at home.",
        "de": "Ausgelassen: niemand ist zu Hause.",
    },
    "shifted": {
        "en": "Rings {minutes} min earlier ({reasons}): {time}.",
        "de": "Klingelt {minutes} Min. früher ({reasons}): {time}.",
    },
    "shift_reset": {
        "en": "Back to the normal time: {time}.",
        "de": "Wieder normale Zeit: {time}.",
    },
    "device_unavailable": {
        "en": "Lights not available: {lights}.",
        "de": "Lampen nicht erreichbar: {lights}.",
    },
    "failed": {
        "en": "Could not control the lights: {lights}.",
        "de": "Lampen konnten nicht geschaltet werden: {lights}.",
    },
    "last_call": {
        "en": "Last call: nobody reacted.",
        "de": "Letzter Versuch: niemand hat reagiert.",
    },
    "started": {"en": "Sunrise started.", "de": "Sonnenaufgang gestartet."},
    "finished": {"en": "Alarm finished.", "de": "Wecker beendet."},
}


class DaybreakError(HomeAssistantError):
    """Error with a machine-readable code for the frontend."""

    def __init__(self, code: str, message: str | None = None, **info: Any) -> None:
        super().__init__(message or code)
        self.code = code
        self.info = info


class DaybreakStore(Store[dict[str, Any]]):
    """Storage with migration of older DayBreak versions."""

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
    ) -> dict[str, Any]:
        if old_major_version < 2:
            return migrate_store_v1(old_data)
        return old_data


@dataclass
class LightGroup:
    """Lights that share one set of light settings."""

    lights: list[str]
    settings: dict[str, Any]
    # Fraction of the ramp that passes before this group starts.
    offset: float = 0.0
    caps: dict[str, Capabilities] = field(default_factory=dict)
    started: bool = False


@dataclass
class AlarmRun:
    """State of one running alarm."""

    kind: str
    base_time: datetime
    alarm_time: datetime
    light_start: datetime
    groups: list[LightGroup]
    context: Context
    test: bool = False
    # A shortened ramp continues from this point instead of the light start.
    anchor_time: datetime | None = None
    anchor_progress: float = 0.0
    ring_started: datetime | None = None
    snooze_until: datetime | None = None
    snoozes: int = 0
    snooze_end: datetime | None = None
    last_call_started: datetime | None = None
    unsubs: list[CALLBACK_TYPE] = field(default_factory=list)
    timer: CALLBACK_TYPE | None = None
    end_timer: CALLBACK_TYPE | None = None
    effect_unsub: CALLBACK_TYPE | None = None
    effect_phase: bool = False
    scripts: list[Script] = field(default_factory=list)
    # Suppress "manual off" detection while we switch the lights off ourselves.
    lights_off_by_us: bool = False
    failed: set[str] = field(default_factory=set)
    shift: ShiftResult = field(default_factory=ShiftResult)

    @property
    def lights(self) -> list[str]:
        return sorted({light for group in self.groups for light in group.lights})

    def progress(self, at: datetime) -> float:
        """Position on the ramp (0 = light start, 1 = alarm time)."""
        start = self.anchor_time or self.light_start
        p0 = self.anchor_progress if self.anchor_time else 0.0
        total = (self.alarm_time - start).total_seconds()
        if total <= 0:
            return 1.0
        return min(1.0, max(0.0, p0 + (1 - p0) * (at - start).total_seconds() / total))

    def reanchor(self, now: datetime, alarm_time: datetime) -> None:
        """Move the alarm time; the ramp continues from where it is now."""
        self.anchor_progress = self.progress(now)
        self.anchor_time = now
        self.alarm_time = alarm_time

    def cancel_timer(self) -> None:
        if self.timer:
            self.timer()
            self.timer = None

    def stop_effect(self) -> None:
        if self.effect_unsub:
            self.effect_unsub()
            self.effect_unsub = None

    def cancel_all(self) -> None:
        self.cancel_timer()
        self.stop_effect()
        if self.end_timer:
            self.end_timer()
            self.end_timer = None
        while self.unsubs:
            self.unsubs.pop()()


@dataclass
class AlarmRuntime:
    """Scheduling state of one alarm."""

    base_time: datetime | None = None
    shift: ShiftResult = field(default_factory=ShiftResult)
    # Base time the current shift was computed for.
    shift_for: datetime | None = None
    next_alarm: datetime | None = None
    trigger_at: datetime | None = None
    timer: CALLBACK_TYPE | None = None
    run: AlarmRun | None = None
    off_later: CALLBACK_TYPE | None = None


class DaybreakManager:
    """Owns all alarms, profiles and settings of the integration."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store = DaybreakStore(hass, STORAGE_VERSION, STORAGE_KEY)
        self.alarms: dict[str, dict[str, Any]] = {}
        self.settings: dict[str, Any] = validate_settings({})
        self.light_profiles: dict[str, dict[str, Any]] = {}
        self.last_call_profiles: dict[str, dict[str, Any]] = {}
        # Base alarm time (ISO, UTC) up to which an alarm has been handled. Prevents a
        # stopped sunrise from starting again before its alarm time is reached.
        self._handled: dict[str, str] = {}
        self._runtime: dict[str, AlarmRuntime] = {}
        self._holidays: dict[date, bool] = {}
        self._unsubs: list[CALLBACK_TYPE] = []

    # ------------------------------------------------------------------ setup

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        try:
            self.settings = validate_settings(data.get("settings", {}))
        except Exception:
            _LOGGER.exception("Invalid stored DayBreak settings, using defaults")
        for key, validator, target in (
            ("light_profiles", validate_light_profile, self.light_profiles),
            ("last_call_profiles", validate_last_call_profile, self.last_call_profiles),
        ):
            for raw in data.get(key, []):
                try:
                    profile = validator(raw)
                except Exception:
                    _LOGGER.exception("Dropping invalid stored profile %s", raw.get("id"))
                    continue
                target[profile["id"]] = profile
        for raw in data.get("alarms", []):
            try:
                alarm = validate_alarm(raw)
            except Exception:
                _LOGGER.exception("Dropping invalid stored alarm %s", raw.get("id"))
                continue
            self.alarms[alarm["id"]] = alarm
        self._handled = dict(data.get("handled", {}))
        # Create every runtime first: listeners of the dispatches below read all alarms.
        self._runtime = {alarm_id: AlarmRuntime() for alarm_id in self.alarms}
        for alarm_id in self.alarms:
            async_dispatcher_send(self.hass, SIGNAL_ALARM_ADDED, alarm_id)
            self._schedule(alarm_id)
        self._unsubs.append(
            self.hass.bus.async_listen(EVENT_CORE_CONFIG_UPDATE, self._on_core_config_update)
        )
        self._unsubs.append(
            async_track_time_interval(self.hass, self._job(self._async_shift_tick), SHIFT_INTERVAL)
        )
        self._unsubs.append(
            async_track_time_change(
                self.hass, self._job(self.async_refresh_holidays), hour=0, minute=5, second=0
            )
        )
        self.hass.async_create_task(self.async_refresh_holidays(), eager_start=False)

    async def async_unload(self) -> None:
        while self._unsubs:
            self._unsubs.pop()()
        for runtime in self._runtime.values():
            if runtime.timer:
                runtime.timer()
            if runtime.off_later:
                runtime.off_later()
            if runtime.run:
                runtime.run.cancel_all()

    @callback
    def _on_core_config_update(self, _event: Event) -> None:
        """Time zone or location may have changed: recompute all schedules."""
        self._schedule_all()

    @callback
    def _schedule_all(self) -> None:
        for alarm_id in self.alarms:
            self._schedule(alarm_id)

    @callback
    def _save(self) -> None:
        self._store.async_delay_save(self._data_to_save, 1)

    def _data_to_save(self) -> dict[str, Any]:
        return {
            "alarms": list(self.alarms.values()),
            "settings": self.settings,
            "light_profiles": list(self.light_profiles.values()),
            "last_call_profiles": list(self.last_call_profiles.values()),
            "handled": self._handled,
        }

    # ------------------------------------------------------------------- CRUD

    def get(self, alarm_id: str) -> dict[str, Any]:
        try:
            return self.alarms[alarm_id]
        except KeyError as err:
            raise DaybreakError("unknown_alarm", f"Unknown alarm {alarm_id}") from err

    async def async_create(self, data: dict[str, Any]) -> dict[str, Any]:
        data = {key: value for key, value in data.items() if key != "id"}
        alarm = validate_alarm(data)
        self.alarms[alarm["id"]] = alarm
        self._runtime[alarm["id"]] = AlarmRuntime()
        self._save()
        async_dispatcher_send(self.hass, SIGNAL_ALARM_ADDED, alarm["id"])
        self._schedule(alarm["id"])
        if not alarm["wake_on_holidays"]:
            self.hass.async_create_task(self.async_refresh_holidays(), eager_start=False)
        return alarm

    async def async_update(self, alarm_id: str, changes: dict[str, Any]) -> dict[str, Any]:
        current = self.get(alarm_id)
        alarm = merge_alarm(current, changes)
        # A new time or new days make an old skip meaningless.
        if (alarm["wake"], alarm["repeat"]) != (
            current["wake"],
            current["repeat"],
        ) and "skip_date" not in changes:
            alarm["skip_date"] = None
        self.alarms[alarm_id] = alarm
        self._save()
        if alarm["name"] != current["name"]:
            self._rename_device(alarm_id, alarm["name"])
        runtime = self._runtime[alarm_id]
        if not alarm["enabled"] and runtime.run and not runtime.run.test:
            self._end_run(alarm_id, END_DISABLED)
        if alarm["shift"] != current["shift"]:
            runtime.shift_for = None
        self._schedule(alarm_id)
        if current["wake_on_holidays"] and not alarm["wake_on_holidays"]:
            self.hass.async_create_task(self.async_refresh_holidays(), eager_start=False)
        return alarm

    async def async_delete(self, alarm_id: str) -> None:
        self.get(alarm_id)
        runtime = self._runtime.pop(alarm_id)
        if runtime.timer:
            runtime.timer()
        if runtime.off_later:
            runtime.off_later()
        if runtime.run:
            runtime.run.cancel_all()
        del self.alarms[alarm_id]
        self._handled.pop(alarm_id, None)
        self._save()
        dev_reg = dr.async_get(self.hass)
        if device := dev_reg.async_get_device(identifiers={(DOMAIN, alarm_id)}):
            dev_reg.async_remove_device(device.id)
        async_dispatcher_send(self.hass, SIGNAL_ALARMS_CHANGED)

    def _rename_device(self, alarm_id: str, name: str) -> None:
        dev_reg = dr.async_get(self.hass)
        if device := dev_reg.async_get_device(identifiers={(DOMAIN, alarm_id)}):
            dev_reg.async_update_device(device.id, name=name)

    async def async_set_once(
        self, alarm_id: str, day: str, at: str, light_lead: int | None = None
    ) -> None:
        """Ring at a different time on one day only ("only tomorrow")."""
        self.get(alarm_id)
        await self.async_update(
            alarm_id, {"once": {"date": day, "time": at, "light_lead": light_lead}}
        )

    async def async_clear_once(self, alarm_id: str) -> None:
        self.get(alarm_id)
        await self.async_update(alarm_id, {"once": None})

    # --------------------------------------------------------------- settings

    async def async_update_settings(self, changes: dict[str, Any]) -> dict[str, Any]:
        self.settings = validate_settings({**self.settings, **changes})
        self._save()
        for runtime in self._runtime.values():
            runtime.shift_for = None
        self._schedule_all()
        self.hass.async_create_task(self.async_refresh_holidays(), eager_start=False)
        return self.settings

    def snooze_minutes(self, alarm: dict[str, Any]) -> int:
        presets = {p["id"]: p for p in self.settings["snooze_presets"]}
        preset = presets.get(alarm["snooze"]["preset"] or "") or presets.get(
            self.settings["default_snooze"]
        )
        return preset["minutes"] if preset else 9

    def snooze_count(self, alarm: dict[str, Any]) -> int:
        return alarm["snooze"]["count"] or self.settings["default_snooze_count"]

    # --------------------------------------------------------------- profiles

    def all_light_profiles(self) -> list[dict[str, Any]]:
        return [*deepcopy(BUILTIN_LIGHT_PROFILES), *self.light_profiles.values()]

    def all_last_call_profiles(self) -> list[dict[str, Any]]:
        return [*deepcopy(BUILTIN_LAST_CALL_PROFILES), *self.last_call_profiles.values()]

    def light_profile(self, profile_id: str | None) -> dict[str, Any] | None:
        if not profile_id:
            return None
        if profile_id in self.light_profiles:
            return self.light_profiles[profile_id]
        return next((p for p in BUILTIN_LIGHT_PROFILES if p["id"] == profile_id), None)

    def last_call_profile(self, profile_id: str | None) -> dict[str, Any]:
        for pid in (profile_id, self.settings["default_last_call"], "all_on"):
            if pid in self.last_call_profiles:
                return self.last_call_profiles[pid]
            for profile in BUILTIN_LAST_CALL_PROFILES:
                if profile["id"] == pid:
                    return profile
        return BUILTIN_LAST_CALL_PROFILES[0]

    def profile_users(self, kind: str, profile_id: str) -> list[str]:
        """Alarms that use a light ("light") or last call ("last_call") profile."""
        users = []
        for alarm_id, alarm in self.alarms.items():
            if kind == "last_call":
                used = alarm["last_call"]["profile"] == profile_id
            else:
                light = alarm["light"]
                used = light["profile"] == profile_id or any(
                    o["profile"] == profile_id for o in light["overrides"]
                )
            if used:
                users.append(alarm_id)
        return users

    def _check_profile_editable(
        self, kind: str, profile_id: str, *, confirm: bool, deleting: bool = False
    ) -> None:
        store = self.light_profiles if kind == "light" else self.last_call_profiles
        if profile_id not in store:
            builtin = BUILTIN_LIGHT_PROFILES if kind == "light" else BUILTIN_LAST_CALL_PROFILES
            if any(p["id"] == profile_id for p in builtin):
                raise DaybreakError("profile_builtin", "Built-in profiles cannot be changed")
            raise DaybreakError("unknown_profile", f"Unknown profile {profile_id}")
        users = self.profile_users(kind, profile_id)
        if deleting and users:
            raise DaybreakError("profile_in_use", "Profile is still in use", alarms=users)
        owner_sets = {
            tuple(sorted(self.alarms[a]["owners"])) for a in users if self.alarms[a]["owners"]
        }
        if len(owner_sets) > 1:
            # Used by alarms of different people: changing it would change
            # somebody else's alarm. Save as a new profile instead.
            raise DaybreakError("profile_shared", "Profile is shared", alarms=users)
        if len(users) > 1 and not confirm:
            raise DaybreakError(
                "profile_confirm", "Profile is used by several alarms", alarms=users
            )

    async def async_save_profile(
        self, kind: str, data: dict[str, Any], *, confirm: bool = False
    ) -> dict[str, Any]:
        """Create (no id) or update a light or last call profile."""
        store = self.light_profiles if kind == "light" else self.last_call_profiles
        validator = validate_light_profile if kind == "light" else validate_last_call_profile
        profile_id = data.get("id")
        if profile_id:
            self._check_profile_editable(kind, profile_id, confirm=confirm)
        profile = validator({k: v for k, v in data.items() if k != "builtin"})
        store[profile["id"]] = profile
        self._save()
        if profile_id:
            for alarm_id in self.profile_users(kind, profile_id):
                self._schedule(alarm_id)
        async_dispatcher_send(self.hass, SIGNAL_ALARMS_CHANGED)
        return profile

    async def async_delete_profile(self, kind: str, profile_id: str) -> None:
        self._check_profile_editable(kind, profile_id, confirm=True, deleting=True)
        store = self.light_profiles if kind == "light" else self.last_call_profiles
        del store[profile_id]
        if self.settings["default_last_call"] == profile_id:
            self.settings["default_last_call"] = "all_on"
        self._save()
        async_dispatcher_send(self.hass, SIGNAL_ALARMS_CHANGED)

    # ------------------------------------------------------------- read state

    def state(self, alarm_id: str) -> str:
        alarm = self.alarms[alarm_id]
        runtime = self._runtime[alarm_id]
        if run := runtime.run:
            if run.last_call_started:
                return STATE_LAST_CALL
            if run.snooze_until:
                return STATE_SNOOZED
            if run.ring_started:
                return STATE_RINGING
            return STATE_SUNRISE
        if not alarm["enabled"]:
            return STATE_DISABLED
        if runtime.next_alarm:
            return STATE_SCHEDULED
        return STATE_IDLE

    def next_alarm(self, alarm_id: str) -> datetime | None:
        return self._runtime[alarm_id].next_alarm

    def runtime_info(self, alarm_id: str) -> dict[str, Any]:
        """Serializable runtime info for the frontend."""
        runtime = self._runtime[alarm_id]
        run = runtime.run

        def iso(value: datetime | None) -> str | None:
            return value.isoformat() if value else None

        alarm = self.alarms[alarm_id]
        return {
            "state": self.state(alarm_id),
            "next_alarm": iso(runtime.next_alarm),
            "next_base": iso(runtime.base_time),
            "next_light_start": iso(runtime.trigger_at),
            # Kept for 0.1 cards.
            "next_sunrise": iso(runtime.trigger_at),
            "shift": runtime.shift.minutes,
            "shift_parts": runtime.shift.parts,
            "run_shift": run.shift.minutes if run else 0,
            "snooze_minutes": self.snooze_minutes(alarm),
            "snooze_count": self.snooze_count(alarm),
            "test": bool(run and run.test),
            "alarm_time": iso(run.alarm_time) if run else None,
            "light_start": iso(run.light_start) if run else None,
            "sunrise_start": iso(run.light_start) if run else None,
            "ring_started": iso(run.ring_started) if run else None,
            "snooze_until": iso(run.snooze_until) if run else None,
            "snoozes": run.snoozes if run else 0,
            "snooze_end": iso(run.snooze_end) if run else None,
            "last_call_started": iso(run.last_call_started) if run else None,
        }

    def as_dict(self, alarm_id: str) -> dict[str, Any]:
        return {**self.alarms[alarm_id], "runtime": self.runtime_info(alarm_id)}

    def next_overall(self) -> tuple[str, datetime] | None:
        """The enabled alarm that rings next."""
        upcoming = [
            (runtime.next_alarm, alarm_id)
            for alarm_id, runtime in self._runtime.items()
            if runtime.next_alarm and self.alarms[alarm_id]["kind"] == "wake"
        ]
        if not upcoming:
            return None
        when, alarm_id = min(upcoming)
        return alarm_id, when

    def active_alarms(self) -> list[str]:
        return [alarm_id for alarm_id in self.alarms if self.state(alarm_id) in ACTIVE_STATES]

    def sun_times(self, day: date) -> dict[str, str | None]:
        return {
            name: value.isoformat() if value else None
            for name, value in astro.sun_events(self.hass, day).items()
        }

    @callback
    def _notify(self, alarm_id: str) -> None:
        async_dispatcher_send(self.hass, signal_alarm_updated(alarm_id))
        async_dispatcher_send(self.hass, SIGNAL_ALARMS_CHANGED)

    # ------------------------------------------------------------- scheduling

    def _tz(self):
        return dt_util.get_default_time_zone()

    def _sun(self, day: date, event: str) -> datetime | None:
        return astro.sun_event(self.hass, day, event)

    def _is_holiday(self, day: date) -> bool:
        return self._holidays.get(day, False)

    def _lead(self, alarm: dict[str, Any], base: datetime) -> int:
        if not self._has_target(alarm["light"]["targets"]):
            return 0
        return light_lead_on(alarm, dt_util.as_local(base).date())

    @staticmethod
    def _has_target(target: dict[str, Any]) -> bool:
        return any(target.get(key) for key in target)

    @staticmethod
    def _has_shift_rules(alarm: dict[str, Any]) -> bool:
        shift = alarm["shift"]
        return alarm["kind"] == "wake" and (
            shift["weather"]["enabled"] or shift["travel"]["enabled"]
        )

    @callback
    def _schedule(self, alarm_id: str) -> None:
        """(Re)compute the next alarm and arm the timer."""
        if alarm_id not in self.alarms:
            return
        alarm = self.alarms[alarm_id]
        runtime = self._runtime[alarm_id]
        if runtime.timer:
            runtime.timer()
            runtime.timer = None

        now = dt_util.utcnow()
        tz = self._tz()
        once = alarm["once"]
        if once and once["date"] < now.astimezone(tz).date().isoformat():
            alarm["once"] = None
            self._save()

        after = now
        if handled := self._handled.get(alarm_id):
            after = max(now, dt_util.parse_datetime(handled) or now)
        base = next_occurrence(alarm, after, tz, sun=self._sun, is_holiday=self._is_holiday)
        runtime.base_time = base
        if runtime.shift_for != base:
            runtime.shift = ShiftResult()
            runtime.shift_for = base
            if (
                base
                and self._has_shift_rules(alarm)
                and base - timedelta(minutes=self._lead(alarm, base)) - SHIFT_LOOKAHEAD <= now
            ):
                self.hass.async_create_task(self._async_evaluate_shift(alarm_id), eager_start=False)
        runtime.next_alarm = None
        runtime.trigger_at = None

        if base:
            when = base - timedelta(minutes=runtime.shift.minutes)
            lead = timedelta(minutes=self._lead(alarm, base))
            runtime.next_alarm = when
            trigger_at = when - lead
            runtime.trigger_at = trigger_at
            if not (runtime.run and not runtime.run.test):
                if trigger_at <= now:
                    # Inside the light window. After a restart: join mid-curve.
                    # Because of a shift: start from the beginning, shorter.
                    shortened = base - lead > now
                    self.hass.async_create_task(
                        self._async_trigger(alarm_id, base, shortened=shortened),
                        eager_start=False,
                    )
                else:
                    runtime.timer = async_track_point_in_utc_time(
                        self.hass, self._job(self._async_trigger, alarm_id, base), trigger_at
                    )
        self._notify(alarm_id)

    async def _async_trigger(
        self, alarm_id: str, base: datetime, *, shortened: bool = False
    ) -> None:
        if alarm_id not in self.alarms:
            return
        runtime = self._runtime[alarm_id]
        runtime.timer = None
        if runtime.base_time != base:
            return  # stale timer
        if runtime.run:
            if not runtime.run.test:
                return
            # A real alarm beats a test run.
            self._end_run(alarm_id, END_STOPPED, reschedule=False)
        self._handled[alarm_id] = base.isoformat()
        self._save()
        alarm = self.alarms[alarm_id]
        presence = alarm["presence"]
        if presence["skip_when_away"] and not self._anyone_home(self._presence_entities(alarm)):
            _LOGGER.debug("DayBreak: nobody home, skipping %s", alarm["name"])
            self._fire(
                EVENT_ALARM_SKIPPED, alarm_id, {"skipped": base.isoformat(), "reason": "away"}
            )
            self._async_send_message(alarm_id, "skipped")
            if is_one_time(alarm):
                alarm["enabled"] = False
                alarm["repeat"]["date"] = None
                self._save()
            self._schedule(alarm_id)
            return
        alarm_time = base - timedelta(minutes=runtime.shift.minutes)
        light_start = alarm_time - timedelta(minutes=self._lead(alarm, base))
        await self._async_start_run(
            alarm_id, base, alarm_time, light_start, test=False, shortened=shortened
        )

    # ----------------------------------------------------------------- shifts

    async def _async_shift_tick(self) -> None:
        now = dt_util.utcnow()
        for alarm_id, alarm in list(self.alarms.items()):
            runtime = self._runtime.get(alarm_id)
            if not runtime or not self._has_shift_rules(alarm):
                continue
            run = runtime.run
            if run and (run.test or run.ring_started):
                continue
            base = run.base_time if run else runtime.base_time
            if not base:
                continue
            if base - timedelta(minutes=self._lead(alarm, base)) - SHIFT_LOOKAHEAD > now:
                continue
            await self._async_evaluate_shift(alarm_id)

    async def _async_evaluate_shift(self, alarm_id: str) -> None:
        """Re-check the shift rules; move the alarm (and a running sunrise)."""
        if alarm_id not in self.alarms:
            return
        alarm = self.alarms[alarm_id]
        runtime = self._runtime[alarm_id]
        run = runtime.run
        if run and (run.test or run.ring_started):
            return
        base = run.base_time if run else runtime.base_time
        if not base:
            return
        try:
            inputs = await self._async_shift_inputs(alarm, base)
            result = evaluate(alarm, self.settings, inputs, dt_util.as_local(base))
        except Exception:
            _LOGGER.exception("DayBreak: shift evaluation failed for %s", alarm["name"])
            return
        if alarm_id not in self.alarms:
            return
        # The run may have moved on while we were waiting for the forecast.
        run = runtime.run
        if run and (run.test or run.ring_started or run.base_time != base):
            return
        if not run and runtime.base_time != base:
            return
        holder = run or runtime
        old = holder.shift.minutes
        changed_parts = result.parts != holder.shift.parts
        holder.shift = result
        if not run:
            runtime.shift_for = base
        if result.minutes == old:
            if changed_parts:
                self._notify(alarm_id)
            return

        new_time = base - timedelta(minutes=result.minutes)
        if run:
            now = dt_util.utcnow()
            if new_time <= now:
                await self._async_ring(alarm_id)
            else:
                run.reanchor(now, new_time)
                self._notify(alarm_id)
        else:
            self._schedule(alarm_id)
        self._fire(
            EVENT_ALARM_SHIFTED,
            alarm_id,
            {
                "minutes": result.minutes,
                "previous": old,
                "reasons": [p["reason"] for p in result.parts],
                "new_time": new_time.isoformat(),
            },
        )
        if alarm["shift"]["notify"]:
            local = dt_util.as_local(new_time).strftime("%H:%M")
            if result.minutes:
                self._async_send_message(
                    alarm_id,
                    "shifted",
                    minutes=result.minutes,
                    reasons=", ".join(sorted({p["reason"] for p in result.parts})),
                    time=local,
                )
            else:
                self._async_send_message(alarm_id, "shifted", key="shift_reset", time=local)

    async def _async_shift_inputs(self, alarm: dict[str, Any], base: datetime) -> ShiftInputs:
        inputs = ShiftInputs()
        settings = self.settings
        shift = alarm["shift"]
        if shift["weather"]["enabled"]:
            if (entity := settings["weather_entity"]) and (state := self.hass.states.get(entity)):
                inputs.condition = state.state
                inputs.temperature = _as_float(state.attributes.get("temperature"))
                forecast = await self._async_forecast_at(entity, base)
                if forecast:
                    inputs.condition = forecast.get("condition", inputs.condition)
                    inputs.temperature = _as_float(forecast.get("temperature", inputs.temperature))
            if (
                (entity := settings["temperature_entity"])
                and (state := self.hass.states.get(entity))
                and (value := _as_float(state.state)) is not None
            ):
                inputs.temperature = value
            inputs.warning_level = self._warning_level(settings["warning_entities"])
        travel = shift["travel"]
        if (
            travel["enabled"]
            and travel["sensor"]
            and (state := self.hass.states.get(travel["sensor"]))
        ):
            inputs.travel_minutes = _as_float(state.state)
        return inputs

    async def _async_forecast_at(self, entity_id: str, at: datetime) -> dict[str, Any] | None:
        if not self.hass.services.has_service("weather", "get_forecasts"):
            return None
        try:
            response = await self.hass.services.async_call(
                "weather",
                "get_forecasts",
                {"type": "hourly"},
                target={ATTR_ENTITY_ID: entity_id},
                blocking=True,
                return_response=True,
            )
        except Exception:  # weather without hourly forecast
            _LOGGER.debug("DayBreak: no hourly forecast from %s", entity_id, exc_info=True)
            return None
        forecasts = ((response or {}).get(entity_id) or {}).get("forecast") or []
        best: tuple[float, dict[str, Any]] | None = None
        for item in forecasts:
            when = dt_util.parse_datetime(str(item.get("datetime", "")))
            if not when:
                continue
            distance = abs((when - at).total_seconds())
            if distance <= 90 * 60 and (best is None or distance < best[0]):
                best = (distance, item)
        return best[1] if best else None

    def _warning_level(self, entities: list[str]) -> int:
        level = 0
        for entity_id in entities:
            state = self.hass.states.get(entity_id)
            if not state:
                continue
            for key, value in state.attributes.items():
                if _WARNING_LEVEL_RE.match(key) and (number := _as_float(value)) is not None:
                    level = max(level, int(number))
        return level

    # --------------------------------------------------------------- holidays

    def holiday_entity(self) -> str | None:
        if self.settings["holiday_entity"]:
            return self.settings["holiday_entity"]
        for entry in er.async_get(self.hass).entities.values():
            if (
                entry.platform == "workday"
                and entry.domain == "binary_sensor"
                and not entry.disabled
            ):
                return entry.entity_id
        return None

    async def async_refresh_holidays(self) -> None:
        """Ask the workday integration which of the coming days are holidays."""
        holidays: dict[date, bool] = {}
        entity = self.holiday_entity()
        needed = any(not alarm["wake_on_holidays"] for alarm in self.alarms.values())
        if needed and entity and self.hass.services.has_service("workday", "check_date"):
            state = self.hass.states.get(entity)
            names = (state.attributes.get("workdays") if state else None) or _WEEKDAYS[:5]
            workdays = {_WEEKDAYS.index(name) for name in names if name in _WEEKDAYS}
            today = dt_util.now().date()
            for offset in range(SEARCH_DAYS + 1):
                day = today + timedelta(days=offset)
                if day.weekday() not in workdays:
                    continue  # a normal free day, not a holiday
                try:
                    response = await self.hass.services.async_call(
                        "workday",
                        "check_date",
                        {"check_date": day.isoformat()},
                        target={ATTR_ENTITY_ID: entity},
                        blocking=True,
                        return_response=True,
                    )
                    holidays[day] = not response[entity]["workday"]
                except Exception:
                    _LOGGER.debug("DayBreak: workday check failed for %s", day, exc_info=True)
                    break
        if holidays != self._holidays:
            self._holidays = holidays
            self._schedule_all()

    # ------------------------------------------------------------------- runs

    async def _async_start_run(
        self,
        alarm_id: str,
        base: datetime,
        alarm_time: datetime,
        light_start: datetime,
        *,
        test: bool,
        shortened: bool = False,
    ) -> None:
        alarm = self.alarms[alarm_id]
        runtime = self._runtime[alarm_id]
        if runtime.off_later:
            runtime.off_later()
            runtime.off_later = None
        now = dt_util.utcnow()
        groups, missing = self._light_groups(alarm, light_start, alarm_time)
        run = AlarmRun(
            kind=alarm["kind"],
            base_time=base,
            alarm_time=alarm_time,
            light_start=light_start,
            groups=groups,
            context=Context(),
            test=test,
            shift=runtime.shift if not test else ShiftResult(),
        )
        if shortened and light_start < now:
            run.anchor_time = now
        runtime.run = run
        if missing:
            self._async_send_message(alarm_id, "device_unavailable", lights=", ".join(missing))
        lights = run.lights
        if lights and alarm["stop_on_light_off"]:
            run.unsubs.append(
                async_track_state_change_event(
                    self.hass, lights, partial(self._on_light_change, alarm_id)
                )
            )
        presence = alarm["presence"]
        entities = self._presence_entities(alarm)
        if entities and presence["stop_when_away"]:
            run.unsubs.append(
                async_track_state_change_event(
                    self.hass, entities, partial(self._on_presence_change, alarm_id)
                )
            )

        if alarm_time <= now:
            await self._async_ring(alarm_id)
            return
        self._fire(EVENT_SUNRISE_STARTED, alarm_id)
        self._async_send_message(alarm_id, "started")
        self._async_run_actions(alarm_id, run, "light_start")
        self._notify(alarm_id)
        if run.kind == "kids":
            await self._async_send(run, [(g, KIDS_STAY) for g in run.groups], transition=2)
            run.timer = async_track_point_in_utc_time(
                self.hass, self._job(self._async_ring, alarm_id), alarm_time
            )
            return
        await self._async_step(alarm_id)

    def _light_groups(
        self, alarm: dict[str, Any], light_start: datetime, alarm_time: datetime
    ) -> tuple[list[LightGroup], list[str]]:
        """Resolve the alarm's lights into groups with their settings.

        Lights of an override get the override's settings. Unavailable lights
        are replaced by their fallback light if one is configured.
        """
        light = alarm["light"]
        own = self._settings_for(light["profile"], light["settings"])
        base_lights = self._resolve_lights(light["targets"])
        groups: list[LightGroup] = []
        taken: set[str] = set()
        for override in light["overrides"]:
            lights = [x for x in self._resolve_lights(override["target"]) if x not in taken]
            if not lights:
                continue
            taken.update(lights)
            settings = self._settings_for(override["profile"], override["settings"])
            groups.append(LightGroup(lights=lights, settings=settings))
        rest = [x for x in base_lights if x not in taken]
        if rest:
            groups.insert(0, LightGroup(lights=rest, settings=own))

        total = (alarm_time - light_start).total_seconds() / 60
        missing: list[str] = []
        replacements = alarm["fallback"]["lights"]
        for group in groups:
            resolved = []
            for entity_id in group.lights:
                state = self.hass.states.get(entity_id)
                if state is None or state.state == "unavailable":
                    missing.append(self._friendly(entity_id))
                    if replacement := replacements.get(entity_id):
                        resolved.append(replacement)
                        continue
                resolved.append(entity_id)
            group.lights = sorted(set(resolved))
            offset = group.settings["start_offset"]
            group.offset = min(0.95, offset / total) if total > 0 and offset else 0.0
            for entity_id in group.lights:
                group.caps[entity_id] = self._caps(entity_id)
        return [g for g in groups if g.lights], missing

    def _settings_for(self, profile_id: str | None, own: dict[str, Any]) -> dict[str, Any]:
        if profile := self.light_profile(profile_id):
            return profile["settings"]
        return own

    def _resolve_lights(self, target: dict[str, Any]) -> list[str]:
        if not self._has_target(target):
            return []
        selected = async_extract_referenced_entity_ids(
            self.hass, TargetSelection(target), expand_group=False
        )
        return sorted(
            entity_id
            for entity_id in selected.referenced | selected.indirectly_referenced
            if entity_id.startswith("light.")
        )

    def _caps(self, entity_id: str) -> Capabilities:
        state = self.hass.states.get(entity_id)
        modes = state.attributes.get("supported_color_modes") if state else None
        return Capabilities.from_modes(modes)

    def _friendly(self, entity_id: str) -> str:
        state = self.hass.states.get(entity_id)
        return state.name if state else entity_id

    async def _async_step(self, alarm_id: str) -> None:
        """Send the next ramp level and arm the following step."""
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run) or run.ring_started:
            return
        run.timer = None
        now = dt_util.utcnow()
        if now >= run.alarm_time:
            await self._async_ring(alarm_id)
            return

        step = float(min((g.settings["step_seconds"] for g in run.groups), default=15))
        if run.test:
            # Compressed test sunrise: keep roughly 20 updates.
            total = (run.alarm_time - run.light_start).total_seconds()
            step = max(2.0, min(step, total / 20))
        remaining = (run.alarm_time - now).total_seconds()
        delay = min(step, remaining)
        # Aim at the level of the *next* step and fade towards it.
        progress = run.progress(now + timedelta(seconds=delay))
        await self._async_apply(run, progress, transition=delay)
        run.timer = async_call_later(self.hass, delay, self._job(self._async_step, alarm_id))

    async def _async_apply(
        self, run: AlarmRun, progress: float, *, transition: float | None = None
    ) -> None:
        """Show ``progress`` of the ramp on every group."""
        items: list[tuple[LightGroup, Any]] = []
        for group in run.groups:
            if run.kind == "sleep":
                # Falling asleep: the curve runs backwards, ending dark.
                level = 1.0 - progress
            elif group.offset:
                if progress < group.offset:
                    continue
                level = (progress - group.offset) / (1 - group.offset)
            else:
                level = progress
            items.append((group, _Level(level)))
        await self._async_send(run, items, transition=transition)

    async def _async_send(
        self,
        run: AlarmRun,
        items: list[tuple[LightGroup, Any]],
        *,
        transition: float | None = None,
        lights: list[str] | None = None,
    ) -> None:
        """Send commands to groups. ``items`` holds a LightCommand or a curve level."""
        batches: dict[tuple[Any, ...], list[str]] = {}
        off: list[str] = []
        for group, what in items:
            settings = group.settings
            for entity_id in group.lights:
                if lights is not None and entity_id not in lights:
                    continue
                state = self.hass.states.get(entity_id)
                if state and state.attributes.get("supported_color_modes"):
                    group.caps[entity_id] = self._caps(entity_id)
                caps = group.caps.get(entity_id) or Capabilities()
                cmd = command_at(settings, what.value, caps) if isinstance(what, _Level) else what
                bri = to_brightness_255(cmd.brightness_pct, settings["min_brightness"])
                if bri <= 0:
                    if group.started:
                        off.append(entity_id)
                    continue
                rgb = cmd.rgb if cmd.rgb and caps.color else None
                kelvin = None
                if rgb is None and cmd.kelvin and (caps.color_temp or caps.color):
                    kelvin = cmd.kelvin
                use_transition = None
                if transition and settings["transition"] != "never":
                    features = state.attributes.get("supported_features", 0) if state else 0
                    if settings["transition"] == "always" or features & _SUPPORT_TRANSITION:
                        use_transition = round(transition, 1)
                key = (bri, kelvin, rgb, use_transition)
                batches.setdefault(key, []).append(entity_id)
            group.started = True
        for (bri, kelvin, rgb, use_transition), entity_ids in batches.items():
            data: dict[str, Any] = {ATTR_ENTITY_ID: entity_ids, "brightness": bri}
            if rgb:
                data["rgb_color"] = list(rgb)
            elif kelvin:
                data["color_temp_kelvin"] = kelvin
            if use_transition:
                data["transition"] = use_transition
            await self._async_call_light("turn_on", run, data)
        if off:
            run.lights_off_by_us = True
            await self._async_call_light("turn_off", run, {ATTR_ENTITY_ID: off})

    async def _async_lights_off(self, run: AlarmRun, lights: list[str] | None = None) -> None:
        lights = run.lights if lights is None else lights
        if not lights:
            return
        run.lights_off_by_us = True
        await self._async_call_light("turn_off", run, {ATTR_ENTITY_ID: lights})

    async def _async_call_light(self, service: str, run: AlarmRun, data: dict[str, Any]) -> None:
        try:
            await self.hass.services.async_call(
                "light", service, data, blocking=True, context=run.context
            )
        except Exception:
            _LOGGER.warning(
                "DayBreak: light.%s failed for %s", service, data[ATTR_ENTITY_ID], exc_info=True
            )
            new = set(data[ATTR_ENTITY_ID]) - run.failed
            if new:
                run.failed.update(new)
                for alarm_id, runtime in self._runtime.items():
                    if runtime.run is run:
                        self._async_send_message(
                            alarm_id,
                            "failed",
                            lights=", ".join(self._friendly(x) for x in sorted(new)),
                        )

    async def _async_ring(self, alarm_id: str) -> None:
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run) or run.last_call_started:
            return
        alarm = self.alarms[alarm_id]
        run.cancel_timer()
        now = dt_util.utcnow()

        if run.kind == "sleep":
            # Lights are out: the sleep light is done.
            await self._async_lights_off(run)
            self._end_run(alarm_id, END_AUTO_STOP)
            return

        was_snoozed = run.snooze_until is not None
        run.snooze_until = None
        first_ring = run.ring_started is None
        run.ring_started = run.ring_started or now
        run.lights_off_by_us = False

        if run.kind == "kids":
            await self._async_send(run, [(g, KIDS_GO) for g in run.groups], transition=2)
            self._fire(EVENT_ALARM_RINGING, alarm_id, {"after_snooze": False})
            self._async_run_actions(alarm_id, run, "wake")
            run.timer = async_call_later(
                self.hass,
                TEST_MAX_RING if run.test else KIDS_GREEN,
                self._job(self._end_run, alarm_id, END_AUTO_STOP),
            )
            self._notify(alarm_id)
            return

        if first_ring:
            window = timedelta(minutes=self.snooze_minutes(alarm) * self.snooze_count(alarm))
            if run.test:
                window = min(window, TEST_MAX_RING)
            run.snooze_end = run.ring_started + window
            run.end_timer = async_track_point_in_utc_time(
                self.hass, self._job(self._async_end_of_snoozes, alarm_id), run.snooze_end
            )
            self._async_run_actions(alarm_id, run, "wake")
        await self._async_apply(run, 1.0, transition=1)
        self._start_effect(alarm_id, run)
        self._fire(EVENT_ALARM_RINGING, alarm_id, {"after_snooze": was_snoozed})
        self._notify(alarm_id)

    @callback
    def _start_effect(self, alarm_id: str, run: AlarmRun) -> None:
        """Pulse or blink while ringing (accessibility)."""
        if any(g.settings["ringing"] != "hold" for g in run.groups):
            run.stop_effect()
            run.effect_unsub = async_track_time_interval(
                self.hass, self._job(self._async_effect_tick, alarm_id), EFFECT_INTERVAL
            )

    async def _async_effect_tick(self, alarm_id: str) -> None:
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run) or not run.effect_unsub:
            return
        run.effect_phase = not run.effect_phase
        items: list[tuple[LightGroup, Any]] = []
        blink_off: list[str] = []
        for group in run.groups:
            mode = group.settings["ringing"]
            if mode == "blink":
                if run.effect_phase:
                    blink_off.extend(group.lights)
                else:
                    items.append((group, _Level(1.0)))
            elif mode == "pulse":
                items.append((group, _Level(PULSE_LOW if run.effect_phase else 1.0)))
        await self._async_send(run, items, transition=EFFECT_INTERVAL.total_seconds() * 0.8)
        if blink_off:
            await self._async_lights_off(run, blink_off)

    def _effect_lights(self, run: AlarmRun) -> set[str]:
        if not run.effect_unsub:
            return set()
        return {light for g in run.groups if g.settings["ringing"] != "hold" for light in g.lights}

    async def _async_end_of_snoozes(self, alarm_id: str) -> None:
        """All snoozes used up and nobody stopped: last call, or stop."""
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run):
            return
        run.end_timer = None
        if self.alarms[alarm_id]["last_call"]["enabled"] and not run.last_call_started:
            await self._async_last_call(alarm_id)
        else:
            self._end_run(alarm_id, END_AUTO_STOP)

    async def _async_last_call(self, alarm_id: str) -> None:
        """Overslept: last call profile (all lights on, actions) for a limited time."""
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run) or run.last_call_started:
            return
        alarm = self.alarms[alarm_id]
        profile = self.last_call_profile(alarm["last_call"]["profile"])
        run.cancel_timer()
        run.stop_effect()
        run.snooze_until = None
        run.last_call_started = dt_util.utcnow()
        run.lights_off_by_us = False

        lights = self._resolve_lights(profile["targets"]) or run.lights
        known = set(run.lights)
        if new := [entity_id for entity_id in lights if entity_id not in known]:
            settings = deepcopy(run.groups[0].settings) if run.groups else None
            if settings is None:
                settings = validate_light_profile({"name": "x"})["settings"]
            group = LightGroup(lights=new, settings=settings)
            group.caps = {entity_id: self._caps(entity_id) for entity_id in new}
            run.groups.append(group)
            if alarm["stop_on_light_off"]:
                run.unsubs.append(
                    async_track_state_change_event(
                        self.hass, new, partial(self._on_light_change, alarm_id)
                    )
                )
        if lights:
            command = LightCommand(
                brightness_pct=profile["brightness"],
                kelvin=profile["kelvin"],
            )
            await self._async_send(
                run, [(g, command) for g in run.groups], transition=1, lights=lights
            )

        self._fire(EVENT_LAST_CALL, alarm_id, {"profile": profile["id"]})
        self._async_send_message(alarm_id, "last_call")
        if profile["actions"]:
            self._async_run_script(alarm_id, run, profile["actions"], "last_call")

        duration = timedelta(minutes=profile["duration"])
        if run.test:
            duration = min(duration, TEST_LAST_CALL)
        run.timer = async_call_later(
            self.hass, duration, self._job(self._end_run, alarm_id, END_LAST_CALL_TIMEOUT)
        )
        self._notify(alarm_id)

    @callback
    def _async_run_actions(self, alarm_id: str, run: AlarmRun | None, phase: str) -> None:
        actions = self.alarms[alarm_id]["actions"][phase]
        if actions:
            self._async_run_script(alarm_id, run, actions, phase)

    @callback
    def _async_run_script(
        self,
        alarm_id: str,
        run: AlarmRun | None,
        actions: list[dict[str, Any]],
        phase: str,
    ) -> None:
        alarm = self.alarms[alarm_id]
        variables = {
            "alarm_id": alarm_id,
            "name": alarm["name"],
            "phase": phase,
            "test": bool(run and run.test),
        }
        context = run.context if run else Context()

        async def _run() -> None:
            try:
                config = await async_validate_actions_config(
                    self.hass, cv.SCRIPT_SCHEMA(deepcopy(actions))
                )
            except Exception:  # broken actions must not kill the alarm
                _LOGGER.exception("DayBreak: invalid %s actions for %s", phase, alarm["name"])
                return
            script = Script(
                self.hass, config, f"DayBreak {alarm['name']} {phase}", DOMAIN, logger=_LOGGER
            )
            if run and phase != "stop":
                run.scripts.append(script)
            await script.async_run(variables, context=context)

        # Run in the background: a long script must not block the alarm.
        self.hass.async_create_background_task(_run(), f"daybreak_{phase}_{alarm_id}")

    @callback
    def _on_light_change(self, alarm_id: str, event: Event[EventStateChangedData]) -> None:
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run) or run.lights_off_by_us:
            return
        old, new = event.data["old_state"], event.data["new_state"]
        if not old or not new or old.state != STATE_ON or new.state != STATE_OFF:
            return
        if new.context.id == run.context.id or new.entity_id in self._effect_lights(run):
            return
        _LOGGER.debug("DayBreak: %s turned off by hand, stopping alarm", new.entity_id)
        self._end_run(alarm_id, END_MANUAL_OFF)

    @staticmethod
    def _presence_entities(alarm: dict[str, Any]) -> list[str]:
        """Presence entities; the owners when none are set."""
        return alarm["presence"]["entities"] or alarm["owners"]

    def _anyone_home(self, entities: list[str]) -> bool:
        """True if any presence entity reports someone at home.

        No entities configured, or an entity that is unknown/unavailable,
        counts as "home": a flaky tracker must never silence an alarm.
        """
        if not entities:
            return True
        for entity_id in entities:
            state = self.hass.states.get(entity_id)
            if state is None or state.state in _UNKNOWN_STATES:
                return True
            if state.state in _HOME_STATES:
                return True
            if entity_id.startswith("zone."):
                try:
                    if int(state.state) > 0:
                        return True
                except ValueError:
                    pass
        return False

    @callback
    def _on_presence_change(self, alarm_id: str, event: Event[EventStateChangedData]) -> None:
        runtime = self._runtime.get(alarm_id)
        if not runtime or not runtime.run:
            return
        if not self._anyone_home(self._presence_entities(self.alarms[alarm_id])):
            _LOGGER.debug("DayBreak: everybody left, stopping alarm %s", alarm_id)
            self._end_run(alarm_id, END_AWAY)

    # ---------------------------------------------------------------- actions

    def _resolve_targets(self, alarm_id: str | None) -> list[str]:
        if alarm_id:
            self.get(alarm_id)
            return [alarm_id]
        return self.active_alarms()

    async def async_snooze(self, alarm_id: str | None = None, minutes: int | None = None) -> None:
        """Snooze a ringing alarm (or all ringing alarms)."""
        for target in self._resolve_targets(alarm_id):
            run = self._runtime[target].run
            if not run or run.kind != "wake" or not run.ring_started or run.last_call_started:
                continue
            alarm = self.alarms[target]
            run.cancel_timer()
            run.stop_effect()
            run.snoozes += 1
            run.snooze_until = dt_util.utcnow() + timedelta(
                minutes=minutes or self.snooze_minutes(alarm)
            )
            if run.test:
                run.snooze_until = min(run.snooze_until, dt_util.utcnow() + timedelta(seconds=30))
            await self._async_apply(run, SNOOZE_LEVEL, transition=2)
            run.timer = async_track_point_in_utc_time(
                self.hass, self._job(self._async_ring, target), run.snooze_until
            )
            self._fire(
                EVENT_ALARM_SNOOZED,
                target,
                {"snooze_until": run.snooze_until.isoformat(), "snoozes": run.snoozes},
            )
            self._async_run_actions(target, run, "snooze")
            self._notify(target)

    async def async_stop(self, alarm_id: str | None = None) -> None:
        """Stop a running alarm (or all running alarms)."""
        for target in self._resolve_targets(alarm_id):
            if self._runtime[target].run:
                self._end_run(target, END_STOPPED)

    async def async_skip_next(self, alarm_id: str) -> None:
        """Skip the next occurrence without disabling the alarm."""
        alarm = self.get(alarm_id)
        when = self._runtime[alarm_id].base_time
        if not when:
            raise DaybreakError("no_upcoming", "Alarm has no upcoming occurrence")
        self._fire(EVENT_ALARM_SKIPPED, alarm_id, {"skipped": when.isoformat(), "reason": "user"})
        if is_one_time(alarm):
            # Skipping a one-time alarm simply switches it off.
            await self.async_update(alarm_id, {"enabled": False})
            return
        skip_date = dt_util.as_local(when).date().isoformat()
        await self.async_update(alarm_id, {"skip_date": skip_date})

    async def async_cancel_skip(self, alarm_id: str) -> None:
        self.get(alarm_id)
        await self.async_update(alarm_id, {"skip_date": None})

    async def async_set_enabled(self, alarm_id: str, enabled: bool) -> None:
        await self.async_update(alarm_id, {"enabled": enabled})

    async def async_test(self, alarm_id: str, duration: int = 60) -> None:
        """Run the whole alarm now with a compressed light ramp of ``duration`` s."""
        self.get(alarm_id)
        runtime = self._runtime[alarm_id]
        if runtime.run:
            self._end_run(alarm_id, END_STOPPED)
        now = dt_util.utcnow()
        alarm_time = now + timedelta(seconds=duration)
        await self._async_start_run(alarm_id, alarm_time, alarm_time, now, test=True)

    async def async_preview(
        self, settings: dict[str, Any], entity_ids: list[str], progress: float
    ) -> None:
        """Show one point of a light curve on some lights (editor preview)."""
        settings = validate_light_profile({"name": "preview", "settings": settings})["settings"]
        lights = [e for e in entity_ids if e.startswith("light.")]
        group = LightGroup(lights=lights, settings=settings)
        group.caps = {entity_id: self._caps(entity_id) for entity_id in lights}
        run = AlarmRun(
            kind="wake",
            base_time=dt_util.utcnow(),
            alarm_time=dt_util.utcnow(),
            light_start=dt_util.utcnow(),
            groups=[group],
            context=Context(),
            test=True,
        )
        await self._async_send(run, [(group, _Level(progress))], transition=0.5)

    @callback
    def _end_run(self, alarm_id: str, reason: str, *, reschedule: bool = True) -> None:
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run):
            return
        run.cancel_all()
        runtime.run = None
        alarm = self.alarms[alarm_id]
        for script in run.scripts:
            if script.is_running:
                self.hass.async_create_task(script.async_stop())

        if reason != END_MANUAL_OFF:
            off_now: list[str] = []
            off_later: list[str] = []
            for group in run.groups:
                mode = "off" if run.kind in ("sleep", "kids") else group.settings["after_stop"]
                if mode == "off":
                    off_now.extend(group.lights)
                elif mode == "off_later":
                    off_later.extend(group.lights)
            if off_now:
                self.hass.async_create_task(self._async_lights_off(run, off_now))
            if off_later:
                runtime.off_later = async_call_later(
                    self.hass,
                    OFF_LATER,
                    self._job(self._async_off_later, alarm_id, run, off_later),
                )

        data = {"reason": reason, "test": run.test}
        if reason in (END_STOPPED, END_MANUAL_OFF, END_AWAY):
            self._fire(EVENT_ALARM_STOPPED, alarm_id, data, run=run)
        self._fire(EVENT_ALARM_FINISHED, alarm_id, data, run=run)
        self._async_send_message(alarm_id, "finished")
        if reason != END_DISABLED:
            self._async_run_actions(alarm_id, None, "stop")

        if not run.test and is_one_time(alarm) and alarm["enabled"]:
            alarm["enabled"] = False
            alarm["repeat"]["date"] = None
            self._save()
        if reschedule:
            self._schedule(alarm_id)
        else:
            self._notify(alarm_id)

    async def _async_off_later(self, alarm_id: str, run: AlarmRun, lights: list[str]) -> None:
        runtime = self._runtime.get(alarm_id)
        if runtime:
            runtime.off_later = None
            if runtime.run:
                return  # a new run owns the lights now
        await self._async_lights_off(run, lights)

    # ---------------------------------------------------------- notifications

    @callback
    def _async_send_message(
        self, alarm_id: str, event: str, *, key: str | None = None, **values: Any
    ) -> None:
        """Push and/or persistent notification for an alarm event."""
        alarm = self.alarms.get(alarm_id)
        if not alarm:
            return
        fallback = alarm["fallback"]
        if event not in fallback["events"]:
            return
        lang = "de" if (self.hass.config.language or "").startswith("de") else "en"
        message = _MESSAGES[key or event][lang].format(**values)
        title = f"DayBreak - {alarm['name']}"
        target = fallback["notify"] or self.settings["notify"]
        if target:
            self.hass.async_create_task(self._async_push(target, title, message))
        if fallback["persistent"] and event in ("device_unavailable", "failed"):
            persistent_notification.async_create(
                self.hass, message, title, notification_id=f"{DOMAIN}_{alarm_id}_{event}"
            )

    async def _async_push(self, target: str, title: str, message: str) -> None:
        try:
            if target.startswith("notify.") and self.hass.states.get(target):
                await self.hass.services.async_call(
                    "notify",
                    "send_message",
                    {"message": message, "title": title},
                    target={ATTR_ENTITY_ID: target},
                    blocking=True,
                )
                return
            domain, _, service = target.partition(".")
            if not service:
                domain, service = "notify", target
            await self.hass.services.async_call(
                domain, service, {"message": message, "title": title}, blocking=True
            )
        except Exception:
            _LOGGER.warning("DayBreak: notification via %s failed", target, exc_info=True)

    # ------------------------------------------------------------------ utils

    def _job(self, func: Callable[..., Any], *args: Any) -> Callable[[datetime], None]:
        """Wrap a method as an event-loop timer callback."""

        @callback
        def _run(_now: datetime) -> None:
            result = func(*args)
            if inspect.iscoroutine(result):
                self.hass.async_create_task(result, eager_start=True)

        return _run

    @callback
    def _fire(
        self,
        event_type: str,
        alarm_id: str,
        extra: dict[str, Any] | None = None,
        *,
        run: AlarmRun | None = None,
    ) -> None:
        alarm = self.alarms[alarm_id]
        run = run or self._runtime[alarm_id].run
        data: dict[str, Any] = {"alarm_id": alarm_id, "name": alarm["name"], "kind": alarm["kind"]}
        if run:
            data["test"] = run.test
            data["alarm_time"] = run.alarm_time.isoformat()
        if extra:
            data.update(extra)
        self.hass.bus.async_fire(event_type, data)


@dataclass(frozen=True, slots=True)
class _Level:
    """A position on the light curve, resolved per light by its capabilities."""

    value: float


def _as_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None
