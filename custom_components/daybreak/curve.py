"""Light curves: brightness, colour temperature and colour over the sunrise."""

from __future__ import annotations

from dataclasses import dataclass
from itertools import pairwise
import math
from typing import Any

PRESET_POINTS: dict[str, list[tuple[float, float]]] = {
    # Long dark phase, bright only near the end (like a real sunrise).
    "natural": [(0.0, 0.0), (0.4, 0.04), (0.7, 0.2), (0.9, 0.6), (1.0, 1.0)],
    # Soft S-curve: gentle start and gentle finish.
    "gentle": [(0.0, 0.0), (0.25, 0.07), (0.5, 0.4), (0.75, 0.82), (1.0, 1.0)],
    "linear": [(0.0, 0.0), (1.0, 1.0)],
    # Bright early, then levels off.
    "fast": [(0.0, 0.0), (0.2, 0.5), (0.5, 0.85), (1.0, 1.0)],
}

COLOR_PRESETS: dict[str, list[str]] = {
    "sunrise": ["#3A0D06", "#A32B10", "#F07A2A", "#FFD28A", "#FFF2DC"],
    "dawn": ["#2A0B1E", "#8A2A55", "#F06A5A", "#FFC29A", "#FFE9D6"],
    "pastel": ["#2B2340", "#7B6BB0", "#F0A7C0", "#FFD9C8", "#FFF1E6"],
}

# Colour temperature that best matches each colour preset, for lamps that
# cannot show colour ("passend zum Farbverlauf").
MATCHING_KELVIN: dict[str, tuple[int, int]] = {
    "sunrise": (1800, 3600),
    "dawn": (1800, 3000),
    "pastel": (2200, 4000),
    "custom": (1800, 3600),
}

COLOR_MODES = {"hs", "xy", "rgb", "rgbw", "rgbww"}


@dataclass(frozen=True, slots=True)
class Capabilities:
    """What a light can do, from its supported_color_modes."""

    brightness: bool = True
    color_temp: bool = False
    color: bool = False

    @classmethod
    def from_modes(cls, modes: list[str] | None) -> Capabilities:
        modes_set = set(modes or [])
        if not modes_set:
            return cls(brightness=True)
        return cls(
            brightness=modes_set != {"onoff"},
            color_temp="color_temp" in modes_set,
            color=bool(modes_set & COLOR_MODES),
        )


def curve_points(settings: dict[str, Any], channel: str) -> list[tuple[float, float]]:
    """Points of the brightness ("bri") or colour ("col") curve."""
    if settings["curve"] != "custom":
        return PRESET_POINTS[settings["curve"]]
    key = "points_color" if channel == "col" and settings["separate"] else "points"
    return [(p["t"], p["v"]) for p in settings[key]]


def _slopes(points: list[tuple[float, float]]) -> list[float]:
    """Fritsch-Carlson tangents: smooth through all points, never overshoots."""
    n = len(points)
    deltas = [
        (points[i + 1][1] - points[i][1]) / ((points[i + 1][0] - points[i][0]) or 1e-9)
        for i in range(n - 1)
    ]
    if n == 2:
        return [deltas[0], deltas[0]]
    slopes = [deltas[0]]
    for i in range(1, n - 1):
        d0, d1 = deltas[i - 1], deltas[i]
        slopes.append(0.0 if d0 * d1 <= 0 else 2 / (1 / d0 + 1 / d1))
    slopes.append(deltas[-1])
    return slopes


def curve_value(points: list[tuple[float, float]], x: float) -> float:
    """Monotone cubic interpolation through the curve points."""
    x = min(1.0, max(0.0, x))
    if x <= points[0][0]:
        return points[0][1]
    if x >= points[-1][0]:
        return points[-1][1]
    slopes = _slopes(points)
    for i in range(len(points) - 1):
        (t0, v0), (t1, v1) = points[i], points[i + 1]
        if x <= t1:
            h = (t1 - t0) or 1e-9
            r = (x - t0) / h
            h00 = 2 * r**3 - 3 * r**2 + 1
            h10 = r**3 - 2 * r**2 + r
            h01 = -2 * r**3 + 3 * r**2
            h11 = r**3 - r**2
            value = h00 * v0 + h10 * h * slopes[i] + h01 * v1 + h11 * h * slopes[i + 1]
            return min(1.0, max(0.0, value))
    return points[-1][1]


def _hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16)


def _mix(a: tuple[int, int, int], b: tuple[int, int, int], r: float) -> tuple[int, int, int]:
    return (
        round(a[0] + (b[0] - a[0]) * r),
        round(a[1] + (b[1] - a[1]) * r),
        round(a[2] + (b[2] - a[2]) * r),
    )


def _stops(settings: dict[str, Any]) -> list[tuple[float, str, float | None]]:
    """(position 0..1, colour, step brightness) for the colour gradient."""
    if settings["colors"] == "custom" and len(settings["sequence"]) >= 2:
        seq = settings["sequence"]
        total = sum(step["minutes"] for step in seq) or 1
        out = []
        acc = 0.0
        for step in seq:
            out.append((acc / total, step["color"], step["brightness"]))
            acc += step["minutes"]
        out.append((1.0, seq[-1]["color"], seq[-1]["brightness"]))
        return out
    colors = COLOR_PRESETS.get(settings["colors"], COLOR_PRESETS["sunrise"])
    n = len(colors) - 1
    return [(i / n, c, None) for i, c in enumerate(colors)]


def color_at(
    settings: dict[str, Any], position: float
) -> tuple[tuple[int, int, int], float | None]:
    """RGB colour (and custom step brightness) at gradient position 0..1."""
    stops = _stops(settings)
    position = min(1.0, max(0.0, position))
    for (p0, c0, b0), (p1, c1, b1) in pairwise(stops):
        if position <= p1:
            r = 0.0 if p1 == p0 else (position - p0) / (p1 - p0)
            bri = None if b0 is None or b1 is None else b0 + (b1 - b0) * r
            return _mix(_hex_to_rgb(c0), _hex_to_rgb(c1), r), bri
    last = stops[-1]
    return _hex_to_rgb(last[1]), last[2]


def plain_kelvin(settings: dict[str, Any]) -> tuple[int, int]:
    if settings.get("plain_kelvin"):
        return tuple(settings["plain_kelvin"])  # type: ignore[return-value]
    return MATCHING_KELVIN.get(settings["colors"], (1800, 3600))


@dataclass(frozen=True, slots=True)
class LightCommand:
    """Values to send to one light at one moment."""

    brightness_pct: float
    kelvin: int | None = None
    rgb: tuple[int, int, int] | None = None


def command_at(settings: dict[str, Any], progress: float, caps: Capabilities) -> LightCommand:
    """What a light with ``caps`` should show at ``progress`` (0 = start, 1 = alarm)."""
    p = min(1.0, max(0.0, progress))
    b_start, b_end = settings["brightness"]
    bri = b_start + (b_end - b_start) * curve_value(curve_points(settings, "bri"), p)
    col = curve_value(curve_points(settings, "col"), p)

    if settings["color_mode"] == "color":
        if caps.color:
            if settings["colors"] == "custom" and len(settings["sequence"]) >= 2:
                rgb, step_bri = color_at(settings, p)
                if step_bri is not None:
                    bri = step_bri
            else:
                rgb, _ = color_at(settings, col)
            return LightCommand(brightness_pct=round(bri, 2), rgb=rgb)
        if caps.color_temp:
            k0, k1 = plain_kelvin(settings)
            return LightCommand(brightness_pct=round(bri, 2), kelvin=round(k0 + (k1 - k0) * col))
        return LightCommand(brightness_pct=round(bri, 2))

    if caps.color_temp or caps.color:
        k0, k1 = settings["kelvin"]
        return LightCommand(brightness_pct=round(bri, 2), kelvin=round(k0 + (k1 - k0) * col))
    return LightCommand(brightness_pct=round(bri, 2))


def to_brightness_255(percent: float, minimum: float = 0) -> int:
    """Convert percent to 0..255; any non-zero percent stays visible."""
    if percent <= 0:
        return 0
    percent = max(percent, minimum)
    return max(1, min(255, math.ceil(percent * 255 / 100)))
