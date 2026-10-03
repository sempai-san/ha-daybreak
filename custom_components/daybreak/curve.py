"""Sunrise curve: brightness and colour temperature over the sunrise."""

from __future__ import annotations

from dataclasses import dataclass
import itertools
import math
from typing import Any

from .const import CURVE_CUSTOM, CURVE_LINEAR


@dataclass(frozen=True, slots=True)
class LightLevel:
    """Light output at one moment of the sunrise."""

    brightness: float  # percent, 0-100
    kelvin: int | None


def _ease(curve: str, x: float) -> float:
    if curve == CURVE_LINEAR:
        return x
    # "smooth": slow start, faster later. The eye perceives brightness roughly
    # logarithmically, so a quadratic-ish ramp feels linear when waking up.
    return x * x * (3 - 2 * x) * 0.4 + x * x * 0.6


def _custom(points: list[dict[str, Any]], x: float, fallback_kelvin: int | None):
    if x <= points[0]["t"]:
        return points[0]["brightness"], points[0].get("kelvin") or fallback_kelvin
    for left, right in itertools.pairwise(points):
        if x <= right["t"]:
            span = right["t"] - left["t"]
            ratio = 0.0 if span <= 0 else (x - left["t"]) / span
            bri = left["brightness"] + (right["brightness"] - left["brightness"]) * ratio
            lk, rk = left.get("kelvin"), right.get("kelvin")
            kelvin = lk + (rk - lk) * ratio if lk and rk else lk or rk or fallback_kelvin
            return bri, kelvin
    last = points[-1]
    return last["brightness"], last.get("kelvin") or fallback_kelvin


def level_at(light: dict[str, Any], progress: float) -> LightLevel:
    """Light level at ``progress`` (0 = sunrise start, 1 = alarm time)."""
    x = min(1.0, max(0.0, progress))
    use_ct = light.get("use_color_temp", True)
    start_k, end_k = light["start_kelvin"], light["end_kelvin"]

    if light["curve"] == CURVE_CUSTOM and len(light.get("points") or []) >= 2:
        bri, kelvin = _custom(light["points"], x, end_k if use_ct else None)
    else:
        eased = _ease(light["curve"], x)
        start_b, end_b = light["start_brightness"], light["end_brightness"]
        bri = start_b + (end_b - start_b) * eased
        # Colour temperature follows the plain progress: warm early, cool late.
        kelvin = start_k + (end_k - start_k) * x

    return LightLevel(
        brightness=round(bri, 2),
        kelvin=round(kelvin) if use_ct and kelvin else None,
    )


def to_brightness_255(percent: float) -> int:
    """Convert percent to 1..255; any non-zero percent stays visible."""
    if percent <= 0:
        return 0
    return max(1, min(255, math.ceil(percent * 255 / 100)))
