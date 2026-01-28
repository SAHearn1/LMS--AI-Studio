import { PrismaClient, UserRole, CourseStatus, LessonType, LessonStatus, CurriculumStatus, IEPStatus, GardenItemType } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (in reverse order of dependencies)
  await prisma.gardenReward.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.garden.deleteMany();
  await prisma.iEPGoal.deleteMany();
  await prisma.iEP.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create users
  const passwordHash = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@rootwork.edu',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Created admin user: ${adminUser.email}`);

  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@rootwork.edu',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.TEACHER,
      bio: 'Experienced educator specializing in mathematics and computer science.',
    },
  });
  console.log(`✅ Created teacher user: ${teacherUser.email}`);

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@rootwork.edu',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Smith',
      role: UserRole.STUDENT,
    },
  });
  console.log(`✅ Created student user: ${studentUser.email}`);

  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@rootwork.edu',
      passwordHash,
      firstName: 'Michael',
      lastName: 'Smith',
      role: UserRole.PARENT,
    },
  });
  console.log(`✅ Created parent user: ${parentUser.email}`);

  // Create curriculum
  const mathCurriculum = await prisma.curriculum.create({
    data: {
      title: 'Mathematics Grade 10',
      description: 'Comprehensive mathematics curriculum covering algebra, geometry, and introduction to calculus.',
      gradeLevel: '10',
      subject: 'Mathematics',
      status: CurriculumStatus.ACTIVE,
    },
  });
  console.log(`✅ Created curriculum: ${mathCurriculum.title}`);

  const csCurriculum = await prisma.curriculum.create({
    data: {
      title: 'Introduction to Computer Science',
      description: 'Foundational computer science concepts including programming, algorithms, and data structures.',
      gradeLevel: '9-12',
      subject: 'Computer Science',
      status: CurriculumStatus.ACTIVE,
    },
  });
  console.log(`✅ Created curriculum: ${csCurriculum.title}`);

  // Create courses
  const algebraCourse = await prisma.course.create({
    data: {
      title: 'Algebra Fundamentals',
      description: 'Master the basics of algebra including equations, inequalities, and functions.',
      instructorId: teacherUser.id,
      curriculumId: mathCurriculum.id,
      duration: 40,
      status: CourseStatus.PUBLISHED,
    },
  });
  console.log(`✅ Created course: ${algebraCourse.title}`);

  const programmingCourse = await prisma.course.create({
    data: {
      title: 'Introduction to JavaScript',
      description: 'Learn the fundamentals of JavaScript programming from scratch.',
      instructorId: teacherUser.id,
      curriculumId: csCurriculum.id,
      duration: 60,
      status: CourseStatus.PUBLISHED,
    },
  });
  console.log(`✅ Created course: ${programmingCourse.title}`);

  // Create lessons for Algebra course
  const algebraLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        courseId: algebraCourse.id,
        title: 'Introduction to Variables',
        content: 'In this lesson, we will learn what variables are and how to use them in algebraic expressions.',
        orderIndex: 1,
        duration: 45,
        type: LessonType.TEXT,
        status: LessonStatus.PUBLISHED,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: algebraCourse.id,
        title: 'Solving Linear Equations',
        content: 'Learn how to solve linear equations step by step.',
        orderIndex: 2,
        duration: 60,
        type: LessonType.VIDEO,
        status: LessonStatus.PUBLISHED,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: algebraCourse.id,
        title: 'Practice: Linear Equations',
        content: 'Test your knowledge of linear equations.',
        orderIndex: 3,
        duration: 30,
        type: LessonType.QUIZ,
        status: LessonStatus.PUBLISHED,
      },
    }),
  ]);
  console.log(`✅ Created ${algebraLessons.length} lessons for Algebra course`);

  // Create lessons for Programming course
  const programmingLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        courseId: programmingCourse.id,
        title: 'Getting Started with JavaScript',
        content: 'Set up your development environment and write your first JavaScript program.',
        orderIndex: 1,
        duration: 30,
        type: LessonType.TEXT,
        status: LessonStatus.PUBLISHED,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: programmingCourse.id,
        title: 'Variables and Data Types',
        content: 'Learn about JavaScript variables, constants, and different data types.',
        orderIndex: 2,
        duration: 45,
        type: LessonType.TEXT,
        status: LessonStatus.PUBLISHED,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: programmingCourse.id,
        title: 'Functions in JavaScript',
        content: 'Understanding functions, parameters, and return values.',
        orderIndex: 3,
        duration: 60,
        type: LessonType.VIDEO,
        status: LessonStatus.PUBLISHED,
      },
    }),
  ]);
  console.log(`✅ Created ${programmingLessons.length} lessons for Programming course`);

  // Enroll student in courses
  await prisma.courseEnrollment.create({
    data: {
      courseId: algebraCourse.id,
      studentId: studentUser.id,
      progress: 33.3,
    },
  });
  await prisma.courseEnrollment.create({
    data: {
      courseId: programmingCourse.id,
      studentId: studentUser.id,
      progress: 0,
    },
  });
  console.log(`✅ Enrolled student in courses`);

  // Create assignments
  const algebraAssignment = await prisma.assignment.create({
    data: {
      courseId: algebraCourse.id,
      title: 'Linear Equations Problem Set',
      description: 'Solve 10 linear equations and show your work.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      maxPoints: 100,
      status: 'PUBLISHED',
    },
  });
  console.log(`✅ Created assignment: ${algebraAssignment.title}`);

  // Create IEP for student
  const studentIEP = await prisma.iEP.create({
    data: {
      studentId: studentUser.id,
      title: 'Annual IEP Review 2024',
      description: 'Individualized Education Program for Alex Smith',
      accommodations: [
        'Extended time on tests (1.5x)',
        'Preferential seating near instructor',
        'Written instructions for assignments',
        'Use of calculator for math assessments',
      ],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: IEPStatus.ACTIVE,
      goals: {
        create: [
          {
            description: 'Improve reading comprehension to grade level',
            targetDate: new Date('2024-06-01'),
            progress: 45,
            status: 'IN_PROGRESS',
            notes: 'Showing good progress with comprehension strategies.',
          },
          {
            description: 'Complete math assignments independently',
            targetDate: new Date('2024-09-01'),
            progress: 30,
            status: 'IN_PROGRESS',
          },
        ],
      },
    },
  });
  console.log(`✅ Created IEP for student`);

  // Create garden for student
  const studentGarden = await prisma.garden.create({
    data: {
      studentId: studentUser.id,
      name: "Alex's Learning Garden",
      description: 'A garden where knowledge grows!',
      plants: {
        create: [
          {
            name: 'Math Mastery Rose',
            type: GardenItemType.FLOWER,
            level: 3,
            xp: 250,
            health: 100,
          },
          {
            name: 'Coding Cactus',
            type: GardenItemType.PLANT,
            level: 1,
            xp: 50,
            health: 100,
          },
        ],
      },
    },
  });
  console.log(`✅ Created garden for student`);

  // Add some rewards
  await prisma.gardenReward.createMany({
    data: [
      {
        studentId: studentUser.id,
        rewardType: 'XP',
        amount: 100,
        reason: 'Completed first algebra lesson',
      },
      {
        studentId: studentUser.id,
        rewardType: 'SEED',
        amount: 1,
        reason: 'Perfect score on quiz',
      },
    ],
  });
  console.log(`✅ Created rewards for student`);

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📝 Test accounts:');
  console.log('   Admin:   admin@rootwork.edu / password123');
  console.log('   Teacher: teacher@rootwork.edu / password123');
  console.log('   Student: student@rootwork.edu / password123');
  console.log('   Parent:  parent@rootwork.edu / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
