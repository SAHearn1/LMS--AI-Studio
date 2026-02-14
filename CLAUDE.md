# CLAUDE.md - RootWork Framework LMS

## Project Overview

Trauma-informed, healing-centered K-12 Learning Management System. Monorepo with three build targets: a Vite canvas app (root), a Next.js web app (`apps/web`), and a NestJS API (`apps/api`), plus shared packages.

## Repository Structure

```
├── apps/
│   ├── api/              # NestJS REST API (port 3001)
│   └── web/              # Next.js 16 frontend (port 3000)
├── packages/
│   ├── database/         # Prisma schema, migrations, seed
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Shared Radix UI component library
│   └── config/           # Shared ESLint/TS configs
├── components/           # Root Vite app React components
├── hooks/                # Root Vite app custom hooks
├── services/             # Root Vite app services (Gemini AI)
├── stores/               # Root Vite app Zustand stores
├── utils/                # Root Vite app utilities
├── docker/
│   ├── development/      # docker-compose (Postgres, Redis, Mailhog)
│   └── production/       # Multi-stage Dockerfiles
└── .github/workflows/    # CI/CD (ci.yml, deploy-staging, deploy-production)
```

## Quick Reference - Commands

### Install & Setup

```bash
pnpm install
pnpm --filter database generate     # Generate Prisma client (REQUIRED before builds)
docker compose -f docker/development/docker-compose.yml up -d  # Start Postgres/Redis/Mailhog
pnpm --filter database migrate dev  # Run database migrations
pnpm --filter database seed         # Seed demo data
```

### Build

```bash
pnpm build                          # Root Vite app
pnpm --filter web build             # Next.js web app
pnpm --filter api build             # NestJS API (nest build)
```

### Dev Servers

```bash
pnpm dev                            # Root Vite app (port 5173)
pnpm --filter web dev               # Next.js dev server (port 3000)
pnpm --filter api start:dev         # NestJS watch mode (port 3001)
```

### Lint & Type Check

```bash
pnpm type-check                     # Root tsc --noEmit (checks everything)
pnpm --filter api lint              # API ESLint with auto-fix
pnpm --filter web lint              # Web ESLint
```

### Test

```bash
pnpm --filter api test              # API unit tests (Jest)
pnpm --filter api test:cov          # With coverage
pnpm --filter api test:e2e          # E2E tests
```

### Database

```bash
pnpm --filter database generate     # Generate Prisma client
pnpm --filter database migrate dev  # Create + apply migration
pnpm --filter database migrate:deploy  # Apply migrations (prod)
pnpm --filter database push         # Push schema without migration
pnpm --filter database studio       # Prisma Studio GUI
pnpm --filter database seed         # Seed data
```

## Git Hooks (Husky)

- **pre-commit**: Runs `pnpm lint-staged` (ESLint --fix + Prettier on staged files)
- **pre-push**: Runs `pnpm type-check` then `pnpm test`

Both hooks have deprecated husky v9 shim lines that should be removed before husky v10.

## Code Style

### Formatting (Prettier)

- Single quotes, semicolons, trailing commas (es5)
- 2-space indent, 80 char print width, LF line endings
- Arrow parens: avoid

### Linting (ESLint - flat config)

- **Root** (`eslint.config.js`): TypeScript + React + React Hooks rules
  - `@typescript-eslint/no-unused-vars`: warn (underscore-prefixed args ignored)
  - `@typescript-eslint/no-explicit-any`: warn
  - `react-hooks/rules-of-hooks`: error
  - `no-console`: off
- **API** (`apps/api/eslint.config.mjs`): TypeScript + Prettier integration
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-floating-promises`: warn
  - `prettier/prettier`: error

### Naming Conventions

| Entity           | Convention                   | Example                                      |
| ---------------- | ---------------------------- | -------------------------------------------- |
| Components       | PascalCase files             | `Sidebar.tsx`, `Button.tsx`                  |
| Hooks            | camelCase with `use` prefix  | `useCanvasState.ts`                          |
| Utils/services   | camelCase files              | `cn.ts`, `geminiService.ts`                  |
| Types/Interfaces | PascalCase                   | `User`, `ButtonProps`                        |
| Enums            | PascalCase with UPPER values | `UserRole.ADMIN`                             |
| Constants        | UPPER_SNAKE_CASE             | `ROLES_KEY`                                  |
| NestJS files     | kebab-case                   | `auth.controller.ts`, `create-course.dto.ts` |
| DB schema fields | snake_case                   | `first_name`, `password_hash`                |

### Import Order

1. External packages (`react`, `@nestjs/common`, etc.)
2. Internal packages (`@rootwork/database`, `@/types`)
3. Relative imports (`./components`, `../utils`)

## Architecture Patterns

### NestJS API (`apps/api/src/`)

- **Module pattern**: Each feature is a self-contained module with controller, service, DTOs, entities
- **Auth**: Global `JwtAuthGuard` (bypass with `@Public()` decorator), `RolesGuard` for RBAC
- **Roles**: `@Roles('ADMIN', 'TEACHER')` decorator for role-based access
- **Database**: `PrismaService` injected via `PrismaModule` (global)
- **Errors**: Use NestJS exceptions (`NotFoundException`, `UnauthorizedException`, `ConflictException`, etc.)
- **API docs**: Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiBearerAuth`)
- **Config**: `@nestjs/config` with `registerAs()` pattern (files in `src/config/`)

Module structure:

```
modules/[feature]/
├── [feature].module.ts
├── [feature].controller.ts
├── [feature].service.ts
├── dto/
│   ├── create-[feature].dto.ts
│   └── update-[feature].dto.ts
└── entities/           # (optional)
```

Existing modules: `ai`, `analytics`, `auth`, `communications`, `compliance`, `curriculum`, `garden`, `integrations`, `learning` (assignments/courses/lessons), `users`

### Next.js Web (`apps/web/src/`)

- **App Router** with route groups: `(auth)` for login/signup, `(dashboard)` for role-based dashboards
- **Auth**: NextAuth.js v4 with CredentialsProvider
- **State**: Zustand with `persist` middleware (localStorage)
- **API client**: Class-based `ApiClient` with token management, returns `{ data?, error?, status }`
- **Middleware**: Route protection + role-based redirects (`src/middleware.ts`)
- **Components**: `'use client'` directive for client components, `React.forwardRef` for compound components
- **Path alias**: `@/*` maps to `./src/*`

### Root Vite App

- **Canvas**: Konva.js + react-konva for visual learning environment
- **AI**: Google Generative AI (Gemini) integration
- **State**: Zustand with Immer middleware
- **Path alias**: `@/*` maps to `./*`

### Shared Packages

- **`@rootwork/database`**: Prisma client re-export, singleton instance, schema at `prisma/schema.prisma`
- **`@rootwork/types`**: Shared type definitions (User, Course, Lesson, IEP, Garden, etc.)
- **`@rootwork/ui`**: Radix UI + CVA + Tailwind component library

## Database (Prisma + PostgreSQL)

- Schema: `packages/database/prisma/schema.prisma`
- Generated client output: `packages/database/generated/prisma`
- Provider: PostgreSQL
- Key models: User, Curriculum, Course, Lesson, Assignment, IEP, Garden
- Roles enum: `STUDENT`, `TEACHER`, `ADMIN`, `PARENT`

**Important**: The Prisma client must be generated before building any app. Run `pnpm --filter database generate` after install and after any schema changes.

## Environment Variables

### API (`apps/api/.env`)

```
DATABASE_URL=postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms
JWT_SECRET=<secret>
JWT_EXPIRES_IN=15m
NODE_ENV=development
PORT=3001
BCRYPT_SALT_ROUNDS=12
```

### Web (`apps/web/.env`)

```
DATABASE_URL="prisma+postgres://..."
DIRECT_URL="postgres://..."
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

## CI/CD

- **ci.yml**: Runs on push/PR to main/develop. Steps: install, lint, type-check, test, build, Snyk security scan
- **deploy-staging.yml**: Push to develop triggers Vercel (web) + Railway (api) deploy
- **deploy-production.yml**: Push to main triggers Vercel --prod + AWS ECS (placeholder)

## Testing

- **API tests**: Jest with `ts-jest`. Pattern: `*.spec.ts` (unit), `*.e2e-spec.ts` (e2e)
- **Jest config**: Inline in `apps/api/package.json`, rootDir: `src`, testEnvironment: `node`
- **Root/Web tests**: Not configured yet

## Known Build Issues

- Prisma client must be explicitly generated (`pnpm --filter database generate`) — the `pnpm install` step skips build scripts by default (pnpm `approve-builds` security)
- `packages/ui` has missing peer dependencies (Radix UI, lucide-react, CVA, storybook)
- API has missing Swagger decorator imports in some controllers (compliance, users)
- Root `type-check` aggregates errors from all workspaces; individual app builds may succeed independently
