"""WebSocket API used by the DayBreak panel and cards."""

from __future__ import annotations

import contextlib
from datetime import date, timedelta
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .access import (
    _allowed,
    clean_for_user,
    is_admin,
    own_persons,
    own_phone_services,
    require_alarm,
    settings_for,
    shared,
    visible_ids,
)
from .const import SIGNAL_ALARMS_CHANGED, VERSION
from .helpers import get_manager
from .manager import DaybreakError
from .push import person_services, phone_services

# Alarms one non-admin user may have.
MAX_USER_ALARMS = 20

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
    websocket_api.async_register_command(hass, ws_test)
    websocket_api.async_register_command(hass, ws_history_entry)
    websocket_api.async_register_command(hass, ws_once)
    websocket_api.async_register_command(hass, ws_ma_search)
    websocket_api.async_register_command(hass, ws_phones)
    websocket_api.async_register_command(hass, ws_users)


def _snapshot(hass: HomeAssistant, connection: websocket_api.ActiveConnection) -> dict[str, Any]:
    manager = get_manager(hass)
    admin = is_admin(connection)
    mine = visible_ids(manager, connection)
    nxt = manager.next_overall(None if admin else mine)
    use_custom = admin or shared(manager)
    if any(
        (uid := manager.alarms[a].get("user_id")) and uid not in manager.user_names for a in mine
    ):
        # A user was added since the names were read.
        hass.async_create_task(manager.async_refresh_users(), eager_start=False)
    return {
        "alarms": [
            {
                **manager.as_dict(alarm_id),
                "user_name": manager.user_name(manager.alarms[alarm_id].get("user_id")),
            }
            for alarm_id in manager.alarms
            if alarm_id in mine
        ],
        "next": {"alarm_id": nxt[0], "time": nxt[1].isoformat()} if nxt else None,
        "settings": settings_for(manager, connection),
        "version": VERSION,
        "is_admin": admin,
        "holiday_entity": manager.holiday_entity() if use_custom else None,
        "light_profiles": manager.all_light_profiles(use_custom),
        "last_call_profiles": manager.all_last_call_profiles(use_custom),
        "climate_profiles": manager.all_climate_profiles(use_custom),
        # The history holds device states and presence: administrators only.
        "history": manager.history_summary() if admin else [],
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
        connection.send_result(msg["id"], _snapshot(hass, connection))
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
            connection.send_message(
                websocket_api.event_message(msg_id, _snapshot(hass, connection))
            )

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
    manager = get_manager(hass)
    if connection.user.id not in manager.user_names:
        await manager.async_refresh_users()
    data = dict(msg["alarm"])
    if is_admin(connection):
        data.setdefault("user_id", connection.user.id)
    else:
        if sum(a.get("user_id") == connection.user.id for a in manager.alarms.values()) >= (
            MAX_USER_ALARMS
        ):
            _error(connection, msg["id"], DaybreakError("too_many", "Too many alarms"))
            return
        data = {**clean_for_user(hass, manager, connection, data), "user_id": connection.user.id}
    try:
        alarm = await manager.async_create(data)
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
    require_alarm(manager, connection, msg["alarm_id"])
    changes = msg["changes"]
    if not is_admin(connection):
        changes = clean_for_user(hass, manager, connection, changes)
    try:
        await manager.async_update(msg["alarm_id"], changes)
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
    manager = get_manager(hass)
    require_alarm(manager, connection, msg["alarm_id"])
    try:
        await manager.async_delete(msg["alarm_id"])
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
    if alarm_id:
        require_alarm(manager, connection, alarm_id)
    try:
        if action in ("snooze", "stop") and not alarm_id and not is_admin(connection):
            # "The ringing alarm": only the user's own.
            for own in visible_ids(manager, connection) & set(manager.active_alarms()):
                if action == "snooze":
                    await manager.async_snooze(own, msg.get("minutes"))
                else:
                    await manager.async_stop(own)
        elif action == "snooze":
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
    if "changes" in msg and not connection.user.is_admin:
        raise Unauthorized
    try:
        if "changes" in msg:
            await manager.async_update_settings(msg["changes"])
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], settings_for(manager, connection))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/profile/save",
        vol.Required("kind"): vol.In(["light", "last_call", "climate"]),
        vol.Required("profile"): dict,
        vol.Optional("confirm", default=False): bool,
    }
)
@websocket_api.require_admin
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
@websocket_api.require_admin
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
@websocket_api.async_response
async def ws_preview(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Show one point of a light curve on real lights."""
    if not is_admin(connection) and not all(_allowed(connection.user, e) for e in msg["entity_id"]):
        raise Unauthorized
    try:
        await get_manager(hass).async_preview(msg["settings"], msg["entity_id"], msg["progress"])
    except (vol.Invalid, HomeAssistantError) as err:
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "daybreak/history/entry", vol.Required("entry_id"): str}
)
@websocket_api.require_admin
@callback
def ws_history_entry(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """One history entry with DayBreak's commands and the service durations."""
    try:
        connection.send_result(msg["id"], get_manager(hass).history_entry(msg["entry_id"]))
    except HomeAssistantError as err:
        _error(connection, msg["id"], err)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "daybreak/alarm/test",
        vol.Required("alarm_id"): str,
        # Unsaved editor settings; default = the stored alarm.
        vol.Optional("alarm"): dict,
        # Time lapse: 1 = real time, 6 = one minute takes 10 seconds.
        vol.Optional("speed", default=6): vol.All(vol.Coerce(float), vol.Range(min=1, max=120)),
        vol.Optional("parts"): [vol.In(["light", "audio"])],
        vol.Optional("start", default="light"): vol.In(["light", "ring"]),
    }
)
@websocket_api.async_response
async def ws_test(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Test run in time lapse, optionally with unsaved settings."""
    manager = get_manager(hass)
    require_alarm(manager, connection, msg["alarm_id"])
    config = msg.get("alarm")
    if config is not None and not is_admin(connection):
        config = clean_for_user(hass, manager, connection, config)
    try:
        await manager.async_test(
            msg["alarm_id"],
            config=config,
            speed=msg["speed"],
            parts=msg.get("parts"),
            start=msg["start"],
        )
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
    manager = get_manager(hass)
    alarm = msg["alarm"]
    if not is_admin(connection):
        alarm = clean_for_user(hass, manager, connection, alarm)
    try:
        days = await manager.async_calendar_preview(alarm)
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
    require_alarm(get_manager(hass), connection, msg["alarm_id"])
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
    admin = is_admin(connection)
    persons = hass.states.async_entity_ids("person")
    if not admin:
        persons = own_persons(hass, connection.user)
    connection.send_result(
        msg["id"],
        {
            "services": phone_services(hass)
            if admin
            else own_phone_services(hass, connection.user),
            "persons": {person: person_services(hass, person) for person in persons},
            "music_assistant": bool(hass.config_entries.async_loaded_entries("music_assistant")),
            "tts": [
                e
                for e in sorted(hass.states.async_entity_ids("tts"))
                if _allowed(connection.user, e)
            ],
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "daybreak/users"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_users(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """The Home Assistant users an administrator can give an alarm to."""
    manager = get_manager(hass)
    await manager.async_refresh_users()
    connection.send_result(
        msg["id"],
        sorted(
            ({"id": uid, "name": name} for uid, name in manager.user_names.items()),
            key=lambda u: u["name"].lower(),
        ),
    )
