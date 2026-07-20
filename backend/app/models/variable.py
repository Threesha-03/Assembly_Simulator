"""
variable.py — Variable data model.
"""

from dataclasses import dataclass
from typing import Literal

DataType = Literal["int", "float", "double", "boolean"]

TYPE_BYTE_SIZE: dict[str, int] = {
    "int": 4,
    "float": 4,
    "double": 8,
    "boolean": 1,
}


@dataclass
class Variable:
    name: str
    type: DataType
    initial_value: int = 0
