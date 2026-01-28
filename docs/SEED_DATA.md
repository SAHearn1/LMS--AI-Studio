# RootWork LMS - Seed Data Documentation

## Overview

The seed script (`packages/database/prisma/seed.ts`) populates the database with comprehensive demo data suitable for testing, development, and demonstrations.

---

## Quick Start

```bash
cd packages/database
pnpm install
pnpm generate   # Generate Prisma client
pnpm push       # Create database tables
pnpm seed       # Populate with demo data
```

---

## Demo Accounts

### Administrators

| Email | Name | Role |
|-------|------|------|
| admin@rootwork.edu | System Administrator | ADMIN |
| principal@rootwork.edu | Patricia Williams | ADMIN (Principal) |

### Teachers

| Email | Name | Subject |
|-------|------|---------|
| msmith@rootwork.edu | Maria Smith | Mathematics |
| jchen@rootwork.edu | James Chen | Science |
| agarcia@rootwork.edu | Ana Garcia | English Language Arts |
| djohnson@rootwork.edu | David Johnson | Social Studies/History |
| specialed@rootwork.edu | Sarah Thompson | Special Education Coordinator |

### Students (by Grade Level)

| Email | Name | Grade | Notes |
|-------|------|-------|-------|
| emma.k@rootwork.edu | Emma Anderson | K | |
| liam.1@rootwork.edu | Liam Brown | 1 | |
| olivia.2@rootwork.edu | Olivia Davis | 2 | |
| noah.3@rootwork.edu | Noah Wilson | 3 | **Has IEP** (Reading) |
| ava.4@rootwork.edu | Ava Martinez | 4 | |
| ethan.5@rootwork.edu | Ethan Taylor | 5 | **Has IEP** (Math) |
| sophia.6@rootwork.edu | Sophia Thomas | 6 | |
| mason.7@rootwork.edu | Mason Jackson | 7 | |
| isabella.8@rootwork.edu | Isabella White | 8 | **Has IEP** (Social-Emotional) |
| jacob.9@rootwork.edu | Jacob Harris | 9 | |
| mia.10@rootwork.edu | Mia Clark | 10 | |
| william.11@rootwork.edu | William Lewis | 11 | |
| charlotte.12@rootwork.edu | Charlotte Walker | 12 | |
| alexander.3@rootwork.edu | Alexander Hall | 3 | |
| amelia.5@rootwork.edu | Amelia Allen | 5 | |
| benjamin.7@rootwork.edu | Benjamin Young | 7 | |
| harper.10@rootwork.edu | Harper King | 10 | |

### Parents

| Email | Name | Linked Children |
|-------|------|-----------------|
| parent.anderson@email.com | Michael Anderson | Emma (K) |
| parent.brown@email.com | Jennifer Brown | Liam (1st) |
| parent.martinez@email.com | Carlos Martinez | Ava (4th) |

**Default Password**: `demo123` (stored as placeholder hash)

---

## Curricula

### Mathematics

| Curriculum | Grade Range | Status |
|------------|-------------|--------|
| Elementary Mathematics (K-2) | K-2 | ACTIVE |
| Elementary Mathematics (3-5) | 3-5 | ACTIVE |
| Middle School Mathematics (6-8) | 6-8 | ACTIVE |
| High School Mathematics (9-12) | 9-12 | ACTIVE |

### English Language Arts

| Curriculum | Grade Range | Status |
|------------|-------------|--------|
| Elementary ELA (K-2) | K-2 | ACTIVE |
| Elementary ELA (3-5) | 3-5 | ACTIVE |
| Middle School ELA (6-8) | 6-8 | ACTIVE |

### Science

| Curriculum | Grade Range | Status |
|------------|-------------|--------|
| Elementary Science (K-5) | K-5 | ACTIVE |
| Middle School Science (6-8) | 6-8 | ACTIVE |

### Social Studies

| Curriculum | Grade Range | Status |
|------------|-------------|--------|
| Social Studies (K-5) | K-5 | ACTIVE |

---

## Courses

### 1. Multiplication Mastery (3rd Grade Math)

**Instructor**: Maria Smith  
**Duration**: 36 hours  
**Status**: PUBLISHED

**Lessons**:
1. Introduction to Multiplication (TEXT, 30 min)
2. Multiplication with Arrays (INTERACTIVE, 35 min)
3. Times Tables: 2s and 5s (TEXT/VIDEO, 25 min)
4. Times Tables Quiz: 2s and 5s (QUIZ, 15 min)
5. Times Tables: 3s and 4s (TEXT, 30 min)
6. Word Problems with Multiplication (TEXT, 40 min)

**Assignment**: Multiplication Facts Practice (100 points, due in 7 days)

### 2. Ecosystems and Food Webs (5th Grade Science)

**Instructor**: James Chen  
**Duration**: 24 hours  
**Status**: PUBLISHED

**Lessons**:
1. What is an Ecosystem? (TEXT, 35 min)
2. Producers, Consumers, and Decomposers (VIDEO, 40 min)
3. Food Chains (TEXT, 30 min)
4. Food Webs (INTERACTIVE, 45 min)
5. Ecosystem Quiz (QUIZ, 20 min)

### 3. Persuasive Writing Workshop (7th Grade ELA)

**Instructor**: Ana Garcia  
**Duration**: 30 hours  
**Status**: PUBLISHED

**Lessons**:
1. What is Persuasive Writing? (TEXT, 40 min)
2. Building a Strong Argument (TEXT, 45 min)
3. Using Evidence Effectively (TEXT, 35 min)
4. Persuasive Techniques (VIDEO, 40 min)

**Assignment**: Persuasive Essay: School Policy (100 points, due in 14 days)

### 4. Algebra 1: Foundations (9th-10th Grade Math)

**Instructor**: Maria Smith  
**Duration**: 48 hours  
**Status**: PUBLISHED

**Lessons**:
1. Variables and Expressions (TEXT, 45 min)
2. Order of Operations (TEXT, 40 min)
3. Solving One-Step Equations (VIDEO, 50 min)
4. Solving Two-Step Equations (TEXT, 50 min)
5. Equations Quiz (QUIZ, 20 min)

---

## IEP Data

### IEP 1: Noah Wilson (3rd Grade)

**Focus**: Reading & Written Expression  
**Case Manager**: Sarah Thompson  
**Status**: ACTIVE

**Goals**:
1. **Reading Comprehension**: Identify main ideas with 80% accuracy (baseline: 55%)
2. **Reading Fluency**: Increase from 65 to 90 WCPM
3. **Written Expression**: Write 5-sentence paragraphs with ≤3 errors

**Accommodations**:
- Audio recordings of texts
- Extended time for reading (1.5x)
- Graphic organizers for writing
- Speech-to-text software
- Preferential seating
- Extended test time
- Breaks during work

**Services**:
- Specialized Instruction: 5x weekly, 30 min
- Reading Intervention: 3x weekly, 20 min

**Progress Tracking**: Goal progress entries show improvement over time

### IEP 2: Ethan Taylor (5th Grade)

**Focus**: Mathematics & Executive Function  
**Case Manager**: Sarah Thompson  
**Status**: ACTIVE

**Goals**:
1. **Math Problem Solving**: Solve multi-step problems with 75% accuracy (baseline: 45%)
2. **Math Fluency**: Multiplication facts at 40/min (baseline: 22/min)
3. **Executive Function**: Independent planner use 80% of time

**Accommodations**:
- Calculator for complex calculations
- Multiplication chart
- Graph paper
- Reduced distraction seating
- Extended math test time
- Daily planner check
- Color-coded folders

**Services**:
- Specialized Instruction: 5x weekly, 30 min
- Math Intervention: 2x weekly, 30 min

### IEP 3: Isabella White (8th Grade)

**Focus**: Social-Emotional & Self-Advocacy  
**Case Manager**: Sarah Thompson  
**Status**: ACTIVE

**Goals**:
1. **Social-Emotional**: Use coping strategies in 4/5 stressful situations
2. **Self-Advocacy**: Independently request accommodations 80% of time
3. **Transition**: Identify and research 3 career paths

**Accommodations**:
- Access to quiet space
- Extended test time
- Weekly counselor check-in
- Pre-arranged signal to leave class
- Written instructions

**Services**:
- Counseling: 2x weekly, 30 min
- Social Skills Group: 1x weekly, 45 min

---

## Garden Gamification

### Plants (Assigned Randomly)

| Plant Name | Type | Earned Through |
|------------|------|----------------|
| Knowledge Sunflower | FLOWER | Completing lessons |
| Math Oak | TREE | Math achievements |
| Reading Rose | FLOWER | Reading progress |
| Science Succulent | PLANT | Science activities |
| Writing Willow | TREE | Writing assignments |
| Creativity Cactus | PLANT | Creative projects |
| Problem-Solving Pine | TREE | Complex problems |
| Teamwork Tulip | FLOWER | Collaboration |

**Each student receives**: 2-5 random plants with varying levels (1-5), XP (0-500), and health (70-100).

### Rewards

| Reward Type | Sample Reasons |
|-------------|----------------|
| XP (25) | Completed lesson |
| XP (50) | Perfect quiz score |
| XP (15) | Helped a classmate |
| SEED (1) | Finished a course module |
| FERTILIZER (2) | Logged in 5 days in a row |
| BADGE (1) | Math Master achievement |
| DECORATION (1) | First assignment submitted |

**Each student receives**: 3-8 random rewards

---

## Announcements

| Author | Title | Scope | Pinned |
|--------|-------|-------|--------|
| Principal Williams | Welcome to the New School Year! | School-wide | Yes |
| Maria Smith | Multiplication Facts Challenge! | Math Course | No |
| James Chen | Field Trip Permission Forms | Science Course | Yes |

---

## Enrollment Summary

| Course | Enrolled Students |
|--------|-------------------|
| Multiplication Mastery | 3rd graders (Noah, Alexander) |
| Ecosystems and Food Webs | 5th graders (Ethan, Amelia) |
| Persuasive Writing Workshop | 7th graders (Mason, Benjamin) |
| Algebra 1: Foundations | 9th & 10th graders (Jacob, Mia, Harper) |

Each enrolled student has:
- Random progress (10-70%)
- Some lesson completion records
- Quiz scores where applicable

---

## Customizing Seed Data

To modify the seed data, edit `packages/database/prisma/seed.ts`:

```typescript
// Add more students
const studentData = [
  { email: 'newstudent@rootwork.edu', firstName: 'New', lastName: 'Student', grade: '6' },
  // ... add more
];

// Add more courses
const newCourse = await prisma.course.create({
  data: {
    title: 'My New Course',
    // ... course details
  },
});

// Re-run seed (this clears existing data!)
// pnpm seed
```

---

## Testing Scenarios

The seed data supports these testing scenarios:

1. **Student Dashboard**: Login as any student to see courses, progress, garden
2. **Teacher Dashboard**: Login as teacher to see classes, grade assignments
3. **Admin Dashboard**: Login as admin for school-wide view
4. **Parent Portal**: Login as parent to view child's progress
5. **IEP Management**: View Noah, Ethan, or Isabella for IEP workflows
6. **Course Completion**: Students have partial progress for testing
7. **Gamification**: All students have gardens with plants and rewards
