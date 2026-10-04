"""Phone notifications with Snooze/Stop buttons (Home Assistant companion app)."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import slugify

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

ACTION_SNOOZE = "DAYBREAK_SNOOZE"
ACTION_STOP = "DAYBREAK_STOP"


def phone_services(hass: HomeAssistant) -> list[str]:
    """All companion app notify services, e.g. ["mobile_app_jans_iphone"]."""
    return sorted(
        s for s in hass.services.async_services().get("notify", {}) if s.startswith("mobile_app_")
    )


def person_services(hass: HomeAssistant, person: str) -> list[str]:
    """Notify services of the companion apps that track a person."""
    state = hass.states.get(person)
    if not state:
        return []
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    available = set(phone_services(hass))
    found: list[str] = []
    for tracker in state.attributes.get("device_trackers", []):
        entry = ent_reg.async_get(tracker)
        if not entry or entry.platform != "mobile_app" or not entry.device_id:
            continue
        device = dev_reg.async_get(entry.device_id)
        if not device:
            continue
        for config_entry_id in device.config_entries:
            config_entry = hass.config_entries.async_get_entry(config_entry_id)
            if not config_entry or config_entry.domain != "mobile_app":
                continue
            name = config_entry.data.get("device_name") or device.name or ""
            service = f"mobile_app_{slugify(name)}"
            if service in available and service not in found:
                found.append(service)
    return found


def targets(hass: HomeAssistant, alarm: dict[str, Any]) -> list[str]:
    push = alarm["push"]
    if not push["enabled"]:
        return []
    found: list[str] = []
    if push["owners"]:
        for owner in alarm["owners"]:
            found.extend(s for s in person_services(hass, owner) if s not in found)
    found.extend(s for s in push["targets"] if s not in found)
    return found


def tag(alarm_id: str) -> str:
    return f"{DOMAIN}_{alarm_id}"


async def async_send(
    hass: HomeAssistant,
    alarm: dict[str, Any],
    title: str,
    message: str,
    *,
    buttons: list[tuple[str, str]],
    critical: bool = False,
    context: Context | None = None,
) -> None:
    """Send an actionable notification to every phone of the alarm."""
    data: dict[str, Any] = {
        "tag": tag(alarm["id"]),
        "group": DOMAIN,
        "actions": [
            {"action": f"{action}_{alarm['id']}", "title": label} for action, label in buttons
        ],
        # Android: show on the lock screen, high priority.
        "priority": "high",
        "ttl": 0,
        "channel": "DayBreak",
    }
    if critical:
        data["push"] = {"sound": {"name": "default", "critical": 1, "volume": 1.0}}
        data["channel"] = "alarm_stream"
    await _call_all(hass, alarm, {"title": title, "message": message, "data": data}, context)


async def async_clear(hass: HomeAssistant, alarm: dict[str, Any]) -> None:
    await _call_all(
        hass, alarm, {"message": "clear_notification", "data": {"tag": tag(alarm["id"])}}, None
    )


async def _call_all(
    hass: HomeAssistant, alarm: dict[str, Any], payload: dict[str, Any], context: Context | None
) -> None:
    for service in targets(hass, alarm):
        try:
            await hass.services.async_call(
                "notify", service, payload, blocking=True, context=context
            )
        except Exception:
            _LOGGER.warning("DayBreak: notification via %s failed", service, exc_info=True)


def parse_action(action: str) -> tuple[str, str] | None:
    """("snooze"|"stop", alarm_id) for a DayBreak notification button."""
    for prefix, kind in ((ACTION_SNOOZE, "snooze"), (ACTION_STOP, "stop")):
        if action.startswith(f"{prefix}_"):
            return kind, action[len(prefix) + 1 :]
    return None
