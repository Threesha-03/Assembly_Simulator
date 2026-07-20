"""
register.py — CPU Register model.
"""

from dataclasses import dataclass


GENERAL_PURPOSE_REGISTERS = [f"R{i}" for i in range(16)]


@dataclass
class Register:
    name: str
    value: int = 0
