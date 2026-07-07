"""
data_service.py — Business logic for variable management.
"""

from typing import List
from app.models.variable import Variable, TYPE_BYTE_SIZE


class DataService:
    """Manages the collection of declared program variables."""

    def __init__(self):
        self._variables: List[Variable] = []

    def get_all(self) -> List[Variable]:
        return list(self._variables)

    def add(self, name: str, type: str, initial_value: int = 0) -> Variable:
        var = Variable(name=name, type=type, initial_value=initial_value)
        self._variables.append(var)
        return var

    def remove(self, name: str) -> bool:
        original = len(self._variables)
        self._variables = [v for v in self._variables if v.name != name]
        return len(self._variables) < original

    def clear(self) -> None:
        self._variables.clear()
