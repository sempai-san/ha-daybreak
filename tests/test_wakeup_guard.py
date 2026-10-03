"""Presence handling and the last call (overslept) escalation."""

from __future__ import annotations

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_OFF
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    async_capture_events,
    async_fire_time_changed,
    async_mock_service,
)
import voluptuous as vol

from custom_components.daybreak.const import (
    EVENT_ALARM_FINISHED,
    EVENT_ALARM_SKIPPED,
    EVENT_LAST_CALL,
    EVENT_SUNRISE_STARTED,
)
from custom_components.daybreak.models import validate_alarm

LIGHT = "light.bedroom"
EXTRA = "light.hallway"
PERSON = "person.jan"


async def _advance(hass: HomeAssistant, freezer: FrozenDateTimeFactory, delta: timedelta) -> None:
    end = dt_util.utcnow() + delta
    while dt_util.utcnow() < end:
        freezer.tick(timedelta(seconds=5))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()


@pytest.fixture
def lights(hass: HomeAssistant):
    hass.states.async_set(LIGHT, STATE_OFF, {"supported_color_modes": ["color_temp"]})
    hass.states.async_set(EXTRA, STATE_OFF, {"supported_color_modes": ["color_temp"]})
    return async_mock_service(hass, "light", "turn_on")


def _morning(freezer: FrozenDateTimeFactory, hour: int, minute: int) -> None:
    freezer.move_to(datetime(2026, 10, 5, hour, minute, tzinfo=dt_util.get_default_time_zone()))


async def test_skip_when_nobody_home(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 0)
    hass.states.async_set(PERSON, "not_home")
    skipped = async_capture_events(hass, EVENT_ALARM_SKIPPED)
    started = async_capture_events(hass, EVENT_SUNRISE_STARTED)
    alarm = await manager.async_create(
        {
            "time": "06:30",
            "days": [0, 1, 2, 3, 4],
            "light": {"target": {"entity_id": [LIGHT]}, "duration": 10},
            "presence": {"entities": [PERSON]},
        }
    )
    await _advance(hass, freezer, timedelta(minutes=21))
    assert not started
    assert skipped and skipped[0].data["reason"] == "away"
    assert not lights
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    assert nxt.day == 6


async def test_unknown_presence_counts_as_home(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 0)
    hass.states.async_set(PERSON, "unavailable")
    started = async_capture_events(hass, EVENT_SUNRISE_STARTED)
    await manager.async_create(
        {
            "time": "06:30",
            "days": [0],
            "light": {"target": {"entity_id": [LIGHT]}, "duration": 10},
            "presence": {"entities": [PERSON]},
        }
    )
    await _advance(hass, freezer, timedelta(minutes=21))
    assert started


async def test_stop_when_leaving(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    hass.states.async_set(PERSON, "home")
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    alarm = await manager.async_create(
        {
            "time": "06:30",
            "days": [0],
            "light": {"target": {"entity_id": [LIGHT]}, "duration": 0},
            "presence": {"entities": [PERSON]},
        }
    )
    await _advance(hass, freezer, timedelta(minutes=2))
    assert manager.state(alarm["id"]) == "ringing"
    hass.states.async_set(PERSON, "not_home")
    await hass.async_block_till_done()
    assert finished and finished[0].data["reason"] == "away"


async def test_last_call(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    script_calls = async_mock_service(hass, "test", "wake_up")
    last_calls = async_capture_events(hass, EVENT_LAST_CALL)
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    alarm = await manager.async_create(
        {
            "time": "06:30",
            "days": [0],
            "light": {"target": {"entity_id": [LIGHT]}, "duration": 0},
            "behavior": {"auto_stop_minutes": 60, "snooze_minutes": 5},
            "last_call": {
                "enabled": True,
                "after_minutes": 15,
                "duration": 5,
                "target": {"entity_id": [LIGHT, EXTRA]},
                "actions": [{"action": "test.wake_up", "data": {"loud": True}}],
            },
        }
    )
    await _advance(hass, freezer, timedelta(minutes=2))
    assert manager.state(alarm["id"]) == "ringing"
    # Snoozing does not prevent the last call.
    await manager.async_snooze(alarm["id"])
    await _advance(hass, freezer, timedelta(minutes=14))
    assert manager.state(alarm["id"]) == "last_call"
    assert len(last_calls) == 1
    on = lights[-1].data
    assert on["entity_id"] == [LIGHT, EXTRA]
    assert on["brightness"] == 255
    assert on["color_temp_kelvin"] == 5000
    assert script_calls and script_calls[0].data == {"loud": True}

    # Snooze is ignored during the last call; it ends by itself.
    await manager.async_snooze(alarm["id"])
    assert manager.state(alarm["id"]) == "last_call"
    await _advance(hass, freezer, timedelta(minutes=5, seconds=5))
    assert finished and finished[0].data["reason"] == "last_call_timeout"
    assert manager.state(alarm["id"]) == "scheduled"


async def test_auto_stop_hands_over_to_last_call(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    last_calls = async_capture_events(hass, EVENT_LAST_CALL)
    alarm = await manager.async_create(
        {
            "time": "06:30",
            "days": [0],
            "light": {"target": {"entity_id": [LIGHT]}, "duration": 0},
            "behavior": {"auto_stop_minutes": 5},
            "last_call": {"enabled": True, "after_minutes": 30},
        }
    )
    await _advance(hass, freezer, timedelta(minutes=7))
    assert last_calls
    assert manager.state(alarm["id"]) == "last_call"


async def test_stop_prevents_last_call(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    last_calls = async_capture_events(hass, EVENT_LAST_CALL)
    alarm = await manager.async_create(
        {
            "time": "06:30",
            "days": [0],
            "light": {"target": {"entity_id": [LIGHT]}, "duration": 0},
            "last_call": {"enabled": True, "after_minutes": 5},
        }
    )
    await _advance(hass, freezer, timedelta(minutes=2))
    await manager.async_stop(alarm["id"])
    await _advance(hass, freezer, timedelta(minutes=10))
    assert not last_calls


def test_invalid_actions_rejected() -> None:
    with pytest.raises(vol.Invalid):
        validate_alarm({"last_call": {"actions": [{"not_an_action": 1}]}})
