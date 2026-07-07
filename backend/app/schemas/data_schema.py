"""
data_schema.py — Pydantic schemas for data/variable API payloads.
"""

from pydantic import BaseModel
from typing import Literal, Optional

DataType = Literal["BYTE", "WORD", "DWORD", "QWORD"]


class VariableCreate(BaseModel):
    name: str
    type: DataType
    initial_value: int = 0


class VariableResponse(BaseModel):
    id: int
    name: str
    type: DataType
    initial_value: int
    address: Optional[int] = None
    address_label: Optional[str] = None
