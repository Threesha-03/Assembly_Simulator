"""
memory_routes.py — Memory state queries.
"""

from fastapi import APIRouter
from app.core.app_state import engine

router = APIRouter()


@router.get("/state")
async def get_memory_state():
    """Return both data + instruction memory."""
    state = engine.get_state()
    return {
        "data_memory": state["data_memory"],
        "instruction_memory": state["instruction_memory"],
    }


@router.get("/data")
async def get_data_memory():
    """Return data memory cells."""
    return engine.get_state()["data_memory"]


@router.get("/instructions")
async def get_instruction_memory():
    """Return instruction memory cells."""
    return engine.get_state()["instruction_memory"]
