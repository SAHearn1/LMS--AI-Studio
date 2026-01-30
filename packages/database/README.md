# @rootwork/database

PostgreSQL database package for RootWork LMS using Prisma ORM.

## Setup

### Prerequisites

- PostgreSQL 15+ running (locally or via Docker)
- Node.js 18+

### Environment Variables

Create a `.env` file in this directory:

```bash
DATABASE_URL="postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms"
```

### Quick Start with Docker

From the project root:

```bash
# Start PostgreSQL and Redis
cd docker/development
docker compose up -d

# Return to database package
cd ../../packages/database

# Install dependencies
pnpm install

# Generate Prisma client
pnpm generate

# Push schema to database
pnpm push

# Seed with sample data
pnpm seed
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm generate` | Generate Prisma Client from schema |
| `pnpm push` | Push schema changes to database (dev only) |
| `pnpm migrate` | Create and apply migrations |
| `pnpm migrate:deploy` | Apply pending migrations (production) |
| `pnpm migrate:reset` | Reset database and apply all migrations |
| `pnpm seed` | Populate database with sample data |
| `pnpm studio` | Open Prisma Studio GUI |
| `pnpm format` | Format the schema file |

## Schema Overview

### Core Models

- **User** - Students, teachers, admins, and parents
- **Curriculum** - Subject/grade-level curriculum containers
- **Course** - Individual courses within curricula
- **Lesson** - Course content (video, text, quiz, assignment)
- **Assignment** - Graded work with submissions

### Progress Tracking

- **CourseEnrollment** - Student enrollment in courses
- **LessonProgress** - Individual lesson completion tracking
- **AssignmentSubmission** - Student work submissions

### Special Education

- **IEP** - Individualized Education Programs
- **IEPGoalProgress** - Progress tracking for IEP goals

### Gamification (Learning Garden)

- **Garden** - Student's virtual learning garden
- **GardenPlant** - Plants/decorations in the garden
- **GardenReward** - Rewards earned through learning

### Communications

- **Notification** - User notifications
- **Announcement** - Course/school announcements

### AI Studio

- **CanvasProject** - Saved canvas states from AI Studio

### Audit

- **AuditLog** - System activity tracking

## Usage in NestJS API

```typescript
// apps/api/src/modules/users/users.service.ts
import { prisma, User } from '@rootwork/database';

@Injectable()
export class UsersService {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
```

## Migrations

For production deployments, use migrations instead of `db push`:

```bash
# Create a migration
pnpm migrate --name add_new_feature

# Apply migrations in production
pnpm migrate:deploy
```

## Database Reset

⚠️ **Warning**: This will delete all data!

```bash
pnpm migrate:reset
```
