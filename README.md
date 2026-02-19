# Project Name

## Getting Started

### Development

To start the development servers for both the backend and frontend locally (without Docker), run:

```bash
make dev
```

This will run `yarn workspace @bg-teach/backend dev` and `yarn workspace @bg-teach/frontend dev` in the background.

### Development with Docker

To start the backend, frontend, and MongoDB services using Docker Compose, run:

```bash
docker-compose up
```

This will build and start all services defined in `docker-compose.yml`.

### Cleaning Generated Files

To remove generated files and directories (like `node_modules`, `.next`, and `out`), run:

```bash
make clean
```
