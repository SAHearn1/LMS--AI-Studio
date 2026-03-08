# Debug Playbook — LMS--AI-Studio

## Canvas Failures (Konva)

| Symptom | First Check | Likely Cause |
|---------|------------|---------------|
| Blank canvas | Stage width/height props | Missing dimensions |
| Shapes not visible | Layer not added to Stage | Layer/Stage hierarchy wrong |
| Events not firing | Event handler name | Using DOM events instead of Konva events |
| Performance degradation | Shape count | Too many shapes without layer caching |
| Transformer not working | Node selection | Transformer not attached to node |

## AI Failures (Gemini)

| Symptom | First Check | Likely Cause |
|---------|------------|---------------|
| `API key not valid` | `VITE_GEMINI_API_KEY` | Missing or invalid key |
| `model not found` | Model name string | Deprecated or wrong model ID |
| Timeout | Network tab | Prompt too large or network issue |
| Empty response | `.text()` call | Response not extracted correctly |
| Content blocked | Safety settings | Prompt triggered safety filter |

## Build Failures (Vite)

| Symptom | First Check | Likely Cause |
|---------|------------|---------------|
| `cannot find module` | Import path | Wrong import alias or missing package |
| Type errors | `tsc --noEmit` | Prop type mismatch |
| VITE_ undefined | `.env` file | Missing env var or wrong prefix |

## Runtime Failures

| Symptom | First Check | Likely Cause |
|---------|------------|---------------|
| Blank page | Browser console | JS runtime error on mount |
| State not updating | React DevTools | Stale closure or missing dependency |
| Canvas resize broken | ResizeObserver | Width/height not reactive to window size |
