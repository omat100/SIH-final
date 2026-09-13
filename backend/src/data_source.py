"""Tracks which source is currently feeding live sensor_data events:
"generator" (random simulated data) or "esp32" (real hardware over serial)."""

_current_source = "generator"


def set_source(source):
    global _current_source
    _current_source = source


def get_source():
    return _current_source
