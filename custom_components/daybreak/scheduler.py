"""Pure scheduling helpers: when does an alarm ring next?

Kept free of Home Assistant state so it is easy to unit test.
"""

from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import Any
from zoneinfo import ZoneInfo

# Look this many days ahead for a matching weekday (a week plus slack for skips).
_SEARCH_DAYS = 15


def _alarm_time(alarm: dict[str, Any]) -> time:
    hour, minute = (int(part) for part in alarm["time"].split(":"))
    return time(hour, minute)


def _local(day: date, at: time, tz: ZoneInfo) -> datetime:
    """Local wall-clock time on a day, normalised across DST gaps.

    A time inside the spring-forward gap (e.g. 02:30) rings at the first
    valid moment after the gap.
    """
    naive = datetime.combine(day, at)
    aware = naive.replace(tzinfo=tz)
    # Round-trip through UTC to resolve non-existent local times.
    return aware.astimezone(ZoneInfo("UTC")).astimezone(tz)


def next_occurrence(alarm: dict[str, Any], now: datetime, tz: ZoneInfo) -> datetime | None:
    """Return the next alarm time strictly after ``now``, or None.

    Respects ``days`` (weekly repeat), ``date`` (one-time on a date) and
    ``skip_date`` (one skipped occurrence). Disabled alarms return None.
    """
    if not alarm.get("enabled", True):
        return None

    at = _alarm_time(alarm)
    now = now.astimezone(tz)
    skip = alarm.get("skip_date")
    days: list[int] = alarm.get("days") or []

    if not days:
        if alarm.get("date"):
            candidate = _local(date.fromisoformat(alarm["date"]), at, tz)
            if candidate <= now or candidate.date().isoformat() == skip:
                return None
            return candidate
        for offset in range(3):
            candidate = _local(now.date() + timedelta(days=offset), at, tz)
            if candidate > now and candidate.date().isoformat() != skip:
                return candidate
        return None

    for offset in range(_SEARCH_DAYS):
        day = now.date() + timedelta(days=offset)
        if day.weekday() not in days:
            continue
        candidate = _local(day, at, tz)
        if candidate <= now or day.isoformat() == skip:
            continue
        return candidate
    return None


def is_one_time(alarm: dict[str, Any]) -> bool:
    """True for alarms that disable themselves after ringing once."""
    return not alarm.get("days")
