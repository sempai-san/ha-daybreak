"""Integration tests: setup, alarms, entities and an alarm run."""

from __future__ import annotations

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_OFF, STATE_ON
from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    async_capture_events,
    async_fire_time_changed,
    async_mock_service,
)

from custom_components.daybreak.const import (
    DOMAIN,
    EVENT_ALARM_FINISHED,
    EVENT_ALARM_RINGING,
    EVENT_ALARM_SNOOZED,
    EVENT_SUNRISE_STARTED,
)

LIGHT = "light.bedroom"


async def _advance(hass: HomeAssistant, freezer: FrozenDateTimeFactory, delta: timedelta) -> None:
    """Move time forward in small steps so every timer fires."""
    end = dt_util.utcnow() + delta
    while dt_util.utcnow() < end:
        freezer.tick(timedelta(seconds=5))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()


@pytest.fixture
def light_calls(hass: HomeAssistant):
    hass.states.async_set(LIGHT, STATE_OFF, {"supported_color_modes": ["color_temp"]})
    return async_mock_service(hass, "light", "turn_on"), async_mock_service(
        hass, "light", "turn_off"
    )


async def test_create_alarm_creates_entities(hass: HomeAssistant, manager) -> None:
    alarm = await manager.async_create({"name": "Work", "time": "06:30", "days": [0, 1, 2, 3, 4]})
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    switch_id = reg.async_get_entity_id("switch", DOMAIN, f"{alarm['id']}_enabled")
    sensor_id = reg.async_get_entity_id("sensor", DOMAIN, f"{alarm['id']}_next_alarm")
    assert switch_id and sensor_id
    assert hass.states.get(switch_id).state == STATE_ON
    assert hass.states.get(sensor_id).state not in ("unknown", "unavailable")

    await manager.async_set_enabled(alarm["id"], False)
    await hass.async_block_till_done()
    assert hass.states.get(switch_id).state == STATE_OFF
    assert hass.states.get(sensor_id).state == "unknown"

    await manager.async_delete(alarm["id"])
    await hass.async_block_till_done()
    assert reg.async_get(switch_id) is None


async def test_alarm_run(
    hass: HomeAssistant, manager, light_calls, freezer: FrozenDateTimeFactory
) -> None:
    turn_on, _turn_off = light_calls
    freezer.move_to(datetime(2026, 10, 5, 6, 0, tzinfo=dt_util.get_default_time_zone()))
    started = async_capture_events(hass, EVENT_SUNRISE_STARTED)
    ringing = async_capture_events(hass, EVENT_ALARM_RINGING)
    snoozed = async_capture_events(hass, EVENT_ALARM_SNOOZED)
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)

    alarm = await manager.async_create(
        {
            "name": "Work",
            "time": "06:30",
            "days": [0, 1, 2, 3, 4],
            "light": {"target": {"entity_id": [LIGHT]}, "duration": 10},
            "behavior": {"auto_stop_minutes": 5, "snooze_minutes": 5},
        }
    )
    await hass.async_block_till_done()
    assert manager.state(alarm["id"]) == "scheduled"

    await _advance(hass, freezer, timedelta(minutes=20, seconds=5))
    assert len(started) == 1
    assert manager.state(alarm["id"]) == "sunrise"
    assert turn_on
    first = turn_on[0].data
    assert first["entity_id"] == [LIGHT]
    assert first["brightness"] <= 5

    await _advance(hass, freezer, timedelta(minutes=10))
    assert len(ringing) == 1
    assert manager.state(alarm["id"]) == "ringing"
    assert turn_on[-1].data["brightness"] == 255

    await manager.async_snooze()
    assert manager.state(alarm["id"]) == "snoozed"
    assert len(snoozed) == 1
    await _advance(hass, freezer, timedelta(minutes=5, seconds=5))
    assert manager.state(alarm["id"]) == "ringing"
    assert len(ringing) == 2

    await _advance(hass, freezer, timedelta(minutes=5, seconds=5))
    assert len(finished) == 1
    assert finished[0].data["reason"] == "auto_stop"
    # Recurring alarm stays enabled and is scheduled for the next weekday.
    assert manager.alarms[alarm["id"]]["enabled"]
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    assert (nxt.day, nxt.hour, nxt.minute) == (6, 6, 30)


async def test_manual_light_off_stops(
    hass: HomeAssistant, manager, light_calls, freezer: FrozenDateTimeFactory
) -> None:
    freezer.move_to(datetime(2026, 10, 5, 6, 25, tzinfo=dt_util.get_default_time_zone()))
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    alarm = await manager.async_create(
        {"time": "06:30", "light": {"target": {"entity_id": [LIGHT]}, "duration": 10}}
    )
    await hass.async_block_till_done()
    # Created inside the sunrise window: joins mid-curve right away.
    assert manager.state(alarm["id"]) == "sunrise"

    hass.states.async_set(LIGHT, STATE_ON, {"brightness": 20})
    await hass.async_block_till_done()
    hass.states.async_set(LIGHT, STATE_OFF, context=Context())
    await hass.async_block_till_done()

    assert finished and finished[0].data["reason"] == "manual_light_off"
    # One-time alarm switched itself off and does not restart.
    assert not manager.alarms[alarm["id"]]["enabled"]
    assert manager.state(alarm["id"]) == "disabled"


async def test_skip_next(hass: HomeAssistant, manager, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(datetime(2026, 10, 2, 12, 0, tzinfo=dt_util.get_default_time_zone()))
    alarm = await manager.async_create({"time": "06:30", "days": [0, 1, 2, 3, 4]})
    await manager.async_skip_next(alarm["id"])
    assert manager.alarms[alarm["id"]]["skip_date"] == "2026-10-05"
    assert dt_util.as_local(manager.next_alarm(alarm["id"])).day == 6
    await manager.async_cancel_skip(alarm["id"])
    assert dt_util.as_local(manager.next_alarm(alarm["id"])).day == 5


async def test_test_run(
    hass: HomeAssistant, manager, light_calls, freezer: FrozenDateTimeFactory
) -> None:
    turn_on, _ = light_calls
    alarm = await manager.async_create(
        {"time": "06:30", "days": [0], "light": {"target": {"entity_id": [LIGHT]}}}
    )
    await manager.async_test(alarm["id"], 30)
    assert manager.state(alarm["id"]) == "sunrise"
    await _advance(hass, freezer, timedelta(seconds=35))
    assert manager.state(alarm["id"]) == "ringing"
    await manager.async_stop(alarm["id"])
    assert manager.state(alarm["id"]) == "scheduled"
    assert len(turn_on) > 5


async def test_services_and_websocket(hass: HomeAssistant, manager, hass_ws_client) -> None:
    assert await async_setup_component(hass, "websocket_api", {})
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "daybreak/alarm/create", "alarm": {"name": "WS", "time": "07:15"}}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    alarm_id = msg["result"]["id"]
    assert msg["result"]["runtime"]["state"] == "scheduled"

    await client.send_json_auto_id(
        {"type": "daybreak/alarm/update", "alarm_id": alarm_id, "changes": {"time": "25:00"}}
    )
    msg = await client.receive_json()
    assert not msg["success"]

    await client.send_json_auto_id({"type": "daybreak/alarms"})
    msg = await client.receive_json()
    assert [a["name"] for a in msg["result"]["alarms"]] == ["WS"]

    await hass.services.async_call(DOMAIN, "skip_next", {"alarm_id": alarm_id}, blocking=True)
    # one-time alarm: skipping disables it
    assert not manager.alarms[alarm_id]["enabled"]
    await hass.services.async_call(DOMAIN, "stop", {}, blocking=True)


async def test_reload_restores_alarms(hass: HomeAssistant, manager) -> None:
    """Alarms survive a reload and all entities come back without errors."""
    first = await manager.async_create({"name": "A", "time": "06:00", "days": [0]})
    await manager.async_create({"name": "B", "time": "07:00", "days": [1]})
    await hass.async_block_till_done()
    await manager._store.async_save(manager._data_to_save())

    entry = hass.config_entries.async_entries(DOMAIN)[0]
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()

    reloaded = entry.runtime_data
    assert reloaded is not manager
    assert sorted(a["name"] for a in reloaded.alarms.values()) == ["A", "B"]
    assert reloaded.state(first["id"]) == "scheduled"
    assert hass.states.get("binary_sensor.daybreak_alarm_active").state == STATE_OFF
