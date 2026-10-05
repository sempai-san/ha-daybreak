"""Pure evaluation of calendar rules: what happens to an alarm on a day?

Events are fetched by the manager; this module only decides. Rules are
checked from top to bottom and the first one that matches and applies
decides the day.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from .scheduler import local_dt, parse_time

# How many days ahead the calendars are read.
CALENDAR_DAYS = 8


@dataclass(frozen=True)
class CalEvent:
    calendar: str
    summary: str
    start: datetime
    end: datetime
    all_day: bool
    description: str = ""
    location: str = ""

    @property
    def key(self) -> str:
        return f"{self.calendar}|{self.start.isoformat()}|{self.summary}"


@dataclass
class Decision:
    """What a rule decided for one day."""

    action: str  # skip | time | ring (normal time) | alarm (another alarm rings)
    rule: int
    time: datetime | None = None
    any_day: bool = False
    event: CalEvent | None = None
    travel: int | None = None
    # action "alarm": the alarm that takes over; action "ring": the alarm that handed over.
    alarm: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "action": self.action,
            "rule": self.rule,
            "time": self.time.isoformat() if self.time else None,
            "summary": self.event.summary if self.event else None,
            "event_start": self.event.start.isoformat() if self.event else None,
            "location": self.event.location if self.event else None,
            "travel": self.travel,
            "alarm": self.alarm,
        }


def parse_event(calendar: str, raw: dict[str, Any], tz: ZoneInfo) -> CalEvent | None:
    """An event from the calendar.get_events response."""
    try:
        start_raw, end_raw = str(raw["start"]), str(raw["end"])
        all_day = len(start_raw) == 10
        if all_day:
            start = datetime.combine(date.fromisoformat(start_raw), datetime.min.time(), tz)
            end = datetime.combine(date.fromisoformat(end_raw), datetime.min.time(), tz)
        else:
            start = datetime.fromisoformat(start_raw)
            end = datetime.fromisoformat(end_raw)
            if start.tzinfo is None:
                start, end = start.replace(tzinfo=tz), end.replace(tzinfo=tz)
    except (KeyError, TypeError, ValueError):
        return None
    return CalEvent(
        calendar=calendar,
        summary=str(raw.get("summary") or ""),
        start=start,
        end=end,
        all_day=all_day,
        description=str(raw.get("description") or ""),
        location=str(raw.get("location") or ""),
    )


def matches(rule: dict[str, Any], event: CalEvent) -> bool:
    """Does the event belong to the rule's calendars and contain its keywords?"""
    if rule["calendars"] and event.calendar not in rule["calendars"]:
        return False
    words = [w.casefold() for w in rule["keywords"]]
    if not words:
        return True
    text = f"{event.summary}\n{event.description}".casefold()
    found = [w in text for w in words]
    return all(found) if rule["match"] == "all" else any(found)


def events_on(events: list[CalEvent], day: date, tz: ZoneInfo) -> list[CalEvent]:
    """Events that touch the local day."""
    start = datetime.combine(day, datetime.min.time(), tz)
    end = start + timedelta(days=1)
    return [e for e in events if (e.start < end and e.end > start) or e.start == start]


def decide(
    alarm: dict[str, Any],
    events: list[CalEvent],
    day: date,
    tz: ZoneInfo,
    *,
    normal_day: bool,
    travel: Callable[[CalEvent], int | None] | None = None,
) -> Decision | None:
    """The decision of the first rule that matches and applies on ``day``."""
    config = alarm.get("calendar") or {}
    if not config.get("enabled"):
        return None
    todays = sorted(events_on(events, day, tz), key=lambda e: (e.start, e.summary))
    if not todays:
        return None
    for index, rule in enumerate(config["rules"]):
        if not rule["enabled"]:
            continue
        hits = [e for e in todays if matches(rule, e)]
        action = rule["action"]
        if action == "before":
            # Needs a start time: timed events beginning on this day.
            hits = [e for e in hits if not e.all_day and e.start.astimezone(tz).date() == day]
        if not hits:
            continue
        if action == "skip":
            if normal_day:
                return Decision("skip", index, event=hits[0])
            continue
        if not normal_day and not rule["any_day"]:
            continue
        event = hits[0]
        if action == "time":
            return Decision(
                "time",
                index,
                time=local_dt(day, parse_time(rule["time"]), tz),
                any_day=rule["any_day"],
                event=event,
            )
        if action == "before":
            minutes = None
            if rule["travel"]:
                minutes = travel(event) if travel else None
                if minutes is None:
                    minutes = config["travel"]["fallback"]
            when = event.start - timedelta(minutes=rule["before"] + (minutes or 0))
            when = when.astimezone(tz).replace(second=0, microsecond=0)
            if when.date() != day:
                when = datetime.combine(day, datetime.min.time(), tz)
            return Decision(
                "time", index, time=when, any_day=rule["any_day"], event=event, travel=minutes
            )
        if action == "alarm" and rule["alarm"] and rule["alarm"] != alarm.get("id"):
            return Decision(
                "alarm", index, any_day=rule["any_day"], event=event, alarm=rule["alarm"]
            )
    return None


def needs_travel(alarm: dict[str, Any]) -> bool:
    config = alarm.get("calendar") or {}
    return bool(config.get("enabled")) and any(
        r["enabled"] and r["action"] == "before" and r["travel"] for r in config["rules"]
    )


def calendars_used(alarm: dict[str, Any]) -> set[str] | None:
    """Calendars the rules read; None = all of them."""
    config = alarm.get("calendar") or {}
    if not config.get("enabled"):
        return set()
    used: set[str] = set()
    for rule in config["rules"]:
        if not rule["enabled"]:
            continue
        if not rule["calendars"]:
            return None
        used.update(rule["calendars"])
    return used
