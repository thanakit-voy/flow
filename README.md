# Flow

An Nx monorepo containing Angular micro-frontend applications and NestJS backend services.

## Project Structure

```
flow/
├── apps/
│   ├── frontend/
│   │   ├── shell/          Angular host app (Module Federation) — port 4200
│   │   └── dashboard/      Angular remote app                  — port 4201
│   └── backend/
│       ├── api-gateway/    NestJS API Gateway                  — port 3000
│       └── user-service/   NestJS User Service                 — port 3001
└── libs/
    └── shared/
        ├── ui/             Angular UI component library
        ├── data-access/    Data access library
        └── util/           Utility library
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8

```sh
npm install -g pnpm
```

## Setup

Install dependencies:

```sh
pnpm install
```

## Running the Applications

### Frontend (Angular + Module Federation)

Run the shell host and dashboard remote together:

```sh
pnpm nx serve shell
```

The shell will automatically start the dashboard remote as a dependency.

| App       | URL                   |
|-----------|-----------------------|
| Shell     | http://localhost:4200 |
| Dashboard | http://localhost:4201 |

### Backend (NestJS)

Run each service individually:

```sh
# API Gateway — http://localhost:3000/api
pnpm nx serve api-gateway

# User Service — http://localhost:3001/users
pnpm nx serve user-service
```

### Run Everything

```sh
pnpm nx run-many -t serve --all --parallel
```

## Testing

Run unit tests for all projects:

```sh
pnpm nx run-many -t test --all
```

Run tests for a specific project:

```sh
pnpm nx test api-gateway
pnpm nx test shell
```

Run E2E tests:

```sh
pnpm nx e2e api-gateway-e2e
pnpm nx e2e shell-e2e
```

## Building

Build all projects:

```sh
pnpm nx run-many -t build --all
```

Build a specific project:

```sh
pnpm nx build shell
pnpm nx build api-gateway
```

## Linting

```sh
pnpm nx run-many -t lint --all
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm nx graph` | Visualize project dependency graph |
| `pnpm nx affected -t test` | Run tests only on affected projects |
| `pnpm nx affected -t build` | Build only affected projects |
| `pnpm nx list` | List all installed Nx plugins |
