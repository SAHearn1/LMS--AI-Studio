# Architecture Documentation

## System Overview

RootWork Canvas (LMS--AI-Studio) is a visual learning ecosystem that provides an interactive canvas-based interface for creating and managing educational content. The application leverages AI capabilities through Google's Gemini API to assist with content generation and editing.

### Vision and Goals

- **Visual Learning**: Provide an intuitive, canvas-based interface for organizing educational content
- **AI Integration**: Leverage AI to assist educators in content creation
- **Flexibility**: Support multiple content types (text, images, videos, tasks, links)
- **Interactivity**: Enable real-time collaboration and content manipulation
- **Modularity**: Build with reusable, maintainable components

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                 │
│  (React Components + Tailwind CSS + Konva Canvas)       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 State Management Layer                   │
│              (Zustand + Immer Middleware)                │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│        (Gemini AI Service, Utility Functions)            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│              (Google Gemini AI, Next.js API)             │
└─────────────────────────────────────────────────────────┘
```

## Architecture Decision Records (ADRs)

### ADR-001: React as UI Framework

**Status:** Accepted

**Context:**
We needed a modern, performant framework for building an interactive canvas-based educational tool with complex state management and real-time updates.

**Decision:**
Use React 19.2.0 as the primary UI framework.

**Rationale:**
- Large ecosystem with extensive library support
- Excellent performance with virtual DOM and concurrent features
- Strong TypeScript support
- Rich ecosystem for canvas manipulation (react-konva)
- Team familiarity and strong community support
- Hooks API provides clean state and lifecycle management

**Consequences:**
- Positive: Fast development, extensive libraries, strong community
- Positive: Easy integration with Konva for canvas rendering
- Negative: Learning curve for React-specific patterns
- Negative: Bundle size considerations

**Alternatives Considered:**
- Vue.js: Good option but smaller ecosystem for canvas libraries
- Svelte: Better performance but less mature ecosystem
- Vanilla JS: More control but slower development

---

### ADR-002: TypeScript for Type Safety

**Status:** Accepted

**Context:**
Complex data structures (canvas nodes, connections, state) require strong typing to prevent runtime errors and improve developer experience.

**Decision:**
Use TypeScript 5.8.2 throughout the codebase.

**Rationale:**
- Compile-time type checking reduces bugs
- Better IDE support with IntelliSense
- Self-documenting code through interfaces
- Easier refactoring with confidence
- Industry standard for modern React applications

**Consequences:**
- Positive: Fewer runtime errors, better code quality
- Positive: Improved developer experience and onboarding
- Negative: Initial setup complexity
- Negative: Requires type definitions for all libraries

---

### ADR-003: Vite as Build Tool

**Status:** Accepted

**Context:**
Need fast development experience with HMR (Hot Module Replacement) and efficient production builds.

**Decision:**
Use Vite 6.2.0 as the build tool instead of Create React App or Webpack.

**Rationale:**
- Lightning-fast HMR during development
- Native ESM support for faster dev server startup
- Optimized production builds with Rollup
- Simple configuration with sensible defaults
- Better developer experience than CRA
- Built-in TypeScript support

**Consequences:**
- Positive: Instant HMR, faster development cycles
- Positive: Smaller bundle sizes with automatic code splitting
- Positive: Simple configuration
- Negative: Some plugins may not be available yet
- Negative: ESM-only can cause compatibility issues with older packages

---

### ADR-004: Zustand for State Management

**Status:** Accepted

**Context:**
Canvas state is complex with nodes, connections, selections, and modals. Need lightweight, performant state management without excessive boilerplate.

**Decision:**
Use Zustand with Immer middleware for state management.

**Rationale:**
- Minimal boilerplate compared to Redux
- No context provider wrapper needed
- Excellent TypeScript support
- Immer middleware for immutable updates
- Simple API with hooks
- Small bundle size (~1KB)
- Built-in devtools support

**Consequences:**
- Positive: Fast development, less boilerplate
- Positive: Easy to understand and maintain
- Positive: Great performance with minimal re-renders
- Negative: Less ecosystem compared to Redux
- Negative: Less structured than Redux (more responsibility on developers)

**Alternatives Considered:**
- Redux Toolkit: More powerful but excessive for this use case
- Context API: Not performant enough for frequent updates
- Jotai/Recoil: Good alternatives but Zustand is simpler

---

### ADR-005: Konva for Canvas Rendering

**Status:** Accepted

**Context:**
Need to render interactive, draggable, and transformable nodes on a canvas with connections between them.

**Decision:**
Use Konva with React-Konva bindings for canvas rendering.

**Rationale:**
- High-performance 2D canvas library
- React-friendly with react-konva bindings
- Built-in support for transformations, dragging, events
- Layer-based architecture for performance
- Extensive documentation and examples
- Supports complex shapes and images

**Consequences:**
- Positive: Excellent performance for canvas operations
- Positive: Seamless React integration
- Positive: Rich feature set for interactive graphics
- Negative: Learning curve for Konva concepts
- Negative: Adds to bundle size (~400KB)

**Alternatives Considered:**
- HTML5 Canvas API: Too low-level, more code to maintain
- SVG with React: Performance issues with many elements
- PixiJS: Overkill for 2D educational content
- Fabric.js: Good but less React-friendly

---

### ADR-006: Google Gemini AI Integration

**Status:** Accepted

**Context:**
Need AI capabilities for image generation, video generation, and content assistance to enhance the educational experience.

**Decision:**
Integrate Google's Gemini AI through the official SDK.

**Rationale:**
- Multimodal capabilities (text, image, video)
- Strong performance and accuracy
- Official TypeScript SDK available
- Competitive pricing
- Good documentation and support
- Vision capabilities for image understanding

**Consequences:**
- Positive: Powerful AI features with single integration
- Positive: Multimodal support fits our use cases
- Positive: Official SDK reduces maintenance burden
- Negative: Vendor lock-in to Google ecosystem
- Negative: API costs scale with usage
- Negative: Requires API key management

**Alternatives Considered:**
- OpenAI GPT-4: Excellent but more expensive
- Anthropic Claude: Good but limited image generation
- Stability AI: Image-focused, would need multiple providers

---

### ADR-007: Tailwind CSS for Styling

**Status:** Accepted

**Context:**
Need consistent, maintainable styling system that works well with component-based architecture.

**Decision:**
Use Tailwind CSS utility classes for styling components.

**Rationale:**
- Utility-first approach reduces custom CSS
- Consistent design system
- Small production bundle (purged unused classes)
- Responsive design built-in
- No naming conflicts
- Fast development with autocomplete

**Consequences:**
- Positive: Consistent styling across components
- Positive: No CSS file management
- Positive: Easy responsive design
- Negative: Longer className strings
- Negative: Initial learning curve for utility classes

---

### ADR-008: Node-Based Canvas Architecture

**Status:** Accepted

**Context:**
Need flexible content organization system that supports various content types and relationships.

**Decision:**
Implement a node-based architecture where each piece of content is a node with type, data, position, and size.

**Node Types:**
- Text: Rich text content
- Image: Static or AI-generated images
- Video: Video content with thumbnails
- Task: Checklist/todo items
- Link: External URLs
- Voice: Audio/voice notes
- Draw: Freehand drawings

**Rationale:**
- Flexible: Easy to add new node types
- Composable: Nodes can be connected and grouped
- Scalable: Each node is independent
- Intuitive: Matches mental model of educators
- Reusable: Node components can be used elsewhere

**Consequences:**
- Positive: Easy to extend with new content types
- Positive: Clear separation of concerns
- Positive: Intuitive for users
- Negative: More complex state management
- Negative: Need careful optimization for many nodes

---

### ADR-009: Modal-Based Interactions for AI Features

**Status:** Accepted

**Context:**
AI operations (image generation, video generation) require user input and take time to complete.

**Decision:**
Use modal dialogs for AI-powered interactions rather than inline UI.

**Rationale:**
- Focused user experience for complex operations
- Prevents accidental interactions during generation
- Clear loading states and progress feedback
- Maintains canvas cleanliness
- Standard UX pattern users understand

**Consequences:**
- Positive: Clear, focused user experience
- Positive: Easy to implement loading states
- Positive: Canvas remains uncluttered
- Negative: Interrupts workflow slightly
- Negative: Requires modal state management

---

### ADR-010: Environment Variables for Configuration

**Status:** Accepted

**Context:**
Need secure way to manage API keys and configuration without hardcoding or committing sensitive data.

**Decision:**
Use Vite's environment variable system with `.env.local` files.

**Configuration Pattern:**
```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

**Rationale:**
- Secure: `.env.local` excluded from git
- Flexible: Different configs for dev/prod
- Standard: Vite built-in support
- Type-safe: Can add TypeScript declarations
- Platform-agnostic: Works with Vercel, etc.

**Consequences:**
- Positive: Secure configuration management
- Positive: Easy to set up different environments
- Negative: Requires manual setup for new developers
- Negative: Environment variables must be set in deployment platform

---

## Component Architecture

### Component Hierarchy

```
App
├── Header (Static UI)
├── ZoomControls
├── Canvas
│   └── NodeComponent (for each node)
│       ├── TextNode
│       ├── ImageNode
│       ├── VideoNode
│       ├── TaskNode
│       ├── LinkNode
│       ├── VoiceNode
│       └── DrawNode
├── Toolbar
├── AiAssistant
├── LessonPlanPanel
└── Modals
    ├── AIGenerationModal
    ├── VideoPlayerModal
    └── LessonLoaderModal
```

### Component Responsibilities

#### Presentational Components
Pure components that receive props and render UI. No direct state management.

**Examples:**
- `ZoomControls`: Buttons for zoom functionality
- Node components (`TextNode`, `ImageNode`, etc.)
- `Modal`: Reusable modal wrapper

#### Container Components
Connect to global state and handle business logic.

**Examples:**
- `Canvas`: Manages rendering and node interactions
- `Toolbar`: Handles node creation
- `AiAssistant`: Manages AI interactions

#### Layout Components
Define page structure and positioning.

**Examples:**
- `App`: Root layout and routing
- `LessonPlanPanel`: Side panel layout

### State Management Structure

```typescript
interface CanvasState {
  // Node management
  nodes: Record<string, CanvasNode>;
  connections: Record<string, Connection>;
  
  // Selection and interaction
  selectedNodeIds: string[];
  editingNodeId: string | null;
  
  // Canvas reference
  stage: Stage | null;
  
  // UI state
  modal: { type: ModalType; data?: any };
  lessonPlan: LessonPlan | null;
  isLessonPanelOpen: boolean;
}
```

### Data Flow

1. **User Interaction** → Component event handler
2. **Component** → Calls Zustand store action
3. **Store Action** → Updates state immutably (via Immer)
4. **State Change** → Triggers re-render of subscribed components
5. **Component** → Renders updated UI

## Service Layer Architecture

### Gemini AI Service (`services/geminiService.ts`)

Centralized service for all AI operations:

**Key Functions:**
- `generateImage(prompt, nodes, selectedNodeIds)`: Image generation
- `editImage(prompt, image, nodes, selectedNodeIds)`: Image editing
- `generateVideo(prompt, nodes, selectedNodeIds)`: Video generation
- `sendMessage(message, nodes, selectedNodeIds)`: Chat with context

**Design Principles:**
- Single source of truth for AI interactions
- Context-aware: Passes canvas state to AI
- Error handling and retry logic
- Type-safe responses

### Utility Services

**`utils/helpers.ts`:**
- `decode()`: Base64 decoding utilities
- `decodeAudioData()`: Audio processing

**`utils/googleGenerativeAiShim.ts`:**
- Shim layer for Google Generative AI SDK
- Allows for easier testing and mocking

## API Architecture

### Next.js API Routes

**Structure:**
```
app/api/v1/dashboard/deployments/[id]/route.ts
```

**Patterns:**
- RESTful design
- Dynamic route parameters with `[id]`
- TypeScript types for requests/responses
- Standard HTTP methods (GET, PUT, DELETE)
- JSON responses with proper status codes

**Current Endpoints:**
- `GET /api/v1/dashboard/deployments/:id` - Get deployment
- `PUT /api/v1/dashboard/deployments/:id` - Update deployment
- `DELETE /api/v1/dashboard/deployments/:id` - Delete deployment

## Data Models

### Core Types

**BaseNode:**
```typescript
interface BaseNode<T> {
  id: string;              // Unique identifier
  type: NodeType;          // Node type enum
  position: NodePosition;  // x, y coordinates
  size: NodeSize;          // width, height
  rotation?: number;       // Optional rotation angle
  data: T;                 // Type-specific data
}
```

**Node Type System:**
Each node type extends `BaseNode` with specific data:
- `TextNode`: `TextNodeData` (text, backgroundColor)
- `ImageNode`: `ImageNodeData` (src, alt, prompt, base64)
- `VideoNode`: `VideoNodeData` (src, thumbnailSrc, prompt)
- etc.

### Type Safety

Union types ensure exhaustive handling:
```typescript
type CanvasNode = TextNode | ImageNode | VideoNode | VoiceNode | LinkNode | TaskNode | DrawNode;
```

TypeScript's discriminated unions (via `type` field) enable type narrowing.

## Performance Considerations

### Canvas Optimization

1. **Layering**: Use Konva layers to separate static/dynamic content
2. **Caching**: Cache complex shapes that don't change frequently
3. **Virtualization**: Only render visible nodes (future enhancement)
4. **Debouncing**: Debounce expensive operations (auto-save, AI calls)

### Bundle Optimization

1. **Code Splitting**: Vite automatically splits vendor code
2. **Lazy Loading**: Dynamic imports for modals and heavy components
3. **Tree Shaking**: Vite removes unused code
4. **Manual Chunks**: Konva split into separate chunk

### State Optimization

1. **Selective Subscriptions**: Components only subscribe to needed state
2. **Immer**: Efficient immutable updates
3. **Memoization**: Use React.memo() for expensive components

## Security Considerations

### API Key Management
- Never commit API keys
- Use environment variables
- Validate keys on server side
- Rotate keys periodically

### Data Validation
- Validate user input before processing
- Sanitize data before rendering
- Use TypeScript for type safety
- Validate API responses

### Content Security
- Sanitize user-generated content
- Validate image/video URLs
- Implement rate limiting for AI calls
- Handle errors gracefully

## Future Architecture Considerations

### Scalability

**Current State:** In-memory state, no persistence
**Future:** 
- Add backend database for persistence
- Implement real-time collaboration with WebSockets
- Add user authentication and authorization

### Multi-tenancy

**Current State:** Single-user, local only
**Future:**
- User accounts and workspaces
- Sharing and permissions
- Team collaboration features

### Offline Support

**Current State:** Requires internet for AI features
**Future:**
- Service workers for offline canvas editing
- Local storage for draft saving
- Sync when connection restored

### Testing Infrastructure

**Current State:** No automated tests
**Future:**
- Unit tests for utilities and services
- Component tests with React Testing Library
- Integration tests for user flows
- E2E tests with Playwright

## ADR Template for Future Decisions

When making significant architectural decisions, use this template:

```markdown
### ADR-XXX: [Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded]

**Date:** YYYY-MM-DD

**Context:**
What is the issue that we're seeing that is motivating this decision or change?

**Decision:**
What is the change that we're proposing and/or doing?

**Rationale:**
Why are we making this decision? What are the key factors?

**Consequences:**
What becomes easier or more difficult to do because of this change?

**Alternatives Considered:**
What other options did we consider?
```

## Glossary

- **Node**: A content element on the canvas (text, image, video, etc.)
- **Canvas**: The main interactive workspace using Konva
- **Stage**: Konva's top-level container for the canvas
- **Layer**: Konva's grouping mechanism for performance
- **Zustand Store**: Global state management instance
- **Modal**: Overlay dialog for focused interactions
- **Lesson Plan**: Structured learning content with tasks

## References

- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Konva Documentation](https://konvajs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Google Generative AI](https://ai.google.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Last updated: 2025-11-10
