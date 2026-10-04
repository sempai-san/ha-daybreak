"""Climate before waking up: start, conditions, windows, restore, learning."""

from __future__ import annotations

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_OFF
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.daybreak.climate_control import estimate_lead, outdoor_allows
from custom_components.daybreak.models import CLIMATE_SETTINGS_SCHEMA

from .conftest import advance

WEEKDAYS = {"type": "weekly", "days": [0, 1, 2, 3, 4]}
THERMOSTAT = "climate.bedroom"
WINDOW = "binary_sensor.bedroom_window"


def _monday(freezer: FrozenDateTimeFactory, hour: int, minute: int) -> None:
    freezer.move_to(datetime(2026, 10, 5, hour, minute, tzinfo=dt_util.get_default_time_zone()))


def _settings(**kwargs):
    return CLIMATE_SETTINGS_SCHEMA(kwargs)


@pytest.fixture
def climate_calls(hass: HomeAssistant):
    hass.states.async_set(
        THERMOSTAT,
        STATE_OFF,
        {"hvac_modes": ["off", "heat"], "current_temperature": 18, "temperature": 17},
    )
    hass.states.async_set(WINDOW, STATE_OFF)
    async_mock_service(hass, "light", "turn_on")
    async_mock_service(hass, "light", "turn_off")
    return {
        "set_temperature": async_mock_service(hass, "climate", "set_temperature"),
        "set_hvac_mode": async_mock_service(hass, "climate", "set_hvac_mode"),
        "fan_on": async_mock_service(hass, "fan", "turn_on"),
    }


def _alarm(**climate):
    return {
        "wake": {"time": "06:30"},
        "repeat": WEEKDAYS,
        "light_lead": 10,
        "climate": {"enabled": True, "devices": [THERMOSTAT], **climate},
    }


def test_estimate_lead() -> None:
    s = _settings(start="learned", temperature=21, max_lead=120)
    # 3 degrees at the default 10 min per degree.
    assert estimate_lead(s, [], 18, None) == 38
    assert estimate_lead(s, [], 21.5, None) == 0
    # Learned: 5 min per degree.
    assert estimate_lead(s, [{"per_degree": 5, "outdoor": 0}], 18, 0) == 22
    # The sample at a similar outdoor temperature counts more.
    samples = [{"per_degree": 5, "outdoor": 10}, {"per_degree": 20, "outdoor": -10}]
    assert estimate_lead(s, samples, 18, -10) > estimate_lead(s, samples, 18, 10)
    assert estimate_lead(s, [{"per_degree": 100, "outdoor": 0}], 10, 0) == 120
    # No room temperature: the fixed lead.
    assert estimate_lead(s, [], None, None) == 30


def test_outdoor_conditions() -> None:
    s = _settings(outdoor_below=10)
    assert outdoor_allows(s, 5)
    assert not outdoor_allows(s, 12)
    assert outdoor_allows(s, None)
    assert not outdoor_allows(_settings(outdoor_above=24), 20)


async def test_fixed_start_and_restore(
    hass: HomeAssistant, manager, climate_calls, freezer: FrozenDateTimeFactory
) -> None:
    _monday(freezer, 5, 50)
    alarm = await manager.async_create(_alarm(settings={"lead": 30, "minutes": 0}))
    runtime = manager.runtime_info(alarm["id"])
    assert runtime["climate_at"].startswith("2026-10-05T06:00")
    await advance(hass, freezer, timedelta(minutes=9))
    assert not climate_calls["set_temperature"]
    await advance(hass, freezer, timedelta(minutes=2))
    call = climate_calls["set_temperature"][0].data
    assert call["hvac_mode"] == "heat"
    assert call["temperature"] == 21
    assert manager.runtime_info(alarm["id"])["climate_active"]
    # Alarm rings at 06:30; stopping it restores the old state (it was off).
    await advance(hass, freezer, timedelta(minutes=30))
    await manager.async_stop(alarm["id"])
    await hass.async_block_till_done()
    assert climate_calls["set_hvac_mode"][-1].data["hvac_mode"] == "off"


async def test_not_needed_when_warm(
    hass: HomeAssistant, manager, climate_calls, freezer: FrozenDateTimeFactory
) -> None:
    hass.states.async_set(
        THERMOSTAT, STATE_OFF, {"hvac_modes": ["off", "heat"], "current_temperature": 22}
    )
    _monday(freezer, 5, 55)
    await manager.async_create(_alarm())
    await advance(hass, freezer, timedelta(minutes=10))
    assert not climate_calls["set_temperature"]


async def test_window_pauses(
    hass: HomeAssistant, manager, climate_calls, freezer: FrozenDateTimeFactory
) -> None:
    _monday(freezer, 5, 55)
    await manager.async_create(_alarm(windows=[WINDOW]))
    await advance(hass, freezer, timedelta(minutes=6))
    assert climate_calls["set_temperature"]
    hass.states.async_set(WINDOW, "on")
    await hass.async_block_till_done()
    assert climate_calls["set_hvac_mode"][-1].data["hvac_mode"] == "off"
    before = len(climate_calls["set_temperature"])
    hass.states.async_set(WINDOW, STATE_OFF)
    await hass.async_block_till_done()
    assert len(climate_calls["set_temperature"]) == before + 1


async def test_open_window_delays_start(
    hass: HomeAssistant, manager, climate_calls, freezer: FrozenDateTimeFactory
) -> None:
    hass.states.async_set(WINDOW, "on")
    _monday(freezer, 5, 55)
    await manager.async_create(_alarm(windows=[WINDOW]))
    await advance(hass, freezer, timedelta(minutes=6))
    assert not climate_calls["set_temperature"]
    hass.states.async_set(WINDOW, STATE_OFF)
    await advance(hass, freezer, timedelta(minutes=11))
    assert climate_calls["set_temperature"]


async def test_skipped_alarm_restores(
    hass: HomeAssistant, manager, climate_calls, freezer: FrozenDateTimeFactory
) -> None:
    _monday(freezer, 5, 55)
    alarm = await manager.async_create(_alarm())
    await advance(hass, freezer, timedelta(minutes=6))
    assert climate_calls["set_temperature"]
    await manager.async_skip_next(alarm["id"])
    await hass.async_block_till_done()
    assert climate_calls["set_hvac_mode"][-1].data["hvac_mode"] == "off"


async def test_learned_start_and_learning(
    hass: HomeAssistant, manager, climate_calls, freezer: FrozenDateTimeFactory
) -> None:
    hass.states.async_set("sensor.room", "18")
    _monday(freezer, 4, 0)
    alarm = await manager.async_create(
        _alarm(room_sensor="sensor.room", settings={"start": "learned", "max_lead": 120})
    )
    # 3 degrees x 10 min x 1.1 + 5 = 38 min before 06:30.
    await advance(hass, freezer, timedelta(minutes=110))
    assert not climate_calls["set_temperature"]
    await advance(hass, freezer, timedelta(minutes=3))
    assert climate_calls["set_temperature"]
    # The room is warm after 15 minutes: 5 min per degree is learned.
    freezer.tick(timedelta(minutes=15))
    hass.states.async_set("sensor.room", "21")
    await hass.async_block_till_done()
    samples = manager._climate_learn[alarm["id"]]
    assert samples and samples[0]["per_degree"] == pytest.approx(5, abs=0.5)


async def test_climate_profile_and_fan(
    hass: HomeAssistant, manager, climate_calls, freezer: FrozenDateTimeFactory
) -> None:
    hass.states.async_set("fan.ceiling", STATE_OFF)
    _monday(freezer, 5, 55)
    profile = await manager.async_save_profile(
        "climate", {"name": "Fan", "settings": {"mode": "cool", "fan": 30, "lead": 20}}
    )
    await manager.async_create(
        {
            **_alarm(profile=profile["id"]),
            "climate": {
                "enabled": True,
                "devices": ["fan.ceiling"],
                "profile": profile["id"],
            },
        }
    )
    await advance(hass, freezer, timedelta(minutes=10))
    assert not climate_calls["fan_on"]
    await advance(hass, freezer, timedelta(minutes=6))
    assert climate_calls["fan_on"][0].data["percentage"] == 30


async def test_after_presence_keeps_running(
    hass: HomeAssistant, manager, climate_calls, freezer: FrozenDateTimeFactory
) -> None:
    hass.states.async_set("person.jan", "home")
    _monday(freezer, 5, 55)
    alarm = await manager.async_create(
        {
            **_alarm(settings={"after": "presence", "minutes": 0}),
            "presence": {"entities": ["person.jan"]},
        }
    )
    await advance(hass, freezer, timedelta(minutes=36))
    await manager.async_stop(alarm["id"])
    await hass.async_block_till_done()
    assert not climate_calls["set_hvac_mode"]
    hass.states.async_set("person.jan", "not_home")
    await hass.async_block_till_done()
    assert climate_calls["set_hvac_mode"][-1].data["hvac_mode"] == "off"
