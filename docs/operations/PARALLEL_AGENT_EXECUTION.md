# Parallel Agent Execution Plan

## Objective
Deliver full role-based operability for `ADMIN`, `TEACHER`, `STUDENT`, and `PARENT` with end-to-end validation and release-ready quality gates.

## Agent Tracks (Run In Parallel)
- `A0-Orchestrator`: dependency tracking, integration sequencing, release decision.
- `A1-Platform-CI`: CI reliability, environment reproducibility, quality gates.
- `A2-Auth-RBAC`: role enforcement across web middleware and API guards/decorators.
- `A3-Student`: student flows and edge-case handling.
- `A4-Teacher`: teacher authoring/management flows and permissions.
- `A5-Parent`: parent visibility flows and restricted actions.
- `A6-Admin`: governance flows and privileged operations.
- `A7-Data`: Prisma schema, deterministic seeds, migration integrity.
- `A8-Observability-Security`: security scans, logs, health checks, and basic performance smoke.

## Execution Order
1. Stabilize platform/auth/data (`A1`, `A2`, `A7`).
2. Execute role tracks in parallel (`A3`-`A6`) with shared seeded fixtures.
3. Run continuous validation (`A8`) during role implementation.
4. Merge via orchestrator integration branch only after role suites pass.
5. Promote to release only after two consecutive all-green full runs.

## Definition of Done Per Role
- Login succeeds with seeded credentials.
- Role lands on valid dashboard and sees role-specific navigation.
- Allowed routes/functions succeed end-to-end.
- Disallowed routes/functions reject with enforced redirect or authorization error.
- Regression checks for touched surfaces are green in CI.

## Command Backbone
- `pnpm --filter @rootwork/database generate`
- `pnpm --filter @rootwork/database push`
- `pnpm --filter @rootwork/database seed`
- `pnpm --filter web e2e:role`
- `pnpm --filter api test:e2e`

## Current Status
- Role E2E framework added: `apps/web/playwright.config.ts`, `apps/web/tests/e2e/roles.spec.ts`
- Dedicated workflow added: `.github/workflows/role-e2e.yml`
- CI quality workflow updated: `.github/workflows/ci.yml`
- Seed hashing fixed for valid role login credentials: `packages/database/prisma/seed.ts`
