"""DayBreak alarm manager: storage, scheduling and running alarms."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from functools import partial
import inspect
import logging
from typing import Any

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
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_call_later,
    async_track_point_in_utc_time,
    async_track_state_change_event,
)
from homeassistant.helpers.storage import Store
from homeassistant.helpers.target import (
    TargetSelection,
    async_extract_referenced_entity_ids,
)
from homeassistant.util import dt as dt_util

from .const import (
    ACTIVE_STATES,
    AFTER_STOP_OFF,
    DOMAIN,
    END_AUTO_STOP,
    END_DISABLED,
    END_MANUAL_OFF,
    END_STOPPED,
    EVENT_ALARM_FINISHED,
    EVENT_ALARM_RINGING,
    EVENT_ALARM_SKIPPED,
    EVENT_ALARM_SNOOZED,
    EVENT_ALARM_STOPPED,
    EVENT_SUNRISE_STARTED,
    SIGNAL_ALARM_ADDED,
    SIGNAL_ALARMS_CHANGED,
    SNOOZE_LIGHT_DIM,
    SNOOZE_LIGHT_OFF,
    STATE_DISABLED,
    STATE_IDLE,
    STATE_RINGING,
    STATE_SCHEDULED,
    STATE_SNOOZED,
    STATE_SUNRISE,
    STORAGE_KEY,
    STORAGE_VERSION,
    signal_alarm_updated,
)
from .curve import level_at, to_brightness_255
from .models import merge_alarm, validate_alarm
from .scheduler import is_one_time, next_occurrence

_LOGGER = logging.getLogger(__name__)

# A test run rings this long at most before it stops by itself.
TEST_MAX_RING = timedelta(minutes=2)


@dataclass
class AlarmRun:
    """State of one running alarm (sunrise, ringing or snoozed)."""

    alarm_time: datetime
    sunrise_start: datetime
    lights: list[str]
    context: Context
    test: bool = False
    snooze_until: datetime | None = None
    ring_started: datetime | None = None
    unsubs: list[CALLBACK_TYPE] = field(default_factory=list)
    timer: CALLBACK_TYPE | None = None
    # Suppress "manual off" detection while we switch the lights off ourselves.
    lights_off_by_us: bool = False

    def cancel_timer(self) -> None:
        if self.timer:
            self.timer()
            self.timer = None

    def cancel_all(self) -> None:
        self.cancel_timer()
        while self.unsubs:
            self.unsubs.pop()()


@dataclass
class AlarmRuntime:
    """Scheduling state of one alarm."""

    next_alarm: datetime | None = None
    trigger_at: datetime | None = None
    timer: CALLBACK_TYPE | None = None
    run: AlarmRun | None = None


class DaybreakManager:
    """Owns all alarms of the integration."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.alarms: dict[str, dict[str, Any]] = {}
        # Alarm time (ISO, UTC) up to which an alarm has been handled. Prevents a
        # stopped sunrise from starting again before its alarm time is reached.
        self._handled: dict[str, str] = {}
        self._runtime: dict[str, AlarmRuntime] = {}
        self._unsub_core: CALLBACK_TYPE | None = None

    # ------------------------------------------------------------------ setup

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
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
        self._unsub_core = self.hass.bus.async_listen(
            EVENT_CORE_CONFIG_UPDATE, self._on_core_config_update
        )

    async def async_unload(self) -> None:
        if self._unsub_core:
            self._unsub_core()
        for runtime in self._runtime.values():
            if runtime.timer:
                runtime.timer()
            if runtime.run:
                runtime.run.cancel_all()

    @callback
    def _on_core_config_update(self, _event: Event) -> None:
        """Time zone may have changed: recompute all schedules."""
        for alarm_id in self.alarms:
            self._schedule(alarm_id)

    @callback
    def _save(self) -> None:
        self._store.async_delay_save(self._data_to_save, 1)

    def _data_to_save(self) -> dict[str, Any]:
        return {"alarms": list(self.alarms.values()), "handled": self._handled}

    # ------------------------------------------------------------------- CRUD

    def get(self, alarm_id: str) -> dict[str, Any]:
        try:
            return self.alarms[alarm_id]
        except KeyError as err:
            raise HomeAssistantError(f"Unknown alarm {alarm_id}") from err

    async def async_create(self, data: dict[str, Any]) -> dict[str, Any]:
        data = {key: value for key, value in data.items() if key != "id"}
        alarm = validate_alarm(data)
        self.alarms[alarm["id"]] = alarm
        self._runtime[alarm["id"]] = AlarmRuntime()
        self._save()
        async_dispatcher_send(self.hass, SIGNAL_ALARM_ADDED, alarm["id"])
        self._schedule(alarm["id"])
        return alarm

    async def async_update(self, alarm_id: str, changes: dict[str, Any]) -> dict[str, Any]:
        current = self.get(alarm_id)
        alarm = merge_alarm(current, changes)
        # A new time or new days make an old skip meaningless.
        if (alarm["time"], alarm["days"], alarm["date"]) != (
            current["time"],
            current["days"],
            current["date"],
        ) and "skip_date" not in changes:
            alarm["skip_date"] = None
        self.alarms[alarm_id] = alarm
        self._save()
        if alarm["name"] != current["name"]:
            self._rename_device(alarm_id, alarm["name"])
        runtime = self._runtime[alarm_id]
        if not alarm["enabled"] and runtime.run and not runtime.run.test:
            self._end_run(alarm_id, END_DISABLED)
        self._schedule(alarm_id)
        return alarm

    async def async_delete(self, alarm_id: str) -> None:
        self.get(alarm_id)
        runtime = self._runtime.pop(alarm_id)
        if runtime.timer:
            runtime.timer()
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

    # ------------------------------------------------------------- read state

    def state(self, alarm_id: str) -> str:
        alarm = self.alarms[alarm_id]
        runtime = self._runtime[alarm_id]
        if run := runtime.run:
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

        return {
            "state": self.state(alarm_id),
            "next_alarm": iso(runtime.next_alarm),
            "next_sunrise": iso(runtime.trigger_at),
            "test": bool(run and run.test),
            "alarm_time": iso(run.alarm_time) if run else None,
            "sunrise_start": iso(run.sunrise_start) if run else None,
            "ring_started": iso(run.ring_started) if run else None,
            "snooze_until": iso(run.snooze_until) if run else None,
        }

    def as_dict(self, alarm_id: str) -> dict[str, Any]:
        return {**self.alarms[alarm_id], "runtime": self.runtime_info(alarm_id)}

    def next_overall(self) -> tuple[str, datetime] | None:
        """The enabled alarm that rings next."""
        upcoming = [
            (runtime.next_alarm, alarm_id)
            for alarm_id, runtime in self._runtime.items()
            if runtime.next_alarm
        ]
        if not upcoming:
            return None
        when, alarm_id = min(upcoming)
        return alarm_id, when

    def active_alarms(self) -> list[str]:
        return [alarm_id for alarm_id in self.alarms if self.state(alarm_id) in ACTIVE_STATES]

    @callback
    def _notify(self, alarm_id: str) -> None:
        async_dispatcher_send(self.hass, signal_alarm_updated(alarm_id))
        async_dispatcher_send(self.hass, SIGNAL_ALARMS_CHANGED)

    # ------------------------------------------------------------- scheduling

    def _sunrise_minutes(self, alarm: dict[str, Any]) -> int:
        light = alarm["light"]
        if not self._has_light_target(light):
            return 0
        return light["duration"]

    @staticmethod
    def _has_light_target(light: dict[str, Any]) -> bool:
        return any(light["target"].get(key) for key in light["target"])

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
        after = now
        if handled := self._handled.get(alarm_id):
            after = max(now, dt_util.parse_datetime(handled) or now)
        when = next_occurrence(alarm, after, dt_util.get_default_time_zone())
        runtime.next_alarm = when
        runtime.trigger_at = None

        if when and not (runtime.run and not runtime.run.test):
            trigger_at = when - timedelta(minutes=self._sunrise_minutes(alarm))
            runtime.trigger_at = trigger_at
            if trigger_at <= now:
                # Created or restarted inside the sunrise window: join mid-curve.
                self.hass.async_create_task(self._async_trigger(alarm_id, when), eager_start=False)
            else:
                runtime.timer = async_track_point_in_utc_time(
                    self.hass, self._job(self._async_trigger, alarm_id, when), trigger_at
                )
        self._notify(alarm_id)

    async def _async_trigger(self, alarm_id: str, alarm_time: datetime) -> None:
        if alarm_id not in self.alarms:
            return
        runtime = self._runtime[alarm_id]
        runtime.timer = None
        if runtime.run:
            if not runtime.run.test:
                return
            # A real alarm beats a test run.
            self._end_run(alarm_id, END_STOPPED, reschedule=False)
        self._handled[alarm_id] = alarm_time.isoformat()
        self._save()
        alarm = self.alarms[alarm_id]
        sunrise_start = alarm_time - timedelta(minutes=self._sunrise_minutes(alarm))
        await self._async_start_run(alarm_id, alarm_time, sunrise_start, test=False)

    # ------------------------------------------------------------------- runs

    async def _async_start_run(
        self,
        alarm_id: str,
        alarm_time: datetime,
        sunrise_start: datetime,
        *,
        test: bool,
    ) -> None:
        alarm = self.alarms[alarm_id]
        runtime = self._runtime[alarm_id]
        lights = self._resolve_lights(alarm["light"])
        run = AlarmRun(
            alarm_time=alarm_time,
            sunrise_start=sunrise_start,
            lights=lights,
            context=Context(),
            test=test,
        )
        runtime.run = run
        if lights and alarm["behavior"]["stop_on_light_off"]:
            run.unsubs.append(
                async_track_state_change_event(
                    self.hass, lights, partial(self._on_light_change, alarm_id)
                )
            )

        if lights and alarm_time > dt_util.utcnow():
            self._fire(EVENT_SUNRISE_STARTED, alarm_id)
            self._notify(alarm_id)
            await self._async_step(alarm_id)
        else:
            await self._async_ring(alarm_id)

    def _resolve_lights(self, light: dict[str, Any]) -> list[str]:
        if not self._has_light_target(light):
            return []
        selected = async_extract_referenced_entity_ids(
            self.hass, TargetSelection(light["target"]), expand_group=False
        )
        return sorted(
            entity_id
            for entity_id in selected.referenced | selected.indirectly_referenced
            if entity_id.startswith("light.")
        )

    async def _async_step(self, alarm_id: str) -> None:
        """Send the next sunrise level and arm the following step."""
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run) or run.ring_started:
            return
        run.timer = None
        alarm = self.alarms[alarm_id]
        light = alarm["light"]
        now = dt_util.utcnow()
        if now >= run.alarm_time:
            await self._async_ring(alarm_id)
            return

        total = (run.alarm_time - run.sunrise_start).total_seconds()
        step = float(light["step_seconds"])
        if run.test:
            # Compressed test sunrise: keep roughly 20 updates.
            step = max(2.0, min(step, total / 20))
        remaining = (run.alarm_time - now).total_seconds()
        delay = min(step, remaining)
        # Aim at the level of the *next* step and fade towards it.
        target_time = now + timedelta(seconds=delay)
        progress = 1.0 if total <= 0 else (target_time - run.sunrise_start).total_seconds() / total
        await self._async_set_level(run, light, progress, transition=delay)
        run.timer = async_call_later(
            self.hass,
            delay,
            self._job(self._async_step, alarm_id),
        )

    async def _async_set_level(
        self,
        run: AlarmRun,
        light: dict[str, Any],
        progress: float,
        transition: float | None = None,
    ) -> None:
        if not run.lights:
            return
        level = level_at(light, progress)
        brightness = to_brightness_255(level.brightness)
        data: dict[str, Any] = {ATTR_ENTITY_ID: run.lights}
        if brightness <= 0:
            await self._async_lights_off(run)
            return
        data["brightness"] = brightness
        if level.kelvin:
            data["color_temp_kelvin"] = level.kelvin
        if transition:
            data["transition"] = round(transition, 1)
        await self._async_call_light("turn_on", run, data)

    async def _async_lights_off(self, run: AlarmRun) -> None:
        if not run.lights:
            return
        run.lights_off_by_us = True
        await self._async_call_light("turn_off", run, {ATTR_ENTITY_ID: run.lights})

    async def _async_call_light(self, service: str, run: AlarmRun, data: dict[str, Any]) -> None:
        try:
            await self.hass.services.async_call(
                "light", service, data, blocking=True, context=run.context
            )
        except Exception:
            _LOGGER.warning("DayBreak: light.%s failed for %s", service, run.lights, exc_info=True)

    async def _async_ring(self, alarm_id: str) -> None:
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run):
            return
        alarm = self.alarms[alarm_id]
        run.cancel_timer()
        was_snoozed = run.snooze_until is not None
        run.snooze_until = None
        run.ring_started = run.ring_started or dt_util.utcnow()
        run.lights_off_by_us = False
        await self._async_set_level(run, alarm["light"], 1.0, transition=1)
        self._fire(EVENT_ALARM_RINGING, alarm_id, {"after_snooze": was_snoozed})

        auto_stop = timedelta(minutes=alarm["behavior"]["auto_stop_minutes"])
        if run.test and (not auto_stop or auto_stop > TEST_MAX_RING):
            auto_stop = TEST_MAX_RING
        if auto_stop:
            run.timer = async_call_later(
                self.hass,
                auto_stop,
                self._job(self._end_run, alarm_id, END_AUTO_STOP),
            )
        self._notify(alarm_id)

    @callback
    def _on_light_change(self, alarm_id: str, event: Event[EventStateChangedData]) -> None:
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run) or run.lights_off_by_us:
            return
        old, new = event.data["old_state"], event.data["new_state"]
        if not old or not new or old.state != STATE_ON or new.state != STATE_OFF:
            return
        if new.context.id == run.context.id:
            return
        _LOGGER.debug("DayBreak: %s turned off by hand, stopping alarm", new.entity_id)
        self._end_run(alarm_id, END_MANUAL_OFF)

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
            if not run or not run.ring_started:
                continue
            alarm = self.alarms[target]
            behavior = alarm["behavior"]
            run.cancel_timer()
            run.snooze_until = dt_util.utcnow() + timedelta(
                minutes=minutes or behavior["snooze_minutes"]
            )
            if behavior["snooze_light"] == SNOOZE_LIGHT_OFF:
                await self._async_lights_off(run)
            elif behavior["snooze_light"] == SNOOZE_LIGHT_DIM:
                await self._async_set_level(run, alarm["light"], 0.0, transition=2)
            run.timer = async_track_point_in_utc_time(
                self.hass,
                self._job(self._async_ring, target),
                run.snooze_until,
            )
            self._fire(
                EVENT_ALARM_SNOOZED,
                target,
                {"snooze_until": run.snooze_until.isoformat()},
            )
            self._notify(target)

    async def async_stop(self, alarm_id: str | None = None) -> None:
        """Stop a running alarm (or all running alarms)."""
        for target in self._resolve_targets(alarm_id):
            if self._runtime[target].run:
                self._end_run(target, END_STOPPED)

    async def async_skip_next(self, alarm_id: str) -> None:
        """Skip the next occurrence without disabling the alarm."""
        alarm = self.get(alarm_id)
        when = self._runtime[alarm_id].next_alarm
        if not when:
            raise HomeAssistantError("Alarm has no upcoming occurrence")
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
        """Run the whole alarm now with a compressed sunrise of ``duration`` s."""
        self.get(alarm_id)
        runtime = self._runtime[alarm_id]
        if runtime.run:
            self._end_run(alarm_id, END_STOPPED)
        now = dt_util.utcnow()
        await self._async_start_run(alarm_id, now + timedelta(seconds=duration), now, test=True)

    @callback
    def _end_run(self, alarm_id: str, reason: str, *, reschedule: bool = True) -> None:
        runtime = self._runtime.get(alarm_id)
        if not runtime or not (run := runtime.run):
            return
        run.cancel_all()
        runtime.run = None
        alarm = self.alarms[alarm_id]

        if alarm["behavior"]["after_stop"] == AFTER_STOP_OFF and reason != END_MANUAL_OFF:
            self.hass.async_create_task(self._async_lights_off(run))

        data = {"reason": reason, "test": run.test}
        if reason in (END_STOPPED, END_MANUAL_OFF):
            self._fire(EVENT_ALARM_STOPPED, alarm_id, data)
        self._fire(EVENT_ALARM_FINISHED, alarm_id, data)

        if not run.test and is_one_time(alarm) and alarm["enabled"]:
            alarm["enabled"] = False
            alarm["date"] = None
            self._save()
        if reschedule:
            self._schedule(alarm_id)
        else:
            self._notify(alarm_id)

    def _job(self, func: Callable[..., Any], *args: Any) -> Callable[[datetime], None]:
        """Wrap a method as an event-loop timer callback."""

        @callback
        def _run(_now: datetime) -> None:
            result = func(*args)
            if inspect.iscoroutine(result):
                self.hass.async_create_task(result, eager_start=True)

        return _run

    @callback
    def _fire(self, event_type: str, alarm_id: str, extra: dict[str, Any] | None = None) -> None:
        alarm = self.alarms[alarm_id]
        run = self._runtime[alarm_id].run
        data: dict[str, Any] = {"alarm_id": alarm_id, "name": alarm["name"]}
        if run:
            data["test"] = run.test
            data["alarm_time"] = run.alarm_time.isoformat()
        if extra:
            data.update(extra)
        self.hass.bus.async_fire(event_type, data)
