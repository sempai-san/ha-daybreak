"""WebSocket API used by the DayBreak panel and cards."""

from __future__ import annotations

import contextlib
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_connect
import voluptuous as vol

from .const import SIGNAL_ALARMS_CHANGED
from .helpers import get_manager

ACTIONS = ["snooze", "stop", "skip_next", "cancel_skip", "test", "enable", "disable"]


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register websocket commands."""
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_create)
    websocket_api.async_register_command(hass, ws_update)
    websocket_api.async_register_command(hass, ws_delete)
    websocket_api.async_register_command(hass, ws_action)


def _snapshot(hass: HomeAssistant) -> dict[str, Any]:
    manager = get_manager(hass)
    nxt = manager.next_overall()
    return {
        "alarms": [manager.as_dict(alarm_id) for alarm_id in manager.alarms],
        "next": {"alarm_id": nxt[0], "time": nxt[1].isoformat()} if nxt else None,
    }


def _error(connection: websocket_api.ActiveConnection, msg_id: int, err: Exception) -> None:
    connection.send_error(msg_id, "daybreak_error", str(err))


@websocket_api.websocket_command({vol.Required("type"): "daybreak/alarms"})
@callback
def ws_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return all alarms with their runtime state."""
    try:
        connection.send_result(msg["id"], _snapshot(hass))
    except HomeAssistantError as err:
        _error(connection, msg["id"], err)


@websocket_api.websocket_command({vol.Required("type"): "daybreak/subscribe"})
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Push the full alarm list whenever anything changes."""
    msg_id = msg["id"]
    pending = False

    @callback
    def _send() -> None:
        nonlocal pending
        pending = False
        with contextlib.suppress(HomeAssistantError):
            connection.send_message(websocket_api.event_message(msg_id, _snapshot(hass)))

    @callback
    def _changed() -> None:
        # Coalesce bursts of changes into one message per loop iteration.
        nonlocal pending
        if not pending:
            pending = True
            hass.loop.call_soon(_send)

    connection.subscriptions[msg_id] = async_dispatcher_connect(
        hass, SIGNAL_ALARMS_CHANGED, _changed
    )
    connection.send_result(msg_id)
    _send()


@websocket_api.websocket_command(
    {vol.Required("type"): "daybreak/alarm/create", vol.Required("alarm"): dict}
)
@websocket_api.async_response
async def ws_create(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    try:
        alarm = await get_manager(hass).async_create(msg["alarm"])
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], get_manager(hass).as_dict(alarm["id"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/alarm/update",
        vol.Required("alarm_id"): str,
        vol.Required("changes"): dict,
    }
)
@websocket_api.async_response
async def ws_update(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    manager = get_manager(hass)
    try:
        await manager.async_update(msg["alarm_id"], msg["changes"])
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], manager.as_dict(msg["alarm_id"]))


@websocket_api.websocket_command(
    {vol.Required("type"): "daybreak/alarm/delete", vol.Required("alarm_id"): str}
)
@websocket_api.async_response
async def ws_delete(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    try:
        await get_manager(hass).async_delete(msg["alarm_id"])
    except HomeAssistantError as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/alarm/action",
        vol.Optional("alarm_id"): vol.Any(None, str),
        vol.Required("action"): vol.In(ACTIONS),
        vol.Optional("minutes"): vol.All(int, vol.Range(min=1, max=60)),
        vol.Optional("duration"): vol.All(int, vol.Range(min=10, max=1800)),
    }
)
@websocket_api.async_response
async def ws_action(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    manager = get_manager(hass)
    alarm_id = msg.get("alarm_id")
    action = msg["action"]
    try:
        if action == "snooze":
            await manager.async_snooze(alarm_id, msg.get("minutes"))
        elif action == "stop":
            await manager.async_stop(alarm_id)
        elif not alarm_id:
            raise HomeAssistantError(f"{action} needs an alarm_id")
        elif action == "skip_next":
            await manager.async_skip_next(alarm_id)
        elif action == "cancel_skip":
            await manager.async_cancel_skip(alarm_id)
        elif action == "test":
            await manager.async_test(alarm_id, msg.get("duration", 60))
        else:
            await manager.async_set_enabled(alarm_id, action == "enable")
    except HomeAssistantError as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])
