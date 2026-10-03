"""Sun event times (incl. civil, nautical and astronomical twilight)."""

from __future__ import annotations

from datetime import UTC, date, datetime
from functools import lru_cache

from astral import Observer, sun
from homeassistant.core import HomeAssistant
from homeassistant.helpers.sun import get_astral_location

DEPRESSION = {"civil": 6.0, "nautical": 12.0, "astronomical": 18.0}


@lru_cache(maxsize=256)
def _events(lat: float, lon: float, elev: float, day: date) -> dict[str, datetime | None]:
    observer = Observer(latitude=lat, longitude=lon, elevation=elev)
    out: dict[str, datetime | None] = {}
    for kind, depression in DEPRESSION.items():
        for name, func in (("dawn", sun.dawn), ("dusk", sun.dusk)):
            try:
                out[f"{kind}_{name}"] = func(observer, day, depression=depression, tzinfo=UTC)
            except ValueError:  # event does not happen (polar day/night)
                out[f"{kind}_{name}"] = None
    for name, func in (("sunrise", sun.sunrise), ("sunset", sun.sunset)):
        try:
            out[name] = func(observer, day, tzinfo=UTC)
        except ValueError:
            out[name] = None
    return out


def sun_events(hass: HomeAssistant, day: date) -> dict[str, datetime | None]:
    """All sun events of ``day`` as aware UTC datetimes."""
    location, elevation = get_astral_location(hass)
    obs = location.observer
    return _events(round(obs.latitude, 4), round(obs.longitude, 4), float(elevation or 0), day)


def sun_event(hass: HomeAssistant, day: date, event: str) -> datetime | None:
    return sun_events(hass, day).get(event)
