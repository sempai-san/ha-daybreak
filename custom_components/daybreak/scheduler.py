"""Pure scheduling: on which days and at what time does an alarm ring?

Kept free of Home Assistant state. Sun times and holidays are injected as
callables so the logic is easy to test.
"""

from __future__ import annotations

from collections.abc import Callable
from datetime import date, datetime, time, timedelta
from typing import Any
from zoneinfo import ZoneInfo

# Anchor for week cycles without an explicit start date (a Monday).
DEFAULT_ANCHOR = date(2024, 1, 1)
SEARCH_DAYS = 62

SunLookup = Callable[[date, str], datetime | None]
HolidayLookup = Callable[[date], bool]


def parse_time(value: str) -> time:
    hour, minute = (int(part) for part in value.split(":"))
    return time(hour, minute)


def local_dt(day: date, at: time, tz: ZoneInfo) -> datetime:
    """Local wall-clock time on a day, normalised across DST gaps.

    A time inside the spring-forward gap rings at the first valid moment
    after the gap.
    """
    aware = datetime.combine(day, at).replace(tzinfo=tz)
    return aware.astimezone(ZoneInfo("UTC")).astimezone(tz)


def _anchor(repeat: dict[str, Any]) -> date:
    if repeat.get("start_date"):
        return date.fromisoformat(repeat["start_date"])
    return DEFAULT_ANCHOR


def day_matches(alarm: dict[str, Any], day: date) -> bool:
    """Does the repeat rule select ``day``? (Ignores skips and holidays.)"""
    rep = alarm["repeat"]
    kind = rep["type"]
    if kind == "once":
        return rep.get("date") is None or rep["date"] == day.isoformat()
    if kind == "weekly":
        if day.weekday() not in rep["days"]:
            return False
        cycle = rep.get("week_cycle", 1)
        if cycle <= 1:
            return True
        anchor = _anchor(rep)
        anchor_monday = anchor - timedelta(days=anchor.weekday())
        week = ((day - anchor_monday).days // 7) % cycle
        weeks = rep.get("weeks") or [True]
        return bool(weeks[week]) if week < len(weeks) else False
    anchor = _anchor(rep)
    if day < anchor:
        return False
    delta = (day - anchor).days
    if kind == "interval":
        step = rep["interval"] * (7 if rep.get("unit") == "weeks" else 1)
        return delta % step == 0
    if kind == "pattern":
        pattern = rep["pattern"]
        return bool(pattern[delta % len(pattern)])
    return False


def wake_time_on(
    alarm: dict[str, Any], day: date, tz: ZoneInfo, sun: SunLookup | None
) -> datetime | None:
    """The (unshifted) alarm time on ``day``."""
    once = alarm.get("once")
    if once and once["date"] == day.isoformat():
        return local_dt(day, parse_time(once["time"]), tz)
    wake = alarm["wake"]
    if wake["type"] == "fixed" or sun is None:
        return local_dt(day, parse_time(wake["time"]), tz)
    event = sun(day, wake["sun_event"])
    if event is None:
        return None
    result = event.astimezone(tz) + timedelta(minutes=wake["offset"])
    # Whole minutes only.
    result = result.replace(second=0, microsecond=0)
    if wake.get("earliest"):
        result = max(result, local_dt(day, parse_time(wake["earliest"]), tz))
    if wake.get("latest"):
        result = min(result, local_dt(day, parse_time(wake["latest"]), tz))
    return result


def light_lead_on(alarm: dict[str, Any], day: date) -> int:
    once = alarm.get("once")
    if once and once["date"] == day.isoformat() and once.get("light_lead") is not None:
        return once["light_lead"]
    return alarm["light_lead"]


def next_occurrence(
    alarm: dict[str, Any],
    now: datetime,
    tz: ZoneInfo,
    *,
    sun: SunLookup | None = None,
    is_holiday: HolidayLookup | None = None,
) -> datetime | None:
    """Next alarm time strictly after ``now`` (before any shift), or None."""
    if not alarm.get("enabled", True):
        return None
    now = now.astimezone(tz)
    rep = alarm["repeat"]
    once = alarm.get("once")
    for offset in range(-1, SEARCH_DAYS):
        day = now.date() + timedelta(days=offset)
        override = bool(once and once["date"] == day.isoformat())
        if not override and not day_matches(alarm, day):
            continue
        if day.isoformat() == alarm.get("skip_date"):
            continue
        if (
            not override
            and is_holiday is not None
            and not alarm.get("wake_on_holidays", True)
            and is_holiday(day)
        ):
            continue
        when = wake_time_on(alarm, day, tz, sun)
        if when is None or when <= now:
            continue
        if rep["type"] == "once" and rep.get("date") is None and offset > 1:
            # "Next possible time": today or tomorrow only.
            return None
        return when
    return None


def is_one_time(alarm: dict[str, Any]) -> bool:
    """True for alarms that disable themselves after ringing once."""
    return alarm["repeat"]["type"] == "once"
