"""Small shared helpers."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .const import DOMAIN

if TYPE_CHECKING:
    from .manager import DaybreakManager


def get_manager(hass: HomeAssistant) -> DaybreakManager:
    """Return the manager of the loaded config entry."""
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise HomeAssistantError("DayBreak is not loaded")
    return entries[0].runtime_data


def alarm_id_from_entity(hass: HomeAssistant, entity_id: str) -> str:
    """Map any DayBreak entity of an alarm back to its alarm id."""
    entry = er.async_get(hass).async_get(entity_id)
    if entry and entry.platform == DOMAIN and entry.device_id:
        device = dr.async_get(hass).async_get(entry.device_id)
        if device:
            for domain, identifier in device.identifiers:
                if domain == DOMAIN:
                    return identifier
    raise ServiceValidationError(f"{entity_id} is not a DayBreak alarm entity")
