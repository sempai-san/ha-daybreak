"""Presence, last call, shifts, holidays, fallback and notifications."""

from __future__ import annotations

from datetime import datetime, timedelta
from unittest.mock import patch

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_OFF
from homeassistant.core import HomeAssistant, ServiceResponse
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_capture_events,
    async_mock_service,
)

from custom_components.daybreak.const import (
    DOMAIN,
    EVENT_ALARM_FINISHED,
    EVENT_ALARM_RINGING,
    EVENT_ALARM_SHIFTED,
    EVENT_ALARM_SKIPPED,
    EVENT_LAST_CALL,
    EVENT_SUNRISE_STARTED,
)

from .conftest import advance

LIGHT = "light.bedroom"
EXTRA = "light.hallway"
PERSON = "person.jan"
WEATHER = "weather.home"
MONDAY = {"type": "weekly", "days": [0]}
WEEKDAYS = {"type": "weekly", "days": [0, 1, 2, 3, 4]}


@pytest.fixture
def lights(hass: HomeAssistant):
    hass.states.async_set(LIGHT, STATE_OFF, {"supported_color_modes": ["color_temp"]})
    hass.states.async_set(EXTRA, STATE_OFF, {"supported_color_modes": ["color_temp"]})
    return async_mock_service(hass, "light", "turn_on")


def _morning(freezer: FrozenDateTimeFactory, hour: int, minute: int, day: int = 5) -> None:
    freezer.move_to(datetime(2026, 10, day, hour, minute, tzinfo=dt_util.get_default_time_zone()))


def _alarm(lead: int = 0, **extra):
    return {
        "wake": {"time": "06:30"},
        "repeat": MONDAY,
        "light_lead": lead,
        "light": {"targets": {"entity_id": [LIGHT]}},
        **extra,
    }


async def _snooze_preset(manager, minutes: int, count: int) -> None:
    await manager.async_update_settings(
        {
            "snooze_presets": [{"id": "p", "name": "P", "minutes": minutes}],
            "default_snooze_count": count,
        }
    )


async def test_skip_when_nobody_home(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 0)
    hass.states.async_set(PERSON, "not_home")
    skipped = async_capture_events(hass, EVENT_ALARM_SKIPPED)
    started = async_capture_events(hass, EVENT_SUNRISE_STARTED)
    alarm = await manager.async_create(_alarm(10, repeat=WEEKDAYS, presence={"entities": [PERSON]}))
    await advance(hass, freezer, timedelta(minutes=21))
    assert not started
    assert skipped and skipped[0].data["reason"] == "away"
    assert not lights
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    assert nxt.day == 6


async def test_owners_are_no_presence_check(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    """Without presence entities the alarm runs, even if its owner is away."""
    _morning(freezer, 6, 0)
    hass.states.async_set(PERSON, "not_home")
    skipped = async_capture_events(hass, EVENT_ALARM_SKIPPED)
    started = async_capture_events(hass, EVENT_SUNRISE_STARTED)
    await manager.async_create(_alarm(10, owners=[PERSON]))
    await advance(hass, freezer, timedelta(minutes=21))
    assert not skipped
    assert started


async def test_unknown_presence_counts_as_home(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 0)
    hass.states.async_set(PERSON, "unavailable")
    started = async_capture_events(hass, EVENT_SUNRISE_STARTED)
    await manager.async_create(_alarm(10, presence={"entities": [PERSON]}))
    await advance(hass, freezer, timedelta(minutes=21))
    assert started


async def test_stop_when_leaving(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    hass.states.async_set(PERSON, "home")
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    alarm = await manager.async_create(_alarm(0, presence={"entities": [PERSON]}))
    await advance(hass, freezer, timedelta(minutes=2))
    assert manager.state(alarm["id"]) == "ringing"
    hass.states.async_set(PERSON, "not_home")
    await hass.async_block_till_done()
    assert finished and finished[0].data["reason"] == "away"


async def test_last_call(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    await _snooze_preset(manager, 5, 3)
    script_calls = async_mock_service(hass, "test", "wake_up")
    last_calls = async_capture_events(hass, EVENT_LAST_CALL)
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    profile = await manager.async_save_profile(
        "last_call",
        {
            "name": "Loud",
            "duration": 5,
            "targets": {"entity_id": [LIGHT, EXTRA]},
            "actions": [{"action": "test.wake_up", "data": {"loud": True}}],
        },
    )
    alarm = await manager.async_create(
        _alarm(0, last_call={"enabled": True, "profile": profile["id"]})
    )
    await advance(hass, freezer, timedelta(minutes=2))
    assert manager.state(alarm["id"]) == "ringing"
    # Snoozing does not move the last call: 3 x 5 min after the first ring.
    await manager.async_snooze(alarm["id"])
    await advance(hass, freezer, timedelta(minutes=14))
    assert manager.state(alarm["id"]) == "last_call"
    assert len(last_calls) == 1
    on = lights[-1].data
    assert sorted(on["entity_id"]) == [LIGHT, EXTRA]
    assert on["brightness"] == 255
    assert on["color_temp_kelvin"] == 5000
    assert script_calls and script_calls[0].data == {"loud": True}

    # Snooze is ignored during the last call; it ends by itself.
    await manager.async_snooze(alarm["id"])
    assert manager.state(alarm["id"]) == "last_call"
    await advance(hass, freezer, timedelta(minutes=5, seconds=5))
    assert finished and finished[0].data["reason"] == "last_call_timeout"
    assert manager.state(alarm["id"]) == "scheduled"


async def test_last_call_duration_per_alarm(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    await _snooze_preset(manager, 5, 1)
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    alarm = await manager.async_create(_alarm(0, last_call={"enabled": True, "duration": 3}))
    await advance(hass, freezer, timedelta(minutes=6, seconds=30))
    assert manager.state(alarm["id"]) == "last_call"
    await advance(hass, freezer, timedelta(minutes=3, seconds=5))
    assert finished and finished[0].data["reason"] == "last_call_timeout"


async def test_stop_prevents_last_call(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    last_calls = async_capture_events(hass, EVENT_LAST_CALL)
    alarm = await manager.async_create(_alarm(0, last_call={"enabled": True}))
    await advance(hass, freezer, timedelta(minutes=2))
    await manager.async_stop(alarm["id"])
    await advance(hass, freezer, timedelta(minutes=30))
    assert not last_calls


async def test_wake_actions(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    calls = async_mock_service(hass, "test", "phase")
    actions = {
        phase: [{"action": "test.phase", "data": {"phase": phase}}]
        for phase in ("wake", "snooze", "stop")
    }
    alarm = await manager.async_create(_alarm(0, actions=actions))
    await advance(hass, freezer, timedelta(minutes=2))
    await manager.async_snooze(alarm["id"])
    await manager.async_stop(alarm["id"])
    await hass.async_block_till_done()
    assert [c.data["phase"] for c in calls] == ["wake", "snooze", "stop"]


def _weather(hass: HomeAssistant, condition: str) -> None:
    hass.states.async_set(WEATHER, condition, {"temperature": 5})


async def test_weather_shift_moves_light_start(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 5, 0)
    _weather(hass, "sunny")
    await manager.async_update_settings({"weather_entity": WEATHER})
    shifted = async_capture_events(hass, EVENT_ALARM_SHIFTED)
    alarm = await manager.async_create(
        _alarm(20, shift={"weather": {"enabled": True, "conditions": ["snow"]}})
    )
    await hass.async_block_till_done()
    assert manager.runtime_info(alarm["id"])["shift"] == 0

    _weather(hass, "snowy")
    await advance(hass, freezer, timedelta(minutes=6), step=30)
    info = manager.runtime_info(alarm["id"])
    assert info["shift"] == 15
    assert shifted and shifted[0].data["minutes"] == 15
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    start = dt_util.as_local(dt_util.parse_datetime(info["next_light_start"]))
    assert (nxt.hour, nxt.minute) == (6, 15)
    assert (start.hour, start.minute) == (5, 55)


async def test_shift_during_sunrise_shortens_ramp(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 0)
    _weather(hass, "sunny")
    await manager.async_update_settings({"weather_entity": WEATHER})
    ringing = async_capture_events(hass, EVENT_ALARM_RINGING)
    alarm = await manager.async_create(
        _alarm(30, shift={"weather": {"enabled": True, "conditions": ["snow"]}})
    )
    await advance(hass, freezer, timedelta(minutes=10))
    assert manager.state(alarm["id"]) == "sunrise"
    before = lights[-1].data["brightness"]

    # Snow starts at 06:10: alarm moves to 06:15, the ramp gets shorter.
    _weather(hass, "snowy")
    await advance(hass, freezer, timedelta(minutes=2))
    assert manager.runtime_info(alarm["id"])["alarm_time"].startswith("2026-10-05T06:15")
    assert lights[-1].data["brightness"] >= before
    await advance(hass, freezer, timedelta(minutes=3, seconds=30))
    assert ringing
    assert dt_util.as_local(ringing[0].time_fired).minute in (15, 16)


async def test_holidays_from_workday(
    hass: HomeAssistant, manager, freezer: FrozenDateTimeFactory
) -> None:
    freezer.move_to(datetime(2026, 10, 1, 12, 0, tzinfo=dt_util.get_default_time_zone()))
    hass.states.async_set(
        "binary_sensor.workday", "on", {"workdays": ["mon", "tue", "wed", "thu", "fri"]}
    )

    def check_date(call) -> ServiceResponse:
        day = call.data["check_date"]
        return {"binary_sensor.workday": {"workday": str(day) != "2026-10-02"}}

    hass.services.async_register("workday", "check_date", check_date, supports_response="only")
    await manager.async_update_settings({"holiday_entity": "binary_sensor.workday"})
    alarm = await manager.async_create({"wake": {"time": "06:30"}, "repeat": WEEKDAYS})
    await hass.async_block_till_done()
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    assert nxt.day == 5  # Friday 2 Oct is a holiday, weekend free

    await manager.async_update(alarm["id"], {"wake_on_holidays": True})
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    assert nxt.day == 2


async def test_fallback_light_and_notification(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    hass.states.async_set(LIGHT, "unavailable")
    notify = async_mock_service(hass, "notify", "phone")
    await manager.async_create(
        _alarm(0, fallback={"lights": {LIGHT: EXTRA}, "notify": "notify.phone"})
    )
    await advance(hass, freezer, timedelta(minutes=2))
    assert lights[-1].data["entity_id"] == [EXTRA]
    assert notify and "bedroom" in notify[0].data["message"]


async def test_blink_while_ringing(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    turn_off = async_mock_service(hass, "light", "turn_off")
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    alarm = await manager.async_create(
        _alarm(0, light={"targets": {"entity_id": [LIGHT]}, "settings": {"ringing": "blink"}})
    )
    await advance(hass, freezer, timedelta(minutes=1, seconds=10), step=1)
    assert manager.state(alarm["id"]) == "ringing"
    assert len(turn_off) >= 3
    assert not finished
    await manager.async_snooze(alarm["id"])
    count = len(turn_off)
    await advance(hass, freezer, timedelta(seconds=10), step=1)
    assert len(turn_off) == count


async def test_migration_from_v1(hass: HomeAssistant, hass_storage, mock_frontend) -> None:
    hass_storage[DOMAIN] = {
        "version": 1,
        "minor_version": 1,
        "key": DOMAIN,
        "data": {
            "alarms": [
                {
                    "id": "old",
                    "name": "Old",
                    "time": "06:45",
                    "days": [0, 1],
                    "light": {"target": {"entity_id": [LIGHT]}, "duration": 15},
                    "behavior": {"snooze_minutes": 9},
                }
            ]
        },
    }
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch("custom_components.daybreak.manager.SHIFT_INTERVAL", timedelta(hours=1)):
        assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    manager = entry.runtime_data
    alarm = manager.alarms["old"]
    assert alarm["wake"]["time"] == "06:45"
    assert alarm["light_lead"] == 15
    assert alarm["snooze"]["preset"] == "standard"
