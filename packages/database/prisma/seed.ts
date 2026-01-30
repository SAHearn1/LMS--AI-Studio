/**
 * RootWork LMS - Comprehensive Database Seed
 * 
 * Creates a fully functional demo environment with:
 * - Users across all roles (admin, teachers, students, parents)
 * - K-12 curricula for multiple subjects
 * - Courses with complete lesson content
 * - IEP data with goals, accommodations, and progress tracking
 * - Garden gamification with plants and rewards
 */

import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// ============================================
// HELPER FUNCTIONS
// ============================================

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

// Placeholder password hash (in production, use bcrypt)
const DEMO_PASSWORD = '$2b$10$demopasswordhash';

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await cleanDatabase();

  // ==========================================
  // 1. CREATE USERS
  // ==========================================
  console.log('\n👤 Creating users...');

  // Admins
  const admin = await prisma.user.create({
    data: {
      email: 'admin@rootwork.edu',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      bio: 'System administrator for RootWork LMS',
      password: DEMO_PASSWORD,
    },
  });
  console.log(`  ✓ Admin: ${admin.email}`);

  const principalAdmin = await prisma.user.create({
    data: {
      email: 'principal@rootwork.edu',
      firstName: 'Patricia',
      lastName: 'Williams',
      role: 'ADMIN',
      bio: 'School Principal',
      password: DEMO_PASSWORD,
    },
  });

  // Teachers (by subject specialty)
  const teachers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'msmith@rootwork.edu',
        firstName: 'Maria',
        lastName: 'Smith',
        role: 'TEACHER',
        bio: 'Mathematics teacher with 15 years experience. Specializes in making math accessible and fun.',
        password: DEMO_PASSWORD,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jchen@rootwork.edu',
        firstName: 'James',
        lastName: 'Chen',
        role: 'TEACHER',
        bio: 'Science teacher passionate about hands-on learning and STEM education.',
        password: DEMO_PASSWORD,
      },
    }),
    prisma.user.create({
      data: {
        email: 'agarcia@rootwork.edu',
        firstName: 'Ana',
        lastName: 'Garcia',
        role: 'TEACHER',
        bio: 'English Language Arts teacher. Creative writing enthusiast and literacy advocate.',
        password: DEMO_PASSWORD,
      },
    }),
    prisma.user.create({
      data: {
        email: 'djohnson@rootwork.edu',
        firstName: 'David',
        lastName: 'Johnson',
        role: 'TEACHER',
        bio: 'Social Studies and History teacher. Brings history to life through storytelling.',
        password: DEMO_PASSWORD,
      },
    }),
    prisma.user.create({
      data: {
        email: 'specialed@rootwork.edu',
        firstName: 'Sarah',
        lastName: 'Thompson',
        role: 'TEACHER',
        bio: 'Special Education Coordinator. Certified in differentiated instruction and IEP development.',
        password: DEMO_PASSWORD,
      },
    }),
  ]);
  console.log(`  ✓ Teachers: ${teachers.length} created`);

  // Students across grade levels
  const studentData = [
    // Elementary (K-5)
    { email: 'emma.k@rootwork.edu', firstName: 'Emma', lastName: 'Anderson', grade: 'K' },
    { email: 'liam.1@rootwork.edu', firstName: 'Liam', lastName: 'Brown', grade: '1' },
    { email: 'olivia.2@rootwork.edu', firstName: 'Olivia', lastName: 'Davis', grade: '2' },
    { email: 'noah.3@rootwork.edu', firstName: 'Noah', lastName: 'Wilson', grade: '3' },
    { email: 'ava.4@rootwork.edu', firstName: 'Ava', lastName: 'Martinez', grade: '4' },
    { email: 'ethan.5@rootwork.edu', firstName: 'Ethan', lastName: 'Taylor', grade: '5' },
    // Middle School (6-8)
    { email: 'sophia.6@rootwork.edu', firstName: 'Sophia', lastName: 'Thomas', grade: '6' },
    { email: 'mason.7@rootwork.edu', firstName: 'Mason', lastName: 'Jackson', grade: '7' },
    { email: 'isabella.8@rootwork.edu', firstName: 'Isabella', lastName: 'White', grade: '8' },
    // High School (9-12)
    { email: 'jacob.9@rootwork.edu', firstName: 'Jacob', lastName: 'Harris', grade: '9' },
    { email: 'mia.10@rootwork.edu', firstName: 'Mia', lastName: 'Clark', grade: '10' },
    { email: 'william.11@rootwork.edu', firstName: 'William', lastName: 'Lewis', grade: '11' },
    { email: 'charlotte.12@rootwork.edu', firstName: 'Charlotte', lastName: 'Walker', grade: '12' },
    // Additional students for class diversity
    { email: 'alexander.3@rootwork.edu', firstName: 'Alexander', lastName: 'Hall', grade: '3' },
    { email: 'amelia.5@rootwork.edu', firstName: 'Amelia', lastName: 'Allen', grade: '5' },
    { email: 'benjamin.7@rootwork.edu', firstName: 'Benjamin', lastName: 'Young', grade: '7' },
    { email: 'harper.10@rootwork.edu', firstName: 'Harper', lastName: 'King', grade: '10' },
  ];

  const students = await Promise.all(
    studentData.map((s) =>
      prisma.user.create({
        data: {
          email: s.email,
          firstName: s.firstName,
          lastName: s.lastName,
          role: 'STUDENT',
          gradeLevel: s.grade,
          password: DEMO_PASSWORD,
        },
      })
    )
  );
  console.log(`  ✓ Students: ${students.length} created (K-12)`);

  // Parents
  const parents = await Promise.all([
    prisma.user.create({
      data: {
        email: 'parent.anderson@email.com',
        firstName: 'Michael',
        lastName: 'Anderson',
        role: 'PARENT',
        password: DEMO_PASSWORD,
      },
    }),
    prisma.user.create({
      data: {
        email: 'parent.brown@email.com',
        firstName: 'Jennifer',
        lastName: 'Brown',
        role: 'PARENT',
        password: DEMO_PASSWORD,
      },
    }),
    prisma.user.create({
      data: {
        email: 'parent.martinez@email.com',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'PARENT',
        password: DEMO_PASSWORD,
      },
    }),
  ]);
  console.log(`  ✓ Parents: ${parents.length} created`);

  // Link parents to students
  await prisma.parentStudent.createMany({
    data: [
      { parentId: parents[0].id, studentId: students[0].id }, // Anderson family (Emma K)
      { parentId: parents[1].id, studentId: students[1].id }, // Brown family (Liam 1st)
      { parentId: parents[2].id, studentId: students[4].id }, // Martinez family (Ava 4th)
    ],
  });

  // ==========================================
  // 2. CREATE CURRICULA
  // ==========================================
  console.log('\n📚 Creating curricula...');

  const curricula = await Promise.all([
    // Mathematics
    prisma.curriculum.create({
      data: {
        title: 'Elementary Mathematics (K-2)',
        description: 'Foundation mathematics curriculum covering numbers, basic operations, shapes, and measurement.',
        gradeLevel: 'K-2',
        subject: 'Mathematics',
        status: 'ACTIVE',
      },
    }),
    prisma.curriculum.create({
      data: {
        title: 'Elementary Mathematics (3-5)',
        description: 'Intermediate mathematics covering multiplication, division, fractions, and geometry.',
        gradeLevel: '3-5',
        subject: 'Mathematics',
        status: 'ACTIVE',
      },
    }),
    prisma.curriculum.create({
      data: {
        title: 'Middle School Mathematics (6-8)',
        description: 'Pre-algebra and algebra foundations, ratios, proportions, and geometry.',
        gradeLevel: '6-8',
        subject: 'Mathematics',
        status: 'ACTIVE',
      },
    }),
    prisma.curriculum.create({
      data: {
        title: 'High School Mathematics (9-12)',
        description: 'Algebra, Geometry, Pre-Calculus, and Calculus pathways.',
        gradeLevel: '9-12',
        subject: 'Mathematics',
        status: 'ACTIVE',
      },
    }),
    // English Language Arts
    prisma.curriculum.create({
      data: {
        title: 'Elementary ELA (K-2)',
        description: 'Foundational literacy: phonics, reading comprehension, and early writing.',
        gradeLevel: 'K-2',
        subject: 'English Language Arts',
        status: 'ACTIVE',
      },
    }),
    prisma.curriculum.create({
      data: {
        title: 'Elementary ELA (3-5)',
        description: 'Reading comprehension, creative writing, grammar, and vocabulary development.',
        gradeLevel: '3-5',
        subject: 'English Language Arts',
        status: 'ACTIVE',
      },
    }),
    prisma.curriculum.create({
      data: {
        title: 'Middle School ELA (6-8)',
        description: 'Literary analysis, essay writing, research skills, and public speaking.',
        gradeLevel: '6-8',
        subject: 'English Language Arts',
        status: 'ACTIVE',
      },
    }),
    // Science
    prisma.curriculum.create({
      data: {
        title: 'Elementary Science (K-5)',
        description: 'Exploring the natural world through hands-on experiments and observation.',
        gradeLevel: 'K-5',
        subject: 'Science',
        status: 'ACTIVE',
      },
    }),
    prisma.curriculum.create({
      data: {
        title: 'Middle School Science (6-8)',
        description: 'Life science, earth science, and physical science foundations.',
        gradeLevel: '6-8',
        subject: 'Science',
        status: 'ACTIVE',
      },
    }),
    // Social Studies
    prisma.curriculum.create({
      data: {
        title: 'Social Studies (K-5)',
        description: 'Community, geography, and introduction to history and civics.',
        gradeLevel: 'K-5',
        subject: 'Social Studies',
        status: 'ACTIVE',
      },
    }),
  ]);
  console.log(`  ✓ Curricula: ${curricula.length} created`);

  // ==========================================
  // 3. CREATE COURSES WITH LESSONS
  // ==========================================
  console.log('\n📖 Creating courses and lessons...');

  // Math Course: 3rd Grade Multiplication
  const mathCourse3 = await prisma.course.create({
    data: {
      title: 'Multiplication Mastery',
      description: 'Master multiplication facts and strategies. Learn to multiply single and multi-digit numbers with confidence.',
      instructorId: teachers[0].id, // Maria Smith
      curriculumId: curricula[1].id, // Elementary Math 3-5
      duration: 36,
      status: 'PUBLISHED',
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: mathCourse3.id,
        title: 'Introduction to Multiplication',
        content: `# What is Multiplication?\n\nMultiplication is a quick way to add the same number multiple times.\n\n## Key Concepts\n- Multiplication as repeated addition\n- The multiplication symbol (×)\n- Understanding factors and products\n\n## Example\n3 × 4 means adding 3 four times: 3 + 3 + 3 + 3 = 12`,
        orderIndex: 1,
        duration: 30,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: mathCourse3.id,
        title: 'Multiplication with Arrays',
        content: `# Using Arrays to Multiply\n\nArrays help us visualize multiplication problems.\n\n## What is an Array?\nAn array is a group of objects arranged in rows and columns.\n\n## Practice\n- Create arrays for 2 × 5\n- Create arrays for 4 × 3`,
        orderIndex: 2,
        duration: 35,
        type: 'INTERACTIVE',
        status: 'PUBLISHED',
      },
      {
        courseId: mathCourse3.id,
        title: 'Times Tables: 2s and 5s',
        content: `# The 2 and 5 Times Tables\n\n## 2 Times Table\n2, 4, 6, 8, 10, 12, 14, 16, 18, 20\n\n## 5 Times Table\n5, 10, 15, 20, 25, 30, 35, 40, 45, 50\n\n## Tips\n- 2s always end in 0, 2, 4, 6, or 8\n- 5s always end in 0 or 5`,
        orderIndex: 3,
        duration: 25,
        type: 'TEXT',
        status: 'PUBLISHED',
        videoUrl: 'https://example.com/videos/times-tables-2-5',
      },
      {
        courseId: mathCourse3.id,
        title: 'Times Tables Quiz: 2s and 5s',
        content: JSON.stringify({
          questions: [
            { question: '2 × 7 = ?', options: ['12', '14', '16', '18'], correct: 1 },
            { question: '5 × 6 = ?', options: ['25', '30', '35', '40'], correct: 1 },
            { question: '2 × 9 = ?', options: ['16', '17', '18', '19'], correct: 2 },
            { question: '5 × 8 = ?', options: ['35', '40', '45', '50'], correct: 1 },
          ],
        }),
        orderIndex: 4,
        duration: 15,
        type: 'QUIZ',
        status: 'PUBLISHED',
      },
      {
        courseId: mathCourse3.id,
        title: 'Times Tables: 3s and 4s',
        content: `# The 3 and 4 Times Tables\n\n## 3 Times Table\n3, 6, 9, 12, 15, 18, 21, 24, 27, 30\n\n## 4 Times Table\n4, 8, 12, 16, 20, 24, 28, 32, 36, 40\n\n## Strategy: Double and Double Again\nTo multiply by 4, double the number, then double again!`,
        orderIndex: 5,
        duration: 30,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: mathCourse3.id,
        title: 'Word Problems with Multiplication',
        content: `# Solving Word Problems\n\n## Steps to Solve\n1. Read the problem carefully\n2. Identify what you need to find\n3. Look for clue words (each, every, per, groups of)\n4. Write the multiplication equation\n5. Solve and check your answer\n\n## Example\nSara has 5 bags of apples. Each bag has 6 apples. How many apples does Sara have in all?\n\n5 × 6 = 30 apples`,
        orderIndex: 6,
        duration: 40,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
    ],
  });

  // Math Assignment
  await prisma.assignment.create({
    data: {
      courseId: mathCourse3.id,
      title: 'Multiplication Facts Practice',
      description: 'Complete 20 multiplication problems covering 2s, 3s, 4s, and 5s times tables.',
      dueDate: daysFromNow(7),
      maxPoints: 100,
      status: 'PUBLISHED',
      rubric: {
        criteria: [
          { name: 'Accuracy', points: 80, description: '4 points per correct answer' },
          { name: 'Work Shown', points: 20, description: 'Show your thinking' },
        ],
      },
    },
  });

  // Science Course: 5th Grade Life Science
  const scienceCourse5 = await prisma.course.create({
    data: {
      title: 'Ecosystems and Food Webs',
      description: 'Explore how living things interact in ecosystems. Learn about producers, consumers, decomposers, and energy flow.',
      instructorId: teachers[1].id, // James Chen
      curriculumId: curricula[7].id, // Elementary Science
      duration: 24,
      status: 'PUBLISHED',
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: scienceCourse5.id,
        title: 'What is an Ecosystem?',
        content: `# Understanding Ecosystems\n\nAn ecosystem is a community of living organisms interacting with their environment.\n\n## Components\n- **Biotic factors**: Living things (plants, animals, bacteria)\n- **Abiotic factors**: Non-living things (water, sunlight, soil, temperature)\n\n## Types of Ecosystems\n- Forest\n- Desert\n- Ocean\n- Grassland\n- Freshwater`,
        orderIndex: 1,
        duration: 35,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: scienceCourse5.id,
        title: 'Producers, Consumers, and Decomposers',
        content: `# Roles in an Ecosystem\n\n## Producers\nMake their own food through photosynthesis (plants, algae)\n\n## Consumers\n- **Herbivores**: Eat only plants\n- **Carnivores**: Eat only animals\n- **Omnivores**: Eat both plants and animals\n\n## Decomposers\nBreak down dead organisms (fungi, bacteria)`,
        orderIndex: 2,
        duration: 40,
        type: 'VIDEO',
        status: 'PUBLISHED',
        videoUrl: 'https://example.com/videos/ecosystem-roles',
      },
      {
        courseId: scienceCourse5.id,
        title: 'Food Chains',
        content: `# Understanding Food Chains\n\nA food chain shows how energy flows from one organism to another.\n\n## Example Food Chain\nGrass → Grasshopper → Frog → Snake → Hawk\n\n## Energy Transfer\n- Energy starts with the sun\n- Producers capture energy\n- Only 10% of energy passes to the next level`,
        orderIndex: 3,
        duration: 30,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: scienceCourse5.id,
        title: 'Food Webs',
        content: `# From Chains to Webs\n\nA food web shows how multiple food chains connect in an ecosystem.\n\n## Why Food Webs Matter\n- Show complex relationships\n- Help predict what happens when species disappear\n- Demonstrate ecosystem balance`,
        orderIndex: 4,
        duration: 45,
        type: 'INTERACTIVE',
        status: 'PUBLISHED',
      },
      {
        courseId: scienceCourse5.id,
        title: 'Ecosystem Quiz',
        content: JSON.stringify({
          questions: [
            { question: 'Which organism is a producer?', options: ['Rabbit', 'Oak tree', 'Mushroom', 'Wolf'], correct: 1 },
            { question: 'What do decomposers do?', options: ['Make food from sunlight', 'Hunt other animals', 'Break down dead organisms', 'Eat only plants'], correct: 2 },
            { question: 'How much energy passes to the next level in a food chain?', options: ['50%', '25%', '10%', '100%'], correct: 2 },
          ],
        }),
        orderIndex: 5,
        duration: 20,
        type: 'QUIZ',
        status: 'PUBLISHED',
      },
    ],
  });

  // ELA Course: 7th Grade Writing
  const elaCourse7 = await prisma.course.create({
    data: {
      title: 'Persuasive Writing Workshop',
      description: 'Learn to craft compelling arguments and persuade your audience through well-structured essays.',
      instructorId: teachers[2].id, // Ana Garcia
      curriculumId: curricula[6].id, // Middle School ELA
      duration: 30,
      status: 'PUBLISHED',
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: elaCourse7.id,
        title: 'What is Persuasive Writing?',
        content: `# The Art of Persuasion\n\nPersuasive writing aims to convince readers to accept a particular viewpoint or take a specific action.\n\n## Elements of Persuasion\n- **Ethos**: Credibility and trustworthiness\n- **Pathos**: Emotional appeal\n- **Logos**: Logical reasoning and evidence\n\n## Where We See Persuasion\n- Advertisements\n- Political speeches\n- Opinion editorials\n- Product reviews`,
        orderIndex: 1,
        duration: 40,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: elaCourse7.id,
        title: 'Building a Strong Argument',
        content: `# Structure of a Persuasive Essay\n\n## Introduction\n- Hook the reader\n- Present your thesis (claim)\n\n## Body Paragraphs\n- Topic sentence\n- Evidence and examples\n- Analysis and explanation\n- Transition to next point\n\n## Counterargument\n- Acknowledge opposing views\n- Refute with evidence\n\n## Conclusion\n- Restate thesis\n- Call to action`,
        orderIndex: 2,
        duration: 45,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: elaCourse7.id,
        title: 'Using Evidence Effectively',
        content: `# Supporting Your Claims\n\n## Types of Evidence\n- Statistics and data\n- Expert opinions\n- Real-world examples\n- Personal anecdotes\n\n## Citing Sources\n- Always credit your sources\n- Use quotes sparingly\n- Paraphrase when possible`,
        orderIndex: 3,
        duration: 35,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: elaCourse7.id,
        title: 'Persuasive Techniques',
        content: `# Rhetorical Strategies\n\n## Techniques to Master\n- **Repetition**: Emphasize key points\n- **Rhetorical questions**: Engage readers\n- **Inclusive language**: "We" and "us"\n- **Strong verbs**: Action words that motivate\n- **Addressing counterarguments**: Shows fairness`,
        orderIndex: 4,
        duration: 40,
        type: 'VIDEO',
        status: 'PUBLISHED',
        videoUrl: 'https://example.com/videos/persuasive-techniques',
      },
    ],
  });

  // ELA Assignment
  await prisma.assignment.create({
    data: {
      courseId: elaCourse7.id,
      title: 'Persuasive Essay: School Policy',
      description: 'Write a 5-paragraph persuasive essay arguing for or against a school policy of your choice (dress code, cell phones, homework, etc.).',
      dueDate: daysFromNow(14),
      maxPoints: 100,
      status: 'PUBLISHED',
      rubric: {
        criteria: [
          { name: 'Thesis & Argument', points: 25, description: 'Clear, debatable thesis with strong argument' },
          { name: 'Evidence', points: 25, description: 'Relevant evidence with proper citations' },
          { name: 'Organization', points: 20, description: 'Logical flow with transitions' },
          { name: 'Counterargument', points: 15, description: 'Addresses and refutes opposing view' },
          { name: 'Grammar & Style', points: 15, description: 'Correct grammar, varied sentences' },
        ],
      },
    },
  });

  // High School Algebra Course
  const algebraCourse = await prisma.course.create({
    data: {
      title: 'Algebra 1: Foundations',
      description: 'Build a strong foundation in algebraic thinking. Topics include variables, equations, inequalities, and linear functions.',
      instructorId: teachers[0].id, // Maria Smith
      curriculumId: curricula[3].id, // High School Math
      duration: 48,
      status: 'PUBLISHED',
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: algebraCourse.id,
        title: 'Variables and Expressions',
        content: `# Introduction to Variables\n\nA variable is a symbol (usually a letter) that represents an unknown value.\n\n## Algebraic Expressions\n- **Term**: A number, variable, or product of both\n- **Coefficient**: The number multiplied by a variable\n- **Constant**: A term without a variable\n\n## Examples\n- 3x + 5: Two terms, coefficient 3, constant 5\n- 2a² - 4a + 1: Three terms`,
        orderIndex: 1,
        duration: 45,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: algebraCourse.id,
        title: 'Order of Operations',
        content: `# PEMDAS\n\n## The Order\n1. **P**arentheses\n2. **E**xponents\n3. **M**ultiplication and **D**ivision (left to right)\n4. **A**ddition and **S**ubtraction (left to right)\n\n## Example\n3 + 4 × 2² = 3 + 4 × 4 = 3 + 16 = 19`,
        orderIndex: 2,
        duration: 40,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: algebraCourse.id,
        title: 'Solving One-Step Equations',
        content: `# Balance and Inverse Operations\n\n## The Golden Rule\nWhatever you do to one side of an equation, do to the other.\n\n## Inverse Operations\n- Addition ↔ Subtraction\n- Multiplication ↔ Division\n\n## Examples\nx + 5 = 12 → x = 7\n3y = 24 → y = 8`,
        orderIndex: 3,
        duration: 50,
        type: 'VIDEO',
        status: 'PUBLISHED',
        videoUrl: 'https://example.com/videos/one-step-equations',
      },
      {
        courseId: algebraCourse.id,
        title: 'Solving Two-Step Equations',
        content: `# Two-Step Equations\n\n## Strategy\n1. Undo addition/subtraction first\n2. Then undo multiplication/division\n\n## Example\n2x + 3 = 11\n2x = 8 (subtract 3)\nx = 4 (divide by 2)`,
        orderIndex: 4,
        duration: 50,
        type: 'TEXT',
        status: 'PUBLISHED',
      },
      {
        courseId: algebraCourse.id,
        title: 'Equations Quiz',
        content: JSON.stringify({
          questions: [
            { question: 'Solve: x + 7 = 15', options: ['x = 8', 'x = 22', 'x = 7', 'x = 9'], correct: 0 },
            { question: 'Solve: 3x = 27', options: ['x = 24', 'x = 30', 'x = 9', 'x = 81'], correct: 2 },
            { question: 'Solve: 2x - 5 = 11', options: ['x = 3', 'x = 8', 'x = 6', 'x = 16'], correct: 1 },
            { question: 'What is the coefficient in 7y?', options: ['y', '7', '7y', '1'], correct: 1 },
          ],
        }),
        orderIndex: 5,
        duration: 20,
        type: 'QUIZ',
        status: 'PUBLISHED',
      },
    ],
  });

  console.log(`  ✓ Courses: 4 created with ${await prisma.lesson.count()} lessons`);

  // ==========================================
  // 4. ENROLL STUDENTS IN COURSES
  // ==========================================
  console.log('\n✍️ Enrolling students...');

  // Get course IDs
  const allCourses = await prisma.course.findMany();

  // Enroll students based on grade level
  const enrollments: Array<{ courseId: string; studentId: string; progress: number }> = [];

  // 3rd graders in Math multiplication course
  const grade3Students = students.filter((s) => s.gradeLevel === '3');
  grade3Students.forEach((student) => {
    enrollments.push({ courseId: mathCourse3.id, studentId: student.id, progress: Math.floor(Math.random() * 60) + 20 });
  });

  // 5th graders in Science course
  const grade5Students = students.filter((s) => s.gradeLevel === '5');
  grade5Students.forEach((student) => {
    enrollments.push({ courseId: scienceCourse5.id, studentId: student.id, progress: Math.floor(Math.random() * 50) + 30 });
  });

  // 7th graders in ELA course
  const grade7Students = students.filter((s) => s.gradeLevel === '7');
  grade7Students.forEach((student) => {
    enrollments.push({ courseId: elaCourse7.id, studentId: student.id, progress: Math.floor(Math.random() * 40) + 10 });
  });

  // 9th and 10th graders in Algebra
  const highSchoolStudents = students.filter((s) => ['9', '10'].includes(s.gradeLevel || ''));
  highSchoolStudents.forEach((student) => {
    enrollments.push({ courseId: algebraCourse.id, studentId: student.id, progress: Math.floor(Math.random() * 70) + 15 });
  });

  await prisma.courseEnrollment.createMany({ data: enrollments });
  console.log(`  ✓ Enrollments: ${enrollments.length} created`);

  // Create lesson progress for some students
  const lessons = await prisma.lesson.findMany({ where: { courseId: mathCourse3.id } });
  const mathStudents = grade3Students;

  for (const student of mathStudents) {
    const completedLessons = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < completedLessons && i < lessons.length; i++) {
      await prisma.lessonProgress.create({
        data: {
          lessonId: lessons[i].id,
          studentId: student.id,
          completed: true,
          score: lessons[i].type === 'QUIZ' ? Math.floor(Math.random() * 30) + 70 : null,
          timeSpent: Math.floor(Math.random() * 1800) + 600,
          completedAt: daysAgo(Math.floor(Math.random() * 14)),
        },
      });
    }
  }

  // ==========================================
  // 5. CREATE IEP DATA
  // ==========================================
  console.log('\n📋 Creating IEP data...');

  // Create IEPs for select students
  const studentsWithIEP = [students[3], students[5], students[8]]; // Noah (3rd), Ethan (5th), Isabella (8th)
  const specialEdTeacher = teachers[4]; // Sarah Thompson

  const iep1 = await prisma.iEP.create({
    data: {
      studentId: studentsWithIEP[0].id, // Noah, 3rd grade
      title: 'Annual IEP - Reading & Written Expression',
      description: 'Individualized Education Program focusing on reading comprehension and written expression skills.',
      caseManagerId: specialEdTeacher.id,
      goals: [
        {
          id: 'goal-1',
          area: 'Reading',
          description: 'Noah will improve reading comprehension by identifying main ideas and supporting details in grade-level texts with 80% accuracy.',
          baseline: 'Currently identifies main ideas with 55% accuracy',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Curriculum-based assessments, running records',
        },
        {
          id: 'goal-2',
          area: 'Reading',
          description: 'Noah will increase reading fluency from 65 WCPM to 90 WCPM on grade-level passages.',
          baseline: '65 words correct per minute',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Weekly fluency probes',
        },
        {
          id: 'goal-3',
          area: 'Written Expression',
          description: 'Noah will write a 5-sentence paragraph with a topic sentence, 3 supporting details, and a conclusion with 3 or fewer errors.',
          baseline: 'Currently writes 2-3 sentences with 6+ errors',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Writing samples, teacher observation',
        },
      ],
      accommodations: [
        { type: 'Presentation', description: 'Audio recordings of texts available' },
        { type: 'Presentation', description: 'Extended time for reading assignments (time and a half)' },
        { type: 'Response', description: 'Use of graphic organizers for writing' },
        { type: 'Response', description: 'Speech-to-text software available' },
        { type: 'Setting', description: 'Preferential seating near teacher' },
        { type: 'Timing', description: 'Extended time on tests (time and a half)' },
        { type: 'Timing', description: 'Breaks during extended work periods' },
      ],
      services: [
        { type: 'Specialized Instruction', frequency: '5x weekly', duration: 30, provider: 'Special Education Teacher', location: 'Resource Room' },
        { type: 'Reading Intervention', frequency: '3x weekly', duration: 20, provider: 'Reading Specialist', location: 'Small Group' },
      ],
      presentLevels: {
        academic: 'Noah is a 3rd grader who struggles with reading comprehension and written expression. His math skills are at grade level. He enjoys science and hands-on activities.',
        functional: 'Noah follows classroom routines well and interacts positively with peers. He sometimes becomes frustrated when faced with lengthy reading tasks.',
        strengths: ['Strong verbal skills', 'Good problem-solving in math', 'Enthusiastic learner', 'Works well with peers'],
        concerns: ['Reading fluency below grade level', 'Difficulty with written expression', 'Needs support with reading comprehension strategies'],
      },
      startDate: daysAgo(60),
      endDate: daysFromNow(305),
      nextReviewDate: daysFromNow(120),
      status: 'ACTIVE',
    },
  });

  // Add goal progress entries
  await prisma.iEPGoalProgress.createMany({
    data: [
      { iepId: iep1.id, goalId: 'goal-1', progress: 65, notes: 'Noah is showing improvement with identifying main ideas. Using graphic organizers has helped.', recordedAt: daysAgo(30) },
      { iepId: iep1.id, goalId: 'goal-1', progress: 72, notes: 'Continued progress. Noah correctly identified main ideas in 4 out of 5 passages this week.', recordedAt: daysAgo(14) },
      { iepId: iep1.id, goalId: 'goal-2', progress: 55, notes: 'Fluency increased to 72 WCPM. Consistent practice helping.', recordedAt: daysAgo(21) },
      { iepId: iep1.id, goalId: 'goal-3', progress: 40, notes: 'Working on topic sentences. Noah wrote a 4-sentence paragraph with graphic organizer support.', recordedAt: daysAgo(7) },
    ],
  });

  // Add IEP meeting
  await prisma.iEPMeeting.create({
    data: {
      iepId: iep1.id,
      meetingType: 'progress_review',
      scheduledAt: daysAgo(30),
      notes: 'Reviewed progress on all goals. Team agreed to continue current interventions. Parent expressed satisfaction with progress.',
      attendees: [
        { name: 'Sarah Thompson', role: 'Special Education Teacher/Case Manager' },
        { name: 'Maria Smith', role: 'General Education Teacher' },
        { name: 'Michael Anderson', role: 'Parent' },
        { name: 'Noah Wilson', role: 'Student' },
      ],
      decisions: ['Continue current services', 'Add visual supports for writing', 'Schedule home reading practice'],
    },
  });

  // Add service logs
  await prisma.iEPServiceLog.createMany({
    data: [
      { iepId: iep1.id, serviceType: 'Specialized Instruction', duration: 30, notes: 'Worked on reading comprehension strategies', sessionDate: daysAgo(1) },
      { iepId: iep1.id, serviceType: 'Specialized Instruction', duration: 30, notes: 'Writing workshop - topic sentences', sessionDate: daysAgo(2) },
      { iepId: iep1.id, serviceType: 'Reading Intervention', duration: 20, notes: 'Fluency practice with repeated reading', sessionDate: daysAgo(1) },
      { iepId: iep1.id, serviceType: 'Reading Intervention', duration: 20, notes: 'Vocabulary development activities', sessionDate: daysAgo(3) },
    ],
  });

  // Create second IEP (Ethan - 5th grade, Math focus)
  const iep2 = await prisma.iEP.create({
    data: {
      studentId: studentsWithIEP[1].id, // Ethan, 5th grade
      title: 'Annual IEP - Mathematics & Executive Function',
      description: 'IEP addressing math calculation difficulties and executive function skills.',
      caseManagerId: specialEdTeacher.id,
      goals: [
        {
          id: 'goal-1',
          area: 'Mathematics',
          description: 'Ethan will solve multi-step word problems using all four operations with 75% accuracy.',
          baseline: 'Currently solves with 45% accuracy',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Weekly math probes, curriculum assessments',
        },
        {
          id: 'goal-2',
          area: 'Mathematics',
          description: 'Ethan will demonstrate fluency with multiplication facts (0-12) at 40 facts per minute.',
          baseline: 'Currently at 22 facts per minute',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Timed fact fluency assessments',
        },
        {
          id: 'goal-3',
          area: 'Executive Function',
          description: 'Ethan will independently use a planner to track and complete assignments with 80% consistency.',
          baseline: 'Currently uses planner with adult prompting 50% of time',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Planner checks, assignment completion logs',
        },
      ],
      accommodations: [
        { type: 'Presentation', description: 'Calculator available for complex calculations' },
        { type: 'Presentation', description: 'Multiplication chart provided' },
        { type: 'Response', description: 'Graph paper for math problems' },
        { type: 'Setting', description: 'Reduced distraction seating' },
        { type: 'Timing', description: 'Extended time on math assessments' },
        { type: 'Organization', description: 'Daily planner check with teacher' },
        { type: 'Organization', description: 'Color-coded folders by subject' },
      ],
      services: [
        { type: 'Specialized Instruction', frequency: '5x weekly', duration: 30, provider: 'Special Education Teacher', location: 'Resource Room' },
        { type: 'Math Intervention', frequency: '2x weekly', duration: 30, provider: 'Math Interventionist', location: 'Small Group' },
      ],
      presentLevels: {
        academic: 'Ethan is a 5th grader performing below grade level in mathematics. His reading and writing skills are at grade level. He has difficulty with multi-step problems and math fact fluency.',
        functional: 'Ethan is well-liked by peers and participates in class discussions. He struggles with organization and time management.',
        strengths: ['Strong reading comprehension', 'Creative thinker', 'Good verbal communication', 'Positive attitude'],
        concerns: ['Math calculation difficulties', 'Slow processing speed', 'Executive function challenges', 'Needs organizational support'],
      },
      startDate: daysAgo(45),
      endDate: daysFromNow(320),
      nextReviewDate: daysFromNow(135),
      status: 'ACTIVE',
    },
  });

  // Create third IEP (Isabella - 8th grade, Social-Emotional)
  const iep3 = await prisma.iEP.create({
    data: {
      studentId: studentsWithIEP[2].id, // Isabella, 8th grade
      title: 'Annual IEP - Social-Emotional & Self-Advocacy',
      description: 'IEP focusing on social-emotional learning and self-advocacy skills for transition to high school.',
      caseManagerId: specialEdTeacher.id,
      goals: [
        {
          id: 'goal-1',
          area: 'Social-Emotional',
          description: 'Isabella will use coping strategies (deep breathing, positive self-talk) to manage anxiety in 4 out of 5 stressful situations.',
          baseline: 'Currently uses strategies in 2 out of 5 situations with prompting',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Self-monitoring checklist, counselor observations',
        },
        {
          id: 'goal-2',
          area: 'Self-Advocacy',
          description: 'Isabella will independently request accommodations from teachers in 80% of opportunities.',
          baseline: 'Currently requests with adult prompting',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Teacher reports, student self-report',
        },
        {
          id: 'goal-3',
          area: 'Transition',
          description: 'Isabella will identify career interests and research 3 potential career paths with required education/training.',
          baseline: 'Has not explored career options formally',
          targetDate: daysFromNow(180).toISOString(),
          measurementMethod: 'Transition portfolio, career exploration activities',
        },
      ],
      accommodations: [
        { type: 'Setting', description: 'Access to quiet space when overwhelmed' },
        { type: 'Timing', description: 'Extended time on assessments' },
        { type: 'Social-Emotional', description: 'Weekly check-in with school counselor' },
        { type: 'Social-Emotional', description: 'Pre-arranged signal to leave class if needed' },
        { type: 'Presentation', description: 'Written instructions in addition to verbal' },
      ],
      services: [
        { type: 'Counseling', frequency: '2x weekly', duration: 30, provider: 'School Counselor', location: 'Counseling Office' },
        { type: 'Social Skills Group', frequency: '1x weekly', duration: 45, provider: 'School Psychologist', location: 'Group Room' },
      ],
      presentLevels: {
        academic: 'Isabella performs at grade level in all academic subjects. She is a strong writer and excels in science. Academic performance can be impacted by anxiety.',
        functional: 'Isabella experiences anxiety in social situations and when facing unexpected changes. She has developed good friendships with a small peer group.',
        strengths: ['Strong academic skills', 'Creative writing ability', 'Empathetic and kind', 'Motivated to succeed', 'Self-aware about needs'],
        concerns: ['Anxiety impacts participation', 'Difficulty advocating for needs', 'Transition to high school concerns', 'Perfectionism'],
      },
      startDate: daysAgo(90),
      endDate: daysFromNow(275),
      nextReviewDate: daysFromNow(90),
      status: 'ACTIVE',
    },
  });

  console.log(`  ✓ IEPs: 3 created with goals, accommodations, and services`);

  // ==========================================
  // 6. CREATE GARDEN/GAMIFICATION DATA
  // ==========================================
  console.log('\n🌻 Creating garden gamification data...');

  // Create gardens for all students
  const gardenData = students.map((student) => ({
    studentId: student.id,
    name: `${student.firstName}'s Learning Garden`,
  }));

  await prisma.garden.createMany({ data: gardenData });
  const gardens = await prisma.garden.findMany();

  // Add plants to gardens
  const plantTypes: Array<{ name: string; type: 'FLOWER' | 'TREE' | 'PLANT' | 'DECORATION' }> = [
    { name: 'Knowledge Sunflower', type: 'FLOWER' },
    { name: 'Math Oak', type: 'TREE' },
    { name: 'Reading Rose', type: 'FLOWER' },
    { name: 'Science Succulent', type: 'PLANT' },
    { name: 'Writing Willow', type: 'TREE' },
    { name: 'Creativity Cactus', type: 'PLANT' },
    { name: 'Problem-Solving Pine', type: 'TREE' },
    { name: 'Teamwork Tulip', type: 'FLOWER' },
  ];

  for (const garden of gardens) {
    // Each student gets 2-5 random plants
    const numPlants = Math.floor(Math.random() * 4) + 2;
    const selectedPlants = plantTypes.sort(() => Math.random() - 0.5).slice(0, numPlants);

    for (let i = 0; i < selectedPlants.length; i++) {
      const plant = selectedPlants[i];
      await prisma.gardenPlant.create({
        data: {
          gardenId: garden.id,
          name: plant.name,
          type: plant.type,
          level: Math.floor(Math.random() * 5) + 1,
          xp: Math.floor(Math.random() * 500),
          health: Math.floor(Math.random() * 30) + 70,
          lastWatered: daysAgo(Math.floor(Math.random() * 3)),
          positionX: (i % 3) * 150 + 50,
          positionY: Math.floor(i / 3) * 150 + 50,
        },
      });
    }
  }

  // Add rewards
  const rewardReasons = [
    { type: 'XP', reason: 'Completed lesson', amount: 25 },
    { type: 'XP', reason: 'Perfect quiz score', amount: 50 },
    { type: 'XP', reason: 'Helped a classmate', amount: 15 },
    { type: 'SEED', reason: 'Finished a course module', amount: 1 },
    { type: 'FERTILIZER', reason: 'Logged in 5 days in a row', amount: 2 },
    { type: 'BADGE', reason: 'Math Master achievement', amount: 1 },
    { type: 'DECORATION', reason: 'First assignment submitted', amount: 1 },
  ];

  for (const student of students) {
    // Each student gets 3-8 random rewards
    const numRewards = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < numRewards; i++) {
      const reward = rewardReasons[Math.floor(Math.random() * rewardReasons.length)];
      await prisma.gardenReward.create({
        data: {
          studentId: student.id,
          rewardType: reward.type as 'XP' | 'SEED' | 'FERTILIZER' | 'BADGE' | 'DECORATION',
          amount: reward.amount,
          reason: reward.reason,
          earnedAt: daysAgo(Math.floor(Math.random() * 30)),
        },
      });
    }
  }

  const plantCount = await prisma.gardenPlant.count();
  const rewardCount = await prisma.gardenReward.count();
  console.log(`  ✓ Gardens: ${gardens.length} created with ${plantCount} plants and ${rewardCount} rewards`);

  // ==========================================
  // 7. CREATE ANNOUNCEMENTS & NOTIFICATIONS
  // ==========================================
  console.log('\n📢 Creating announcements and notifications...');

  await prisma.announcement.createMany({
    data: [
      {
        authorId: principalAdmin.id,
        title: 'Welcome to the New School Year!',
        content: 'Dear RootWork Community,\n\nWelcome back! We are excited to begin another year of learning and growth. Please check your course schedules and reach out to teachers with any questions.\n\nBest wishes,\nPrincipal Williams',
        pinned: true,
        publishedAt: daysAgo(7),
      },
      {
        authorId: teachers[0].id,
        courseId: mathCourse3.id,
        title: 'Multiplication Facts Challenge!',
        content: 'Class, we\'re starting our multiplication facts challenge next week! Practice your 2s, 3s, 4s, and 5s. Prizes for the top improvers!',
        pinned: false,
        publishedAt: daysAgo(3),
      },
      {
        authorId: teachers[1].id,
        courseId: scienceCourse5.id,
        title: 'Field Trip Permission Forms',
        content: 'Don\'t forget to return your permission forms for our ecosystem field trip to the nature center. Due by Friday!',
        pinned: true,
        publishedAt: daysAgo(2),
      },
    ],
  });

  // Sample notifications
  for (const student of students.slice(0, 5)) {
    await prisma.notification.createMany({
      data: [
        {
          userId: student.id,
          title: 'New assignment posted',
          message: 'A new assignment has been posted in your course.',
          type: 'assignment',
          read: Math.random() > 0.5,
          createdAt: daysAgo(Math.floor(Math.random() * 7)),
        },
        {
          userId: student.id,
          title: 'Your plant needs water!',
          message: 'Visit your garden to water your plants and earn rewards.',
          type: 'garden',
          read: Math.random() > 0.3,
          createdAt: daysAgo(Math.floor(Math.random() * 3)),
        },
      ],
    });
  }

  console.log(`  ✓ Announcements and notifications created`);

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('\n' + '='.repeat(50));
  console.log('✅ DATABASE SEED COMPLETE!');
  console.log('='.repeat(50));

  const counts = {
    users: await prisma.user.count(),
    curricula: await prisma.curriculum.count(),
    courses: await prisma.course.count(),
    lessons: await prisma.lesson.count(),
    enrollments: await prisma.courseEnrollment.count(),
    ieps: await prisma.iEP.count(),
    gardens: await prisma.garden.count(),
    plants: await prisma.gardenPlant.count(),
  };

  console.log('\n📊 Final Counts:');
  console.log(`   Users: ${counts.users} (Admin, Teachers, Students, Parents)`);
  console.log(`   Curricula: ${counts.curricula} (K-12 subjects)`);
  console.log(`   Courses: ${counts.courses}`);
  console.log(`   Lessons: ${counts.lessons}`);
  console.log(`   Enrollments: ${counts.enrollments}`);
  console.log(`   IEPs: ${counts.ieps}`);
  console.log(`   Gardens: ${counts.gardens}`);
  console.log(`   Plants: ${counts.plants}`);

  console.log('\n🔑 Demo Login Credentials:');
  console.log('   Admin: admin@rootwork.edu');
  console.log('   Teacher: msmith@rootwork.edu (Math)');
  console.log('   Teacher: jchen@rootwork.edu (Science)');
  console.log('   Teacher: specialed@rootwork.edu (Special Ed)');
  console.log('   Student: noah.3@rootwork.edu (3rd grade, has IEP)');
  console.log('   Student: mia.10@rootwork.edu (10th grade)');
  console.log('   Parent: parent.anderson@email.com');
  console.log('\n   Password for all: demo123 (placeholder hash in DB)\n');
}

// ============================================
// CLEAN DATABASE
// ============================================

async function cleanDatabase() {
  // Delete in order respecting foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.canvasProject.deleteMany();
  await prisma.gardenReward.deleteMany();
  await prisma.gardenPlant.deleteMany();
  await prisma.garden.deleteMany();
  await prisma.iEPServiceLog.deleteMany();
  await prisma.iEPMeeting.deleteMany();
  await prisma.iEPGoalProgress.deleteMany();
  await prisma.iEP.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.parentStudent.deleteMany();
  await prisma.user.deleteMany();
}

// ============================================
// RUN SEED
// ============================================

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
