# CLAUDE.md — LMS--AI-Studio

> Agent briefing. Read before touching code.
> Governance hub: `SAHearn1/rwfw-agent-governance`

## Repo Identity
- **Purpose:** AI-powered LMS studio with interactive canvas
- **Tier:** 2 (active support)
- **Stack:** React 19 + Vite + Konva.js + Google Gemini

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + TypeScript |
| Canvas | Konva.js (react-konva) |
| AI | Google Gemini SDK (`@google/generative-ai`) |

## Critical Rules

- **Konva Stage requires explicit dimensions.** `<Stage width={} height={}>` must have numeric values before render. Missing dimensions = blank canvas.
- **Konva uses its own event system**, not DOM events. Use `onClick`, `onDragEnd` etc. as Konva props, not `addEventListener`.
- **React 19 concurrent mode** — Konva and React 19 concurrent rendering can interact unexpectedly. Test canvas updates under `useTransition`.
- **Gemini API key is client-exposed** via `VITE_GEMINI_API_KEY`. Do not add sensitive server-side logic here without moving to a backend.
- **VITE_ prefix required** for all client env vars.
- **No `git add .`**

## Dev Workflow
```bash
npm install && npm run dev
npm run lint && npm run type-check && npm run build
```

## Env Vars
```
VITE_GEMINI_API_KEY
```

## Governance
Follow `AGENTS.md`. Debug via `docs/AGENT_DEBUG_RUNBOOK.md`.
