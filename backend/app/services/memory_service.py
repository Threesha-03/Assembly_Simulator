"""
memory_service.py — Business logic for memory allocation and access.
Mirrors the allocation logic in frontend/src/components/Memory/AddressGenerator.js.
"""

from typing import List, Dict
from app.models.memory import DataMemoryCell, MemorySnapshot
from app.models.instruction import InstructionLine, InstructionMemoryCell
from app.models.variable import Variable, TYPE_BYTE_SIZE

INSTRUCTION_MEMORY_BASE = 0x1000


def format_address(address: int) -> str:
    return f"{address:04X}H"


class MemoryService:
    """Allocates and manages data + instruction memory."""

    def __init__(self):
        self.data_memory: Dict[int, DataMemoryCell] = {}
        self.instruction_memory: Dict[int, InstructionMemoryCell] = {}

    def allocate(self, instructions: List[InstructionLine], variables: List[Variable]) -> None:
        """Compute addresses for instructions then variables (instructions first)."""
        # Instruction memory
        self.instruction_memory = {}
        for i, line in enumerate(instructions):
            addr = INSTRUCTION_MEMORY_BASE + i
            self.instruction_memory[addr] = InstructionMemoryCell(
                address=addr,
                label=line.label or "",
                instruction=line.text,
            )

        # Data memory starts right after last instruction
        cursor = INSTRUCTION_MEMORY_BASE + len(instructions)
        self.data_memory = {}
        for var in variables:
            cell = DataMemoryCell(
                address=cursor,
                label=var.name,
                type=var.type,
                value=var.initial_value,
            )
            self.data_memory[cursor] = cell
            cursor += TYPE_BYTE_SIZE.get(var.type, 1)

    def write(self, address: int, value: int) -> bool:
        if address in self.data_memory:
            self.data_memory[address].value = value
            return True
        return False

    def read(self, address: int) -> int | None:
        cell = self.data_memory.get(address)
        return cell.value if cell else None

    def snapshot(self) -> MemorySnapshot:
        import copy
        return MemorySnapshot(
            data_memory=copy.deepcopy(self.data_memory),
            instruction_memory=copy.deepcopy(self.instruction_memory),
        )

    def restore(self, snapshot: MemorySnapshot) -> None:
        self.data_memory = snapshot.data_memory
        self.instruction_memory = snapshot.instruction_memory
