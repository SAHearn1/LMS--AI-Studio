# Integration Points — LMS--AI-Studio

- **SDK:** `@google/genai`
- **SDK:** `@google/generative-ai`
- **Auth:** API key via `VITE_GEMINI_API_KEY`
- **Models used:** TODO — requires human verification
- **Call pattern:** TODO (streaming? non-streaming?)
- **Rate limits:** TODO — verify current quotas

## Konva.js
- **Package:** `konva` + `react-konva`
- **Pattern:** Stage → Layer → Shape hierarchy
- **Events:** Konva event system (not DOM events)
- **Export:** TODO — verify if canvas export to image is used

## External Dependencies
- TODO — requires human verification of all external API calls

## Environment Boundary
All API keys injected via `VITE_*` env vars at Vite build time.
Never hardcode API credentials in source.
