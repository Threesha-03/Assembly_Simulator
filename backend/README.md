# Backend — Assembly Simulator

FastAPI backend for the Assembly Program Execution Simulator.

## Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs available at http://localhost:8000/docs

## Architecture

```
CPU Engine (execution_engine.py)
    ↓
Memory Manager (memory_manager.py)
    ↓
Redux Toolkit (via API / WebSocket)
    ↓
Memory Panel (React frontend)
```
