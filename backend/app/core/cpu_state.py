"""
cpu_state.py — CPU state container with snapshot/restore support.
"""

import copy
from app.models.cpu import CPUState
from app.core.register_manager import RegisterManager


class CPUStateManager:
    """Wraps CPUState with snapshot/restore for time-travel debugging."""

    def __init__(self):
        self.state = CPUState()
        self.register_manager = RegisterManager()
        self._history: list[dict] = []

    def snapshot(self) -> None:
        self._history.append(self._capture())

    def _capture(self) -> dict:
        return {
            "registers": copy.copy(self.register_manager.get_all()),
            "accumulator": self.state.accumulator,
            "program_counter": self.state.program_counter,
            "instruction_register": self.state.instruction_register,
            "is_halted": self.state.is_halted,
        }

    def restore(self) -> bool:
        if not self._history:
            return False
        snap = self._history.pop()
        for name, val in snap["registers"].items():
            self.register_manager.write(name, val)
        self.state.accumulator = snap["accumulator"]
        self.state.program_counter = snap["program_counter"]
        self.state.instruction_register = snap["instruction_register"]
        self.state.is_halted = snap["is_halted"]
        return True

    def reset(self) -> None:
        self.state = CPUState()
        self.register_manager.reset()
        self._history.clear()
