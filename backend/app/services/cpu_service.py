"""
cpu_service.py — Business logic for CPU state and execution control.
"""

from app.models.cpu import CPUState
from app.models.register import GENERAL_PURPOSE_REGISTERS
from app.services.memory_service import MemoryService, format_address


class CPUService:
    """Manages CPU registers and orchestrates step execution."""

    def __init__(self, memory_service: MemoryService):
        self.memory = memory_service
        self.state = CPUState()

    def reset(self) -> None:
        self.state = CPUState()

    def get_state(self) -> dict:
        return {
            "registers": {name: reg.value for name, reg in self.state.registers.items()},
            "accumulator": self.state.accumulator,
            "program_counter": format_address(self.state.program_counter),
            "instruction_register": self.state.instruction_register,
            "is_halted": self.state.is_halted,
        }

    def step(self) -> dict:
        """Execute the next instruction. Stub — wire to execution_engine.py."""
        if self.state.is_halted:
            return {"status": "halted"}

        # Fetch instruction at PC
        cell = self.memory.instruction_memory.get(self.state.program_counter)
        if not cell:
            self.state.is_halted = True
            return {"status": "halted", "reason": "No instruction at PC"}

        self.state.instruction_register = cell.instruction
        # Advance PC (basic fetch-execute cycle stub)
        self.state.program_counter += 1

        return {
            "status": "stepped",
            "instruction": cell.instruction,
            "program_counter": format_address(self.state.program_counter),
        }
