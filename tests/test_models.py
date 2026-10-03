"""Tests for the data model and the 0.1 migration."""

import pytest
import voluptuous as vol

from custom_components.daybreak.models import (
    migrate_store_v1,
    validate_alarm,
    validate_settings,
)

V1_ALARM = {
    "id": "abc",
    "name": "Work",
    "enabled": True,
    "time": "06:30",
    "days": [0, 1, 2, 3, 4],
    "date": None,
    "skip_date": None,
    "light": {
        "target": {"entity_id": ["light.bedroom"]},
        "duration": 20,
        "curve": "smooth",
        "start_brightness": 1,
        "end_brightness": 80,
        "start_kelvin": 2200,
        "end_kelvin": 4000,
        "step_seconds": 15,
    },
    "behavior": {
        "snooze_minutes": 10,
        "auto_stop_minutes": 30,
        "after_stop": "off",
        "stop_on_light_off": False,
    },
    "presence": {"entities": ["person.jan"], "skip_when_away": True, "stop_when_away": False},
    "last_call": {
        "enabled": True,
        "after_minutes": 20,
        "duration": 5,
        "target": {"entity_id": ["light.hall"]},
        "brightness": 90,
        "kelvin": 4500,
        "actions": [],
    },
}


def test_migrate_store_v1():
    data = migrate_store_v1({"alarms": [V1_ALARM, {"time": "bad"}], "handled": {"abc": "x"}})
    assert len(data["alarms"]) == 1
    alarm = data["alarms"][0]
    assert alarm["id"] == "abc"
    assert alarm["wake"] == {**alarm["wake"], "type": "fixed", "time": "06:30"}
    assert alarm["repeat"]["type"] == "weekly"
    assert alarm["repeat"]["days"] == [0, 1, 2, 3, 4]
    assert alarm["light_lead"] == 20
    assert alarm["light"]["targets"]["entity_id"] == ["light.bedroom"]
    assert alarm["light"]["settings"]["brightness"] == [1, 80]
    assert alarm["light"]["settings"]["after_stop"] == "off"
    assert alarm["stop_on_light_off"] is False
    assert alarm["presence"]["stop_when_away"] is False
    # 10 min snooze becomes a preset, 20 min window = 2 snoozes until the last call.
    preset = next(p for p in data["settings"]["snooze_presets"] if p["minutes"] == 10)
    assert alarm["snooze"] == {"preset": preset["id"], "count": 2}
    # The custom last call becomes its own profile.
    profile = data["last_call_profiles"][0]
    assert alarm["last_call"] == {"enabled": True, "profile": profile["id"]}
    assert profile["targets"]["entity_id"] == ["light.hall"]
    assert (profile["brightness"], profile["kelvin"], profile["duration"]) == (90, 4500, 5)
    assert data["handled"] == {"abc": "x"}


def test_migrate_one_time_alarm():
    old = {**V1_ALARM, "days": [], "date": "2026-10-10", "last_call": {}}
    alarm = migrate_store_v1({"alarms": [old]})["alarms"][0]
    assert alarm["repeat"]["type"] == "once"
    assert alarm["repeat"]["date"] == "2026-10-10"


def test_week_cycle_padding():
    alarm = validate_alarm({"repeat": {"week_cycle": 3, "weeks": [False]}})
    assert alarm["repeat"]["weeks"] == [False, True, True]


def test_invalid_values_rejected():
    with pytest.raises(vol.Invalid):
        validate_alarm({"wake": {"time": "25:00"}})
    with pytest.raises(vol.Invalid):
        validate_alarm({"actions": {"wake": [{"not_an_action": 1}]}})


def test_settings_default_snooze_must_exist():
    settings = validate_settings({"snooze_presets": [{"id": "x", "name": "X", "minutes": 7}]})
    assert settings["default_snooze"] == "x"
