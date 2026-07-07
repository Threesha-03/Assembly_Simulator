"""
variable.py — Variable data model.
"""

from dataclasses import dataclass, field
from typing import Literal

DataType = Literal["BYTE", "WORD", "DWORD", "QWORD"]

TYPE_BYTE_SIZE: dict[str, int] = {
    "BYTE": 1,
    "WORD": 2,
    "DWORD": 4,
    "QWORD": 8,
}


@dataclass
class Variable:
    name: str
    type: DataType
    initial_value: int = 0
