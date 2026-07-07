"""
register.py — CPU Register model.
"""

from dataclasses import dataclass


GENERAL_PURPOSE_REGISTERS = ["R1", "R2", "R3", "R4", "R5", "R6"]


@dataclass
class Register:
    name: str
    value: int = 0
