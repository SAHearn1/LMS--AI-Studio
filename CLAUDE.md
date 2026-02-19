# CLAUDE.md - RootWork Framework LMS

## Project Summary

RootWork is a trauma-informed K-12 LMS monorepo with three active surfaces:

- Root app: React + Vite visual canvas app
- Web app: Next.js app in `apps/web`
- API app: NestJS app in `apps/api`
- Shared workspace packages in `packages/*`

## Monorepo Layout

```text
apps/
  api/            NestJS REST API
  web/            Next.js frontend
packages/
  config/         Shared ESLint and TypeScript config
  database/       Prisma schema, client generation, seed scripts
  types/          Shared TypeScript types
  ui/             Shared UI component library
components/       Root Vite app components
hooks/            Root Vite app hooks
services/         Root Vite app service integrations
src/              Root Vite app styles/lib
docker/
  development/    docker-compose for local services
  production/     Production Dockerfiles
```

## Package Manager And Tooling

- Package manager: `pnpm` (workspace configured via `pnpm-workspace.yaml`)
- Node: use a modern LTS release compatible with Next.js 16 and NestJS 11
- TypeScript across all apps/packages
- Prisma for database access in `packages/database`

## Common Commands

Run from repository root unless noted.

### Install

```bash
pnpm install
```

### Root App (Vite)

```bash
pnpm dev
pnpm build
pnpm preview
```

### Web App (Next.js)

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
```

### API App (NestJS)

```bash
pnpm --filter api start:dev
pnpm --filter api build
pnpm --filter api lint
pnpm --filter api test
pnpm --filter api test:cov
pnpm --filter api test:e2e
```

### Database (Prisma)

```bash
pnpm --filter @rootwork/database generate
pnpm --filter @rootwork/database migrate
pnpm --filter @rootwork/database migrate:deploy
pnpm --filter @rootwork/database push
pnpm --filter @rootwork/database seed
pnpm --filter @rootwork/database studio
```

### Workspace Checks

```bash
pnpm type-check
pnpm test
```

## Local Development Workflow

1. Install dependencies: `pnpm install`
2. Start local infrastructure when needed: `docker compose -f docker/development/docker-compose.yml up -d`
3. Generate Prisma client: `pnpm --filter @rootwork/database generate`
4. Start services you are working on:
   - Root canvas: `pnpm dev`
   - Web: `pnpm --filter web dev`
   - API: `pnpm --filter api start:dev`

## Git Hooks (Husky)

- `.husky/pre-commit`: runs `pnpm lint-staged`
- `.husky/pre-push`: runs `pnpm type-check` and `pnpm test`

## Code Conventions

- Formatting via Prettier (`.prettierrc`)
- ESLint at root and app-level configs:
  - `eslint.config.js`
  - `apps/web/eslint.config.mjs`
  - `apps/api/eslint.config.mjs`
- Naming patterns in codebase:
  - React components: PascalCase
  - Hooks: `use*` camelCase
  - DTOs/entities in Nest modules follow Nest conventions

## Architecture Notes

### API (`apps/api/src`)

- Feature modules grouped by domain (`auth`, `users`, `learning`, `compliance`, etc.)
- Uses guards/decorators for auth and roles
- Prisma integration via shared database package

### Web (`apps/web/src`)

- Next.js App Router with route groups such as `(auth)` and `(dashboard)`
- Shared utility and state patterns in `src/lib`, `src/stores`, and `src/components`

### Root Canvas App

- Uses Konva/react-konva for visual authoring and lesson composition
- AI helpers and service integrations live in root `services/` and `src/lib/`

## Environment Files

Use app-specific env files as needed:

- Root app: `.env.local`
- Web app: `apps/web/.env.example` as template
- API app: create `apps/api/.env` for local API/database/auth settings

Do not commit secrets.

## Guidance For Claude Sessions

- Prefer minimal, targeted changes in the relevant app/package.
- If changing API contracts, update corresponding web client usage.
- If changing Prisma schema, regenerate client and include migration strategy.
- Run lint/type-check/tests for the touched scope before finishing.
- Keep changes aligned with trauma-informed and accessibility goals described in project docs.
