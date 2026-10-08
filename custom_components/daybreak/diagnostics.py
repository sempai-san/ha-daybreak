"""Diagnostics for bug reports: structure and timing, no personal data.

Entity ids become ``domain.<hash>``, free text (names, messages, media, locations)
is removed, and history keeps only the course (step, level, result).
"""

from __future__ import annotations

import hashlib
import re
from typing import Any

from homeassistant.core import HomeAssistant

from .const import VERSION
from .manager import DaybreakManager

_ENTITY = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
# Keys whose values are free text or addresses, never needed to find a bug.
_DROP = {
    "name",
    "title",
    "message",
    "text",
    "media_id",
    "url",
    "location",
    "address",
    "summary",
    "description",
    "keywords",
    "keyword",
    "event",
    "error",
    "snapshot",
    "entities",
    "services",
    "persons",
}
_KEEP_STEP = {"step", "level", "ok", "t", "phase", "reason"}


def _hash(value: str) -> str:
    domain = value.split(".", 1)[0]
    return f"{domain}.{hashlib.sha256(value.encode()).hexdigest()[:6]}"


def _clean(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: "**REDACTED**" if k in _DROP else _clean(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_clean(v) for v in value]
    if isinstance(value, str) and _ENTITY.match(value) and not value.replace(".", "").isdigit():
        return _hash(value)
    return value


def _history(manager: DaybreakManager) -> list[dict[str, Any]]:
    return [
        {
            "kind": entry.get("kind"),
            "test": entry.get("test"),
            "result": entry.get("result"),
            "alarm_time": entry.get("alarm_time"),
            "steps": [
                {k: v for k, v in step.items() if k in _KEEP_STEP}
                for step in entry.get("steps", [])
            ],
        }
        for entry in manager.history[:10]
    ]


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: Any) -> dict[str, Any]:
    """Return the redacted state for a bug report."""
    manager: DaybreakManager = entry.runtime_data
    return {
        "daybreak_version": VERSION,
        "alarm_count": len(manager.alarms),
        "settings": _clean(manager.settings),
        "alarms": [_clean(manager.as_dict(alarm_id)) for alarm_id in manager.alarms],
        "history": _history(manager),
    }
