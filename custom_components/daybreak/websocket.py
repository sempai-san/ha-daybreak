"""WebSocket API used by the DayBreak panel and cards."""

from __future__ import annotations

import contextlib
from datetime import date, timedelta
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import SIGNAL_ALARMS_CHANGED, VERSION
from .helpers import get_manager
from .manager import DaybreakError
from .push import person_services, phone_services

ACTIONS = [
    "snooze",
    "stop",
    "skip_next",
    "cancel_skip",
    "test",
    "enable",
    "disable",
    "clear_once",
]


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register websocket commands."""
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_create)
    websocket_api.async_register_command(hass, ws_update)
    websocket_api.async_register_command(hass, ws_delete)
    websocket_api.async_register_command(hass, ws_action)
    websocket_api.async_register_command(hass, ws_settings)
    websocket_api.async_register_command(hass, ws_profile_save)
    websocket_api.async_register_command(hass, ws_profile_delete)
    websocket_api.async_register_command(hass, ws_sun)
    websocket_api.async_register_command(hass, ws_preview)
    websocket_api.async_register_command(hass, ws_calendar_preview)
    websocket_api.async_register_command(hass, ws_once)
    websocket_api.async_register_command(hass, ws_ma_search)
    websocket_api.async_register_command(hass, ws_phones)


def _snapshot(hass: HomeAssistant) -> dict[str, Any]:
    manager = get_manager(hass)
    nxt = manager.next_overall()
    return {
        "alarms": [manager.as_dict(alarm_id) for alarm_id in manager.alarms],
        "next": {"alarm_id": nxt[0], "time": nxt[1].isoformat()} if nxt else None,
        "settings": manager.settings,
        "version": VERSION,
        "holiday_entity": manager.holiday_entity(),
        "light_profiles": manager.all_light_profiles(),
        "last_call_profiles": manager.all_last_call_profiles(),
        "climate_profiles": manager.all_climate_profiles(),
    }


def _error(connection: websocket_api.ActiveConnection, msg_id: int, err: Exception) -> None:
    if isinstance(err, DaybreakError):
        connection.send_error(msg_id, err.code, str(err))
        return
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
        elif action == "clear_once":
            await manager.async_clear_once(alarm_id)
        else:
            await manager.async_set_enabled(alarm_id, action == "enable")
    except HomeAssistantError as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "daybreak/settings", vol.Optional("changes"): dict}
)
@websocket_api.async_response
async def ws_settings(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Read or change the global settings."""
    manager = get_manager(hass)
    try:
        if "changes" in msg:
            await manager.async_update_settings(msg["changes"])
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], manager.settings)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/profile/save",
        vol.Required("kind"): vol.In(["light", "last_call", "climate"]),
        vol.Required("profile"): dict,
        vol.Optional("confirm", default=False): bool,
    }
)
@websocket_api.async_response
async def ws_profile_save(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Create a profile (no id) or change one."""
    try:
        profile = await get_manager(hass).async_save_profile(
            msg["kind"], msg["profile"], confirm=msg["confirm"]
        )
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], profile)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/profile/delete",
        vol.Required("kind"): vol.In(["light", "last_call", "climate"]),
        vol.Required("profile_id"): str,
    }
)
@websocket_api.async_response
async def ws_profile_delete(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    try:
        await get_manager(hass).async_delete_profile(msg["kind"], msg["profile_id"])
    except HomeAssistantError as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/sun",
        vol.Optional("date"): str,
        vol.Optional("days", default=1): vol.All(int, vol.Range(min=1, max=366)),
    }
)
@callback
def ws_sun(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Sun and twilight times of one or more days (UTC ISO strings)."""
    try:
        start = date.fromisoformat(msg["date"]) if "date" in msg else dt_util.now().date()
    except ValueError as err:
        _error(connection, msg["id"], err)
        return
    manager = get_manager(hass)
    connection.send_result(
        msg["id"],
        {
            (start + timedelta(days=i)).isoformat(): manager.sun_times(start + timedelta(days=i))
            for i in range(msg["days"])
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/preview",
        vol.Required("entity_id"): vol.All(cv.ensure_list, [cv.entity_id]),
        vol.Required("settings"): dict,
        vol.Required("progress"): vol.All(vol.Coerce(float), vol.Range(min=0, max=1)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_preview(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Show one point of a light curve on real lights."""
    try:
        await get_manager(hass).async_preview(msg["settings"], msg["entity_id"], msg["progress"])
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "daybreak/calendar/preview", vol.Required("alarm"): dict}
)
@websocket_api.async_response
async def ws_calendar_preview(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """What the calendar rules of an (unsaved) alarm do in the coming days."""
    try:
        days = await get_manager(hass).async_calendar_preview(msg["alarm"])
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"days": days})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/alarm/once",
        vol.Required("alarm_id"): str,
        vol.Required("date"): str,
        vol.Required("time"): str,
        vol.Optional("light_lead"): vol.Any(None, int),
    }
)
@websocket_api.async_response
async def ws_once(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Ring at another time on one day only."""
    try:
        await get_manager(hass).async_set_once(
            msg["alarm_id"], msg["date"], msg["time"], msg.get("light_lead")
        )
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], get_manager(hass).as_dict(msg["alarm_id"]))


MA_KEYS = {
    "playlists": "playlist",
    "radio": "radio",
    "albums": "album",
    "tracks": "track",
    "artists": "artist",
    "podcasts": "podcast",
    "audiobooks": "audiobook",
}


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/ma_search",
        vol.Required("query"): str,
        vol.Optional("media_type"): vol.Any(None, str),
    }
)
@websocket_api.async_response
async def ws_ma_search(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Search Music Assistant for playlists, radio stations, albums and tracks."""
    entries = hass.config_entries.async_loaded_entries("music_assistant")
    if not entries or not hass.services.has_service("music_assistant", "search"):
        connection.send_error(msg["id"], "no_music_assistant", "Music Assistant is not set up")
        return
    data: dict[str, Any] = {
        "config_entry_id": entries[0].entry_id,
        "name": msg["query"],
        "limit": 8,
    }
    if msg.get("media_type"):
        data["media_type"] = [msg["media_type"]]
    try:
        response = await hass.services.async_call(
            "music_assistant", "search", data, blocking=True, return_response=True
        )
    except HomeAssistantError as err:
        _error(connection, msg["id"], err)
        return
    items: list[dict[str, Any]] = []
    for key, media_type in MA_KEYS.items():
        for item in (response or {}).get(key, []) or []:
            items.append(
                {
                    "name": item.get("name", ""),
                    "uri": item.get("uri") or item.get("name", ""),
                    "media_type": item.get("media_type", media_type),
                    "image": item.get("image"),
                    "artist": ", ".join(a.get("name", "") for a in item.get("artists", []) or []),
                }
            )
    connection.send_result(msg["id"], items)


@websocket_api.websocket_command({vol.Required("type"): "daybreak/phones"})
@callback
def ws_phones(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Companion app notify services and which person they belong to."""
    persons = hass.states.async_entity_ids("person")
    connection.send_result(
        msg["id"],
        {
            "services": phone_services(hass),
            "persons": {person: person_services(hass, person) for person in persons},
            "music_assistant": bool(hass.config_entries.async_loaded_entries("music_assistant")),
            "tts": sorted(hass.states.async_entity_ids("tts")),
        },
    )
