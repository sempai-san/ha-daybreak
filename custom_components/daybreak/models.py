"""Alarm configuration model and validation.

Alarms are stored as plain dicts (JSON in .storage/daybreak). This module
owns the schema, fills defaults and keeps old stored data loadable.
"""

from __future__ import annotations

from copy import deepcopy
import re
from typing import Any
import uuid

from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .const import (
    AFTER_STOP_KEEP,
    AFTER_STOP_MODES,
    CURVE_SMOOTH,
    CURVES,
    SNOOZE_LIGHT_KEEP,
    SNOOZE_LIGHT_MODES,
)

TIME_RE = re.compile(r"^([01]\d|2[0-3]):([0-5]\d)$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

MIN_KELVIN = 1500
MAX_KELVIN = 6500


def _time_str(value: Any) -> str:
    """Accept HH:MM or HH:MM:SS and normalise to HH:MM."""
    value = str(value)[:5]
    if not TIME_RE.match(value):
        raise vol.Invalid("time must be HH:MM")
    return value


def _date_str(value: Any) -> str:
    value = str(value)
    if not DATE_RE.match(value):
        raise vol.Invalid("date must be YYYY-MM-DD")
    return value


def _sorted_points(points: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(points, key=lambda p: p["t"])


PERCENT = vol.All(vol.Coerce(float), vol.Range(min=0, max=100))
KELVIN = vol.All(vol.Coerce(int), vol.Range(min=MIN_KELVIN, max=MAX_KELVIN))

CURVE_POINT_SCHEMA = vol.Schema(
    {
        # Position within the sunrise, 0 = start, 1 = alarm time.
        vol.Required("t"): vol.All(vol.Coerce(float), vol.Range(min=0, max=1)),
        vol.Required("brightness"): PERCENT,
        vol.Optional("kelvin"): vol.Any(None, KELVIN),
    }
)

TARGET_SCHEMA = vol.Schema(
    {
        vol.Optional("entity_id", default=list): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional("area_id", default=list): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("device_id", default=list): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("floor_id", default=list): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("label_id", default=list): vol.All(cv.ensure_list, [cv.string]),
    }
)

LIGHT_SCHEMA = vol.Schema(
    {
        vol.Optional("target", default=dict): TARGET_SCHEMA,
        # Minutes the sunrise starts before the alarm time. 0 = no sunrise.
        vol.Optional("duration", default=30): vol.All(vol.Coerce(int), vol.Range(min=0, max=240)),
        vol.Optional("start_brightness", default=1): PERCENT,
        vol.Optional("end_brightness", default=100): PERCENT,
        vol.Optional("use_color_temp", default=True): cv.boolean,
        vol.Optional("start_kelvin", default=2200): KELVIN,
        vol.Optional("end_kelvin", default=4000): KELVIN,
        vol.Optional("curve", default=CURVE_SMOOTH): vol.In(CURVES),
        vol.Optional("points", default=list): vol.All([CURVE_POINT_SCHEMA], _sorted_points),
        # Seconds between two light updates; each update uses it as transition.
        vol.Optional("step_seconds", default=15): vol.All(
            vol.Coerce(int), vol.Range(min=2, max=120)
        ),
    }
)

BEHAVIOR_SCHEMA = vol.Schema(
    {
        vol.Optional("snooze_minutes", default=9): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=60)
        ),
        vol.Optional("snooze_light", default=SNOOZE_LIGHT_KEEP): vol.In(SNOOZE_LIGHT_MODES),
        # Ringing ends on its own after this many minutes. 0 = never.
        vol.Optional("auto_stop_minutes", default=30): vol.All(
            vol.Coerce(int), vol.Range(min=0, max=720)
        ),
        vol.Optional("after_stop", default=AFTER_STOP_KEEP): vol.In(AFTER_STOP_MODES),
        # Turning the alarm lights off by hand stops the alarm.
        vol.Optional("stop_on_light_off", default=True): cv.boolean,
    }
)

PRESENCE_SCHEMA = vol.Schema(
    {
        # Persons, device trackers, occupancy sensors... Empty = ignore presence.
        vol.Optional("entities", default=list): vol.All(cv.ensure_list, [cv.entity_id]),
        # Nobody home when the alarm would start: skip this occurrence.
        vol.Optional("skip_when_away", default=True): cv.boolean,
        # Everybody left while the alarm runs: stop it.
        vol.Optional("stop_when_away", default=True): cv.boolean,
    }
)


def _actions(value: Any) -> list[dict[str, Any]]:
    """Validate HA actions but keep the raw (JSON-serialisable) config."""
    value = cv.ensure_list(value)
    cv.SCRIPT_SCHEMA(deepcopy(value))
    return value


LAST_CALL_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=False): cv.boolean,
        # Minutes after the alarm time without a stop until the last call fires.
        vol.Optional("after_minutes", default=20): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=240)
        ),
        # The last call ends on its own after this many minutes.
        vol.Optional("duration", default=10): vol.All(vol.Coerce(int), vol.Range(min=1, max=120)),
        # Lights for the last call. Empty = the alarm's own lights.
        vol.Optional("target", default=dict): TARGET_SCHEMA,
        vol.Optional("brightness", default=100): PERCENT,
        vol.Optional("kelvin", default=5000): vol.Any(None, KELVIN),
        # Any Home Assistant actions: scenes, scripts, media, covers...
        vol.Optional("actions", default=list): _actions,
    }
)

ALARM_SCHEMA = vol.Schema(
    {
        vol.Optional("id"): cv.string,
        vol.Optional("name", default="Alarm"): vol.All(cv.string, vol.Length(max=64)),
        vol.Optional("enabled", default=True): cv.boolean,
        vol.Optional("time", default="07:00"): _time_str,
        # Weekdays, 0 = Monday. Empty list = one-time alarm.
        vol.Optional("days", default=list): vol.All(
            cv.ensure_list,
            [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            lambda days: sorted(set(days)),
        ),
        # One-time alarm on a fixed date (only used when days is empty).
        vol.Optional("date"): vol.Any(None, _date_str),
        # Date of an occurrence the user chose to skip.
        vol.Optional("skip_date"): vol.Any(None, _date_str),
        vol.Optional("light", default=dict): LIGHT_SCHEMA,
        vol.Optional("behavior", default=dict): BEHAVIOR_SCHEMA,
        vol.Optional("presence", default=dict): PRESENCE_SCHEMA,
        vol.Optional("last_call", default=dict): LAST_CALL_SCHEMA,
    },
    extra=vol.REMOVE_EXTRA,
)


def new_alarm_id() -> str:
    """Return a new random alarm id."""
    return uuid.uuid4().hex[:12]


def validate_alarm(data: dict[str, Any]) -> dict[str, Any]:
    """Validate and fill defaults. Raises vol.Invalid."""
    alarm: dict[str, Any] = ALARM_SCHEMA(deepcopy(data))
    alarm.setdefault("id", new_alarm_id())
    alarm.setdefault("date", None)
    alarm.setdefault("skip_date", None)
    return alarm


def merge_alarm(current: dict[str, Any], changes: dict[str, Any]) -> dict[str, Any]:
    """Apply a partial update (nested dicts are merged one level deep)."""
    merged = deepcopy(current)
    for key, value in changes.items():
        if key == "id":
            continue
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = {**merged[key], **value}
        else:
            merged[key] = value
    return validate_alarm(merged)
