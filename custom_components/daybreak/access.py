"""Who may see and change which alarm.

Administrators see and change everything. Other users only get the alarms they
created, may use only entities Home Assistant lets them control, may not set free
actions (those can call any service) and, unless an administrator shares them,
may not use the administrator's profiles and sensors.
"""

from __future__ import annotations

import re
from typing import Any

from homeassistant.auth.models import User
from homeassistant.auth.permissions.const import POLICY_CONTROL, POLICY_READ
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from homeassistant.helpers.target import TargetSelection, async_extract_referenced_entity_ids

from .manager import DaybreakManager
from .push import person_services

_ENTITY = re.compile(r"^[a-z][a-z0-9_]*\.[a-z0-9_]+$")
_TARGET_KEYS = ("area_id", "device_id", "floor_id", "label_id")
# Entities DayBreak only reads; everything else is switched.
_READ_DOMAINS = {
    "sensor",
    "binary_sensor",
    "person",
    "calendar",
    "weather",
    "sun",
    "zone",
    "device_tracker",
    "tts",
    "input_boolean",
}
# Settings that name the administrator's sensors and phone.
_SHARED_SETTINGS = (
    "weather_entity",
    "warning_entities",
    "temperature_entity",
    "holiday_entity",
    "notify",
)


def is_admin(connection: ActiveConnection) -> bool:
    return bool(connection.user and connection.user.is_admin)


def can_access(connection: ActiveConnection, alarm: dict[str, Any]) -> bool:
    return is_admin(connection) or alarm.get("user_id") == connection.user.id


def visible_ids(manager: DaybreakManager, connection: ActiveConnection) -> set[str]:
    return {a for a, alarm in manager.alarms.items() if can_access(connection, alarm)}


def require_alarm(manager: DaybreakManager, connection: ActiveConnection, alarm_id: str) -> None:
    """Raise unless the user may touch this alarm (unknown ids fail later, as before)."""
    alarm = manager.alarms.get(alarm_id)
    if alarm is not None and not can_access(connection, alarm):
        raise Unauthorized


def own_persons(hass: HomeAssistant, user: User) -> list[str]:
    """The person entities that belong to this Home Assistant user."""
    return [
        s.entity_id
        for s in hass.states.async_all("person")
        if s.attributes.get("user_id") == user.id
    ]


def own_phone_services(hass: HomeAssistant, user: User) -> list[str]:
    found: list[str] = []
    for person in own_persons(hass, user):
        found.extend(s for s in person_services(hass, person) if s not in found)
    return found


def shared(manager: DaybreakManager) -> bool:
    return bool(manager.settings.get("share_with_users"))


def settings_for(manager: DaybreakManager, connection: ActiveConnection) -> dict[str, Any]:
    settings = dict(manager.settings)
    if not is_admin(connection) and not shared(manager):
        for key in _SHARED_SETTINGS:
            settings[key] = [] if isinstance(settings.get(key), list) else None
    return settings


def _walk(value: Any):
    """All (key, value) pairs and plain values in nested data."""
    if isinstance(value, dict):
        yield value
        for item in value.values():
            yield from _walk(item)
    elif isinstance(value, list):
        for item in value:
            yield from _walk(item)


def _allowed(user: User, entity_id: str) -> bool:
    policy = POLICY_READ if entity_id.split(".", 1)[0] in _READ_DOMAINS else POLICY_CONTROL
    return bool(user.permissions.check_entity(entity_id, policy))


def clean_for_user(
    hass: HomeAssistant,
    manager: DaybreakManager,
    connection: ActiveConnection,
    data: dict[str, Any],
) -> dict[str, Any]:
    """Validate an alarm (or changes) from a non-admin; returns it without forbidden parts.

    Free actions and the owner are removed. Anything else that goes beyond what the
    user may see or control raises Unauthorized.
    """
    user = connection.user
    data = {k: v for k, v in data.items() if k not in ("user_id", "id")}
    strip_actions(data)
    custom = {
        *manager.light_profiles,
        *manager.last_call_profiles,
        *manager.climate_profiles,
    }
    persons = set(own_persons(hass, user))
    phones = set(own_phone_services(hass, user))
    for node in _walk(data):
        for key, value in node.items():
            if (
                key == "profile"
                and isinstance(value, str)
                and value in custom
                and not shared(manager)
            ):
                raise Unauthorized
            if key == "owners" and isinstance(value, list) and not set(value) <= persons:
                raise Unauthorized
            if key == "targets" and isinstance(value, list) and not set(value) <= phones:
                raise Unauthorized
        if any(node.get(k) for k in _TARGET_KEYS):
            selected = async_extract_referenced_entity_ids(
                hass, TargetSelection(dict(node)), expand_group=False
            )
            for entity_id in selected.referenced | selected.indirectly_referenced:
                if not _allowed(user, entity_id):
                    raise Unauthorized
    _check_entities(user, data)
    return data


def strip_actions(data: Any) -> None:
    """Remove every free action list (they can call any service)."""
    if isinstance(data, dict):
        for key in list(data):
            if key == "actions":
                data[key] = {} if isinstance(data[key], dict) else []
            else:
                strip_actions(data[key])
    elif isinstance(data, list):
        for item in data:
            strip_actions(item)


def _check_entities(user: User, value: Any) -> None:
    if isinstance(value, str):
        if _ENTITY.match(value) and not _allowed(user, value):
            raise Unauthorized
    elif isinstance(value, dict):
        for item in value.values():
            _check_entities(user, item)
    elif isinstance(value, list):
        for item in value:
            _check_entities(user, item)
