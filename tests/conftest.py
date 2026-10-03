"""Shared fixtures."""

from __future__ import annotations

from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.loader import Integration
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.daybreak.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable loading custom integrations in all tests."""
    return


def _deps(self: Integration) -> list[str]:
    # DayBreak's frontend dependencies need the real frontend package.
    return [] if self.domain == DOMAIN else self.manifest.get("dependencies", [])


@pytest.fixture
def mock_frontend():
    """Skip panel/static registration (no frontend in tests)."""
    with (
        patch("custom_components.daybreak.async_register_frontend") as register,
        patch("custom_components.daybreak.async_unregister_frontend"),
        patch.object(Integration, "dependencies", property(_deps)),
    ):
        yield register


@pytest.fixture
async def manager(hass: HomeAssistant, mock_frontend):
    """Set up DayBreak and return its manager."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    entry = MockConfigEntry(domain=DOMAIN, title="DayBreak", data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry.runtime_data
