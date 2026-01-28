# Phase 1: Database & Authentication Setup

## Overview

This document describes the Phase 1 implementation which adds:
- PostgreSQL database integration via Prisma ORM
- Complete database schema for all entities
- JWT authentication with bcrypt password hashing
- Full CRUD operations backed by the database

## Database Schema

### Entities Implemented

| Entity | Table | Description |
|--------|-------|-------------|
| User | `users` | User accounts with roles (STUDENT, TEACHER, ADMIN, PARENT) |
| UserProfile | `user_profiles` | Extended user profile data |
| RefreshToken | `refresh_tokens` | JWT refresh tokens for auth |
| Curriculum | `curricula` | Educational curricula |
| Course | `courses` | Courses linked to curricula and instructors |
| CourseEnrollment | `course_enrollments` | Student-Course relationships |
| Lesson | `lessons` | Individual lessons within courses |
| LessonProgress | `lesson_progress` | Student progress tracking per lesson |
| Assignment | `assignments` | Course assignments |
| AssignmentSubmission | `assignment_submissions` | Student assignment submissions |
| IEP | `ieps` | Individualized Education Programs |
| IEPGoal | `iep_goals` | Goals within IEPs |
| Garden | `gardens` | Gamification - student gardens |
| Plant | `plants` | Plants within gardens |
| GardenReward | `garden_rewards` | Rewards earned by students |

### Enums

- `UserRole`: STUDENT, TEACHER, ADMIN, PARENT
- `CourseStatus`: DRAFT, PUBLISHED, ARCHIVED
- `LessonStatus`: DRAFT, PUBLISHED
- `LessonType`: VIDEO, TEXT, QUIZ, ASSIGNMENT
- `AssignmentStatus`: DRAFT, PUBLISHED, CLOSED
- `CurriculumStatus`: DRAFT, ACTIVE, ARCHIVED
- `IEPStatus`: DRAFT, ACTIVE, COMPLETED, ARCHIVED
- `IEPGoalStatus`: NOT_STARTED, IN_PROGRESS, COMPLETED
- `GardenItemType`: FLOWER, TREE, PLANT, DECORATION
- `RewardType`: SEED, FERTILIZER, DECORATION, XP

## Authentication

### Features
- JWT-based authentication with access and refresh tokens
- bcrypt password hashing (12 rounds)
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry (stored in database)
- Global JWT auth guard with `@Public()` decorator for public routes
- Role-based access control with `@Roles()` decorator

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login | No |
| POST | `/auth/refresh` | Refresh tokens | No |
| POST | `/auth/logout` | Logout | Yes |
| POST | `/auth/me` | Get current user | Yes |

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis (optional, for caching)

### Environment Variables

Create `apps/api/.env`:

```env
# Database
DATABASE_URL=postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

# Application
NODE_ENV=development
PORT=3001

# Bcrypt
BCRYPT_SALT_ROUNDS=12
```

### Start Database (Docker)

```bash
cd docker/development
docker-compose up -d
```

### Install Dependencies

```bash
# From project root
cd apps/api
npm install

# Generate Prisma client
cd ../../packages/database
npm install
DATABASE_URL="postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms" npx prisma generate
```

### Run Migrations

```bash
cd packages/database
DATABASE_URL="postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms" npx prisma db push
```

### Seed Database

```bash
cd packages/database
DATABASE_URL="postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms" npm run seed
```

### Start API

```bash
cd apps/api
npm run start:dev
```

### Access Points
- API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api/docs

## Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rootwork.edu | password123 |
| Teacher | teacher@rootwork.edu | password123 |
| Student | student@rootwork.edu | password123 |
| Parent | parent@rootwork.edu | password123 |

## Project Structure

```
apps/api/src/
├── prisma/                    # Prisma service module
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── modules/
│   ├── auth/                  # Authentication
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/                 # User management
│   ├── curriculum/            # Curriculum management
│   ├── learning/              # Courses, Lessons, Assignments
│   ├── compliance/            # IEPs
│   └── garden/                # Gamification
└── common/
    ├── decorators/
    └── guards/

packages/database/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── generated/prisma/          # Generated Prisma client
└── package.json
```

## API Changes

All existing endpoints now work with the PostgreSQL database instead of in-memory storage. The API structure and response formats remain compatible.

## Next Steps (Phase 2)

1. Add email verification
2. Implement password reset
3. Add OAuth2 providers (Google, Microsoft)
4. Add API rate limiting
5. Add Redis caching
6. Add comprehensive logging
7. Add unit and integration tests
