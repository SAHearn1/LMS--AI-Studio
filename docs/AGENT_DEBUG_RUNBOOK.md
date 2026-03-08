# Agent Debug Runbook — LMS--AI-Studio

> 6-Phase deterministic debugging protocol. Never skip phases.

## Phase 1 — Symptom Capture
- Record exact error message and stack trace
- Note browser console output
- Identify affected canvas stage/layer/component
- Note Gemini API response if AI feature failing

## Phase 2 — Boundary Identification
```
User Interaction → React Component → Konva Stage → Gemini API → Response
       ↑                ↑               ↑              ↑
   UI Events      Component State   Canvas Layer   AI Layer
```

## Phase 3 — Root Cause Isolation
- Read the actual component at the boundary
- Check Konva Stage/Layer/Shape prop types
- Verify Gemini API key is available (`VITE_GEMINI_API_KEY`)
- Check Gemini response structure matches expected schema
- Verify Vite build for bundling errors

## Phase 4 — Fix Design
- Smallest change that fixes the root cause
- No bundled refactors
- Document fix in `docs/REPAIR_PATTERNS.md`

## Phase 5 — Verification
```bash
npm run lint
npm run type-check
npm run build
```

## Phase 6 — Documentation
- Update `docs/INCIDENTS.md`
- Update `docs/REPAIR_PATTERNS.md` if reusable

---

## Konva-Specific Debug Checklist
- [ ] Stage has explicit width/height (required)
- [ ] Layer is added to Stage before drawing
- [ ] Event handlers use Konva event names (not DOM events)
- [ ] `batchDraw()` called after programmatic updates
- [ ] Transformer attached to correct node

## Gemini-Specific Debug Checklist
- [ ] API key set in env
- [ ] Model name matches available Gemini models
- [ ] Prompt structure matches GenerativeModel.generateContent() signature
- [ ] Response parsed as `.text()` not raw object
