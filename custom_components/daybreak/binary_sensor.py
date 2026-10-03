"""Binary sensor: is any alarm active right now?"""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import DaybreakConfigEntry
from .entity import DaybreakHubEntity
from .manager import DaybreakManager


async def async_setup_entry(
    hass: HomeAssistant,
    entry: DaybreakConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([ActiveBinarySensor(entry.runtime_data)])


class ActiveBinarySensor(DaybreakHubEntity, BinarySensorEntity):
    """On during sunrise, ringing and snooze of any alarm."""

    _attr_icon = "mdi:weather-sunset-up"

    def __init__(self, manager: DaybreakManager) -> None:
        super().__init__(manager, "active")

    @property
    def is_on(self) -> bool:
        return bool(self.manager.active_alarms())

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"alarm_ids": self.manager.active_alarms()}
