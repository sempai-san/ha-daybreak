"""Constants for DayBreak."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "daybreak"
NAME: Final = "DayBreak"

STORAGE_KEY: Final = DOMAIN
STORAGE_VERSION: Final = 1

FRONTEND_URL_BASE: Final = f"/{DOMAIN}_static"
FRONTEND_SCRIPT: Final = "daybreak.js"
PANEL_URL_PATH: Final = DOMAIN
PANEL_ICON: Final = "mdi:weather-sunset-up"
PANEL_COMPONENT: Final = "daybreak-panel"

SIGNAL_ALARMS_CHANGED: Final = f"{DOMAIN}_alarms_changed"
SIGNAL_ALARM_ADDED: Final = f"{DOMAIN}_alarm_added"


def signal_alarm_updated(alarm_id: str) -> str:
    """Dispatcher signal for a single alarm's config or runtime state."""
    return f"{DOMAIN}_alarm_updated_{alarm_id}"


# Events fired on the HA bus. Every event carries alarm_id and name.
EVENT_SUNRISE_STARTED: Final = f"{DOMAIN}_sunrise_started"
EVENT_ALARM_RINGING: Final = f"{DOMAIN}_alarm_ringing"
EVENT_ALARM_SNOOZED: Final = f"{DOMAIN}_alarm_snoozed"
EVENT_ALARM_STOPPED: Final = f"{DOMAIN}_alarm_stopped"
EVENT_ALARM_SKIPPED: Final = f"{DOMAIN}_alarm_skipped"
EVENT_ALARM_FINISHED: Final = f"{DOMAIN}_alarm_finished"

# Runtime states of a single alarm.
STATE_DISABLED: Final = "disabled"
STATE_IDLE: Final = "idle"
STATE_SCHEDULED: Final = "scheduled"
STATE_SUNRISE: Final = "sunrise"
STATE_RINGING: Final = "ringing"
STATE_SNOOZED: Final = "snoozed"
ALARM_STATES: Final = [
    STATE_DISABLED,
    STATE_IDLE,
    STATE_SCHEDULED,
    STATE_SUNRISE,
    STATE_RINGING,
    STATE_SNOOZED,
]
ACTIVE_STATES: Final = {STATE_SUNRISE, STATE_RINGING, STATE_SNOOZED}

# Why an alarm run ended (part of the stopped/finished events).
END_STOPPED: Final = "stopped"
END_AUTO_STOP: Final = "auto_stop"
END_MANUAL_OFF: Final = "manual_light_off"
END_DISABLED: Final = "disabled"

CURVE_LINEAR: Final = "linear"
CURVE_SMOOTH: Final = "smooth"
CURVE_CUSTOM: Final = "custom"
CURVES: Final = [CURVE_LINEAR, CURVE_SMOOTH, CURVE_CUSTOM]

SNOOZE_LIGHT_KEEP: Final = "keep"
SNOOZE_LIGHT_DIM: Final = "dim"
SNOOZE_LIGHT_OFF: Final = "off"
SNOOZE_LIGHT_MODES: Final = [SNOOZE_LIGHT_KEEP, SNOOZE_LIGHT_DIM, SNOOZE_LIGHT_OFF]

AFTER_STOP_KEEP: Final = "keep"
AFTER_STOP_OFF: Final = "off"
AFTER_STOP_MODES: Final = [AFTER_STOP_KEEP, AFTER_STOP_OFF]

SERVICE_SNOOZE: Final = "snooze"
SERVICE_STOP: Final = "stop"
SERVICE_SKIP_NEXT: Final = "skip_next"
SERVICE_CANCEL_SKIP: Final = "cancel_skip"
SERVICE_TEST: Final = "test"

ATTR_ALARM_ID: Final = "alarm_id"
ATTR_MINUTES: Final = "minutes"
ATTR_DURATION: Final = "duration"
