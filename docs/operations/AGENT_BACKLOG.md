# Agent Backlog (Parallel)

## A0 Orchestrator
- [ ] Track cross-agent dependencies daily.
- [ ] Keep integration branch green.
- [ ] Approve merge only on green role matrix.

## A1 Platform/CI
- [x] Repair CI command set and Prisma generation.
- [x] Add dedicated role E2E workflow.
- [ ] Add branch protection rule requiring role workflow success.

## A2 Auth/RBAC
- [x] Verify middleware role-route map coverage.
- [x] Ensure seeded login credentials are valid (bcrypt seed hash).
- [ ] Add API auth/roles contract test expansion.

## A3 Student
- [x] Add student role route validation in Playwright suite.
- [ ] Expand to assignments/progress completion path.

## A4 Teacher
- [x] Add teacher role route validation in Playwright suite.
- [ ] Expand to create lesson/assignment end-to-end flow.

## A5 Parent
- [x] Add parent role route validation in Playwright suite.
- [ ] Expand to student progress visibility flow.

## A6 Admin
- [x] Add admin role route validation in Playwright suite.
- [ ] Expand to user-management CRUD validation.

## A7 Data
- [x] Ensure deterministic seeded users per role.
- [ ] Add minimal migration-check guard in CI.

## A8 Observability/Security
- [x] Keep Snyk scan in CI when token exists.
- [ ] Add request logging and health endpoint assertions to E2E smoke.
