"""
memory.py — Memory data models.
"""

from dataclasses import dataclass, field
from typing import Optional
from app.models.variable import DataType


@dataclass
class DataMemoryCell:
    address: int
    label: str
    type: DataType
    value: int = 0


@dataclass
class MemorySnapshot:
    data_memory: dict[int, DataMemoryCell] = field(default_factory=dict)
    instruction_memory: dict = field(default_factory=dict)
