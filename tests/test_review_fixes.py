"""Hardening: free service names, template rendering and diagnostics for non-admins."""

from __future__ import annotations

from types import SimpleNamespace

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
import pytest
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.daybreak.access import clean_for_user
from custom_components.daybreak.audio import AlarmAudio
from custom_components.daybreak.diagnostics import _clean
from custom_components.daybreak.models import validate_alarm


async def test_non_admin_cannot_name_other_services(hass: HomeAssistant, manager) -> None:
    user = SimpleNamespace(id="u1", permissions=SimpleNamespace(check_entity=lambda *_: True))
    connection = SimpleNamespace(user=user)
    for target in ("homeassistant.stop", "mobile_app_other"):
        with pytest.raises(Unauthorized):
            clean_for_user(hass, manager, connection, {"fallback": {"notify": target}})
    ok = clean_for_user(hass, manager, connection, {"fallback": {"notify": "notify.phone"}})
    assert ok["fallback"]["notify"] == "notify.phone"


async def test_push_only_calls_notify_domain(hass: HomeAssistant, manager) -> None:
    stop = async_mock_service(hass, "homeassistant", "stop")
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    await manager._async_push("homeassistant.stop", "t", "m")
    await manager._async_push("mobile_app_phone", "t", "m")
    assert not stop
    assert len(phone) == 1


async def test_announcement_template_only_for_admins(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "tts", "speak")
    audio = validate_alarm(
        {
            "audio": {
                "players": ["media_player.a"],
                "tts": {"enabled": True, "engine": "tts.x", "message": "{{ 1 + 1 }}"},
            }
        }
    )["audio"]
    for templates, expected in ((False, "{{ 1 + 1 }}"), (True, "2")):
        player = AlarmAudio(hass, audio, None, {}, lambda: None, templates=templates)
        await player._announce()
        assert calls[-1].data["message"] == expected


def test_diagnostics_drop_account_identifiers() -> None:
    cleaned = _clean(
        {
            "user_id": "abc",
            "notify": "mobile_app_x",
            "fallback": {"notify": "mobile_app_x"},
            "push": {"targets": ["mobile_app_x"]},
        }
    )
    assert "mobile_app_x" not in str(cleaned)
    assert "abc" not in str(cleaned)
