"""Test runs in time lapse, with unsaved settings, and audio problems."""

from __future__ import annotations

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_OFF
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import async_mock_service

from .conftest import advance

LIGHT = "light.bedroom"
SPEAKER = "media_player.bedroom"


@pytest.fixture
def devices(hass: HomeAssistant):
    hass.states.async_set(LIGHT, STATE_OFF, {"supported_color_modes": ["color_temp"]})
    hass.states.async_set(SPEAKER, "idle", {"volume_level": 0.3})
    return {
        "light_on": async_mock_service(hass, "light", "turn_on"),
        "light_off": async_mock_service(hass, "light", "turn_off"),
        "volume": async_mock_service(hass, "media_player", "volume_set"),
        "pause": async_mock_service(hass, "media_player", "media_pause"),
        "resume": async_mock_service(hass, "media_player", "media_play"),
    }


def _alarm(**extra):
    return {
        "wake": {"time": "06:30"},
        "repeat": {"type": "weekly", "days": [0]},
        "light_lead": 2,
        "light": {"targets": {"entity_id": [LIGHT]}},
        "audio": {
            "enabled": True,
            "players": [SPEAKER],
            "source": {"type": "music_assistant", "media_id": "Morning", "media_type": "radio"},
            "lead": 5,
            "volume": [10, 40],
            "ramp": 2,
        },
        **extra,
    }


def _start(freezer: FrozenDateTimeFactory) -> None:
    tz = dt_util.get_default_time_zone()
    freezer.move_to(datetime(2026, 10, 4, 20, 0, tzinfo=tz))


async def test_time_lapse_with_snooze(
    hass: HomeAssistant, manager, devices, freezer: FrozenDateTimeFactory
) -> None:
    play = async_mock_service(hass, "music_assistant", "play_media")
    _start(freezer)
    await manager.async_update_settings(
        {"snooze_presets": [{"id": "s", "name": "S", "minutes": 5}], "default_snooze_count": 3}
    )
    alarm = await manager.async_create(_alarm())
    # 1 minute = 10 s: music 5 min before = 50 s, light 2 min before = 20 s.
    await manager.async_test(alarm["id"], speed=6)
    await hass.async_block_till_done()
    info = manager.runtime_info(alarm["id"])
    assert info["test"] and info["test_speed"] == 6
    assert play and not devices["light_on"]
    await advance(hass, freezer, timedelta(seconds=32), step=1)
    assert devices["light_on"]
    assert manager.state(alarm["id"]) == "sunrise"
    await advance(hass, freezer, timedelta(seconds=20), step=1)
    assert manager.state(alarm["id"]) == "ringing"
    # A 5 minute snooze takes 50 s.
    await manager.async_snooze(alarm["id"])
    await hass.async_block_till_done()
    assert devices["pause"]
    await advance(hass, freezer, timedelta(seconds=45), step=1)
    assert manager.state(alarm["id"]) == "snoozed"
    await advance(hass, freezer, timedelta(seconds=7), step=1)
    assert manager.state(alarm["id"]) == "ringing"
    assert devices["resume"]
    await manager.async_stop(alarm["id"])
    await hass.async_block_till_done()
    assert manager.state(alarm["id"]) == "scheduled"
    entry = manager.history[0]
    assert entry["test"] and entry["speed"] == 6 and entry["result"] == "stopped"
    assert [x["step"] for x in entry["steps"]] == [
        "start",
        "music",
        "music_playing",
        "ring",
        "snooze",
        "ring_again",
        "end",
    ]


async def test_unsaved_settings_audio_only_from_ring(
    hass: HomeAssistant, manager, devices, freezer: FrozenDateTimeFactory
) -> None:
    play = async_mock_service(hass, "music_assistant", "play_media")
    _start(freezer)
    alarm = await manager.async_create(_alarm())
    draft = _alarm()
    draft["audio"]["source"]["media_id"] = "Birds"
    await manager.async_test(alarm["id"], speed=6, config=draft, parts=["audio"], start="ring")
    await hass.async_block_till_done()
    assert manager.state(alarm["id"]) == "ringing"
    assert play[0].data["media_id"] == "Birds"
    assert not devices["light_on"]
    # The stored alarm is unchanged.
    assert manager.get(alarm["id"])["audio"]["source"]["media_id"] == "Morning"


async def test_wrong_media_type_retries_and_reports(
    hass: HomeAssistant, manager, devices, freezer: FrozenDateTimeFactory
) -> None:
    calls: list[dict] = []

    async def _play(call: ServiceCall) -> None:
        calls.append(dict(call.data))
        if "media_type" in call.data:
            raise HomeAssistantError("There is nothing to play here.")

    hass.services.async_register("music_assistant", "play_media", _play)
    _start(freezer)
    alarm = await manager.async_create(_alarm())
    await manager.async_test(alarm["id"], speed=6, parts=["audio"], start="ring")
    await hass.async_block_till_done()
    assert len(calls) == 2 and "media_type" not in calls[1]
    assert not manager.runtime_info(alarm["id"])["problems"]

    async def _broken(call: ServiceCall) -> None:
        raise HomeAssistantError("There is nothing to play here.")

    hass.services.async_register("music_assistant", "play_media", _broken)
    await manager.async_test(alarm["id"], speed=6, parts=["audio"], start="ring")
    await hass.async_block_till_done()
    problems = manager.runtime_info(alarm["id"])["problems"]
    assert problems[0]["part"] == "audio"
    assert "nothing to play" in problems[0]["message"]
    await manager.async_stop(alarm["id"])
    await hass.async_block_till_done()
    entry = manager.history[0]
    assert entry["result"] == "problem"
    failed = [x for x in entry["steps"] if not x["ok"]]
    assert failed[0]["step"] == "audio_failed"
    # The first test run is kept as well, newest first.
    assert len(manager.history) == 2
