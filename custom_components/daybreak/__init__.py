"""DayBreak: sunrise alarm clock for Home Assistant."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .manager import DaybreakManager
from .panel import async_register_frontend, async_unregister_frontend
from .services import async_register_services
from .websocket import async_register_websocket

PLATFORMS: list[Platform] = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.SENSOR,
    Platform.SWITCH,
]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type DaybreakConfigEntry = ConfigEntry[DaybreakManager]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register services and the websocket API once."""
    async_register_services(hass)
    async_register_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: DaybreakConfigEntry) -> bool:
    """Set up DayBreak from a config entry."""
    manager = DaybreakManager(hass)
    entry.runtime_data = manager
    await async_register_frontend(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    # Load after the platforms so their dispatcher listeners see every alarm.
    await manager.async_load()
    return True


async def async_unload_entry(hass: HomeAssistant, entry: DaybreakConfigEntry) -> bool:
    """Unload a config entry."""
    await entry.runtime_data.async_unload()
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        async_unregister_frontend(hass)
    return unloaded
