# Architecture Map — LMS--AI-Studio

> TODO: Verify and expand with actual module structure.

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (SPA)                         │
├──────────────────────────────────────────────────────────┤
│  React 19 + Vite                                         │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  UI Layer  │  │ Konva Canvas │  │  Gemini AI SDK  │  │
│  │ (React)    │  │ (Stage/Layer)│  │ (generateContent│  │
│  └─────┬──────┘  └──────┬───────┘  └────────┬────────┘  │
│        └────────────────┴──────────────────┘            │
└──────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Google Gemini    │
                    │  API (external)   │
                    └───────────────────┘
```

## Key Directories
```
/
├── src/
│   ├── components/     # React UI components
│   ├── canvas/         # Konva Stage/Layer components (TODO: verify)
│   ├── ai/             # Gemini integration (TODO: verify)
│   ├── hooks/          # Custom React hooks
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── vite.config.ts      # Vite config
```

## TODO — Requires Human Verification
- Actual directory structure
- Konva Stage hierarchy (Stages, Layers, Groups)
- Gemini integration pattern (streaming vs. non-streaming)
- State management approach
