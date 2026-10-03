"""Switches: alarm enabled, skip next occurrence."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
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
        return [EnabledSwitch(manager, alarm_id), SkipSwitch(manager, alarm_id)]

    setup_alarm_platform(hass, entry, async_add_entities, factory)


class EnabledSwitch(DaybreakAlarmEntity, SwitchEntity):
    """Alarm on/off. The device's main entity."""

    _attr_name = None

    def __init__(self, manager: DaybreakManager, alarm_id: str) -> None:
        super().__init__(manager, alarm_id, "enabled")

    @property
    def is_on(self) -> bool:
        return self.alarm["enabled"]

    @property
    def icon(self) -> str:
        return "mdi:alarm" if self.is_on else "mdi:alarm-off"

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.manager.async_set_enabled(self.alarm_id, True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.manager.async_set_enabled(self.alarm_id, False)


class SkipSwitch(DaybreakAlarmEntity, SwitchEntity):
    """On while the next occurrence is skipped."""

    _attr_icon = "mdi:debug-step-over"

    def __init__(self, manager: DaybreakManager, alarm_id: str) -> None:
        super().__init__(manager, alarm_id, "skip_next")

    @property
    def is_on(self) -> bool:
        return bool(self.alarm.get("skip_date"))

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"skip_date": self.alarm.get("skip_date")}

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.manager.async_skip_next(self.alarm_id)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.manager.async_cancel_skip(self.alarm_id)
