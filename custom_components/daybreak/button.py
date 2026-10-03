"""Buttons: snooze, stop, test."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import DaybreakConfigEntry
from .entity import DaybreakAlarmEntity, setup_alarm_platform
from .manager import DaybreakManager


async def async_setup_entry(
    hass: HomeAssistant,
    entry: DaybreakConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    def factory(manager: DaybreakManager, alarm_id: str) -> list:
        return [
            AlarmButton(manager, alarm_id, "snooze", "mdi:sleep"),
            AlarmButton(manager, alarm_id, "stop", "mdi:alarm-off"),
            AlarmButton(manager, alarm_id, "test", "mdi:play-circle-outline"),
        ]

    setup_alarm_platform(hass, entry, async_add_entities, factory)


class AlarmButton(DaybreakAlarmEntity, ButtonEntity):
    """Run one action on an alarm."""

    def __init__(self, manager: DaybreakManager, alarm_id: str, key: str, icon: str) -> None:
        super().__init__(manager, alarm_id, key)
        self._key = key
        self._attr_icon = icon

    async def async_press(self) -> None:
        if self._key == "snooze":
            await self.manager.async_snooze(self.alarm_id)
        elif self._key == "stop":
            await self.manager.async_stop(self.alarm_id)
        else:
            await self.manager.async_test(self.alarm_id)
