"""
memory_schema.py — Pydantic schemas for memory API responses.
"""

from pydantic import BaseModel
from typing import Dict, List


class DataMemoryCellResponse(BaseModel):
    address: int
    address_label: str
    label: str
    type: str
    value: int


class InstructionMemoryCellResponse(BaseModel):
    address: int
    address_label: str
    label: str
    instruction: str


class MemoryStateResponse(BaseModel):
    data_memory: Dict[int, DataMemoryCellResponse]
    instruction_memory: Dict[int, InstructionMemoryCellResponse]
