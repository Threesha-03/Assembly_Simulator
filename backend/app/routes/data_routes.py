"""
data_routes.py — API routes for data/variable operations.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/variables")
async def get_variables():
    """Retrieve all declared variables."""
    return []


@router.post("/variables")
async def create_variable(payload: dict):
    """Create a new variable."""
    return {"id": 1, **payload}


@router.put("/variables/{var_id}")
async def update_variable(var_id: int, payload: dict):
    """Update an existing variable."""
    return {"id": var_id, **payload}


@router.delete("/variables/{var_id}")
async def delete_variable(var_id: int):
    """Delete a variable."""
    return {"deleted": var_id}
