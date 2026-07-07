"""
cpu.py — CPU state model.
"""

from dataclasses import dataclass, field
from typing import Optional
from app.models.register import Register, GENERAL_PURPOSE_REGISTERS


@dataclass
class CPUState:
    registers: dict[str, Register] = field(
        default_factory=lambda: {name: Register(name=name) for name in GENERAL_PURPOSE_REGISTERS}
    )
    accumulator: int = 0
    program_counter: int = 0x1000
    instruction_register: Optional[str] = None
    is_halted: bool = False
