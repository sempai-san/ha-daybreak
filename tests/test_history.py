"""History: one entry per alarm occurrence, with the checks before the light."""

from __future__ import annotations

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_OFF
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import async_mock_service

from .conftest import advance

LIGHT = "light.bedroom"


def _monday(freezer: FrozenDateTimeFactory, hour: int, minute: int) -> None:
    freezer.move_to(datetime(2026, 10, 5, hour, minute, tzinfo=dt_util.get_default_time_zone()))


@pytest.fixture
def lights(hass: HomeAssistant):
    hass.states.async_set(LIGHT, STATE_OFF, {"supported_color_modes": ["brightness"]})
    hass.states.async_set("person.jan", "home", {"friendly_name": "Jan"})
    hass.states.async_set("sensor.travel", "45")
    async_mock_service(hass, "light", "turn_on")
    async_mock_service(hass, "light", "turn_off")


def _alarm(**extra):
    return {
        "name": "Work",
        "wake": {"time": "06:30"},
        "repeat": {"type": "weekly", "days": [0, 1, 2, 3, 4]},
        "light_lead": 10,
        "light": {"targets": {"entity_id": [LIGHT]}},
        **extra,
    }


async def test_real_alarm_with_checks(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _monday(freezer, 5, 0)
    alarm = await manager.async_create(
        _alarm(
            presence={"entities": ["person.jan"]},
            shift={"travel": {"enabled": True, "sensor": "sensor.travel", "usual": 30}},
        )
    )
    await hass.async_block_till_done()
    # 15 min more travel: rings at 06:15, light from 06:05.
    entry = manager.history[0]
    assert entry["result"] == "planned"
    checks = entry["steps"][0]
    assert checks["step"] == "checks" and checks["travel"] == 45 and checks["minutes"] == 15
    assert checks["level"] == "warn"
    await advance(hass, freezer, timedelta(minutes=76), step=30)
    assert manager.state(alarm["id"]) == "ringing"
    await manager.async_stop(alarm["id"])
    await hass.async_block_till_done()
    entry = manager.history[0]
    assert entry["result"] == "stopped"
    steps = [s["step"] for s in entry["steps"]]
    assert steps == ["checks", "presence", "start", "ring", "end"]
    assert entry["steps"][1]["detail"] == "Jan"
    # Same occurrence: no second entry.
    assert len([e for e in manager.history if e["alarm_id"] == alarm["id"]]) == 1


async def test_skipped_day_is_logged(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    _monday(freezer, 5, 0)
    alarm = await manager.async_create(_alarm())
    await manager.async_skip_next(alarm["id"])
    await advance(hass, freezer, timedelta(minutes=95), step=60)
    skipped = [e for e in manager.history if e["result"] == "skipped"]
    assert len(skipped) == 1
    assert skipped[0]["steps"][0]["reason"] == "manual"
    assert skipped[0]["alarm_time"].startswith("2026-10-05T06:30")


async def test_nobody_home_is_logged(
    hass: HomeAssistant, manager, lights, freezer: FrozenDateTimeFactory
) -> None:
    hass.states.async_set("person.jan", "not_home")
    _monday(freezer, 6, 0)
    await manager.async_create(_alarm(presence={"entities": ["person.jan"]}))
    await advance(hass, freezer, timedelta(minutes=25), step=30)
    entry = manager.history[0]
    assert entry["result"] == "skipped"
    assert entry["steps"][-1]["reason"] == "away"
    # Not logged a second time by the missed-day check.
    await advance(hass, freezer, timedelta(minutes=15), step=60)
    assert len(manager.history) == 1
