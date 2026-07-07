# API Documentation

Base URL: `http://localhost:8000/api`

## Data Endpoints

| Method | Path                   | Description          |
|--------|------------------------|----------------------|
| GET    | /data/variables        | List all variables   |
| POST   | /data/variables        | Create variable      |
| PUT    | /data/variables/{id}   | Update variable      |
| DELETE | /data/variables/{id}   | Delete variable      |

## Instruction Endpoints

| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| GET    | /instructions/          | List instructions        |
| POST   | /instructions/load      | Load a full program      |

## Memory Endpoints

| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| GET    | /memory/state           | Full memory state        |
| GET    | /memory/data            | Data memory cells        |
| GET    | /memory/instructions    | Instruction memory cells |

## CPU Endpoints

| Method | Path       | Description              |
|--------|------------|--------------------------|
| GET    | /cpu/state | Current CPU state        |
| POST   | /cpu/start | Begin execution          |
| POST   | /cpu/step  | Execute one instruction  |
| POST   | /cpu/reset | Reset to initial state   |

## Interactive Docs

Visit `http://localhost:8000/docs` for the auto-generated Swagger UI.
