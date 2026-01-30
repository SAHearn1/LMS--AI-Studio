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
        courseId: dto.courseId,
        orderIndex: dto.orderIndex,
        duration: dto.duration,
        type: (dto.type as PrismaLessonType) || PrismaLessonType.TEXT,
        status: (dto.status as PrismaLessonStatus) || PrismaLessonStatus.DRAFT,
        videoUrl: dto.videoUrl,
      },
      include: {
        course: {
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
    const where = courseId ? { courseId } : {};

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: [{ courseId: 'asc' }, { orderIndex: 'asc' }],
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
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
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
        orderIndex: dto.orderIndex,
        duration: dto.duration,
        type: dto.type as PrismaLessonType,
        status: dto.status as PrismaLessonStatus,
        videoUrl: dto.videoUrl,
      },
      include: {
        course: {
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
        lessonId_studentId: {
          lessonId,
          studentId,
        },
      },
      create: {
        lessonId,
        studentId,
        completed: true,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  async getProgress(lessonId: string, studentId: string) {
    return this.prisma.lessonProgress.findUnique({
      where: {
        lessonId_studentId: {
          lessonId,
          studentId,
        },
      },
    });
  }
}
