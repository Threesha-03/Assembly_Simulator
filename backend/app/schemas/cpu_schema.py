"""
cpu_schema.py — Pydantic schemas for CPU state API responses.
"""

from pydantic import BaseModel
from typing import Dict, Optional


class CPUStateResponse(BaseModel):
    registers: Dict[str, int]
    accumulator: int
    program_counter: str
    instruction_register: Optional[str]
    is_halted: bool
