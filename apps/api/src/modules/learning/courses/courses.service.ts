import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { CourseStatus as PrismaCourseStatus } from '@rootwork/database';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        instructor_id: dto.instructorId,
        curriculum_id: dto.curriculumId,
        duration: dto.duration,
        thumbnail_url: dto.thumbnailUrl,
        status: (dto.status as PrismaCourseStatus) || PrismaCourseStatus.DRAFT,
      },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
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
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
          _count: {
            select: {
              lessons: true,
              assignments: true,
              course_enrollments: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
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
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        curricula: {
          select: {
            id: true,
            title: true,
          },
        },
        lessons: {
          orderBy: { order_index: 'asc' },
        },
        assignments: {
          orderBy: { created_at: 'desc' },
        },
        _count: {
          select: {
            course_enrollments: true,
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
        curriculum_id: dto.curriculumId,
        duration: dto.duration,
        thumbnail_url: dto.thumbnailUrl,
        status: dto.status as PrismaCourseStatus,
      },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
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
        course_id_student_id: {
          course_id: courseId,
          student_id: studentId,
        },
      },
      create: {
        course_id: courseId,
        student_id: studentId,
      },
      update: {},
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        courses: {
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
        course_id_student_id: {
          course_id: courseId,
          student_id: studentId,
        },
      },
    });

    return { message: 'Student unenrolled successfully' };
  }

  async getEnrollments(courseId: string) {
    await this.findOne(courseId);

    return this.prisma.courseEnrollment.findMany({
      where: { course_id: courseId },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
      orderBy: { enrolled_at: 'desc' },
    });
  }

  async getStudentEnrollments(studentId: string) {
    return this.prisma.courseEnrollment.findMany({
      where: { student_id: studentId },
      include: {
        courses: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
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
      orderBy: { enrolled_at: 'desc' },
    });
  }

  async updateEnrollmentProgress(
    courseId: string,
    studentId: string,
    progress: number,
  ) {
    return this.prisma.courseEnrollment.update({
      where: {
        course_id_student_id: {
          course_id: courseId,
          student_id: studentId,
        },
      },
      data: {
        progress,
        completed_at: progress >= 100 ? new Date() : null,
      },
    });
  }
}
