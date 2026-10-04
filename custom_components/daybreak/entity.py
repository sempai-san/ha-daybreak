"""Base entities for DayBreak."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN, NAME, SIGNAL_ALARM_ADDED, SIGNAL_ALARMS_CHANGED, signal_alarm_updated
from .manager import DaybreakManager

HUB_ID = "hub"


def setup_alarm_platform(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
    factory: Callable[[DaybreakManager, str], list[Entity]],
) -> None:
    """Add entities for every alarm, now and whenever one is created."""
    manager: DaybreakManager = entry.runtime_data

    @callback
    def _add(alarm_id: str) -> None:
        async_add_entities(factory(manager, alarm_id))

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_ALARM_ADDED, _add))


def _via_hub(hass: HomeAssistant) -> dict[str, Any]:
    """Link alarm devices to the DayBreak hub device.

    Newer Home Assistant versions want the hub's device id (``via_device_id``);
    older ones only know the ``via_device`` identifier tuple.
    """
    if "via_device_id" in DeviceInfo.__annotations__:
        hub = dr.async_get(hass).async_get_device(identifiers={(DOMAIN, HUB_ID)})
        return {"via_device_id": hub.id} if hub else {}
    return {"via_device": (DOMAIN, HUB_ID)}


class DaybreakAlarmEntity(Entity):
    """Entity that belongs to one alarm (one device per alarm)."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, manager: DaybreakManager, alarm_id: str, key: str) -> None:
        self.manager = manager
        self.alarm_id = alarm_id
        self._attr_unique_id = f"{alarm_id}_{key}"
        self._attr_translation_key = key
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, alarm_id)},
            name=manager.alarms[alarm_id]["name"],
            manufacturer=NAME,
            model="Alarm",
            entry_type=DeviceEntryType.SERVICE,
            **_via_hub(manager.hass),
        )

    @property
    def alarm(self) -> dict[str, Any]:
        return self.manager.alarms[self.alarm_id]

    @property
    def available(self) -> bool:
        return self.alarm_id in self.manager.alarms

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, signal_alarm_updated(self.alarm_id), self._handle_update
            )
        )

    @callback
    def _handle_update(self) -> None:
        if self.alarm_id in self.manager.alarms:
            self.async_write_ha_state()


class DaybreakHubEntity(Entity):
    """Entity that summarises all alarms."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, manager: DaybreakManager, key: str) -> None:
        self.manager = manager
        self._attr_unique_id = f"{HUB_ID}_{key}"
        self._attr_translation_key = key
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, HUB_ID)},
            name=NAME,
            manufacturer=NAME,
            model="Alarm clock",
            entry_type=DeviceEntryType.SERVICE,
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_ALARMS_CHANGED, self.async_write_ha_state)
        )
