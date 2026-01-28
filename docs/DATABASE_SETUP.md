# RootWork LMS Database Setup Guide

## Overview

The RootWork LMS uses PostgreSQL as its primary database with Prisma ORM for type-safe database access.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (apps/web)                   │
│                    Next.js + React + Zustand                │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────▼───────────────────────────────────┐
│                        Backend (apps/api)                   │
│                    NestJS + Swagger + JWT                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ Prisma Client
┌─────────────────────────▼───────────────────────────────────┐
│                  Database (packages/database)               │
│                    PostgreSQL + Prisma ORM                  │
└─────────────────────────────────────────────────────────────┘
```

## Entity Relationship Diagram

### User Management
```
┌─────────────┐       ┌─────────────────┐
│    User     │◄──────│ ParentStudent   │
│             │       │ (join table)    │
│ - STUDENT   │       └─────────────────┘
│ - TEACHER   │
│ - ADMIN     │
│ - PARENT    │
└─────────────┘
       │
       ├──────────► Courses (as instructor)
       ├──────────► CourseEnrollments (as student)
       ├──────────► LessonProgress
       ├──────────► AssignmentSubmissions
       ├──────────► IEPs
       └──────────► Gardens
```

### Learning Content
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Curriculum  │────►│   Course    │────►│   Lesson    │
│             │     │             │     │             │
│ - DRAFT     │     │ - DRAFT     │     │ - VIDEO     │
│ - ACTIVE    │     │ - PUBLISHED │     │ - TEXT      │
│ - ARCHIVED  │     │ - ARCHIVED  │     │ - QUIZ      │
└─────────────┘     └─────────────┘     │ - ASSIGNMENT│
                           │            │ - INTERACTIVE│
                           │            └─────────────┘
                           │
                    ┌──────▼──────┐
                    │ Assignment  │
                    │             │
                    │ - DRAFT     │
                    │ - PUBLISHED │
                    │ - CLOSED    │
                    └─────────────┘
```

### Gamification (Learning Garden)
```
┌─────────────┐     ┌─────────────┐
│   Garden    │────►│ GardenPlant │
│             │     │             │
│             │     │ - FLOWER    │
└─────────────┘     │ - TREE      │
       │            │ - PLANT     │
       │            │ - DECORATION│
       ▼            └─────────────┘
┌─────────────┐
│GardenReward │
│             │
│ - SEED      │
│ - FERTILIZER│
│ - DECORATION│
│ - XP        │
│ - BADGE     │
└─────────────┘
```

## Local Development Setup

### Option 1: Docker (Recommended)

1. **Start services:**
   ```bash
   cd docker/development
   docker compose up -d
   ```

2. **Verify services:**
   ```bash
   docker compose ps
   # Should show: rootwork-postgres, rootwork-redis, rootwork-mailhog
   ```

3. **Initialize database:**
   ```bash
   cd packages/database
   pnpm install
   pnpm generate
   pnpm push
   pnpm seed
   ```

### Option 2: Manual PostgreSQL

1. **Install PostgreSQL 15+**

2. **Create database:**
   ```sql
   CREATE USER rootwork WITH PASSWORD 'rootwork_dev';
   CREATE DATABASE rootwork_lms OWNER rootwork;
   ```

3. **Update `.env`:**
   ```
   DATABASE_URL="postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms"
   ```

4. **Initialize:**
   ```bash
   cd packages/database
   pnpm generate && pnpm push && pnpm seed
   ```

## Production Deployment

### Using Supabase

1. Create a Supabase project at https://supabase.com
2. Get the connection string from Settings > Database
3. Update `DATABASE_URL` with the Supabase connection string
4. Run migrations:
   ```bash
   pnpm migrate:deploy
   ```

### Using AWS RDS / Other

1. Create a PostgreSQL 15+ instance
2. Configure security groups for your app servers
3. Set `DATABASE_URL` environment variable
4. Run `pnpm migrate:deploy`

## Schema Changes

### Development
Use `pnpm push` for quick iterations:
```bash
# Edit schema.prisma
pnpm push  # Applies changes directly
```

### Production
Always use migrations:
```bash
# Create migration
pnpm migrate --name descriptive_name

# Deploy (in CI/CD)
pnpm migrate:deploy
```

## Useful Commands

| Command | Use Case |
|---------|----------|
| `pnpm studio` | Visual database browser |
| `pnpm generate` | Regenerate Prisma client after schema changes |
| `pnpm push` | Quick schema sync (dev only) |
| `pnpm migrate` | Create versioned migration |
| `pnpm migrate:deploy` | Apply migrations (production) |
| `pnpm migrate:reset` | Wipe and rebuild database |
| `pnpm seed` | Populate with sample data |

## Troubleshooting

### "Can't reach database server"
- Check if PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Check network/firewall rules

### "Prisma client not generated"
```bash
pnpm generate
```

### "Migration failed"
```bash
# Check migration status
npx prisma migrate status

# Reset if needed (dev only!)
pnpm migrate:reset
```

## Connection String Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

Examples:
- Local: `postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms`
- Supabase: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
- AWS RDS: `postgresql://admin:password@mydb.xxx.us-east-1.rds.amazonaws.com:5432/rootwork`
