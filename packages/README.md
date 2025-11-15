# Shared Packages

This directory contains shared packages that can be used across the monorepo.

## 📦 Packages

### `@rootwork/database`
Prisma-based database package for managing database schemas and migrations.

**Scripts:**
- `generate` - Generate Prisma client
- `push` - Push schema changes to database
- `migrate` - Run database migrations
- `seed` - Seed the database
- `studio` - Open Prisma Studio

**Location:** `packages/database/`

### `@rootwork/ui`
Shared React UI component library with reusable components.

**Components:**
- Button
- Card
- Input

**Scripts:**
- `lint` - Run ESLint
- `type-check` - Run TypeScript type checking

**Location:** `packages/ui/`

### `@rootwork/types`
Shared TypeScript types and interfaces.

**Types:**
- User
- Course
- Lesson
- IEP
- Garden

**Location:** `packages/types/`

### `@rootwork/config`
Shared configuration files for TypeScript, ESLint, and Tailwind CSS.

**Configurations:**
- `tsconfig/base.json` - Base TypeScript configuration
- `eslint/base.js` - Base ESLint configuration
- `tailwind/base.js` - Base Tailwind CSS configuration

**Location:** `packages/config/`

## 🚀 Usage

Each package can be imported using its scoped name:

```typescript
// Import database utilities
import { PrismaClient } from '@rootwork/database';

// Import UI components
import { Button, Card, Input } from '@rootwork/ui';

// Import types
import { User, Course, Lesson } from '@rootwork/types';
```

## 📝 Development

To work with these packages:

1. Install dependencies in each package:
   ```bash
   cd packages/[package-name]
   pnpm install
   ```

2. Build or develop as needed using the package-specific scripts.

## 🔧 Configuration

To use the shared configurations in your projects:

### TypeScript
```json
{
  "extends": "@rootwork/config/tsconfig/base.json"
}
```

### ESLint
```javascript
module.exports = {
  extends: ['@rootwork/config/eslint/base.js']
};
```

### Tailwind CSS
```javascript
module.exports = {
  presets: [require('@rootwork/config/tailwind/base.js')]
};
```
