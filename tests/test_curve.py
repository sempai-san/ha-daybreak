"""Tests for the light curves."""

from custom_components.daybreak.curve import (
    Capabilities,
    command_at,
    curve_value,
    to_brightness_255,
)
from custom_components.daybreak.models import LIGHT_SETTINGS_SCHEMA

CT = Capabilities(color_temp=True)
COLOR = Capabilities(color_temp=True, color=True)
DIM = Capabilities()


def _settings(**kwargs):
    return LIGHT_SETTINGS_SCHEMA(kwargs)


def test_linear_endpoints():
    s = _settings(curve="linear", brightness=[0, 100], kelvin=[2000, 4000])
    assert command_at(s, 0, CT).brightness_pct == 0
    assert command_at(s, 0, CT).kelvin == 2000
    assert command_at(s, 1, CT).brightness_pct == 100
    assert command_at(s, 1, CT).kelvin == 4000
    assert command_at(s, 0.5, CT).kelvin == 3000


def test_natural_starts_slowly():
    s = _settings(curve="natural", brightness=[0, 100])
    assert command_at(s, 0.5, CT).brightness_pct < 20
    assert command_at(s, 1, CT).brightness_pct == 100


def test_custom_points_and_separate_colour_curve():
    s = _settings(
        curve="custom",
        points=[{"t": 0, "v": 0}, {"t": 0.5, "v": 1}, {"t": 1, "v": 1}],
        separate=True,
        points_color=[{"t": 0, "v": 0}, {"t": 1, "v": 0}],
        brightness=[0, 100],
        kelvin=[2000, 4000],
    )
    cmd = command_at(s, 0.5, CT)
    assert cmd.brightness_pct == 100
    assert cmd.kelvin == 2000


def test_curve_is_monotone_between_points():
    points = [(0.0, 0.0), (0.3, 0.6), (1.0, 1.0)]
    values = [curve_value(points, i / 50) for i in range(51)]
    assert values == sorted(values)


def test_colour_mode_per_capability():
    s = _settings(color_mode="color", colors="sunrise", curve="linear")
    assert command_at(s, 0.5, COLOR).rgb is not None
    # Lamps without colour get the matching colour temperature.
    plain = command_at(s, 0.5, CT)
    assert plain.rgb is None and 1800 <= plain.kelvin <= 3600
    assert command_at(s, 0.5, DIM).kelvin is None


def test_custom_sequence_sets_brightness():
    s = _settings(
        color_mode="color",
        colors="custom",
        sequence=[
            {"color": "#ff0000", "brightness": 10, "minutes": 5},
            {"color": "#ffffff", "brightness": 90, "minutes": 5},
        ],
    )
    first = command_at(s, 0, COLOR)
    assert first.rgb == (255, 0, 0) and first.brightness_pct == 10
    assert command_at(s, 1, COLOR).brightness_pct == 90


def test_to_brightness_255():
    assert to_brightness_255(0) == 0
    assert to_brightness_255(0.1) == 1
    assert to_brightness_255(100) == 255
    assert to_brightness_255(0.5, minimum=10) == 26
