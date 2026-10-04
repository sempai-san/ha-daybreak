"""Device registry lookups that work on old and new Home Assistant versions."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN


def find_device(hass: HomeAssistant, identifier: tuple[str, str]) -> dr.DeviceEntry | None:
    """Find a DayBreak device by its identifier.

    Newer Home Assistant versions want the lookup scoped to the config entry
    (``async_get_device_by_identifier``); older ones only have
    ``async_get_device``.
    """
    reg = dr.async_get(hass)
    if hasattr(reg, "async_get_device_by_identifier"):
        for entry in hass.config_entries.async_entries(DOMAIN):
            if device := reg.async_get_device_by_identifier(identifier, entry.entry_id):
                return device
        return None
    return reg.async_get_device(identifiers={identifier})
