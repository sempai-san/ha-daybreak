"""Audio for a running alarm: music, announcement, volume ramp, speaker button."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import (
    CALLBACK_TYPE,
    Context,
    Event,
    EventStateChangedData,
    HomeAssistant,
    callback,
)
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.template import Template
from homeassistant.util import dt as dt_util

from .curve import curve_value

_LOGGER = logging.getLogger(__name__)

RAMP_INTERVAL = timedelta(seconds=10)
# State changes this soon after our own command are ours, not a button press.
QUIET = timedelta(seconds=5)


class AlarmAudio:
    """Controls the speakers of one alarm run."""

    def __init__(
        self,
        hass: HomeAssistant,
        audio: dict[str, Any],
        context: Context,
        variables: dict[str, Any],
        on_button: Callable[[], None],
        *,
        speed: float = 1.0,
        on_problem: Callable[[str], None] | None = None,
        on_event: Callable[[str, dict[str, Any]], None] | None = None,
    ) -> None:
        self.hass = hass
        self.audio = audio
        self.players: list[str] = list(audio["players"])
        self.context = context
        self.variables = variables
        self._on_button = on_button
        self._on_problem = on_problem
        self._on_event = on_event
        # Time lapse of a test run: the ramp runs this many times faster.
        self._speed = max(speed, 1.0)
        self._saved: dict[str, float] = {}
        self._volume: float = audio["volume"][0]
        self._ramp_from = audio["volume"][0]
        self._ramp_to = audio["volume"][1]
        self._ramp_start: datetime | None = None
        self._ramp_seconds = audio["ramp"] * 60 / self._speed
        self._ramp_unsub: CALLBACK_TYPE | None = None
        self._state_unsub: CALLBACK_TYPE | None = None
        self._quiet_until = dt_util.utcnow()
        self._source = audio["source"]
        self.started = False
        self.paused = False
        self.should_play = False

    # -------------------------------------------------------------- helpers

    async def _call(
        self,
        domain: str,
        service: str,
        data: dict[str, Any],
        *,
        report: bool = True,
        **target: Any,
    ) -> bool:
        """Call a speaker service; False (and a reported problem) if it failed."""
        self._quiet_until = dt_util.utcnow() + QUIET
        try:
            await self.hass.services.async_call(
                domain,
                service,
                data,
                target=target or {ATTR_ENTITY_ID: self.players},
                blocking=True,
                context=self.context,
            )
        except Exception as err:  # a broken speaker must not stop the alarm
            _LOGGER.warning(
                "DayBreak: %s.%s failed for %s", domain, service, self.players, exc_info=True
            )
            if report and self._on_problem:
                self._on_problem(f"{domain}.{service}: {err}")
            return False
        return True

    async def _set_volume(self, percent: float) -> None:
        self._volume = percent
        await self._call("media_player", "volume_set", {"volume_level": round(percent / 100, 3)})

    async def _play_source(self, source: dict[str, Any]) -> None:
        if source["type"] == "music_assistant" and source["media_id"]:
            if self.hass.services.has_service("music_assistant", "play_media"):
                data = {"media_id": source["media_id"], "enqueue": "replace"}
                name = source.get("name") or source["media_id"]
                if await self._call(
                    "music_assistant",
                    "play_media",
                    {**data, "media_type": source["media_type"]},
                    report=False,
                ):
                    self._event("music_playing", source=name)
                    return
                # A wrong media type makes Music Assistant find nothing: let it
                # work the type out from the uri or name itself.
                if await self._call("music_assistant", "play_media", data):
                    self._event("music_retry", source=name)
                return
            _LOGGER.warning("DayBreak: Music Assistant is not available")
            if self._on_problem:
                self._on_problem("Music Assistant is not available")
        if (
            source["type"] == "url"
            and source["url"]
            and await self._call(
                "media_player",
                "play_media",
                {"media_content_id": source["url"], "media_content_type": "music"},
            )
        ):
            self._event("music_playing", source=source["url"].rsplit("/", 1)[-1])

    def _event(self, event: str, **info: Any) -> None:
        if self._on_event:
            self._on_event(event, info)

    def _has_music(self) -> bool:
        source = self._source
        return (source["type"] == "music_assistant" and bool(source["media_id"])) or (
            source["type"] == "url" and bool(source["url"])
        )

    # -------------------------------------------------------------- phases

    async def async_start(self) -> None:
        """Before the alarm: save volumes, start quietly, ramp up."""
        if self.started or not self.players:
            return
        self.started = True
        for entity_id in self.players:
            state = self.hass.states.get(entity_id)
            if state and (level := state.attributes.get("volume_level")) is not None:
                self._saved[entity_id] = float(level)
        self._state_unsub = async_track_state_change_event(self.hass, self.players, self._on_state)
        if not self._has_music():
            return
        await self._set_volume(self._ramp_from)
        self.should_play = True
        await self._play_source(self._source)
        self._ramp_start = dt_util.utcnow()
        if self._ramp_seconds and (self._ramp_to != self._ramp_from or self.audio["curve"]):
            interval = max(RAMP_INTERVAL / self._speed, timedelta(seconds=1))
            self._ramp_unsub = async_track_time_interval(self.hass, self._ramp_tick, interval)
        else:
            await self._set_volume(self._ramp_to)

    async def async_ring(self) -> None:
        """At the alarm time (and after each snooze)."""
        if not self.started:
            await self.async_start()
        if self.paused:
            self.paused = False
            await self._call("media_player", "media_play", {})
        await self._announce()

    async def async_pause(self) -> None:
        """Snooze: pause the music."""
        if not self.started or not self.audio["pause_on_snooze"]:
            return
        self.paused = True
        if self._has_music():
            await self._call("media_player", "media_pause", {})

    async def async_last_call(self, profile: dict[str, Any]) -> None:
        """Overslept: own source and/or louder volume from the last call profile."""
        if not self.started:
            await self.async_start()
        self._stop_ramp()
        self.paused = False
        source = profile.get("audio") or {"type": "none"}
        volume = profile.get("volume")
        if volume is None:
            volume = max(self._ramp_to, self._volume)
        await self._set_volume(volume)
        if source["type"] != "none":
            self._source = source
            self.should_play = True
            await self._play_source(source)
        elif self._has_music():
            self.should_play = True
            await self._call("media_player", "media_play", {})

    async def async_stop(self) -> None:
        """Alarm over: stop, then put the old volume back."""
        self._stop_ramp()
        if self._state_unsub:
            self._state_unsub()
            self._state_unsub = None
        if not self.started:
            return
        self.should_play = False
        if self._has_music():
            await self._call("media_player", "media_pause", {})
        if self.audio["restore_volume"]:
            for entity_id, level in self._saved.items():
                await self._call(
                    "media_player", "volume_set", {"volume_level": level}, entity_id=entity_id
                )

    # ------------------------------------------------------------ internals

    async def _announce(self) -> None:
        tts = self.audio["tts"]
        if not tts["enabled"] or not tts["message"].strip():
            return
        engine = tts["engine"] or next(iter(sorted(self.hass.states.async_entity_ids("tts"))), None)
        if not engine:
            _LOGGER.warning("DayBreak: no text-to-speech engine for the announcement")
            return
        try:
            message = Template(tts["message"], self.hass).async_render(
                self.variables, parse_result=False
            )
        except Exception:
            _LOGGER.warning("DayBreak: announcement template failed", exc_info=True)
            message = tts["message"]
        await self._call(
            "tts",
            "speak",
            {"media_player_entity_id": self.players, "message": str(message), "cache": False},
            entity_id=engine,
        )

    def _stop_ramp(self) -> None:
        if self._ramp_unsub:
            self._ramp_unsub()
            self._ramp_unsub = None

    async def _ramp_tick(self, _now: datetime) -> None:
        if self.paused or not self._ramp_start:
            return
        done = (dt_util.utcnow() - self._ramp_start).total_seconds() / self._ramp_seconds
        if done >= 1:
            self._stop_ramp()
            done = 1.0
        await self._set_volume(self.volume_at(done))

    def volume_at(self, done: float) -> float:
        """Volume after this share of the ramp, smooth through the curve points."""
        lo, hi = self._ramp_from, self._ramp_to
        points = [(0.0, lo / 100), *((x, y / 100) for x, y in self.audio["curve"]), (1.0, hi / 100)]
        return curve_value(points, done) * 100

    @callback
    def _on_state(self, event: Event[EventStateChangedData]) -> None:
        old, new = event.data["old_state"], event.data["new_state"]
        if not old or not new or old.state != "playing":
            return
        if dt_util.utcnow() < self._quiet_until or new.context.id == self.context.id:
            return
        if new.state == "paused" and self.audio["button"] and not self.paused:
            _LOGGER.debug("DayBreak: pause on %s counts as button press", new.entity_id)
            self._on_button()
        elif new.state == "idle" and self.should_play and not self.paused:
            # A single sound ended by itself: play it again.
            self.hass.async_create_task(self._play_source(self._source), eager_start=False)
