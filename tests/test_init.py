"""Integration tests: setup, alarms, entities and alarm runs."""

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
    async_mock_service,
)

from custom_components.daybreak.const import (
    DOMAIN,
    EVENT_ALARM_FINISHED,
    EVENT_ALARM_RINGING,
    EVENT_ALARM_SNOOZED,
    EVENT_SUNRISE_STARTED,
)

from .conftest import advance

LIGHT = "light.bedroom"
WEEKDAYS = {"type": "weekly", "days": [0, 1, 2, 3, 4]}


def _monday(freezer: FrozenDateTimeFactory, hour: int, minute: int) -> None:
    freezer.move_to(datetime(2026, 10, 5, hour, minute, tzinfo=dt_util.get_default_time_zone()))


def _light(lead: int = 10, **settings):
    return {"light_lead": lead, "light": {"targets": {"entity_id": [LIGHT]}, "settings": settings}}


@pytest.fixture
def light_calls(hass: HomeAssistant):
    hass.states.async_set(LIGHT, STATE_OFF, {"supported_color_modes": ["color_temp"]})
    return async_mock_service(hass, "light", "turn_on"), async_mock_service(
        hass, "light", "turn_off"
    )


async def test_create_alarm_creates_entities(hass: HomeAssistant, manager) -> None:
    alarm = await manager.async_create(
        {"name": "Work", "wake": {"time": "06:30"}, "repeat": WEEKDAYS}
    )
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
    _monday(freezer, 6, 0)
    started = async_capture_events(hass, EVENT_SUNRISE_STARTED)
    ringing = async_capture_events(hass, EVENT_ALARM_RINGING)
    snoozed = async_capture_events(hass, EVENT_ALARM_SNOOZED)
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    await manager.async_update_settings(
        {"snooze_presets": [{"id": "s", "name": "S", "minutes": 5}], "default_snooze_count": 2}
    )

    alarm = await manager.async_create(
        {"name": "Work", "wake": {"time": "06:30"}, "repeat": WEEKDAYS, **_light(10)}
    )
    await hass.async_block_till_done()
    assert manager.state(alarm["id"]) == "scheduled"

    await advance(hass, freezer, timedelta(minutes=20, seconds=5))
    assert len(started) == 1
    assert manager.state(alarm["id"]) == "sunrise"
    first = turn_on[0].data
    assert first["entity_id"] == [LIGHT]
    assert first["brightness"] <= 5

    await advance(hass, freezer, timedelta(minutes=10))
    assert len(ringing) == 1
    assert manager.state(alarm["id"]) == "ringing"
    assert turn_on[-1].data["brightness"] == 255

    await manager.async_snooze()
    assert manager.state(alarm["id"]) == "snoozed"
    assert len(snoozed) == 1
    await advance(hass, freezer, timedelta(minutes=5, seconds=5))
    assert manager.state(alarm["id"]) == "ringing"
    assert len(ringing) == 2

    # 2 snoozes of 5 min after the first ring: then it stops by itself.
    await advance(hass, freezer, timedelta(minutes=5, seconds=5))
    assert len(finished) == 1
    assert finished[0].data["reason"] == "auto_stop"
    # Recurring alarm stays enabled and is scheduled for the next weekday.
    assert manager.alarms[alarm["id"]]["enabled"]
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    assert (nxt.day, nxt.hour, nxt.minute) == (6, 6, 30)


async def test_manual_light_off_stops(
    hass: HomeAssistant, manager, light_calls, freezer: FrozenDateTimeFactory
) -> None:
    _monday(freezer, 6, 25)
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    alarm = await manager.async_create(
        {"wake": {"time": "06:30"}, "repeat": {"type": "once"}, **_light(10)}
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
    alarm = await manager.async_create({"wake": {"time": "06:30"}, "repeat": WEEKDAYS})
    await manager.async_skip_next(alarm["id"])
    assert manager.alarms[alarm["id"]]["skip_date"] == "2026-10-05"
    assert dt_util.as_local(manager.next_alarm(alarm["id"])).day == 6
    await manager.async_cancel_skip(alarm["id"])
    assert dt_util.as_local(manager.next_alarm(alarm["id"])).day == 5


async def test_once_different(hass: HomeAssistant, manager, freezer: FrozenDateTimeFactory) -> None:
    freezer.move_to(datetime(2026, 10, 2, 12, 0, tzinfo=dt_util.get_default_time_zone()))
    alarm = await manager.async_create({"wake": {"time": "06:30"}, "repeat": WEEKDAYS})
    await hass.services.async_call(
        DOMAIN,
        "set_once",
        {"alarm_id": alarm["id"], "date": "2026-10-05", "time": "05:10"},
        blocking=True,
    )
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    assert (nxt.day, nxt.hour, nxt.minute) == (5, 5, 10)
    await hass.services.async_call(DOMAIN, "clear_once", {"alarm_id": alarm["id"]}, blocking=True)
    nxt = dt_util.as_local(manager.next_alarm(alarm["id"]))
    assert (nxt.hour, nxt.minute) == (6, 30)


async def test_test_run(
    hass: HomeAssistant, manager, light_calls, freezer: FrozenDateTimeFactory
) -> None:
    turn_on, _ = light_calls
    alarm = await manager.async_create(
        {"wake": {"time": "06:30"}, "repeat": {"type": "weekly", "days": [0]}, **_light()}
    )
    await manager.async_test(alarm["id"], 30)
    assert manager.state(alarm["id"]) == "sunrise"
    await advance(hass, freezer, timedelta(seconds=35))
    assert manager.state(alarm["id"]) == "ringing"
    await manager.async_stop(alarm["id"])
    assert manager.state(alarm["id"]) == "scheduled"
    assert len(turn_on) > 5


async def test_overrides_and_offsets(
    hass: HomeAssistant, manager, light_calls, freezer: FrozenDateTimeFactory
) -> None:
    """Lamps of an override get their own settings and may start later."""
    turn_on, _ = light_calls
    hass.states.async_set("light.lamp", STATE_OFF, {"supported_color_modes": ["hs"]})
    _monday(freezer, 6, 0)
    await manager.async_create(
        {
            "wake": {"time": "06:30"},
            "repeat": WEEKDAYS,
            "light_lead": 20,
            "light": {
                "targets": {"entity_id": [LIGHT, "light.lamp"]},
                "settings": {"curve": "linear", "brightness": [10, 100]},
                "overrides": [
                    {
                        "target": {"entity_id": ["light.lamp"]},
                        "settings": {"color_mode": "color", "start_offset": 10},
                    }
                ],
            },
        }
    )
    await advance(hass, freezer, timedelta(minutes=10, seconds=20))
    assert turn_on
    assert all(call.data["entity_id"] == [LIGHT] for call in turn_on)
    await advance(hass, freezer, timedelta(minutes=10, seconds=20))
    lamp = [c.data for c in turn_on if c.data["entity_id"] == ["light.lamp"]]
    assert lamp and "rgb_color" in lamp[0]
    assert "color_temp_kelvin" in turn_on[0].data


async def test_sleep_light_fades_out(
    hass: HomeAssistant, manager, light_calls, freezer: FrozenDateTimeFactory
) -> None:
    turn_on, turn_off = light_calls
    _monday(freezer, 22, 0)
    alarm = await manager.async_create(
        {"kind": "sleep", "wake": {"time": "22:20"}, "repeat": WEEKDAYS, **_light(10)}
    )
    await advance(hass, freezer, timedelta(minutes=10, seconds=20))
    assert manager.state(alarm["id"]) == "sunrise"
    assert turn_on[0].data["brightness"] > 200
    await advance(hass, freezer, timedelta(minutes=10))
    assert turn_on[-1].data["brightness"] < turn_on[0].data["brightness"]
    assert turn_off
    assert manager.state(alarm["id"]) == "scheduled"


async def test_kids_traffic_light(
    hass: HomeAssistant, manager, light_calls, freezer: FrozenDateTimeFactory
) -> None:
    turn_on, turn_off = light_calls
    hass.states.async_set(LIGHT, STATE_OFF, {"supported_color_modes": ["hs"]})
    _monday(freezer, 6, 0)
    alarm = await manager.async_create(
        {"kind": "kids", "wake": {"time": "06:40"}, "repeat": WEEKDAYS, **_light(30)}
    )
    await advance(hass, freezer, timedelta(minutes=10, seconds=10))
    assert turn_on[-1].data["rgb_color"][0] == 255  # red: stay in bed
    await advance(hass, freezer, timedelta(minutes=30))
    assert manager.state(alarm["id"]) == "ringing"
    assert turn_on[-1].data["rgb_color"][1] == 255  # green: OK to get up
    await advance(hass, freezer, timedelta(minutes=30, seconds=10))
    assert manager.state(alarm["id"]) == "scheduled"
    assert turn_off


async def test_profile_lock(hass: HomeAssistant, manager) -> None:
    from custom_components.daybreak.manager import DaybreakError

    profile = await manager.async_save_profile("light", {"name": "Mine", "duration": 20})
    a = await manager.async_create({"owners": ["person.a"], "light": {"profile": profile["id"]}})
    with pytest.raises(DaybreakError) as err:
        await manager.async_save_profile("light", {"id": "natural", "name": "x"})
    assert err.value.code == "profile_builtin"
    # One user: editable without confirmation.
    await manager.async_save_profile("light", {**profile, "name": "Mine 2"})
    b = await manager.async_create({"owners": ["person.a"], "light": {"profile": profile["id"]}})
    with pytest.raises(DaybreakError) as err:
        await manager.async_save_profile("light", {**profile, "name": "Mine 3"})
    assert err.value.code == "profile_confirm"
    await manager.async_save_profile("light", {**profile, "name": "Mine 3"}, confirm=True)
    await manager.async_update(b["id"], {"owners": ["person.b"]})
    with pytest.raises(DaybreakError) as err:
        await manager.async_save_profile("light", {**profile, "name": "x"}, confirm=True)
    assert err.value.code == "profile_shared"
    with pytest.raises(DaybreakError) as err:
        await manager.async_delete_profile("light", profile["id"])
    assert err.value.code == "profile_in_use"
    await manager.async_delete(a["id"])
    await manager.async_delete(b["id"])
    await manager.async_delete_profile("light", profile["id"])
    assert manager.light_profile(profile["id"]) is None


async def test_services_and_websocket(hass: HomeAssistant, manager, hass_ws_client) -> None:
    assert await async_setup_component(hass, "websocket_api", {})
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "daybreak/alarm/create",
            "alarm": {"name": "WS", "wake": {"time": "07:15"}, "repeat": {"type": "once"}},
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    alarm_id = msg["result"]["id"]
    assert msg["result"]["runtime"]["state"] == "scheduled"

    await client.send_json_auto_id(
        {
            "type": "daybreak/alarm/update",
            "alarm_id": alarm_id,
            "changes": {"wake": {"time": "25:00"}},
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]

    await client.send_json_auto_id({"type": "daybreak/alarms"})
    msg = await client.receive_json()
    result = msg["result"]
    assert [a["name"] for a in result["alarms"]] == ["WS"]
    assert {p["id"] for p in result["light_profiles"]} >= {"natural", "gentle"}
    assert result["settings"]["default_snooze_count"] == 3

    await client.send_json_auto_id(
        {"type": "daybreak/settings", "changes": {"default_snooze_count": 4}}
    )
    msg = await client.receive_json()
    assert msg["result"]["default_snooze_count"] == 4

    await client.send_json_auto_id(
        {
            "type": "daybreak/profile/save",
            "kind": "light",
            "profile": {"id": "natural", "name": "x"},
        }
    )
    msg = await client.receive_json()
    assert msg["error"]["code"] == "profile_builtin"

    await client.send_json_auto_id({"type": "daybreak/sun", "date": "2026-06-21", "days": 2})
    msg = await client.receive_json()
    assert set(msg["result"]) == {"2026-06-21", "2026-06-22"}
    assert "civil_dawn" in msg["result"]["2026-06-21"]

    await hass.services.async_call(DOMAIN, "skip_next", {"alarm_id": alarm_id}, blocking=True)
    # one-time alarm: skipping disables it
    assert not manager.alarms[alarm_id]["enabled"]
    await hass.services.async_call(DOMAIN, "stop", {}, blocking=True)


async def test_reload_restores_alarms(hass: HomeAssistant, manager) -> None:
    """Alarms survive a reload and all entities come back without errors."""
    first = await manager.async_create(
        {"name": "A", "wake": {"time": "06:00"}, "repeat": {"type": "weekly", "days": [0]}}
    )
    await manager.async_create(
        {"name": "B", "wake": {"time": "07:00"}, "repeat": {"type": "weekly", "days": [1]}}
    )
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
