# Root Work Framework LMS

**Trauma-Informed, Healing-Centered K-12 Learning Management System**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

The Root Work Framework LMS is the first evidence-based, trauma-informed, healing-centered K-12 learning management system that integrates therapeutic pedagogy, immersive garden-based learning, and AI-powered personalization.

**Key Features:**

- 🌱 Therapeutic Horticulture Integration
- 🧠 Healing-Centered Engagement (Dr. Shawn Ginwright Framework)
- 🤖 AI-Powered Lesson Generation with Safety Protocols
- ♿ UDL 3.0 Compliant (WCAG 2.0 Level AA)
- 📋 Substantive IEP Compliance (Endrew F. Standard)
- 🔒 FERPA, IDEA, HIPAA Compliant
- 📊 Therapeutic Learning Graph Architecture

## Tech Stack

**Frontend:**

- React 19 (with TypeScript)
- Vite
- Konva (Canvas-based visual learning)
- Zustand (State Management)
- Google Generative AI (Gemini)

**Architecture:**

- Visual, non-linear learning environment
- Externalizes working memory
- Supports executive function
- Designed for trauma-affected and neurodivergent learners

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/SAHearn1/LMS--AI-Studio.git
cd LMS--AI-Studio

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add your VITE_GEMINI_API_KEY
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local
```

## Development

```bash
# Start development server
npm run dev

# Access the application
# Frontend: http://localhost:5173
```

## Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
LMS--AI-Studio/
├── app/
│   └── api/              # API routes and services
├── components/           # React components
│   ├── Canvas.tsx       # Main canvas component
│   ├── Toolbar.tsx      # Drawing and interaction tools
│   ├── AiAssistant.tsx  # AI-powered assistant
│   ├── LessonPlanPanel.tsx  # Lesson planning interface
│   └── nodes/           # Node components for canvas
├── hooks/               # Custom React hooks
├── services/            # External service integrations
├── utils/               # Utility functions
├── types.ts            # TypeScript type definitions
└── index.html          # Application entry point
```

## Key Components

### RootWork Canvas

A visual, non-linear learning environment designed for how trauma-affected and neurodivergent brains learn, externalizing working memory and supporting executive function.

### AI-Powered Features

- Lesson plan generation
- Adaptive learning pathways
- Content personalization
- Safety-filtered responses

## Contributing

This project is maintained by Dr. Shawn A. Hearn. For contribution guidelines, please contact the maintainer.

## License

MIT License - See [LICENSE](LICENSE) file for details

Copyright (c) 2025 SAHearn1

## Contact

**Dr. Shawn A. Hearn, Ed.D., J.D.**  
Community Exceptional Children's Services  
Savannah, Georgia

---

*View the app in AI Studio: https://ai.studio/apps/drive/1oATln5y3YnAk9vN_bjEhfQI9kHQilS6l*
