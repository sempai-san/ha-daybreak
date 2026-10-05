"""Calendar rules: no alarm, other time, before the event (+ travel), hand-over."""

from __future__ import annotations

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, SupportsResponse
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.daybreak.calendar_rules import CalEvent, matches
from custom_components.daybreak.models import CALENDAR_RULE_SCHEMA

WORK = "calendar.work"
PRIVATE = "calendar.private"
WEEKDAYS = {"type": "weekly", "days": [0, 1, 2, 3, 4]}


def _tz():
    return dt_util.get_default_time_zone()


def _at(day: int, hour: int, minute: int = 0) -> datetime:
    """A local time in the week of Monday 2026-10-05 (day 0 = Monday)."""
    return datetime(2026, 10, 5 + day, hour, minute, tzinfo=_tz())


def _event(summary: str, day: int, hour: int | None = None, **extra) -> dict:
    if hour is None:
        start = (datetime(2026, 10, 5) + timedelta(days=day)).date()
        return {
            "summary": summary,
            "start": start.isoformat(),
            "end": (start + timedelta(days=1)).isoformat(),
            **extra,
        }
    return {
        "summary": summary,
        "start": _at(day, hour).isoformat(),
        "end": (_at(day, hour) + timedelta(hours=1)).isoformat(),
        **extra,
    }


@pytest.fixture
def calendars(hass: HomeAssistant):
    """Mocked calendars; fill ``events[calendar]`` before creating an alarm."""
    hass.states.async_set(WORK, "off")
    hass.states.async_set(PRIVATE, "off")
    events: dict[str, list[dict]] = {WORK: [], PRIVATE: []}

    async def _get_events(call):
        wanted = call.data.get("entity_id") or list(events)
        return {cal: {"events": events.get(cal, [])} for cal in wanted}

    hass.services.async_register(
        "calendar", "get_events", _get_events, supports_response=SupportsResponse.ONLY
    )
    return events


async def _create(hass, manager, freezer, rules, **extra):
    freezer.move_to(_at(-1, 20))
    alarm = await manager.async_create(
        {
            "wake": {"time": "06:30"},
            "repeat": WEEKDAYS,
            "light_lead": 0,
            "calendar": {"enabled": True, "rules": rules},
            **extra,
        }
    )
    await hass.async_block_till_done()
    return alarm


def _next(manager, alarm) -> datetime:
    return dt_util.as_local(manager.next_alarm(alarm["id"]))


def test_matches() -> None:
    event = CalEvent(WORK, "Early shift Hotline", _at(0, 6), _at(0, 14), False, "with Paul")
    rule = CALENDAR_RULE_SCHEMA({"keywords": ["hotline", "paul"], "match": "all"})
    assert matches(rule, event)
    assert not matches({**rule, "keywords": ["hotline", "anna"]}, event)
    assert matches({**rule, "keywords": ["hotline", "anna"], "match": "any"}, event)
    assert not matches({**rule, "calendars": [PRIVATE]}, event)
    assert matches(CALENDAR_RULE_SCHEMA({}), event)


async def test_skip_on_vacation(
    hass: HomeAssistant, manager, calendars, freezer: FrozenDateTimeFactory
) -> None:
    calendars[PRIVATE].append(_event("Vacation", 0))
    alarm = await _create(hass, manager, freezer, [{"keywords": ["vacation"], "action": "skip"}])
    assert _next(manager, alarm) == _at(1, 6, 30)
    days = manager.runtime_info(alarm["id"])["calendar_days"]
    assert days[0]["action"] == "skip" and days[0]["summary"] == "Vacation"


async def test_other_time_and_rule_order(
    hass: HomeAssistant, manager, calendars, freezer: FrozenDateTimeFactory
) -> None:
    calendars[WORK].append(_event("Early shift", 0, 6))
    alarm = await _create(
        hass,
        manager,
        freezer,
        [
            {"calendars": [WORK], "keywords": ["early"], "action": "time", "time": "05:00"},
            {"keywords": ["shift"], "action": "skip"},
        ],
    )
    assert _next(manager, alarm) == _at(0, 5, 0)
    assert manager.runtime_info(alarm["id"])["calendar"]["rule"] == 0
    # Only the private calendar: the first rule no longer matches, the second skips.
    rules = [{**r} for r in alarm["calendar"]["rules"]]
    rules[0]["calendars"] = [PRIVATE]
    await manager.async_update(alarm["id"], {"calendar": {"rules": rules}})
    await hass.async_block_till_done()
    assert _next(manager, alarm) == _at(1, 6, 30)


async def test_before_event_with_travel(
    hass: HomeAssistant, manager, calendars, freezer: FrozenDateTimeFactory
) -> None:
    hass.states.async_set("zone.home", "0", {"latitude": 50.7, "longitude": 6.1})
    waze = async_mock_service(
        hass,
        "waze_travel_time",
        "get_travel_times",
        response={"routes": [{"duration": 52.4}, {"duration": 61}]},
        supports_response=SupportsResponse.ONLY,
    )
    calendars[WORK].append(_event("Meeting", 0, 9, location="Main St 1, Aachen"))
    calendars[WORK].append(_event("Lunch", 1, 12))
    alarm = await _create(
        hass,
        manager,
        freezer,
        [{"keywords": ["meeting", "lunch"], "action": "before", "before": 45, "travel": True}],
    )
    # 09:00 - 52 min travel - 45 min = 07:23 (later than usual: the event decides).
    assert _next(manager, alarm) == _at(0, 7, 23)
    assert waze[0].data["destination"] == "Main St 1, Aachen"
    assert waze[0].data["origin"] == "50.7,6.1"
    assert waze[0].data["region"] == "eu"
    info = manager.runtime_info(alarm["id"])["calendar"]
    assert info["travel"] == 52
    days = manager.runtime_info(alarm["id"])["calendar_days"]
    # No location: the fixed fallback (30 min): 12:00 - 75 min.
    assert days[1]["time"].startswith("2026-10-06T10:45")


async def test_any_day(
    hass: HomeAssistant, manager, calendars, freezer: FrozenDateTimeFactory
) -> None:
    calendars[WORK].append(_event("Saturday service", 5, 8))
    rule = {"keywords": ["service"], "action": "time", "time": "06:00"}
    alarm = await _create(hass, manager, freezer, [rule], repeat={"type": "weekly", "days": [6]})
    # Not on Saturday without "also on free days".
    assert _next(manager, alarm) == _at(6, 6, 30)
    await manager.async_update(alarm["id"], {"calendar": {"rules": [{**rule, "any_day": True}]}})
    await hass.async_block_till_done()
    assert _next(manager, alarm) == _at(5, 6, 0)


async def test_other_alarm_takes_over(
    hass: HomeAssistant, manager, calendars, freezer: FrozenDateTimeFactory
) -> None:
    calendars[PRIVATE].append(_event("Late start", 0))
    freezer.move_to(_at(-1, 20))
    weekend = await manager.async_create(
        {"name": "Weekend", "wake": {"time": "08:15"}, "repeat": {"days": [5, 6]}, "light_lead": 0}
    )
    alarm = await _create(
        hass,
        manager,
        freezer,
        [{"keywords": ["late"], "action": "alarm", "alarm": weekend["id"]}],
    )
    assert _next(manager, alarm) == _at(1, 6, 30)
    assert _next(manager, weekend) == _at(0, 8, 15)
    assert manager.runtime_info(weekend["id"])["calendar"]["alarm"] == alarm["id"]
    # A disabled replacement never leaves the day without an alarm.
    await manager.async_set_enabled(weekend["id"], False)
    await hass.async_block_till_done()
    assert _next(manager, alarm) == _at(0, 6, 30)


async def test_preview(
    hass: HomeAssistant, manager, calendars, freezer: FrozenDateTimeFactory
) -> None:
    calendars[PRIVATE].append(_event("Vacation", 1))
    freezer.move_to(_at(-1, 20))
    days = await manager.async_calendar_preview(
        {
            "wake": {"time": "06:30"},
            "repeat": WEEKDAYS,
            "calendar": {"enabled": True, "rules": [{"keywords": ["vacation"]}]},
        }
    )
    assert days[0]["date"] == "2026-10-04" and not days[0]["normal"]
    assert days[2]["decision"]["action"] == "skip"
    assert days[2]["events"][0]["summary"] == "Vacation"
