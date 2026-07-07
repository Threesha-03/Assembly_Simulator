"""
memory_routes.py — API routes for memory state.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/state")
async def get_memory_state():
    """Return the full memory state (data + instruction)."""
    return {"data_memory": {}, "instruction_memory": {}}


@router.get("/data")
async def get_data_memory():
    """Return data memory cells."""
    return []


@router.get("/instructions")
async def get_instruction_memory():
    """Return instruction memory cells."""
    return []
