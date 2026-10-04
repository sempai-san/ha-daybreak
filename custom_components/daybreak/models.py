"""Data model: alarms, light settings, profiles and global settings.

Everything is stored as plain JSON dicts in ``.storage/daybreak``. This module
owns the schemas, fills defaults, keeps the built-in profiles and migrates
data written by older versions.
"""

from __future__ import annotations

from copy import deepcopy
import logging
import re
from typing import Any
import uuid

from homeassistant.helpers import config_validation as cv
import voluptuous as vol

_LOGGER = logging.getLogger(__name__)

TIME_RE = re.compile(r"^([01]\d|2[0-3]):([0-5]\d)$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")

MIN_KELVIN = 1500
MAX_KELVIN = 6500

KINDS = ["wake", "sleep", "kids"]
WAKE_TYPES = ["fixed", "sun"]
SUN_EVENTS = [
    "astronomical_dawn",
    "nautical_dawn",
    "civil_dawn",
    "sunrise",
    "sunset",
    "civil_dusk",
    "nautical_dusk",
    "astronomical_dusk",
]
REPEAT_TYPES = ["once", "weekly", "interval", "pattern"]
CURVES = ["natural", "gentle", "linear", "fast", "custom"]
COLOR_MODES = ["ct", "color"]
COLOR_PRESETS = ["sunrise", "dawn", "pastel", "custom"]
TRANSITIONS = ["auto", "always", "never"]
RINGING = ["hold", "pulse", "blink"]
AFTER_STOP = ["keep", "off", "off_later"]
ACTION_PHASES = ["light_start", "wake", "snooze", "stop"]
NOTIFY_EVENTS = [
    "started",
    "finished",
    "skipped",
    "shifted",
    "device_unavailable",
    "failed",
    "last_call",
]
COMBINE = ["max", "sum"]
WEATHER_KEYS = ["snow", "storm", "rain"]


# ---------------------------------------------------------------- validators


def _time(value: Any) -> str:
    """Accept HH:MM or HH:MM:SS and normalise to HH:MM."""
    value = str(value)[:5]
    if len(value) == 4 and value[1] == ":":
        value = "0" + value
    if not TIME_RE.match(value):
        raise vol.Invalid("time must be HH:MM")
    return value


def _date(value: Any) -> str:
    value = str(value)[:10]
    if not DATE_RE.match(value):
        raise vol.Invalid("date must be YYYY-MM-DD")
    return value


def _color(value: Any) -> str:
    value = str(value)
    if not COLOR_RE.match(value):
        raise vol.Invalid("color must be #RRGGBB")
    return value.upper()


def _pair(item: Any):
    """[start, end] pair."""
    return vol.All(vol.ExactSequence([item, item]), list)


def _actions(value: Any) -> list[dict[str, Any]]:
    """Validate HA actions but keep the raw (JSON-serialisable) config."""
    value = cv.ensure_list(value)
    cv.SCRIPT_SCHEMA(deepcopy(value))
    return value


def _sorted_points(points: list[dict[str, Any]]) -> list[dict[str, Any]]:
    points = sorted(points, key=lambda p: p["t"])
    if len(points) >= 2:
        points[0]["t"] = 0.0
        points[-1]["t"] = 1.0
    return points


PERCENT = vol.All(vol.Coerce(float), vol.Range(min=0, max=100))
KELVIN = vol.All(vol.Coerce(int), vol.Range(min=MIN_KELVIN, max=MAX_KELVIN))
MINUTES = vol.All(vol.Coerce(int), vol.Range(min=0, max=240))
OPT_TIME = vol.Any(None, _time)
OPT_DATE = vol.Any(None, _date)

POINT_SCHEMA = vol.Schema(
    {
        vol.Required("t"): vol.All(vol.Coerce(float), vol.Range(min=0, max=1)),
        vol.Required("v"): vol.All(vol.Coerce(float), vol.Range(min=0, max=1)),
    }
)
POINTS = vol.All([POINT_SCHEMA], vol.Length(min=2, max=24), _sorted_points)

TARGET_SCHEMA = vol.Schema(
    {
        vol.Optional("entity_id", default=list): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional("area_id", default=list): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("device_id", default=list): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("floor_id", default=list): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("label_id", default=list): vol.All(cv.ensure_list, [cv.string]),
    }
)

SEQUENCE_STEP = vol.Schema(
    {
        vol.Required("color"): _color,
        vol.Optional("brightness", default=100): PERCENT,
        vol.Optional("minutes", default=5): vol.All(vol.Coerce(float), vol.Range(min=0.5, max=240)),
        vol.Optional("transition", default="smooth"): vol.In(["smooth", "step"]),
    }
)

DEFAULT_POINTS = [
    {"t": 0.0, "v": 0.0},
    {"t": 0.4, "v": 0.04},
    {"t": 0.7, "v": 0.2},
    {"t": 0.9, "v": 0.6},
    {"t": 1.0, "v": 1.0},
]

LIGHT_SETTINGS_SCHEMA = vol.Schema(
    {
        vol.Optional("curve", default="natural"): vol.In(CURVES),
        # Custom curve. With ``separate`` brightness and colour have their own.
        vol.Optional("points", default=lambda: deepcopy(DEFAULT_POINTS)): POINTS,
        vol.Optional("separate", default=False): cv.boolean,
        vol.Optional("points_color", default=lambda: deepcopy(DEFAULT_POINTS)): POINTS,
        vol.Optional("brightness", default=lambda: [1, 100]): _pair(PERCENT),
        vol.Optional("color_mode", default="ct"): vol.In(COLOR_MODES),
        vol.Optional("kelvin", default=lambda: [2200, 4000]): _pair(KELVIN),
        vol.Optional("colors", default="sunrise"): vol.In(COLOR_PRESETS),
        vol.Optional("sequence", default=list): vol.All([SEQUENCE_STEP], vol.Length(max=16)),
        # Colour temperature for lamps without colour when color_mode == "color".
        # None = derived from the colour preset ("passend zum Farbverlauf").
        vol.Optional("plain_kelvin", default=None): vol.Any(None, _pair(KELVIN)),
        vol.Optional("step_seconds", default=15): vol.All(
            vol.Coerce(int), vol.Range(min=2, max=120)
        ),
        vol.Optional("min_brightness", default=1): PERCENT,
        vol.Optional("transition", default="auto"): vol.In(TRANSITIONS),
        vol.Optional("start_offset", default=0): vol.All(
            vol.Coerce(int), vol.Range(min=0, max=120)
        ),
        vol.Optional("ringing", default="hold"): vol.In(RINGING),
        vol.Optional("after_stop", default="keep"): vol.In(AFTER_STOP),
    },
    extra=vol.REMOVE_EXTRA,
)

OVERRIDE_SCHEMA = vol.Schema(
    {
        vol.Required("target"): TARGET_SCHEMA,
        vol.Optional("profile", default=None): vol.Any(None, cv.string),
        vol.Optional("settings", default=dict): LIGHT_SETTINGS_SCHEMA,
    }
)

LIGHT_SCHEMA = vol.Schema(
    {
        vol.Optional("targets", default=dict): TARGET_SCHEMA,
        # Light profile id, or None for the alarm's own settings.
        vol.Optional("profile", default=None): vol.Any(None, cv.string),
        vol.Optional("settings", default=dict): LIGHT_SETTINGS_SCHEMA,
        vol.Optional("overrides", default=list): [OVERRIDE_SCHEMA],
        # Own start per lamp: minutes before the alarm time (only when enabled;
        # a missing lamp starts with the light start).
        vol.Optional("per_lamp_start", default=False): cv.boolean,
        vol.Optional("starts", default=dict): {
            cv.entity_id: vol.All(vol.Coerce(int), vol.Range(min=0, max=240))
        },
    }
)

WAKE_SCHEMA = vol.Schema(
    {
        vol.Optional("type", default="fixed"): vol.In(WAKE_TYPES),
        vol.Optional("time", default="07:00"): _time,
        vol.Optional("sun_event", default="sunrise"): vol.In(SUN_EVENTS),
        # Minutes after (positive) or before (negative) the sun event.
        vol.Optional("offset", default=0): vol.All(vol.Coerce(int), vol.Range(min=-240, max=240)),
        vol.Optional("earliest", default=None): OPT_TIME,
        vol.Optional("latest", default=None): OPT_TIME,
    }
)

REPEAT_SCHEMA = vol.Schema(
    {
        vol.Optional("type", default="weekly"): vol.In(REPEAT_TYPES),
        vol.Optional("days", default=lambda: [0, 1, 2, 3, 4]): vol.All(
            cv.ensure_list,
            [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            lambda d: sorted(set(d)),
        ),
        # weekly: cycle of N weeks, ``weeks[i]`` = ring in week i of the cycle.
        vol.Optional("week_cycle", default=1): vol.All(vol.Coerce(int), vol.Range(min=1, max=8)),
        vol.Optional("weeks", default=lambda: [True]): [cv.boolean],
        # interval: every N days/weeks.
        vol.Optional("interval", default=2): vol.All(vol.Coerce(int), vol.Range(min=1, max=60)),
        vol.Optional("unit", default="days"): vol.In(["days", "weeks"]),
        # pattern: free cycle (shift work), ``pattern[i]`` = ring on day i.
        vol.Optional("pattern", default=lambda: [True, True, False, False]): vol.All(
            [cv.boolean], vol.Length(min=1, max=42)
        ),
        # Anchor of week_cycle/interval/pattern; once: the date (None = next).
        vol.Optional("start_date", default=None): OPT_DATE,
        vol.Optional("date", default=None): OPT_DATE,
    }
)

SNOOZE_SCHEMA = vol.Schema(
    {
        vol.Optional("preset", default=None): vol.Any(None, cv.string),
        vol.Optional("count", default=None): vol.Any(
            None, vol.All(vol.Coerce(int), vol.Range(min=1, max=10))
        ),
    }
)

PRESENCE_SCHEMA = vol.Schema(
    {
        vol.Optional("entities", default=list): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional("skip_when_away", default=True): cv.boolean,
        vol.Optional("stop_when_away", default=True): cv.boolean,
    }
)

WEATHER_RULE_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=False): cv.boolean,
        vol.Optional("conditions", default=list): vol.All(cv.ensure_list, [vol.In(WEATHER_KEYS)]),
        # Expert: per-alarm minutes instead of the global defaults.
        vol.Optional("minutes", default=dict): {vol.In(WEATHER_KEYS): MINUTES},
        vol.Optional("cold_below", default=None): vol.Any(None, vol.Coerce(float)),
        vol.Optional("cold_minutes", default=None): vol.Any(None, MINUTES),
    }
)

TRAVEL_RULE_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=False): cv.boolean,
        vol.Optional("sensor", default=None): vol.Any(None, cv.entity_id),
        vol.Optional("usual", default=30): MINUTES,
        # Morning routine: from getting up until leaving.
        vol.Optional("routine", default=45): MINUTES,
        vol.Optional("arrive_by", default=None): OPT_TIME,
    }
)

SHIFT_SCHEMA = vol.Schema(
    {
        vol.Optional("weather", default=dict): WEATHER_RULE_SCHEMA,
        vol.Optional("travel", default=dict): TRAVEL_RULE_SCHEMA,
        vol.Optional("max", default=30): MINUTES,
        vol.Optional("combine", default="max"): vol.In(COMBINE),
        vol.Optional("notify", default=True): cv.boolean,
    }
)

LAST_CALL_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=False): cv.boolean,
        vol.Optional("profile", default="all_on"): cv.string,
        # Minutes the last call lasts; None = the profile's duration.
        vol.Optional("duration", default=None): vol.Any(
            None, vol.All(vol.Coerce(int), vol.Range(min=1, max=120))
        ),
    }
)

ACTIONS_SCHEMA = vol.Schema(
    {vol.Optional(phase, default=list): _actions for phase in ACTION_PHASES}
)

FALLBACK_SCHEMA = vol.Schema(
    {
        # entity_id of an alarm light -> replacement light
        vol.Optional("lights", default=dict): {cv.entity_id: cv.entity_id},
        vol.Optional("notify", default=None): vol.Any(None, cv.string),
        vol.Optional(
            "events", default=lambda: ["skipped", "shifted", "device_unavailable", "failed"]
        ): [vol.In(NOTIFY_EVENTS)],
        vol.Optional("persistent", default=True): cv.boolean,
    }
)

MEDIA_TYPES = ["playlist", "radio", "album", "track", "artist", "podcast", "audiobook"]
SOURCE_TYPES = ["none", "music_assistant", "url"]

SOURCE_SCHEMA = vol.Schema(
    {
        vol.Optional("type", default="none"): vol.In(SOURCE_TYPES),
        # Music Assistant: uri or name plus media type.
        vol.Optional("media_id", default=""): cv.string,
        vol.Optional("media_type", default="playlist"): vol.In(MEDIA_TYPES),
        # Display name from the search, for the UI only.
        vol.Optional("name", default=""): cv.string,
        vol.Optional("url", default=""): cv.string,
    }
)

TTS_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=False): cv.boolean,
        # tts.* entity; None = first available.
        vol.Optional("engine", default=None): vol.Any(None, cv.entity_id),
        vol.Optional("message", default=""): cv.string,
    }
)


def _curve_point(value: list[float]) -> list[float]:
    x, y = value
    return [min(1.0, max(0.0, x)), min(100.0, max(0.0, y))]


AUDIO_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=False): cv.boolean,
        vol.Optional("players", default=list): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional("source", default=dict): SOURCE_SCHEMA,
        vol.Optional("tts", default=dict): TTS_SCHEMA,
        # Music starts this many minutes before the alarm time.
        vol.Optional("lead", default=5): vol.All(vol.Coerce(int), vol.Range(min=0, max=60)),
        vol.Optional("volume", default=lambda: [5, 35]): _pair(PERCENT),
        vol.Optional("ramp", default=5): vol.All(vol.Coerce(int), vol.Range(min=0, max=60)),
        # Points between start and end volume: [share of the ramp 0..1, volume %].
        vol.Optional("curve", default=list): vol.All(
            [vol.All(vol.ExactSequence([vol.Coerce(float), vol.Coerce(float)]), _curve_point)],
            vol.Length(max=8),
            lambda pts: sorted(pts),
        ),
        vol.Optional("pause_on_snooze", default=True): cv.boolean,
        # Pause on the speaker itself: snooze (stop during the last call).
        vol.Optional("button", default=True): cv.boolean,
        vol.Optional("restore_volume", default=True): cv.boolean,
    }
)

PUSH_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=True): cv.boolean,
        # Phones of the owners are found automatically.
        vol.Optional("owners", default=True): cv.boolean,
        # Additional notify services, e.g. "mobile_app_ipad".
        vol.Optional("targets", default=list): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("critical_last_call", default=False): cv.boolean,
    }
)

ONCE_SCHEMA = vol.Schema(
    {
        vol.Required("date"): _date,
        vol.Required("time"): _time,
        vol.Optional("light_lead", default=None): vol.Any(None, MINUTES),
    }
)

ALARM_SCHEMA = vol.Schema(
    {
        vol.Optional("id"): cv.string,
        vol.Optional("name", default="Wecker"): vol.All(cv.string, vol.Length(max=64)),
        vol.Optional("kind", default="wake"): vol.In(KINDS),
        vol.Optional("enabled", default=True): cv.boolean,
        vol.Optional("owners", default=list): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional("wake", default=dict): WAKE_SCHEMA,
        vol.Optional("light_lead", default=30): MINUTES,
        vol.Optional("repeat", default=dict): REPEAT_SCHEMA,
        vol.Optional("wake_on_holidays", default=False): cv.boolean,
        vol.Optional("skip_date", default=None): OPT_DATE,
        vol.Optional("once", default=None): vol.Any(None, ONCE_SCHEMA),
        vol.Optional("snooze", default=dict): SNOOZE_SCHEMA,
        vol.Optional("stop_on_light_off", default=True): cv.boolean,
        vol.Optional("last_call", default=dict): LAST_CALL_SCHEMA,
        vol.Optional("presence", default=dict): PRESENCE_SCHEMA,
        vol.Optional("shift", default=dict): SHIFT_SCHEMA,
        vol.Optional("light", default=dict): LIGHT_SCHEMA,
        vol.Optional("actions", default=dict): ACTIONS_SCHEMA,
        vol.Optional("fallback", default=dict): FALLBACK_SCHEMA,
        vol.Optional("audio", default=dict): AUDIO_SCHEMA,
        vol.Optional("push", default=dict): PUSH_SCHEMA,
    },
    extra=vol.REMOVE_EXTRA,
)

SNOOZE_PRESET_SCHEMA = vol.Schema(
    {
        vol.Required("id"): cv.string,
        vol.Required("name"): cv.string,
        vol.Required("minutes"): vol.All(vol.Coerce(int), vol.Range(min=1, max=60)),
    }
)

LIGHT_PROFILE_SCHEMA = vol.Schema(
    {
        vol.Optional("id"): cv.string,
        vol.Required("name"): vol.All(cv.string, vol.Length(min=1, max=64)),
        vol.Optional("duration", default=30): MINUTES,
        vol.Optional("settings", default=dict): LIGHT_SETTINGS_SCHEMA,
    },
    extra=vol.REMOVE_EXTRA,
)

LAST_CALL_PROFILE_SCHEMA = vol.Schema(
    {
        vol.Optional("id"): cv.string,
        vol.Required("name"): vol.All(cv.string, vol.Length(min=1, max=64)),
        vol.Optional("duration", default=10): vol.All(vol.Coerce(int), vol.Range(min=1, max=120)),
        # Empty = the alarm's own lights.
        vol.Optional("targets", default=dict): TARGET_SCHEMA,
        vol.Optional("brightness", default=100): PERCENT,
        vol.Optional("kelvin", default=5000): vol.Any(None, KELVIN),
        vol.Optional("actions", default=list): _actions,
        # Own audio for the last call; type "none" = keep the alarm's audio.
        vol.Optional("audio", default=dict): SOURCE_SCHEMA,
        vol.Optional("volume", default=None): vol.Any(None, PERCENT),
    },
    extra=vol.REMOVE_EXTRA,
)

# Editor options that can be hidden per mode (expert always shows all).
MODE_FEATURES = [
    "sun",
    "pattern",
    "week_cycle",
    "calendar",
    "conditions",
    "overrides",
    "lamp_start",
    "audio",
    "tts",
    "push",
    "actions",
    "none",
    "fallback",
]
DEFAULT_MODE_HIDDEN = {
    "simple": [
        "sun",
        "pattern",
        "week_cycle",
        "calendar",
        "overrides",
        "lamp_start",
        "tts",
        "actions",
        "none",
    ],
    "normal": [],
}


def _features(value: Any) -> list[str]:
    """Keep known feature keys only (unknown ones come from newer versions)."""
    return [f for f in cv.ensure_list(value) if f in MODE_FEATURES]


SETTINGS_SCHEMA = vol.Schema(
    {
        vol.Optional("snooze_presets", default=lambda: deepcopy(DEFAULT_SNOOZE_PRESETS)): vol.All(
            [SNOOZE_PRESET_SCHEMA], vol.Length(min=1, max=12)
        ),
        vol.Optional("default_snooze", default="standard"): cv.string,
        vol.Optional("default_snooze_count", default=3): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=10)
        ),
        vol.Optional("default_last_call", default="all_on"): cv.string,
        vol.Optional("weather_entity", default=None): vol.Any(None, cv.entity_id),
        vol.Optional("warning_entities", default=list): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Optional("warning_level", default=2): vol.All(vol.Coerce(int), vol.Range(min=1, max=4)),
        vol.Optional("weather_minutes", default=lambda: {"snow": 15, "storm": 20, "rain": 10}): {
            vol.In(WEATHER_KEYS): MINUTES
        },
        vol.Optional("cold_below", default=0): vol.Coerce(float),
        vol.Optional("cold_minutes", default=10): MINUTES,
        vol.Optional("temperature_entity", default=None): vol.Any(None, cv.entity_id),
        vol.Optional("holiday_entity", default=None): vol.Any(None, cv.entity_id),
        vol.Optional("default_mode", default="normal"): vol.In(["simple", "normal", "expert"]),
        vol.Optional("notify", default=None): vol.Any(None, cv.string),
        vol.Optional("mode_hidden", default=lambda: deepcopy(DEFAULT_MODE_HIDDEN)): vol.Schema(
            {
                vol.Optional(
                    "simple", default=lambda: list(DEFAULT_MODE_HIDDEN["simple"])
                ): _features,
                vol.Optional("normal", default=list): _features,
            },
            extra=vol.REMOVE_EXTRA,
        ),
    },
    extra=vol.REMOVE_EXTRA,
)

DEFAULT_SNOOZE_PRESETS = [
    {"id": "standard", "name": "Standard", "minutes": 9},
    {"id": "short", "name": "Kurz", "minutes": 5},
    {"id": "long", "name": "Lang", "minutes": 15},
]


# ---------------------------------------------------------------- built-ins


def _ls(**kwargs: Any) -> dict[str, Any]:
    return LIGHT_SETTINGS_SCHEMA(kwargs)


BUILTIN_LIGHT_PROFILES: list[dict[str, Any]] = [
    {
        "id": "natural",
        "name": "Natürlicher Sonnenaufgang",
        "duration": 30,
        "builtin": True,
        "settings": _ls(curve="natural", color_mode="color", colors="sunrise", brightness=[1, 100]),
    },
    {
        "id": "gentle",
        "name": "Sanft",
        "duration": 30,
        "builtin": True,
        "settings": _ls(curve="gentle", color_mode="ct", kelvin=[2200, 4000]),
    },
    {
        "id": "linear",
        "name": "Linear",
        "duration": 20,
        "builtin": True,
        "settings": _ls(curve="linear", color_mode="ct", kelvin=[3000, 3000]),
    },
    {
        "id": "fast",
        "name": "Schnell & hell",
        "duration": 10,
        "builtin": True,
        "settings": _ls(curve="fast", color_mode="ct", brightness=[5, 100], kelvin=[4000, 6000]),
    },
]

BUILTIN_LAST_CALL_PROFILES: list[dict[str, Any]] = [
    {
        **LAST_CALL_PROFILE_SCHEMA(
            {"name": "Alles an", "duration": 10, "brightness": 100, "kelvin": 5000}
        ),
        "id": "all_on",
        "builtin": True,
    }
]


# ---------------------------------------------------------------- helpers


def new_id() -> str:
    """Return a new random id."""
    return uuid.uuid4().hex[:12]


new_alarm_id = new_id


def validate_alarm(data: dict[str, Any]) -> dict[str, Any]:
    """Validate an alarm and fill defaults. Raises vol.Invalid."""
    alarm: dict[str, Any] = ALARM_SCHEMA(deepcopy(data))
    alarm.setdefault("id", new_id())
    rep = alarm["repeat"]
    rep["weeks"] = (rep["weeks"] + [True] * rep["week_cycle"])[: rep["week_cycle"]]
    return alarm


def merge_alarm(current: dict[str, Any], changes: dict[str, Any]) -> dict[str, Any]:
    """Apply a partial update (nested dicts merged one level deep)."""
    merged = deepcopy(current)
    for key, value in changes.items():
        if key == "id":
            continue
        if isinstance(value, dict) and isinstance(merged.get(key), dict) and key != "once":
            merged[key] = {**merged[key], **value}
        else:
            merged[key] = value
    return validate_alarm(merged)


def validate_settings(data: dict[str, Any]) -> dict[str, Any]:
    settings = SETTINGS_SCHEMA(deepcopy(data))
    ids = [p["id"] for p in settings["snooze_presets"]]
    if settings["default_snooze"] not in ids:
        settings["default_snooze"] = ids[0]
    return settings


def validate_light_profile(data: dict[str, Any]) -> dict[str, Any]:
    profile = LIGHT_PROFILE_SCHEMA(deepcopy(data))
    profile.setdefault("id", new_id())
    return profile


def validate_last_call_profile(data: dict[str, Any]) -> dict[str, Any]:
    profile = LAST_CALL_PROFILE_SCHEMA(deepcopy(data))
    profile.setdefault("id", new_id())
    return profile


# ---------------------------------------------------------------- migration


def migrate_alarm_v1(old: dict[str, Any]) -> dict[str, Any]:
    """Convert a DayBreak 0.1 alarm to the current format."""
    light = old.get("light", {})
    behavior = old.get("behavior", {})
    curve = light.get("curve", "smooth")
    settings: dict[str, Any] = {
        "curve": {"smooth": "natural", "linear": "linear", "custom": "custom"}.get(
            curve, "natural"
        ),
        "brightness": [light.get("start_brightness", 1), light.get("end_brightness", 100)],
        "kelvin": [light.get("start_kelvin", 2200), light.get("end_kelvin", 4000)],
        "color_mode": "ct",
        "step_seconds": light.get("step_seconds", 15),
        "after_stop": "off" if behavior.get("after_stop") == "off" else "keep",
    }
    if curve == "custom" and len(light.get("points") or []) >= 2:
        pts = light["points"]
        b0 = settings["brightness"][0]
        b1 = settings["brightness"][1]
        span = (b1 - b0) or 1
        settings["points"] = [
            {"t": p["t"], "v": min(1, max(0, (p["brightness"] - b0) / span))} for p in pts
        ]
    days = old.get("days") or []
    repeat: dict[str, Any] = {"type": "weekly", "days": days}
    if not days:
        repeat = {"type": "once", "date": old.get("date")}
    last_call = old.get("last_call") or {}
    new = {
        "id": old.get("id"),
        "name": old.get("name", "Wecker"),
        "enabled": old.get("enabled", True),
        "wake": {"type": "fixed", "time": old.get("time", "07:00")},
        "light_lead": light.get("duration", 30),
        "repeat": repeat,
        "wake_on_holidays": True,
        "skip_date": old.get("skip_date"),
        "stop_on_light_off": behavior.get("stop_on_light_off", True),
        "presence": old.get("presence", {}),
        "last_call": {"enabled": bool(last_call.get("enabled")), "profile": "all_on"},
        "light": {"targets": light.get("target", {}), "settings": settings},
    }
    return validate_alarm({k: v for k, v in new.items() if v is not None})


def migrate_store_v1(data: dict[str, Any]) -> dict[str, Any]:
    """Convert the whole 0.1 storage file to the current format.

    Snooze length and the custom last call of 0.1 alarms become a snooze
    preset and a last call profile so nothing the user set up is lost.
    """
    settings = validate_settings({})
    last_call_profiles: list[dict[str, Any]] = []
    alarms: list[dict[str, Any]] = []
    for old in data.get("alarms", []):
        try:
            alarm = migrate_alarm_v1(old)
        except vol.Invalid:
            _LOGGER.warning("Dropping 0.1 alarm %s that could not be converted", old.get("id"))
            continue
        behavior = old.get("behavior") or {}
        minutes = behavior.get("snooze_minutes")
        if minutes:
            presets = settings["snooze_presets"]
            preset = next((p for p in presets if p["minutes"] == minutes), None)
            if preset is None and len(presets) < 12:
                preset = {"id": f"m{minutes}", "name": f"{minutes} min", "minutes": minutes}
                presets.append(preset)
            if preset is not None:
                alarm["snooze"]["preset"] = preset["id"]
                last_call = old.get("last_call") or {}
                window = (
                    last_call.get("after_minutes")
                    if last_call.get("enabled")
                    else behavior.get("auto_stop_minutes")
                )
                if window:
                    alarm["snooze"]["count"] = max(1, min(10, round(window / preset["minutes"])))
        last_call = old.get("last_call") or {}
        if last_call.get("enabled"):
            try:
                profile = validate_last_call_profile(
                    {
                        "name": alarm["name"],
                        "duration": last_call.get("duration", 10),
                        "targets": last_call.get("target") or {},
                        "brightness": last_call.get("brightness", 100),
                        "kelvin": last_call.get("kelvin"),
                        "actions": last_call.get("actions") or [],
                    }
                )
            except vol.Invalid:
                _LOGGER.warning("Could not convert the last call of %s", alarm["name"])
            else:
                last_call_profiles.append(profile)
                alarm["last_call"]["profile"] = profile["id"]
        alarms.append(alarm)
    return {
        "alarms": alarms,
        "settings": settings,
        "light_profiles": [],
        "last_call_profiles": last_call_profiles,
        "handled": dict(data.get("handled", {})),
    }
