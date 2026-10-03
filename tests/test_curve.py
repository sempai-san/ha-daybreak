"""Tests for the sunrise curve."""

from custom_components.daybreak.curve import level_at, to_brightness_255
from custom_components.daybreak.models import validate_alarm


def _light(**kwargs):
    return validate_alarm({"light": kwargs})["light"]


def test_linear_endpoints():
    light = _light(curve="linear", start_brightness=1, end_brightness=100)
    assert level_at(light, 0).brightness == 1
    assert level_at(light, 0.5).brightness == 50.5
    assert level_at(light, 1).brightness == 100
    assert level_at(light, 1).kelvin == 4000
    assert level_at(light, 0).kelvin == 2200


def test_smooth_is_monotonic_and_slow_start():
    light = _light(curve="smooth")
    values = [level_at(light, i / 20).brightness for i in range(21)]
    assert values == sorted(values)
    assert values[10] < 50


def test_custom_points():
    light = _light(
        curve="custom",
        points=[
            {"t": 0, "brightness": 1, "kelvin": 2000},
            {"t": 0.66, "brightness": 30, "kelvin": 2700},
            {"t": 1, "brightness": 100, "kelvin": 4000},
        ],
    )
    assert level_at(light, 0.33).brightness == 15.5
    assert level_at(light, 1).kelvin == 4000


def test_no_color_temp():
    light = _light(use_color_temp=False)
    assert level_at(light, 0.5).kelvin is None


def test_brightness_conversion():
    assert to_brightness_255(0) == 0
    assert to_brightness_255(0.1) == 1
    assert to_brightness_255(100) == 255
