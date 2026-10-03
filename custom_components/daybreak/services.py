"""DayBreak service actions."""

from __future__ import annotations

from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .const import (
    ATTR_ALARM_ID,
    ATTR_DURATION,
    ATTR_MINUTES,
    DOMAIN,
    SERVICE_CANCEL_SKIP,
    SERVICE_SKIP_NEXT,
    SERVICE_SNOOZE,
    SERVICE_STOP,
    SERVICE_TEST,
)
from .helpers import alarm_id_from_entity, get_manager

_TARGET = {
    vol.Optional(ATTR_ALARM_ID): cv.string,
    vol.Optional(ATTR_ENTITY_ID): cv.entity_id,
}

SNOOZE_SCHEMA = vol.Schema(
    {**_TARGET, vol.Optional(ATTR_MINUTES): vol.All(vol.Coerce(int), vol.Range(min=1, max=60))}
)
STOP_SCHEMA = vol.Schema(_TARGET)
ALARM_SCHEMA = vol.All(vol.Schema(_TARGET), cv.has_at_least_one_key(ATTR_ALARM_ID, ATTR_ENTITY_ID))
TEST_SCHEMA = vol.All(
    vol.Schema(
        {
            **_TARGET,
            vol.Optional(ATTR_DURATION, default=60): vol.All(
                vol.Coerce(int), vol.Range(min=10, max=1800)
            ),
        }
    ),
    cv.has_at_least_one_key(ATTR_ALARM_ID, ATTR_ENTITY_ID),
)


def _alarm_id(hass: HomeAssistant, call: ServiceCall) -> str | None:
    if alarm_id := call.data.get(ATTR_ALARM_ID):
        return alarm_id
    if entity_id := call.data.get(ATTR_ENTITY_ID):
        return alarm_id_from_entity(hass, entity_id)
    return None


def async_register_services(hass: HomeAssistant) -> None:
    """Register all DayBreak services."""

    async def snooze(call: ServiceCall) -> None:
        await get_manager(hass).async_snooze(_alarm_id(hass, call), call.data.get(ATTR_MINUTES))

    async def stop(call: ServiceCall) -> None:
        await get_manager(hass).async_stop(_alarm_id(hass, call))

    async def skip_next(call: ServiceCall) -> None:
        await get_manager(hass).async_skip_next(_alarm_id(hass, call))

    async def cancel_skip(call: ServiceCall) -> None:
        await get_manager(hass).async_cancel_skip(_alarm_id(hass, call))

    async def test(call: ServiceCall) -> None:
        await get_manager(hass).async_test(_alarm_id(hass, call), call.data[ATTR_DURATION])

    hass.services.async_register(DOMAIN, SERVICE_SNOOZE, snooze, SNOOZE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_STOP, stop, STOP_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SKIP_NEXT, skip_next, ALARM_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_CANCEL_SKIP, cancel_skip, ALARM_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_TEST, test, TEST_SCHEMA)
