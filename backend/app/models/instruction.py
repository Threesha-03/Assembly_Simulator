"""
instruction.py — Instruction data model.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class InstructionLine:
    text: str
    label: Optional[str] = None


@dataclass
class InstructionMemoryCell:
    address: int
    label: str
    instruction: str
