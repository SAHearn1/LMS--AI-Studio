# AGENTS.md — LMS--AI-Studio

> Ecosystem Operating Standard v3.0 | Governance Hub: `SAHearn1/rwfw-agent-governance`

## Rule 1 — Deterministic Debugging
Never guess. Read the actual file, the actual error, the actual log. Reproduce before fixing.

## Rule 2 — First-Failing-Boundary
Identify the exact layer where correct input produces incorrect output. Do not fix symptoms above the boundary.

## Rule 3 — Smallest-Viable-Fix
Change the minimum code required. No refactors, no dependency upgrades, no style changes bundled with bug fixes.

## Rule 4 — Verify Before Complete
Run lint, type-check, and relevant tests before marking any task done. No exceptions.

## Rule 5 — Governance-Only Write Scope
This operating system governs files in `.github/`, `docs/`, `AGENTS.md`, `repo.intelligence.yml` only. Never touch application source without explicit human instruction.

## Rule 6 — Swarm Safety
One agent writes to one file at a time. No parallel writes to the same file. Announce intent before long-running operations.

## Rule 7 — Handoff Protocol
Before ending a session, write current state to `docs/INCIDENTS.md` or the execution ledger. Leave no ambiguous state.

## Rule 8 — Git Safety
- Never `git add .`
- Never force-push protected branches
- Always work on `agent-operating-system-install` or a named feature branch
- Commit message format: verb + noun (e.g., `Fix Konva canvas render on resize`)

---

## Stack Reference
- **Framework:** React 19 + Vite
- **Canvas:** Konva.js (React Konva)
- **AI:** Google Gemini SDK
- **Language:** TypeScript
- **Deployment:** TODO — requires human verification

## Governance Hub
See `SAHearn1/rwfw-agent-governance` for full playbooks, registries, and swarm rules.
