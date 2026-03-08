# Runtime Map — LMS--AI-Studio

## Development Environment

```bash
npm install
npm run dev       # Vite dev server, typically http://localhost:5173
```

## Required Environment Variables

```env
# Google Gemini
VITE_GEMINI_API_KEY=

# TODO: verify additional env vars
```

> VITE_ prefix is mandatory for Vite to expose vars to client bundles.

## Build
```bash
npm run build     # Outputs to /dist
npm run preview   # Preview production build
```

## Key Scripts
```bash
npm run lint
npm run type-check
```

## Canvas Runtime Notes
- Konva requires explicit Stage dimensions — must be set before render
- Pixel ratio handled automatically by React Konva
- Large canvases: use layer caching (`layer.cache()`) for performance

## AI Runtime Notes
- Gemini API is called client-side (via VITE_ env var)
- Rate limits apply — handle 429 responses
- Stream responses where possible for better UX
