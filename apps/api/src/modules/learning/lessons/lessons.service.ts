import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import {
  LessonStatus as PrismaLessonStatus,
  LessonType as PrismaLessonType,
} from '@rootwork/database';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        course_id: dto.courseId,
        order_index: dto.orderIndex,
        duration: dto.duration,
        type: (dto.type as PrismaLessonType) || PrismaLessonType.TEXT,
        status: (dto.status as PrismaLessonStatus) || PrismaLessonStatus.DRAFT,
        video_url: dto.videoUrl,
      },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async findAll(page = 1, limit = 10, courseId?: string) {
    const skip = (page - 1) * limit;
    const where = courseId ? { course_id: courseId } : {};

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        include: {
          courses: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: [{ course_id: 'asc' }, { order_index: 'asc' }],
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      data: lessons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            instructor_id: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto) {
    await this.findOne(id);

    return this.prisma.lesson.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        order_index: dto.orderIndex,
        duration: dto.duration,
        type: dto.type as PrismaLessonType,
        status: dto.status as PrismaLessonStatus,
        video_url: dto.videoUrl,
      },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.lesson.delete({
      where: { id },
    });

    return { message: `Lesson with ID ${id} deleted successfully` };
  }

  async markComplete(lessonId: string, studentId: string) {
    await this.findOne(lessonId);

    return this.prisma.lessonProgress.upsert({
      where: {
        lesson_id_student_id: {
          lesson_id: lessonId,
          student_id: studentId,
        },
      },
      create: {
        lesson_id: lessonId,
        student_id: studentId,
        completed: true,
        completed_at: new Date(),
      },
      update: {
        completed: true,
        completed_at: new Date(),
      },
    });
  }

  async getProgress(lessonId: string, studentId: string) {
    return this.prisma.lessonProgress.findUnique({
      where: {
        lesson_id_student_id: {
          lesson_id: lessonId,
          student_id: studentId,
        },
      },
    });
  }
}
