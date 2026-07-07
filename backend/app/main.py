"""
main.py — FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import data_routes, instruction_routes, memory_routes, cpu_routes
from app.config.settings import settings

app = FastAPI(
    title="Assembly Program Execution Simulator API",
    version="1.0.0",
    description="Backend API for the assembly language simulator",
)

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(data_routes.router, prefix="/api/data", tags=["data"])
app.include_router(instruction_routes.router, prefix="/api/instructions", tags=["instructions"])
app.include_router(memory_routes.router, prefix="/api/memory", tags=["memory"])
app.include_router(cpu_routes.router, prefix="/api/cpu", tags=["cpu"])


@app.get("/")
def root():
    return {"message": "Assembly Simulator API is running"}
