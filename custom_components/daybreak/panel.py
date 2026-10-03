"""Serve the DayBreak frontend (panel + Lovelace cards) from the integration."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    FRONTEND_SCRIPT,
    FRONTEND_URL_BASE,
    NAME,
    PANEL_COMPONENT,
    PANEL_ICON,
    PANEL_URL_PATH,
)

_DATA_STATIC = f"{DOMAIN}_static_registered"
_FRONTEND_DIR = Path(__file__).parent / "frontend"


def _script_url() -> str:
    # Cache-bust with the file's mtime so updates are picked up after restart.
    script = _FRONTEND_DIR / FRONTEND_SCRIPT
    version = int(script.stat().st_mtime) if script.exists() else 0
    return f"{FRONTEND_URL_BASE}/{FRONTEND_SCRIPT}?v={version}"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Register static files, the sidebar panel and the Lovelace cards."""
    if not hass.data.get(_DATA_STATIC):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(FRONTEND_URL_BASE, str(_FRONTEND_DIR), False)]
        )
        hass.data[_DATA_STATIC] = True

    url = await hass.async_add_executor_job(_script_url)
    # Cards: load the bundle on every dashboard.
    frontend.add_extra_js_url(hass, url)
    hass.data[f"{DOMAIN}_script_url"] = url
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_COMPONENT,
        sidebar_title=NAME,
        sidebar_icon=PANEL_ICON,
        module_url=url,
        require_admin=False,
    )


def async_unregister_frontend(hass: HomeAssistant) -> None:
    """Remove the panel and the card script."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH, warn_if_unknown=False)
    if url := hass.data.pop(f"{DOMAIN}_script_url", None):
        frontend.remove_extra_js_url(hass, url)
