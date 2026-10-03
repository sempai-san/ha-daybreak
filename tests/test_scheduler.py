"""Tests for next-occurrence calculation."""

from datetime import datetime
from zoneinfo import ZoneInfo

from custom_components.daybreak.models import validate_alarm
from custom_components.daybreak.scheduler import next_occurrence

TZ = ZoneInfo("Europe/Berlin")


def _alarm(**kwargs):
    return validate_alarm({"time": "06:30", **kwargs})


def test_one_time_today_or_tomorrow():
    alarm = _alarm()
    # Friday 2026-10-02 05:00 -> same day
    assert next_occurrence(alarm, datetime(2026, 10, 2, 5, 0, tzinfo=TZ), TZ) == datetime(
        2026, 10, 2, 6, 30, tzinfo=TZ
    )
    # after the time -> next day
    assert next_occurrence(alarm, datetime(2026, 10, 2, 7, 0, tzinfo=TZ), TZ) == datetime(
        2026, 10, 3, 6, 30, tzinfo=TZ
    )


def test_weekdays():
    alarm = _alarm(days=[0, 1, 2, 3, 4])
    # Friday after alarm -> Monday
    result = next_occurrence(alarm, datetime(2026, 10, 2, 7, 0, tzinfo=TZ), TZ)
    assert result == datetime(2026, 10, 5, 6, 30, tzinfo=TZ)


def test_skip_date():
    alarm = _alarm(days=[0, 1, 2, 3, 4], skip_date="2026-10-05")
    result = next_occurrence(alarm, datetime(2026, 10, 2, 7, 0, tzinfo=TZ), TZ)
    assert result == datetime(2026, 10, 6, 6, 30, tzinfo=TZ)


def test_fixed_date_in_past_is_none():
    alarm = _alarm(date="2026-10-01")
    assert next_occurrence(alarm, datetime(2026, 10, 2, 7, 0, tzinfo=TZ), TZ) is None


def test_disabled():
    alarm = _alarm(enabled=False)
    assert next_occurrence(alarm, datetime(2026, 10, 2, 5, 0, tzinfo=TZ), TZ) is None


def test_dst_gap():
    # 2026-03-29 02:30 does not exist in Berlin; alarm rings at 03:30 CEST.
    alarm = _alarm(time="02:30", date="2026-03-29")
    result = next_occurrence(alarm, datetime(2026, 3, 28, 12, 0, tzinfo=TZ), TZ)
    assert result is not None
    assert result.utcoffset().total_seconds() == 7200
    assert (result.hour, result.minute) == (3, 30)


def test_dst_fall_back_keeps_wall_clock():
    alarm = _alarm(days=[6], time="06:30")
    result = next_occurrence(alarm, datetime(2026, 10, 24, 12, 0, tzinfo=TZ), TZ)
    assert result == datetime(2026, 10, 25, 6, 30, tzinfo=TZ)
    assert result.utcoffset().total_seconds() == 3600
