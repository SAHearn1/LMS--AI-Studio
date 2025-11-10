# Root Work Framework LMS - Prisma Schema Documentation

## Overview

This Prisma schema defines a comprehensive database structure for the Root Work Framework Learning Management System (LMS). It supports traditional educational features, special education (IEP) management, social-emotional learning (SEL), and wellness through virtual gardening.

## Database Setup

### Prerequisites
- PostgreSQL 12 or higher
- Node.js 18 or higher

### Installation

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `DATABASE_URL` in `.env` with your PostgreSQL connection string:
```
DATABASE_URL="postgresql://user:password@localhost:5432/rootwork_lms?schema=public"
```

3. Generate the Prisma Client:
```bash
npm run prisma:generate
```

4. Create and run migrations:
```bash
npm run prisma:migrate
```

5. (Optional) Open Prisma Studio to view/edit data:
```bash
npm run prisma:studio
```

## Schema Architecture

### Core Organizational Entities

#### Tenant
Multi-tenancy support for SaaS deployment. Each tenant represents an organization (district or independent school).

#### District
School district entity for managing multiple schools.

#### School
Individual school within a district or tenant.

#### User
Central user entity supporting multiple roles:
- **STUDENT**: Enrolled learners
- **TEACHER**: Instructors and educators
- **PARENT**: Student guardians
- **ADMINISTRATOR**: School/district administrators
- **COUNSELOR**: Guidance counselors and support staff

### Academic Entities

#### Course → Lesson → Assignment/Assessment
Traditional LMS hierarchy:
- **Course**: Semester/year-long class
- **Lesson**: Individual lesson within a course
- **Assignment**: Student work submissions
- **Assessment**: Quizzes, tests, exams with questions and results

#### Enrollment
Many-to-many relationship between Users and Courses with status tracking.

### IEP & Special Education

#### IEP (Individualized Education Program)
Complete IEP management with FERPA-sensitive data protection:
- Student eligibility and disability information
- Meeting dates and review schedules
- Coordinator assignment

#### GoalArea → Goal
Hierarchical goal structure:
- **GoalArea**: Categories (academic, behavioral, social, communication, motor)
- **Goal**: Specific, measurable objectives with progress tracking

#### Accommodation
Instructional, environmental, assessment, and behavioral accommodations.

#### Service
Related services (speech therapy, occupational therapy, counseling, etc.).

### Wellness & Virtual Garden

#### VirtualGarden
Digital gardens for students to cultivate as a metaphor for personal growth.

#### Plant
Individual plants with growth stages and health status representing student achievements.

#### GardenActivity
Student interactions with their garden including reflections and emotional states.

### Social-Emotional Learning (SEL)

#### EmotionalCheckIn
Regular emotional wellness tracking for students with:
- Emotional state and intensity
- Triggers and coping strategies
- Marked as FERPA-sensitive

#### HealingCircle
Restorative practice sessions for community building and conflict prevention.

#### RestorativeConference
Structured conferences for addressing conflicts and harm with:
- Incident documentation
- Multiple participant roles (affected party, responsible party, supporter)
- Agreement tracking

### AI & Curriculum

#### LessonPlan
AI-generated or manually created lesson plans with:
- Learning objectives and activities
- Differentiation strategies
- AI generation tracking (prompt, model used)

#### CurriculumStandard
Hierarchical curriculum standards (Common Core, NGSS, state standards).

## Security Features

### Row-Level Security (RLS)
Every entity includes:
- `tenantId`: Ensures data isolation between organizations
- `schoolId`: School-level data segregation

### Audit Trail
All entities include:
- `createdAt`: Timestamp of creation
- `updatedAt`: Auto-updated timestamp
- `createdBy`: User ID who created the record
- `updatedBy`: User ID who last updated the record

### Soft Delete
All entities support soft deletion via `deletedAt`:
- Records are never physically deleted
- Marked deleted records can be filtered in queries
- Supports data recovery and audit requirements

### FERPA Compliance
Sensitive student data is marked with `// @sensitive` comments:
- Student personal information (DOB, SSN, address)
- Disability and medical information in IEPs
- Emotional check-in data
- Healing circle and restorative conference content

## Key Relationships

### User-Centric
- User → many Courses (via Enrollment)
- Student → one IEP → many Goals
- Student → many EmotionalCheckIns
- Student → many GardenActivities
- Parent → many Students (via ParentStudentRelationship)

### Academic Hierarchy
- School → many Courses
- Course → many Lessons
- Lesson → many Assignments
- Lesson → many Assessments
- Assessment → many Questions

### IEP Structure
- IEP → many GoalAreas
- GoalArea → many Goals
- IEP → many Accommodations
- IEP → many Services

## Indexes

Strategic indexes are created for:
- Foreign key relationships
- Frequently queried fields (email, code, status)
- Row-level security fields (tenantId, schoolId)
- Temporal fields (createdAt, dueDate, scheduledAt)

## Usage Examples

### Query a student's courses
```typescript
const studentCourses = await prisma.enrollment.findMany({
  where: {
    userId: studentId,
    status: 'active',
    tenantId: currentTenantId,
  },
  include: {
    course: {
      include: {
        teacher: true,
        lessons: true,
      },
    },
  },
});
```

### Create an IEP with goals
```typescript
const iep = await prisma.iEP.create({
  data: {
    studentId: studentId,
    coordinatorId: coordinatorId,
    startDate: new Date(),
    endDate: nextYear,
    tenantId: currentTenantId,
    schoolId: currentSchoolId,
    goalAreas: {
      create: [
        {
          name: 'Reading Comprehension',
          category: 'academic',
          tenantId: currentTenantId,
          schoolId: currentSchoolId,
          goals: {
            create: [
              {
                description: 'Student will read at grade level...',
                measurementCriteria: '80% accuracy on assessments',
                targetDate: endOfYear,
                tenantId: currentTenantId,
                schoolId: currentSchoolId,
              },
            ],
          },
        },
      ],
    },
  },
});
```

### Track emotional wellness
```typescript
const checkIn = await prisma.emotionalCheckIn.create({
  data: {
    userId: studentId,
    emotionalState: 'calm',
    intensity: 7,
    notes: 'Feeling better after talking with counselor',
    copingStrategies: JSON.stringify(['deep breathing', 'journaling']),
    tenantId: currentTenantId,
    schoolId: currentSchoolId,
  },
});
```

## Best Practices

### 1. Always Filter by Tenant
```typescript
// Good
const courses = await prisma.course.findMany({
  where: { tenantId: currentTenantId },
});

// Bad - could leak data across tenants
const courses = await prisma.course.findMany();
```

### 2. Respect Soft Deletes
```typescript
// Good
const activeCourses = await prisma.course.findMany({
  where: {
    tenantId: currentTenantId,
    deletedAt: null,
  },
});
```

### 3. Use Transactions for Complex Operations
```typescript
await prisma.$transaction(async (tx) => {
  const course = await tx.course.create({ data: courseData });
  await tx.enrollment.createMany({
    data: students.map(s => ({
      userId: s.id,
      courseId: course.id,
      tenantId: currentTenantId,
      schoolId: currentSchoolId,
    })),
  });
});
```

### 4. Audit Trail
```typescript
const userId = getCurrentUserId();
await prisma.assignment.create({
  data: {
    ...assignmentData,
    createdBy: userId,
    updatedBy: userId,
  },
});
```

## Migration Strategy

### Development
```bash
npm run prisma:migrate
```

### Production
```bash
# Generate SQL migration
npx prisma migrate dev --create-only

# Review the migration file
# Apply to production
npx prisma migrate deploy
```

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried fields are indexed
2. **Pagination**: Use cursor-based pagination for large datasets
3. **Select Fields**: Only select needed fields to reduce payload size
4. **Connection Pooling**: Configure appropriate connection limits in DATABASE_URL

## Security Checklist

- [ ] Implement row-level security in application layer
- [ ] Encrypt sensitive FERPA data at rest
- [ ] Use parameterized queries (Prisma handles this)
- [ ] Validate tenant/school access before any query
- [ ] Implement proper authentication and authorization
- [ ] Log access to sensitive data (IEP, emotional check-ins)
- [ ] Regular security audits of data access patterns

## Support

For questions or issues with the schema:
1. Check the Prisma documentation: https://www.prisma.io/docs
2. Review the schema comments for field-level documentation
3. Consult the Root Work Framework LMS documentation

## License

See LICENSE file in the repository root.
