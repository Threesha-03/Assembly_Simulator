"""
helpers.py — General utility functions.
"""


def format_address(address: int) -> str:
    """Format a numeric address as '1000H' style."""
    return f"{address:04X}H"


def parse_hex_address(label: str) -> int:
    """Parse '1000H' style address back to int. Returns 0 on failure."""
    try:
        return int(label.rstrip("H"), 16)
    except (ValueError, AttributeError):
        return 0


def clamp(value: int, min_val: int, max_val: int) -> int:
    """Clamp a value between min and max."""
    return max(min_val, min(max_val, value))
