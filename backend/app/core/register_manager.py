"""
register_manager.py — Manages CPU general-purpose registers.
"""

from app.models.register import Register, GENERAL_PURPOSE_REGISTERS


class RegisterManager:
    def __init__(self):
        self._registers: dict[str, Register] = {
            name: Register(name=name) for name in GENERAL_PURPOSE_REGISTERS
        }

    def read(self, name: str) -> int:
        reg = self._registers.get(name.upper())
        if reg is None:
            raise ValueError(f"Unknown register: {name}")
        return reg.value

    def write(self, name: str, value: int) -> None:
        reg = self._registers.get(name.upper())
        if reg is None:
            raise ValueError(f"Unknown register: {name}")
        reg.value = value

    def get_all(self) -> dict[str, int]:
        return {name: reg.value for name, reg in self._registers.items()}

    def reset(self) -> None:
        for reg in self._registers.values():
            reg.value = 0
