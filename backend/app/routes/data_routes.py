"""
data_routes.py — Variable (data memory) queries.
These are read-only after load; mutations go through /api/instructions/load.
"""

from fastapi import APIRouter
from app.core.app_state import engine

router = APIRouter()


@router.get("/variables")
async def get_variables():
    """Return the current data memory (variables) as a list."""
    return engine.get_state()["data_memory"]
