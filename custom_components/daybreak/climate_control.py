"""Climate before waking up: heating, cooling, fans, humidity and similar.

A ``ClimateRun`` belongs to one alarm occurrence. It remembers how every
device was set, switches the devices to their targets, pauses while a window
is open, measures how fast the room reaches its target (for the learned
start) and finally restores the old state, switches off or keeps running
while somebody is home.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.const import ATTR_ENTITY_ID, STATE_OFF, STATE_ON
from homeassistant.core import (
    CALLBACK_TYPE,
    Context,
    Event,
    EventStateChangedData,
    HomeAssistant,
    callback,
)
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.util import dt as dt_util

_LOGGER = logging.getLogger(__name__)

# Minutes per degree when nothing has been learned yet (about 6 °C per hour).
DEFAULT_MIN_PER_DEGREE = 10.0
# The room counts as "there" this close to the target.
REACHED = 0.3
# Give up measuring after this long.
LEARN_TIMEOUT = timedelta(hours=4)
MAX_SAMPLES = 20
_HEATING = ("heat", "heat_cool", "auto")
_COOLING = ("cool", "heat_cool", "auto")


@dataclass
class ClimateConfig:
    """Everything a run needs, resolved from the alarm and its profile."""

    devices: list[str]
    settings: dict[str, Any]
    room_sensor: str | None
    windows: list[str]


def _float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def room_temperature(hass: HomeAssistant, config: ClimateConfig) -> float | None:
    """The room temperature: the room sensor, else the first thermostat's reading."""
    if config.room_sensor and (state := hass.states.get(config.room_sensor)):
        return _float(state.state)
    for entity_id in config.devices:
        state = hass.states.get(entity_id) if entity_id.startswith("climate.") else None
        if state and (value := _float(state.attributes.get("current_temperature"))) is not None:
            return value
    return None


def needed_delta(settings: dict[str, Any], room: float | None) -> float | None:
    """Degrees the room still has to change; None when it does not matter."""
    if room is None or settings["mode"] not in (*_HEATING, *_COOLING):
        return None
    target = settings["temperature"]
    if settings["mode"] == "heat":
        return target - room
    if settings["mode"] == "cool":
        return room - target
    return abs(target - room)


def estimate_lead(
    settings: dict[str, Any],
    samples: list[dict[str, float]],
    room: float | None,
    outdoor: float | None,
) -> int:
    """Minutes before the alarm the climate should start (learned start)."""
    cap = settings["max_lead"]
    delta = needed_delta(settings, room)
    if delta is None:
        return min(settings["lead"], cap)
    if delta <= 0:
        return 0
    per_degree = DEFAULT_MIN_PER_DEGREE
    if samples:
        # Runs at a similar outdoor temperature count more.
        total = weight_sum = 0.0
        for sample in samples:
            weight = 1.0
            if outdoor is not None and sample.get("outdoor") is not None:
                weight = 1 / (1 + abs(outdoor - sample["outdoor"]) / 3)
            total += sample["per_degree"] * weight
            weight_sum += weight
        per_degree = total / weight_sum
    return int(min(cap, max(5, round(delta * per_degree * 1.1 + 5))))


def outdoor_allows(settings: dict[str, Any], outdoor: float | None) -> bool:
    """The outdoor conditions of the settings (unknown outdoor = allowed)."""
    if outdoor is None:
        return True
    if (below := settings["outdoor_below"]) is not None and outdoor >= below:
        return False
    return not ((above := settings["outdoor_above"]) is not None and outdoor <= above)


class ClimateRun:
    """Climate of one alarm occurrence."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: ClimateConfig,
        when: datetime,
        *,
        outdoor: float | None,
        on_learned: Callable[[dict[str, float]], None],
    ) -> None:
        self.hass = hass
        self.config = config
        self.settings = config.settings
        # The alarm time this run prepares for, and its unshifted base time.
        self.when = when
        self.base: datetime | None = None
        self.outdoor = outdoor
        self.context = Context()
        # Called with (entity_id, service, data) for every command (history).
        self.on_command: Any = None
        self.active: list[str] = []
        self.paused = False
        self.finished = False
        self._saved: dict[str, dict[str, Any]] = {}
        self._on_learned = on_learned
        self._unsubs: list[CALLBACK_TYPE] = []
        self._learn_unsub: CALLBACK_TYPE | None = None
        self._learn_from: tuple[datetime, float] | None = None
        self._after_unsub: CALLBACK_TYPE | None = None
        self._anyone_home: Callable[[], bool] | None = None

    # ---------------------------------------------------------------- start

    async def async_start(self) -> None:
        room = room_temperature(self.hass, self.config)
        for entity_id in self.config.devices:
            state = self.hass.states.get(entity_id)
            if state is None or state.state == "unavailable":
                _LOGGER.warning("DayBreak: climate device %s is not available", entity_id)
                continue
            if not self._needed(entity_id, state, room):
                _LOGGER.debug("DayBreak: %s is already at its target", entity_id)
                continue
            self._saved[entity_id] = {"state": state.state, "attributes": dict(state.attributes)}
            self.active.append(entity_id)
        if self.config.windows:
            self._unsubs.append(
                async_track_state_change_event(self.hass, self.config.windows, self._on_window)
            )
        if self._window_open():
            self.paused = True
        else:
            await self._async_apply_all()
        self._start_learning(room)

    def _needed(self, entity_id: str, state: Any, room: float | None) -> bool:
        if not self.settings["only_if_needed"] or not entity_id.startswith("climate."):
            return True
        own = _float(state.attributes.get("current_temperature"))
        delta = needed_delta(self.settings, room if room is not None else own)
        return delta is None or delta > 0.2

    async def _async_apply_all(self) -> None:
        for entity_id in self.active:
            await self._async_apply(entity_id)

    async def _async_apply(self, entity_id: str) -> None:
        s = self.settings
        domain = entity_id.split(".", 1)[0]
        state = self.hass.states.get(entity_id)
        attrs = state.attributes if state else {}
        if domain == "climate":
            mode = _pick_mode(s["mode"], attrs.get("hvac_modes") or [])
            if mode is None:
                _LOGGER.warning("DayBreak: %s cannot %s", entity_id, s["mode"])
                return
            if mode in ("dry", "fan_only") or s["mode"] in ("dry", "fan_only"):
                await self._call("climate", "set_hvac_mode", entity_id, hvac_mode=mode)
                return
            data: dict[str, Any] = {"hvac_mode": mode}
            if "temperature" not in attrs and "target_temp_low" in attrs:
                data["target_temp_low"] = s["temperature"] - 1
                data["target_temp_high"] = s["temperature"] + 1
            else:
                data["temperature"] = s["temperature"]
            await self._call("climate", "set_temperature", entity_id, **data)
        elif domain == "fan":
            await self._call("fan", "turn_on", entity_id, percentage=s["fan"])
        elif domain == "humidifier":
            await self._call("humidifier", "turn_on", entity_id)
            await self._call("humidifier", "set_humidity", entity_id, humidity=s["humidity"])
        elif domain == "water_heater":
            if self.hass.services.has_service("water_heater", "turn_on"):
                await self._call("water_heater", "turn_on", entity_id)
            await self._call(
                "water_heater", "set_temperature", entity_id, temperature=s["water_temperature"]
            )
        else:
            await self._call(domain, "turn_on", entity_id)

    async def _async_off(self, entity_id: str) -> None:
        domain = entity_id.split(".", 1)[0]
        if domain == "climate":
            await self._call("climate", "set_hvac_mode", entity_id, hvac_mode="off")
        elif domain == "water_heater":
            if self.hass.services.has_service("water_heater", "turn_off"):
                await self._call("water_heater", "turn_off", entity_id)
        else:
            await self._call(domain, "turn_off", entity_id)

    async def _async_restore(self, entity_id: str) -> None:
        saved = self._saved.get(entity_id)
        if not saved:
            return
        domain = entity_id.split(".", 1)[0]
        old, attrs = saved["state"], saved["attributes"]
        if domain == "climate":
            if old == STATE_OFF or old not in (attrs.get("hvac_modes") or []):
                await self._call("climate", "set_hvac_mode", entity_id, hvac_mode=STATE_OFF)
                return
            data: dict[str, Any] = {"hvac_mode": old}
            if attrs.get("temperature") is not None:
                data["temperature"] = attrs["temperature"]
            elif attrs.get("target_temp_low") is not None:
                data["target_temp_low"] = attrs["target_temp_low"]
                data["target_temp_high"] = attrs["target_temp_high"]
            else:
                await self._call("climate", "set_hvac_mode", entity_id, hvac_mode=old)
                return
            await self._call("climate", "set_temperature", entity_id, **data)
        elif domain == "fan":
            if old == STATE_ON:
                extra = {}
                if attrs.get("percentage") is not None:
                    extra["percentage"] = attrs["percentage"]
                await self._call("fan", "turn_on", entity_id, **extra)
            else:
                await self._call("fan", "turn_off", entity_id)
        elif domain == "humidifier":
            if old == STATE_ON:
                if attrs.get("humidity") is not None:
                    await self._call(
                        "humidifier", "set_humidity", entity_id, humidity=attrs["humidity"]
                    )
            else:
                await self._call("humidifier", "turn_off", entity_id)
        elif domain == "water_heater":
            if attrs.get("temperature") is not None:
                await self._call(
                    "water_heater", "set_temperature", entity_id, temperature=attrs["temperature"]
                )
            if old == STATE_OFF:
                await self._async_off(entity_id)
        elif old == STATE_OFF:
            await self._call(domain, "turn_off", entity_id)

    async def _call(self, domain: str, service: str, entity_id: str, **data: Any) -> None:
        if self.on_command:
            self.on_command([entity_id], f"{domain}.{service}", data)
        try:
            await self.hass.services.async_call(
                domain,
                service,
                {ATTR_ENTITY_ID: entity_id, **data},
                blocking=True,
                context=self.context,
            )
        except Exception:  # one broken device must not stop the others
            _LOGGER.warning(
                "DayBreak: %s.%s failed for %s", domain, service, entity_id, exc_info=True
            )

    # -------------------------------------------------------------- windows

    def _window_open(self) -> bool:
        return any(
            (state := self.hass.states.get(e)) is not None and state.state == STATE_ON
            for e in self.config.windows
        )

    @callback
    def _on_window(self, _event: Event[EventStateChangedData]) -> None:
        if self.finished:
            return
        if self._window_open() and not self.paused:
            self.paused = True
            _LOGGER.debug("DayBreak: window open, pausing climate")
            for entity_id in self.active:
                self.hass.async_create_task(self._async_off(entity_id), eager_start=False)
        elif not self._window_open() and self.paused:
            self.paused = False
            _LOGGER.debug("DayBreak: windows closed, climate continues")
            self.hass.async_create_task(self._async_apply_all(), eager_start=False)

    # ------------------------------------------------------------- learning

    def _start_learning(self, room: float | None) -> None:
        delta = needed_delta(self.settings, room)
        if room is None or delta is None or delta < 0.5 or not self.active:
            return
        if not any(e.startswith("climate.") for e in self.active):
            return
        self._learn_from = (dt_util.utcnow(), room)
        sources = (
            [self.config.room_sensor]
            if self.config.room_sensor
            else [e for e in self.active if e.startswith("climate.")][:1]
        )
        self._learn_unsub = async_track_state_change_event(self.hass, sources, self._on_room)
        self._unsubs.append(async_call_later(self.hass, LEARN_TIMEOUT, self._learn_timeout))

    @callback
    def _on_room(self, _event: Event[EventStateChangedData]) -> None:
        if not self._learn_from or self.paused:
            return
        room = room_temperature(self.hass, self.config)
        delta = needed_delta(self.settings, room)
        if room is None or delta is None or delta > REACHED:
            return
        started, start_temp = self._learn_from
        degrees = abs(room - start_temp)
        minutes = (dt_util.utcnow() - started).total_seconds() / 60
        self._stop_learning()
        if degrees >= 0.5 and minutes >= 1:
            self._on_learned({"per_degree": round(minutes / degrees, 2), "outdoor": self.outdoor})

    @callback
    def _learn_timeout(self, _now: datetime) -> None:
        self._stop_learning()

    def _stop_learning(self) -> None:
        self._learn_from = None
        if self._learn_unsub:
            self._learn_unsub()
            self._learn_unsub = None

    # ---------------------------------------------------------------- after

    def finish(
        self,
        *,
        anyone_home: Callable[[], bool],
        presence_entities: list[str],
        now: bool = False,
    ) -> None:
        """The alarm is over (or was skipped): restore, switch off or keep running."""
        s = self.settings
        if now:
            self.hass.async_create_task(self.async_end(), eager_start=False)
            return
        if s["after"] == "presence":
            if presence_entities:
                self._anyone_home = anyone_home
                self._unsubs.append(
                    async_track_state_change_event(self.hass, presence_entities, self._on_presence)
                )
            if s["minutes"]:
                self._after_unsub = async_call_later(self.hass, s["minutes"] * 60, self._job_end)
            return
        if s["minutes"]:
            self._after_unsub = async_call_later(self.hass, s["minutes"] * 60, self._job_end)
        else:
            self.hass.async_create_task(self.async_end(), eager_start=False)

    @callback
    def _on_presence(self, _event: Event[EventStateChangedData]) -> None:
        if self._anyone_home and not self._anyone_home():
            self.hass.async_create_task(self.async_end(), eager_start=False)

    @callback
    def _job_end(self, _now: datetime) -> None:
        self._after_unsub = None
        self.hass.async_create_task(self.async_end(), eager_start=False)

    async def async_end(self) -> None:
        if self.finished:
            return
        self.finished = True
        self.cancel()
        off = self.settings["after"] == "off"
        for entity_id in self.active:
            if off:
                await self._async_off(entity_id)
            else:
                await self._async_restore(entity_id)

    def cancel(self) -> None:
        """Stop listening (unload); leaves the devices as they are."""
        self._stop_learning()
        if self._after_unsub:
            self._after_unsub()
            self._after_unsub = None
        while self._unsubs:
            self._unsubs.pop()()


def _pick_mode(wanted: str, modes: list[str]) -> str | None:
    """The device's mode for what is wanted (e.g. "heat" via "heat_cool")."""
    if wanted in modes:
        return wanted
    fallbacks = {
        "heat": ("heat_cool", "auto"),
        "cool": ("heat_cool", "auto"),
        "heat_cool": ("auto", "heat"),
        "auto": ("heat_cool", "heat"),
        "dry": ("fan_only",),
        "fan_only": (),
    }
    return next((m for m in fallbacks.get(wanted, ()) if m in modes), None)
