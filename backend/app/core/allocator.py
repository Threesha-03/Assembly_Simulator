"""
allocator.py — Address allocation for instruction and data memory.
Mirrors the logic in frontend/src/components/Memory/AddressGenerator.js.
"""

from typing import List
from app.models.variable import Variable, TYPE_BYTE_SIZE
from app.models.instruction import InstructionLine, InstructionMemoryCell
from app.models.memory import DataMemoryCell

INSTRUCTION_MEMORY_BASE = 0x1000


def format_address(address: int) -> str:
    return f"{address:04X}H"


def allocate_instruction_memory(
    lines: List[InstructionLine], base: int = INSTRUCTION_MEMORY_BASE
) -> tuple[List[InstructionMemoryCell], int]:
    """Lay out instructions sequentially from `base`. Returns (cells, next_free_address)."""
    cells = [
        InstructionMemoryCell(
            address=base + i,
            label=line.label or "",
            instruction=line.text,
        )
        for i, line in enumerate(lines)
    ]
    return cells, base + len(lines)


def allocate_data_memory(
    variables: List[Variable], base: int
) -> tuple[List[DataMemoryCell], int]:
    """Lay out variables sequentially starting at `base`. Returns (cells, next_free_address)."""
    cursor = base
    cells: List[DataMemoryCell] = []
    for var in variables:
        cells.append(DataMemoryCell(address=cursor, label=var.name, type=var.type, value=var.initial_value))
        cursor += TYPE_BYTE_SIZE.get(var.type, 1)
    return cells, cursor


def allocate_program_memory(instructions: List[InstructionLine], variables: List[Variable]):
    instr_cells, next_free = allocate_instruction_memory(instructions)
    data_cells, final_addr = allocate_data_memory(variables, next_free)
    return {
        "instruction_memory": instr_cells,
        "data_memory": data_cells,
        "total_bytes_used": final_addr - INSTRUCTION_MEMORY_BASE,
    }
