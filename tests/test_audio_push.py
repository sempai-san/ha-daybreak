"""Audio (music, ramp, speaker button) and phone notifications with buttons."""

from __future__ import annotations

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_OFF
from homeassistant.core import Context, HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    async_capture_events,
    async_mock_service,
)

from custom_components.daybreak.audio import AlarmAudio
from custom_components.daybreak.const import (
    EVENT_ALARM_FINISHED,
    EVENT_ALARM_SNOOZED,
)
from custom_components.daybreak.models import validate_alarm
from custom_components.daybreak.push import parse_action

from .conftest import advance

LIGHT = "light.bedroom"
SPEAKER = "media_player.bedroom"


def _morning(freezer: FrozenDateTimeFactory, hour: int, minute: int) -> None:
    freezer.move_to(datetime(2026, 10, 5, hour, minute, tzinfo=dt_util.get_default_time_zone()))


@pytest.fixture
def speaker(hass: HomeAssistant):
    hass.states.async_set(LIGHT, STATE_OFF, {"supported_color_modes": ["color_temp"]})
    hass.states.async_set(SPEAKER, "idle", {"volume_level": 0.3})
    async_mock_service(hass, "light", "turn_on")
    async_mock_service(hass, "light", "turn_off")
    return {
        name: async_mock_service(hass, domain, service)
        for name, (domain, service) in {
            "play": ("music_assistant", "play_media"),
            "volume": ("media_player", "volume_set"),
            "pause": ("media_player", "media_pause"),
            "resume": ("media_player", "media_play"),
        }.items()
    }


def _alarm(**audio):
    return {
        "wake": {"time": "06:30"},
        "repeat": {"type": "weekly", "days": [0]},
        "light_lead": 2,
        "light": {"targets": {"entity_id": [LIGHT]}},
        "audio": {
            "enabled": True,
            "players": [SPEAKER],
            "source": {"type": "music_assistant", "media_id": "Morning", "media_type": "playlist"},
            "lead": 5,
            "volume": [10, 40],
            "ramp": 2,
            **audio,
        },
    }


async def test_music_ramp_snooze_and_restore(
    hass: HomeAssistant, manager, speaker, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 20)
    await manager.async_update_settings(
        {"snooze_presets": [{"id": "s", "name": "S", "minutes": 5}], "default_snooze_count": 3}
    )
    alarm = await manager.async_create(_alarm())
    # Music starts 5 min before the alarm, the light only 2 min before.
    assert (
        dt_util.as_local(
            dt_util.parse_datetime(manager.runtime_info(alarm["id"])["next_light_start"])
        ).minute
        == 28
    )
    await advance(hass, freezer, timedelta(minutes=5, seconds=10))
    assert speaker["play"] and speaker["play"][0].data["media_id"] == "Morning"
    assert speaker["volume"][0].data["volume_level"] == 0.1
    assert manager.state(alarm["id"]) == "sunrise"

    await advance(hass, freezer, timedelta(minutes=2, seconds=10))
    assert speaker["volume"][-1].data["volume_level"] == 0.4  # ramp done

    await advance(hass, freezer, timedelta(minutes=3))
    assert manager.state(alarm["id"]) == "ringing"
    await manager.async_snooze(alarm["id"])
    await hass.async_block_till_done()
    assert speaker["pause"]
    await advance(hass, freezer, timedelta(minutes=5, seconds=10))
    assert manager.state(alarm["id"]) == "ringing"
    assert speaker["resume"]

    await manager.async_stop(alarm["id"])
    await hass.async_block_till_done()
    assert speaker["volume"][-1].data["volume_level"] == 0.3  # old volume back


async def test_speaker_button_snoozes(
    hass: HomeAssistant, manager, speaker, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    snoozed = async_capture_events(hass, EVENT_ALARM_SNOOZED)
    alarm = await manager.async_create(_alarm())
    await advance(hass, freezer, timedelta(minutes=1, seconds=20))
    assert manager.state(alarm["id"]) == "ringing"
    await advance(hass, freezer, timedelta(seconds=10))
    hass.states.async_set(SPEAKER, "playing", {"volume_level": 0.4})
    await hass.async_block_till_done()
    hass.states.async_set(SPEAKER, "paused", {"volume_level": 0.4}, context=Context())
    await hass.async_block_till_done()
    assert snoozed
    assert manager.state(alarm["id"]) == "snoozed"


async def test_push_buttons_and_critical_last_call(
    hass: HomeAssistant, manager, speaker, freezer: FrozenDateTimeFactory
) -> None:
    _morning(freezer, 6, 29)
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    finished = async_capture_events(hass, EVENT_ALARM_FINISHED)
    await manager.async_update_settings(
        {"snooze_presets": [{"id": "s", "name": "S", "minutes": 1}], "default_snooze_count": 1}
    )
    alarm = await manager.async_create(
        {
            **_alarm(enabled=False),
            "last_call": {"enabled": True, "duration": 5},
            "push": {"owners": False, "targets": ["mobile_app_phone"], "critical_last_call": True},
        }
    )
    await advance(hass, freezer, timedelta(minutes=1, seconds=20))
    ring = phone[0].data
    actions = [a["action"] for a in ring["data"]["actions"]]
    assert actions == [f"DAYBREAK_SNOOZE_{alarm['id']}", f"DAYBREAK_STOP_{alarm['id']}"]
    assert "push" not in ring["data"]

    await advance(hass, freezer, timedelta(minutes=1))
    assert manager.state(alarm["id"]) == "last_call"
    assert phone[-1].data["data"]["push"]["sound"]["critical"] == 1

    hass.bus.async_fire(
        "mobile_app_notification_action", {"action": f"DAYBREAK_STOP_{alarm['id']}"}
    )
    await hass.async_block_till_done()
    assert finished and finished[0].data["reason"] == "stopped"
    assert phone[-1].data["message"] == "clear_notification"


def test_parse_action() -> None:
    assert parse_action("DAYBREAK_SNOOZE_abc123") == ("snooze", "abc123")
    assert parse_action("DAYBREAK_STOP_x") == ("stop", "x")
    assert parse_action("OTHER") is None


async def test_phones_websocket(hass: HomeAssistant, manager, hass_ws_client) -> None:
    from homeassistant.setup import async_setup_component

    assert await async_setup_component(hass, "websocket_api", {})
    async_mock_service(hass, "notify", "mobile_app_phone")
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "daybreak/phones"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["services"] == ["mobile_app_phone"]
    assert msg["result"]["music_assistant"] is False
    await client.send_json_auto_id({"type": "daybreak/ma_search", "query": "x"})
    msg = await client.receive_json()
    assert msg["error"]["code"] == "no_music_assistant"


def test_volume_curve_points() -> None:
    audio = validate_alarm({"audio": {"volume": [10, 50], "curve": [[0.8, 20], [0.2, 40]]}})[
        "audio"
    ]
    assert audio["curve"] == [[0.2, 40.0], [0.8, 20.0]]
    player = AlarmAudio.__new__(AlarmAudio)
    player.audio = audio
    player._ramp_from, player._ramp_to = 10, 50
    assert player.volume_at(0) == pytest.approx(10)
    assert player.volume_at(0.2) == pytest.approx(40)
    assert player.volume_at(0.8) == pytest.approx(20)
    assert player.volume_at(1) == pytest.approx(50)
    player.audio = {**audio, "curve": []}
    assert player.volume_at(0.5) == pytest.approx(30)
