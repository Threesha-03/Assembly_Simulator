"""
instruction_schema.py — Pydantic schemas for instruction API payloads.
"""

from pydantic import BaseModel
from typing import Optional, List


class InstructionLineCreate(BaseModel):
    label: Optional[str] = None
    text: str


class LoadProgramRequest(BaseModel):
    variables: List[dict]
    instruction_lines: List[InstructionLineCreate]


class InstructionMemoryCellResponse(BaseModel):
    address: int
    address_label: str
    label: str
    instruction: str
