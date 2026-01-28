import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { CourseStatus as PrismaCourseStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        instructorId: dto.instructorId,
        curriculumId: dto.curriculumId,
        duration: dto.duration,
        thumbnail: dto.thumbnail,
        status: (dto.status as PrismaCourseStatus) || PrismaCourseStatus.DRAFT,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where = status ? { status: status as PrismaCourseStatus } : {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              lessons: true,
              assignments: true,
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        curriculum: {
          select: {
            id: true,
            title: true,
          },
        },
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
        assignments: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findOne(id);

    return this.prisma.course.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        curriculumId: dto.curriculumId,
        duration: dto.duration,
        thumbnail: dto.thumbnail,
        status: dto.status as PrismaCourseStatus,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.course.delete({
      where: { id },
    });
  }

  async enrollStudent(courseId: string, studentId: string) {
    await this.findOne(courseId);

    return this.prisma.courseEnrollment.upsert({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
      create: {
        courseId,
        studentId,
      },
      update: {},
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async unenrollStudent(courseId: string, studentId: string) {
    await this.findOne(courseId);

    await this.prisma.courseEnrollment.delete({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
    });

    return { message: 'Student unenrolled successfully' };
  }

  async getEnrollments(courseId: string) {
    await this.findOne(courseId);

    return this.prisma.courseEnrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            gradeLevel: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getStudentEnrollments(studentId: string) {
    return this.prisma.courseEnrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                lessons: true,
                assignments: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async updateEnrollmentProgress(courseId: string, studentId: string, progress: number) {
    return this.prisma.courseEnrollment.update({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
      data: {
        progress,
        completedAt: progress >= 100 ? new Date() : null,
      },
    });
  }
}
