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

## Git Workflow

### Branch Naming

Branches must follow this pattern:

| Pattern | Example | Use case |
|---------|---------|----------|
| `feature/*` | `feature/add-login` | New features |
| `bugfix/*` | `bugfix/fix-auth-token` | Bug fixes |
| `hotfix/*` | `hotfix/critical-crash` | Urgent production fixes |
| `release/*` | `release/1.2.0` | Release preparation |
| `develop` | `develop` | Integration branch |

Direct commits and pushes to `main` / `master` are blocked.

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no logic change |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD configuration |
| `build` | Build system changes |
| `revert` | Reverting a commit |

**Scopes** (optional, must match project name):

`api-gateway` · `user-service` · `shell` · `dashboard` · `ui` · `data-access` · `util` · `workspace` · `deps` · `ci`

**Examples:**

```
feat(api-gateway): add user authentication endpoint
fix(shell): resolve lazy loading issue on dashboard route
chore(deps): upgrade angular to 21.2.0
docs(workspace): update README setup instructions
refactor(ui): simplify button component props
```

### Git Hooks (Husky)

Hooks run automatically — no manual setup needed after `pnpm install`.

| Hook | Checks |
|------|--------|
| `commit-msg` | Validate commit message format (commitlint) |
| `pre-commit` | Block sensitive files (`.env`, `.pem`, `.key`) · Validate branch name · Lint · Test (affected only) |
| `pre-push` | Validate branch name · Build (affected only) |
| `pre-rebase` | Block rebase on protected branches |
| `pre-merge-commit` | Block direct merge into protected branches |

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm nx graph` | Visualize project dependency graph |
| `pnpm nx affected -t test` | Run tests only on affected projects |
| `pnpm nx affected -t build` | Build only affected projects |
| `pnpm nx affected -t lint` | Lint only affected projects |
| `pnpm nx list` | List all installed Nx plugins |
