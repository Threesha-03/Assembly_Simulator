"""
instruction_service.py — Business logic for instruction management.
"""

from typing import List, Optional
from app.models.instruction import InstructionLine


class InstructionService:
    """Manages the raw instruction list before memory allocation."""

    def __init__(self):
        self._instructions: List[InstructionLine] = []

    def get_all(self) -> List[InstructionLine]:
        return list(self._instructions)

    def load(self, lines: List[dict]) -> List[InstructionLine]:
        """Replace the current instruction list with a new one."""
        self._instructions = [
            InstructionLine(text=l["text"], label=l.get("label"))
            for l in lines
        ]
        return self._instructions

    def clear(self) -> None:
        self._instructions.clear()
