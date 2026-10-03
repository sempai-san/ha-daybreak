"""Tests for next-occurrence calculation."""

from datetime import UTC, date, datetime, timedelta
from zoneinfo import ZoneInfo

from custom_components.daybreak.models import validate_alarm
from custom_components.daybreak.scheduler import day_matches, next_occurrence

TZ = ZoneInfo("Europe/Berlin")


def _alarm(time="06:30", **kwargs):
    kwargs.setdefault("repeat", {"type": "once"})
    return validate_alarm({"wake": {"time": time}, **kwargs})


def _weekly(days, **repeat):
    return {"type": "weekly", "days": days, **repeat}


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
    alarm = _alarm(repeat=_weekly([0, 1, 2, 3, 4]))
    # Friday after alarm -> Monday
    result = next_occurrence(alarm, datetime(2026, 10, 2, 7, 0, tzinfo=TZ), TZ)
    assert result == datetime(2026, 10, 5, 6, 30, tzinfo=TZ)


def test_skip_date():
    alarm = _alarm(repeat=_weekly([0, 1, 2, 3, 4]), skip_date="2026-10-05")
    result = next_occurrence(alarm, datetime(2026, 10, 2, 7, 0, tzinfo=TZ), TZ)
    assert result == datetime(2026, 10, 6, 6, 30, tzinfo=TZ)


def test_fixed_date_in_past_is_none():
    alarm = _alarm(repeat={"type": "once", "date": "2026-10-01"})
    assert next_occurrence(alarm, datetime(2026, 10, 2, 7, 0, tzinfo=TZ), TZ) is None


def test_disabled():
    alarm = _alarm(enabled=False)
    assert next_occurrence(alarm, datetime(2026, 10, 2, 5, 0, tzinfo=TZ), TZ) is None


def test_dst_gap():
    # 2026-03-29 02:30 does not exist in Berlin; alarm rings at 03:30 CEST.
    alarm = _alarm(time="02:30", repeat={"type": "once", "date": "2026-03-29"})
    result = next_occurrence(alarm, datetime(2026, 3, 28, 12, 0, tzinfo=TZ), TZ)
    assert result is not None
    assert result.utcoffset().total_seconds() == 7200
    assert (result.hour, result.minute) == (3, 30)


def test_dst_fall_back_keeps_wall_clock():
    alarm = _alarm(repeat=_weekly([6]))
    result = next_occurrence(alarm, datetime(2026, 10, 24, 12, 0, tzinfo=TZ), TZ)
    assert result == datetime(2026, 10, 25, 6, 30, tzinfo=TZ)
    assert result.utcoffset().total_seconds() == 3600


def test_week_cycle():
    # Every second week, starting with the week of 2026-10-05.
    alarm = _alarm(repeat=_weekly([0], week_cycle=2, weeks=[True, False], start_date="2026-10-05"))
    assert day_matches(alarm, date(2026, 10, 5))
    assert not day_matches(alarm, date(2026, 10, 12))
    assert day_matches(alarm, date(2026, 10, 19))
    result = next_occurrence(alarm, datetime(2026, 10, 5, 7, 0, tzinfo=TZ), TZ)
    assert result == datetime(2026, 10, 19, 6, 30, tzinfo=TZ)


def test_interval_and_pattern():
    alarm = _alarm(repeat={"type": "interval", "interval": 3, "start_date": "2026-10-01"})
    assert [day_matches(alarm, date(2026, 10, d)) for d in range(1, 8)] == [
        True, False, False, True, False, False, True
    ]  # fmt: skip
    # Shift pattern: 2 on, 2 off.
    alarm = _alarm(repeat={"type": "pattern", "pattern": [1, 1, 0, 0], "start_date": "2026-10-01"})
    assert [day_matches(alarm, date(2026, 10, d)) for d in range(1, 7)] == [
        True, True, False, False, True, True
    ]  # fmt: skip
    assert not day_matches(alarm, date(2026, 9, 30))


def test_holidays_skipped_unless_wanted():
    alarm = _alarm(repeat=_weekly([0, 1, 2, 3, 4]))
    holiday = {date(2026, 10, 5)}
    now = datetime(2026, 10, 2, 7, 0, tzinfo=TZ)
    result = next_occurrence(alarm, now, TZ, is_holiday=lambda d: d in holiday)
    assert result == datetime(2026, 10, 6, 6, 30, tzinfo=TZ)
    alarm["wake_on_holidays"] = True
    result = next_occurrence(alarm, now, TZ, is_holiday=lambda d: d in holiday)
    assert result == datetime(2026, 10, 5, 6, 30, tzinfo=TZ)


def test_once_override_only_that_day():
    alarm = _alarm(
        repeat=_weekly([0, 1, 2, 3, 4]),
        once={"date": "2026-10-05", "time": "05:15"},
    )
    now = datetime(2026, 10, 2, 7, 0, tzinfo=TZ)
    assert next_occurrence(alarm, now, TZ) == datetime(2026, 10, 5, 5, 15, tzinfo=TZ)
    after = datetime(2026, 10, 5, 6, 0, tzinfo=TZ)
    assert next_occurrence(alarm, after, TZ) == datetime(2026, 10, 6, 6, 30, tzinfo=TZ)


def test_sun_based_with_limits():
    alarm = _alarm(
        repeat=_weekly([0, 1, 2, 3, 4, 5, 6]),
        wake={"type": "sun", "sun_event": "sunrise", "offset": -15, "earliest": "06:00"},
    )

    def sun(day, event):
        assert event == "sunrise"
        # 05:40 local in summer, 07:40 local in winter
        hour = 5 if day.month == 7 else 7
        return datetime(day.year, day.month, day.day, hour, 40, tzinfo=TZ).astimezone(UTC)

    summer = next_occurrence(alarm, datetime(2026, 7, 1, 0, 0, tzinfo=TZ), TZ, sun=sun)
    assert summer == datetime(2026, 7, 1, 6, 0, tzinfo=TZ)  # clamped to earliest
    winter = next_occurrence(alarm, datetime(2026, 12, 1, 0, 0, tzinfo=TZ), TZ, sun=sun)
    assert winter == datetime(2026, 12, 1, 7, 25, tzinfo=TZ)
    assert winter - summer.replace(month=12) == timedelta(hours=1, minutes=25)
