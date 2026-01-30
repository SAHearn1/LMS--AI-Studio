import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, CourseStatus } from '../../../../../packages/database/generated/prisma';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';

@Injectable()
export class CoursesService {
  private prisma = new PrismaClient();

  async findAll(page = 1, limit = 20, publishedOnly = false) {
    const skip = (page - 1) * limit;
    const where = publishedOnly ? { status: CourseStatus.PUBLISHED } : {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          instructor: {
            select: { id: true, firstName: true, lastName: true },
          },
          curriculum: {
            select: { id: true, title: true },
          },
          _count: {
            select: { lessons: true, enrollments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        curriculum: true,
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
        enrollments: {
          include: {
            student: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async create(dto: CreateCourseDto, instructorId: string) {
    const course = await this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        curriculumId: dto.curriculumId,
        status: dto.isPublished ? CourseStatus.PUBLISHED : CourseStatus.DRAFT,
        instructorId,
      },
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return course;
  }

  async update(id: string, dto: UpdateCourseDto, userId: string, userRole: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Only instructor or admin can update
    if (course.instructorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Not authorized to update this course');
    }

    const updateData: any = {
      title: dto.title,
      description: dto.description,
      curriculumId: dto.curriculumId,
    };

    if (dto.isPublished !== undefined) {
      updateData.status = dto.isPublished ? CourseStatus.PUBLISHED : CourseStatus.DRAFT;
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return updatedCourse;
  }

  async remove(id: string, userId: string, userRole: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Not authorized to delete this course');
    }

    await this.prisma.course.delete({
      where: { id },
    });

    return { message: 'Course deleted successfully' };
  }

  async getLessons(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
    });

    return lessons;
  }

  async enrollStudent(courseId: string, studentId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new ForbiddenException('Cannot enroll in unpublished course');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
    });

    if (existingEnrollment) {
      return existingEnrollment;
    }

    const enrollment = await this.prisma.courseEnrollment.create({
      data: {
        courseId,
        studentId,
      },
      include: {
        course: {
          select: { id: true, title: true },
        },
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return enrollment;
  }
}
