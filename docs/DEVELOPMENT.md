# Development Guide

## Overview

RootWork Canvas (LMS--AI-Studio) is a visual learning ecosystem built with React, TypeScript, and Vite. This guide provides comprehensive instructions for developers working on the project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **Git** for version control
- A modern code editor (VS Code recommended)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SAHearn1/LMS--AI-Studio.git
cd LMS--AI-Studio
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 19.2.0
- TypeScript 5.8.2
- Vite 6.2.0
- Zustand (state management)
- Konva and React-Konva (canvas rendering)
- Google Generative AI SDK

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local  # if example exists
# or create manually
```

Add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

> **Note:** Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Development Workflow

### Project Structure

```
LMS--AI-Studio/
├── app/                      # Next.js API routes
│   └── api/v1/              # Versioned API endpoints
├── components/              # React components
│   ├── nodes/              # Canvas node components
│   └── common/             # Shared components
├── hooks/                   # Custom React hooks
├── services/               # External service integrations
├── src/                    # Core application code
│   └── lib/               # Library configurations
├── utils/                  # Utility functions
├── types.ts               # TypeScript type definitions
├── App.tsx                # Main application component
└── index.tsx              # Application entry point
```

### Key Technologies

- **React 19.2.0**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Zustand**: Lightweight state management
- **Konva/React-Konva**: Canvas rendering library
- **Google Generative AI**: AI-powered features

### State Management

The application uses Zustand with Immer middleware for state management. The main canvas state is defined in `hooks/useCanvasState.ts` and includes:

- Canvas nodes (text, image, video, task, etc.)
- Node connections
- Selection state
- Modal state
- Lesson plan state

### Code Style and Conventions

#### TypeScript

- Use TypeScript for all new files
- Define interfaces/types in `types.ts` or locally if component-specific
- Avoid `any` type - use proper typing or `unknown` with type guards
- Use enums for fixed sets of values (e.g., `NodeType`)

#### React Components

- Use functional components with hooks
- Follow naming convention: PascalCase for components (e.g., `CanvasNode.tsx`)
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props

Example component structure:
```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default MyComponent;
```

#### File Naming

- Components: PascalCase (e.g., `AiAssistant.tsx`)
- Utilities: camelCase (e.g., `helpers.ts`)
- Hooks: camelCase with `use` prefix (e.g., `useCanvasState.ts`)
- Types: PascalCase (e.g., `types.ts`)

#### CSS and Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent color palette (defined in Tailwind config)
- Maintain semantic HTML structure

### Working with Canvas Nodes

#### Creating a New Node Type

1. Add the node type to the `NodeType` enum in `types.ts`
2. Define the node data interface (e.g., `MyNodeData`)
3. Create a type alias combining `BaseNode<MyNodeData>` with the type
4. Add to the `CanvasNode` union type
5. Create a component in `components/nodes/`
6. Update `NodeComponent.tsx` to handle the new type
7. Add creation logic in `Toolbar.tsx` or relevant UI

#### Node Component Structure

```typescript
interface MyNodeProps {
  node: MyNode;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

const MyNode: React.FC<MyNodeProps> = ({ node, isSelected, onSelect, onEdit }) => {
  // Implement node rendering
};
```

### Working with AI Features

The application integrates with Google's Gemini AI for:
- Image generation
- Video generation
- Image editing
- AI-assisted content

AI services are centralized in `services/geminiService.ts`:

```typescript
// Example usage
import { generateImage } from './services/geminiService';

const imageUrl = await generateImage(prompt, nodes, selectedNodeIds);
```

## Building and Testing

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Testing

Currently, the project does not have automated tests configured. When implementing tests:

1. Install testing dependencies:
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

2. Create test files alongside components:
```
MyComponent.tsx
MyComponent.test.tsx
```

3. Follow testing best practices:
   - Test user interactions, not implementation details
   - Use descriptive test names
   - Mock external dependencies (API calls, etc.)

## Performance Considerations

### Canvas Optimization

- Use Konva's layer caching for static content
- Implement virtualization for large numbers of nodes
- Debounce expensive operations (auto-save, etc.)
- Use React.memo() for expensive components

### Bundle Size

- The build process splits vendor libraries (Konva) into separate chunks
- Monitor bundle size with `npm run build`
- Lazy load non-critical components

## Debugging

### Common Issues

#### API Key Not Found
**Error:** "Gemini API key not found"
**Solution:** Ensure `VITE_GEMINI_API_KEY` is set in `.env.local`

#### Canvas Not Rendering
**Solution:** 
- Check browser console for errors
- Verify Konva is properly initialized
- Check stage dimensions are set

#### Build Failures
**Solution:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npx tsc --noEmit`

### Development Tools

- **React DevTools**: Browser extension for React debugging
- **Redux DevTools**: Compatible with Zustand for state inspection
- **Vite DevTools**: Built into the dev server

### Logging

Use console methods appropriately:
- `console.log()`: General debugging (remove before commit)
- `console.warn()`: Warnings that should be addressed
- `console.error()`: Errors that need attention

## Git Workflow

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`
- Refactor: `refactor/description`

### Commit Messages

Follow conventional commits:
```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(canvas): add drawing node support

- Implement DrawNode component
- Add drawing tools to toolbar
- Support multi-line drawings with color options
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, atomic commits
3. Test your changes thoroughly
4. Update documentation if needed
5. Create a pull request with description
6. Address review feedback
7. Squash commits if requested

## Deployment

### Vercel Deployment

The application is configured for Vercel deployment:

1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables in Production

Set these in your deployment platform:
- `VITE_GEMINI_API_KEY`: Google Gemini API key

## Best Practices

### Code Quality

- Write self-documenting code with clear variable names
- Add comments for complex logic only
- Keep functions small and focused
- Use early returns to reduce nesting
- Handle errors gracefully

### Security

- Never commit API keys or secrets
- Validate user input
- Sanitize data before displaying
- Use environment variables for sensitive data
- Keep dependencies updated

### Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers when possible

### Performance

- Optimize images before adding to the project
- Use lazy loading for heavy components
- Minimize re-renders with React.memo and useMemo
- Profile with React DevTools Profiler
- Monitor bundle size

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Konva Documentation](https://konvajs.org/)
- [Google Generative AI](https://ai.google.dev/)

## Getting Help

- Check existing issues on GitHub
- Review documentation in the `docs/` folder
- Ask questions in team communication channels
- Consult the architecture documentation for design decisions

## Contributing

1. Read this development guide thoroughly
2. Follow the code style conventions
3. Write meaningful commit messages
4. Keep pull requests focused and small
5. Update documentation when making changes
6. Be respectful and collaborative

---

Last updated: 2025-11-10
