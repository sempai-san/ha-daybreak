"""Sensors: next alarm (per alarm and overall) and alarm status."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import DaybreakConfigEntry
from .const import ALARM_STATES
from .entity import DaybreakAlarmEntity, DaybreakHubEntity, setup_alarm_platform
from .manager import DaybreakManager


async def async_setup_entry(
    hass: HomeAssistant,
    entry: DaybreakConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([NextAlarmOverallSensor(entry.runtime_data)])

    def factory(manager: DaybreakManager, alarm_id: str) -> list:
        return [NextAlarmSensor(manager, alarm_id), StatusSensor(manager, alarm_id)]

    setup_alarm_platform(hass, entry, async_add_entities, factory)


class NextAlarmSensor(DaybreakAlarmEntity, SensorEntity):
    """When this alarm rings next."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, manager: DaybreakManager, alarm_id: str) -> None:
        super().__init__(manager, alarm_id, "next_alarm")

    @property
    def native_value(self) -> datetime | None:
        return self.manager.next_alarm(self.alarm_id)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        info = self.manager.runtime_info(self.alarm_id)
        return {
            "alarm_id": self.alarm_id,
            "kind": self.alarm["kind"],
            "base_time": info["next_base"],
            "shift_minutes": info["shift"],
            "light_start": info["next_light_start"],
            "owners": self.alarm["owners"],
        }


class StatusSensor(DaybreakAlarmEntity, SensorEntity):
    """disabled / idle / scheduled / sunrise / ringing / snoozed."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = ALARM_STATES
    _attr_icon = "mdi:alarm-note"

    def __init__(self, manager: DaybreakManager, alarm_id: str) -> None:
        super().__init__(manager, alarm_id, "status")

    @property
    def native_value(self) -> str:
        return self.manager.state(self.alarm_id)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        info = self.manager.runtime_info(self.alarm_id)
        return {
            key: info[key]
            for key in ("snooze_until", "ring_started", "snoozes", "snooze_end", "test")
        }


class NextAlarmOverallSensor(DaybreakHubEntity, SensorEntity):
    """The next alarm across all alarms."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, manager: DaybreakManager) -> None:
        super().__init__(manager, "next_alarm")

    @property
    def native_value(self) -> datetime | None:
        nxt = self.manager.next_overall()
        return nxt[1] if nxt else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        nxt = self.manager.next_overall()
        if not nxt:
            return {"alarm_id": None, "alarm_name": None}
        return {"alarm_id": nxt[0], "alarm_name": self.manager.alarms[nxt[0]]["name"]}
