"""Tests for the automatic wake-up shift."""

from datetime import datetime
from zoneinfo import ZoneInfo

from custom_components.daybreak.models import validate_alarm, validate_settings
from custom_components.daybreak.shift import ShiftInputs, evaluate

TZ = ZoneInfo("Europe/Berlin")
BASE = datetime(2026, 12, 7, 6, 30, tzinfo=TZ)
SETTINGS = validate_settings({})


def _alarm(**shift):
    return validate_alarm({"shift": shift})


def test_no_rules_no_shift():
    result = evaluate(_alarm(), SETTINGS, ShiftInputs(condition="snowy"), BASE)
    assert result.minutes == 0


def test_weather_uses_settings_minutes():
    alarm = _alarm(weather={"enabled": True, "conditions": ["snow", "rain"]})
    assert evaluate(alarm, SETTINGS, ShiftInputs(condition="snowy"), BASE).minutes == 15
    assert evaluate(alarm, SETTINGS, ShiftInputs(condition="pouring"), BASE).minutes == 10
    assert evaluate(alarm, SETTINGS, ShiftInputs(condition="sunny"), BASE).minutes == 0


def test_expert_minutes_and_cold():
    alarm = _alarm(weather={"enabled": True, "conditions": ["snow"], "minutes": {"snow": 25}})
    inputs = ShiftInputs(condition="snowy", temperature=-3)
    result = evaluate(alarm, SETTINGS, inputs, BASE)
    # Strongest reason of the weather rule wins (25 > cold 10).
    assert result.minutes == 25
    assert {p["reason"] for p in result.parts} == {"snow", "cold"}


def test_storm_warning_level():
    alarm = _alarm(weather={"enabled": True, "conditions": ["storm"]})
    assert evaluate(alarm, SETTINGS, ShiftInputs(warning_level=1), BASE).minutes == 0
    assert evaluate(alarm, SETTINGS, ShiftInputs(warning_level=3), BASE).minutes == 20


def test_travel_and_combine():
    weather = {"enabled": True, "conditions": ["snow"]}
    travel = {"enabled": True, "sensor": "sensor.waze", "usual": 40}
    inputs = ShiftInputs(condition="snowy", travel_minutes=80)
    alarm = _alarm(weather=weather, travel=travel, max=120)
    assert evaluate(alarm, SETTINGS, inputs, BASE).minutes == 40  # max(15, 40)
    alarm = _alarm(weather=weather, travel=travel, max=120, combine="sum")
    assert evaluate(alarm, SETTINGS, inputs, BASE).minutes == 55
    alarm = _alarm(weather=weather, travel=travel, max=30, combine="sum")
    assert evaluate(alarm, SETTINGS, inputs, BASE).minutes == 30  # capped


def test_travel_arrive_by():
    # Must arrive 08:00; 45 min routine + 60 min drive -> latest wake 06:15.
    alarm = _alarm(
        travel={"enabled": True, "sensor": "sensor.waze", "routine": 45, "arrive_by": "08:00"},
        max=60,
    )
    result = evaluate(alarm, SETTINGS, ShiftInputs(travel_minutes=60), BASE)
    assert result.minutes == 15
    result = evaluate(alarm, SETTINGS, ShiftInputs(travel_minutes=30), BASE)
    assert result.minutes == 0
