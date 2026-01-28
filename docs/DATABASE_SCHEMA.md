# RootWork LMS - Database Schema Documentation

## Overview

The RootWork LMS database is designed to support a complete K-12 learning management system with special education (IEP) tracking and gamification features.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  USER MANAGEMENT                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐                    ┌─────────────────┐
│     User     │◄──────────────────►│  ParentStudent  │
│              │  (self-referential │   (join table)  │
│ Roles:       │    many-to-many)   └─────────────────┘
│ - STUDENT    │
│ - TEACHER    │────────────────────┐
│ - ADMIN      │                    │ instructs
│ - PARENT     │                    ▼
└──────────────┘           ┌─────────────────┐
       │                   │     Course      │
       │ enrolls           │                 │
       ▼                   │ - DRAFT         │
┌──────────────────┐       │ - PUBLISHED     │
│ CourseEnrollment │◄──────│ - ARCHIVED      │
└──────────────────┘       └────────┬────────┘
                                    │
                                    │ contains
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌───────────┐   ┌─────────────┐   ┌────────────────┐
            │  Lesson   │   │ Assignment  │   │   Curriculum   │
            │           │   │             │   │                │
            │ Types:    │   │ - DRAFT     │   │ Groups courses │
            │ - VIDEO   │   │ - PUBLISHED │   │ by grade/subj  │
            │ - TEXT    │   │ - CLOSED    │   └────────────────┘
            │ - QUIZ    │   └──────┬──────┘
            │ - ASSIGN. │          │
            │ - INTERACT│          ▼
            └─────┬─────┘   ┌────────────────────┐
                  │         │ AssignmentSubmission│
                  ▼         │                    │
         ┌────────────────┐ │ - PENDING          │
         │ LessonProgress │ │ - SUBMITTED        │
         └────────────────┘ │ - GRADED           │
                            │ - RETURNED         │
                            └────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SPECIAL EDUCATION (IEP)                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌─────────────────────┐
│     User     │       │         IEP         │
│  (STUDENT)   │──────►│                     │
└──────────────┘       │ - goals (JSON)      │
                       │ - accommodations    │
                       │ - services          │
                       │ - presentLevels     │
                       │                     │
                       │ Status:             │
                       │ - DRAFT             │
                       │ - ACTIVE            │
                       │ - COMPLETED         │
                       │ - ARCHIVED          │
                       └──────────┬──────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ IEPGoalProgress │  │   IEPMeeting    │  │  IEPServiceLog  │
    │                 │  │                 │  │                 │
    │ Tracks progress │  │ - annual        │  │ Service session │
    │ on each goal    │  │ - amendment     │  │ tracking        │
    │                 │  │ - transition    │  │                 │
    └─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                         GAMIFICATION (Learning Garden)                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     User     │──────►│     Garden      │──────►│   GardenPlant   │
│  (STUDENT)   │       │                 │       │                 │
└──────────────┘       │ Virtual garden  │       │ Types:          │
       │               │ space           │       │ - FLOWER        │
       │               └─────────────────┘       │ - TREE          │
       │                                         │ - PLANT         │
       │                                         │ - DECORATION    │
       ▼                                         │                 │
┌─────────────────┐                              │ Properties:     │
│  GardenReward   │                              │ - level         │
│                 │                              │ - xp            │
│ Types:          │                              │ - health        │
│ - SEED          │                              │ - position      │
│ - FERTILIZER    │                              └─────────────────┘
│ - DECORATION    │
│ - XP            │
│ - BADGE         │
└─────────────────┘
```

---

## Model Details

### User

The central entity for all system users.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique login identifier |
| firstName | String | User's first name |
| lastName | String | User's last name |
| password | String? | Hashed password (nullable for OAuth) |
| role | Enum | STUDENT, TEACHER, ADMIN, PARENT |
| gradeLevel | String? | For students: "K", "1"-"12" |
| avatar | String? | Profile image URL |
| bio | String? | User biography |
| isActive | Boolean | Account status |

### Curriculum

Groups courses by grade level and subject area.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| title | String | e.g., "Elementary Mathematics (K-2)" |
| description | String? | Curriculum overview |
| gradeLevel | String | e.g., "K-2", "3-5", "6-8", "9-12" |
| subject | String | e.g., "Mathematics", "Science", "ELA" |
| status | Enum | DRAFT, ACTIVE, ARCHIVED |

### Course

Individual courses containing lessons and assignments.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| title | String | Course name |
| description | String? | Course overview |
| instructorId | UUID | Teacher who created/teaches the course |
| curriculumId | UUID? | Optional parent curriculum |
| duration | Int? | Estimated hours to complete |
| status | Enum | DRAFT, PUBLISHED, ARCHIVED |
| thumbnail | String? | Course image URL |

### Lesson

Individual learning units within a course.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| courseId | UUID | Parent course |
| title | String | Lesson title |
| content | Text? | Lesson content (markdown/JSON for quizzes) |
| orderIndex | Int | Display order in course |
| duration | Int? | Estimated minutes |
| type | Enum | VIDEO, TEXT, QUIZ, ASSIGNMENT, INTERACTIVE |
| status | Enum | DRAFT, PUBLISHED |
| videoUrl | String? | Video URL if type is VIDEO |
| resources | JSON? | Additional resource links |

### IEP (Individualized Education Program)

Special education tracking with IDEA compliance features.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| studentId | UUID | Student receiving services |
| title | String | IEP title/name |
| description | Text? | IEP summary |
| goals | JSON | Array of goal objects (see below) |
| accommodations | JSON | Array of accommodation objects |
| services | JSON? | Array of service definitions |
| presentLevels | JSON? | Current academic/functional levels |
| startDate | DateTime | IEP effective date |
| endDate | DateTime | IEP end date |
| nextReviewDate | DateTime? | Next scheduled review |
| status | Enum | DRAFT, ACTIVE, COMPLETED, ARCHIVED |
| caseManagerId | String? | Teacher responsible for IEP |

#### IEP Goals JSON Structure:
```json
{
  "id": "goal-1",
  "area": "Reading",
  "description": "Student will improve reading comprehension...",
  "baseline": "Currently at 55% accuracy",
  "targetDate": "2025-06-01",
  "measurementMethod": "Curriculum-based assessments"
}
```

#### IEP Accommodations JSON Structure:
```json
{
  "type": "Timing",
  "description": "Extended time on tests (time and a half)"
}
```

#### IEP Services JSON Structure:
```json
{
  "type": "Specialized Instruction",
  "frequency": "5x weekly",
  "duration": 30,
  "provider": "Special Education Teacher",
  "location": "Resource Room"
}
```

### Garden (Gamification)

Virtual garden space where students grow plants by completing learning activities.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| studentId | UUID | Garden owner |
| name | String | Garden name |

### GardenPlant

Individual plants/decorations in a student's garden.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| gardenId | UUID | Parent garden |
| name | String | Plant name (e.g., "Knowledge Sunflower") |
| type | Enum | FLOWER, TREE, PLANT, DECORATION |
| level | Int | Growth level (1-10) |
| xp | Int | Experience points |
| health | Int | 0-100 health percentage |
| lastWatered | DateTime? | Last interaction time |
| positionX/Y | Int | Canvas position |

### GardenReward

Rewards earned through learning activities.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| studentId | UUID | Reward recipient |
| rewardType | Enum | SEED, FERTILIZER, DECORATION, XP, BADGE |
| amount | Int | Quantity earned |
| reason | String | How reward was earned |
| earnedAt | DateTime | When earned |

---

## JSON Field Schemas

### Quiz Content (Lesson.content when type = QUIZ)

```json
{
  "questions": [
    {
      "question": "What is 2 × 7?",
      "options": ["12", "14", "16", "18"],
      "correct": 1
    }
  ]
}
```

### Assignment Rubric (Assignment.rubric)

```json
{
  "criteria": [
    {
      "name": "Accuracy",
      "points": 80,
      "description": "4 points per correct answer"
    },
    {
      "name": "Work Shown",
      "points": 20,
      "description": "Show your thinking"
    }
  ]
}
```

### IEP Present Levels (IEP.presentLevels)

```json
{
  "academic": "Student is performing below grade level in reading...",
  "functional": "Student follows classroom routines well...",
  "strengths": ["Strong verbal skills", "Good problem-solving"],
  "concerns": ["Reading fluency below grade level", "Needs support"]
}
```

---

## Indexes

The following indexes are created for query optimization:

| Table | Index | Purpose |
|-------|-------|---------|
| users | email (unique) | Login lookup |
| course_enrollments | courseId, studentId (unique) | Prevent duplicate enrollment |
| lesson_progress | lessonId, studentId (unique) | Track unique progress |
| audit_logs | userId | User activity queries |
| audit_logs | entityType, entityId | Entity history |
| audit_logs | createdAt | Time-based queries |

---

## Migrations

When modifying the schema in production:

```bash
# Create a new migration
cd packages/database
pnpm migrate --name describe_your_change

# Apply in production
pnpm migrate:deploy
```

Never use `pnpm push` in production as it can cause data loss.
