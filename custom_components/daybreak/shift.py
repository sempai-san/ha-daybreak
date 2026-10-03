"""Pure evaluation of the automatic wake-up shift (weather, travel time)."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

# HA weather conditions that count for each rule.
WEATHER_CONDITIONS: dict[str, set[str]] = {
    "snow": {"snowy", "snowy-rainy", "hail"},
    "storm": {"lightning", "lightning-rainy", "exceptional", "windy", "windy-variant", "hail"},
    "rain": {"pouring"},
}


@dataclass
class ShiftInputs:
    """Values gathered from Home Assistant for one evaluation."""

    condition: str | None = None
    temperature: float | None = None
    warning_level: int = 0
    travel_minutes: float | None = None


@dataclass
class ShiftResult:
    minutes: int = 0
    parts: list[dict[str, Any]] = field(default_factory=list)


def evaluate(
    alarm: dict[str, Any],
    settings: dict[str, Any],
    inputs: ShiftInputs,
    base_time: datetime,
) -> ShiftResult:
    """How many minutes earlier the alarm should ring."""
    shift = alarm["shift"]
    parts: list[dict[str, Any]] = []

    weather = shift["weather"]
    if weather["enabled"]:
        defaults = settings["weather_minutes"]
        for key in weather["conditions"]:
            if inputs.condition in WEATHER_CONDITIONS[key]:
                minutes = weather["minutes"].get(key, defaults.get(key, 0))
                parts.append({"rule": "weather", "reason": key, "minutes": minutes})
        if "storm" in weather["conditions"] and inputs.warning_level >= settings["warning_level"]:
            minutes = weather["minutes"].get("storm", defaults.get("storm", 0))
            parts.append({"rule": "weather", "reason": "warning", "minutes": minutes})
        below = (
            weather["cold_below"] if weather["cold_below"] is not None else settings["cold_below"]
        )
        cold = (
            weather["cold_minutes"]
            if weather["cold_minutes"] is not None
            else settings["cold_minutes"]
        )
        if inputs.temperature is not None and inputs.temperature < below and cold:
            parts.append({"rule": "weather", "reason": "cold", "minutes": cold})

    travel = shift["travel"]
    if travel["enabled"] and inputs.travel_minutes is not None:
        actual = round(inputs.travel_minutes)
        if travel.get("arrive_by"):
            hour, minute = (int(x) for x in travel["arrive_by"].split(":"))
            arrive = base_time.replace(hour=hour, minute=minute, second=0, microsecond=0)
            latest_wake = arrive.timestamp() - (actual + travel["routine"]) * 60
            delta = round((base_time.timestamp() - latest_wake) / 60)
        else:
            delta = actual - travel["usual"]
        if delta > 0:
            parts.append({"rule": "travel", "reason": "travel", "minutes": delta})

    if not parts:
        return ShiftResult()
    # One value per rule: the strongest reason of that rule.
    per_rule: dict[str, int] = {}
    for part in parts:
        per_rule[part["rule"]] = max(per_rule.get(part["rule"], 0), part["minutes"])
    total = sum(per_rule.values()) if shift["combine"] == "sum" else max(per_rule.values())
    return ShiftResult(minutes=min(total, shift["max"]), parts=parts)
