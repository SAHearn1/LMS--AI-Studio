import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class LessonsService {
  private lessons: Lesson[] = [];
  private idCounter = 1;

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const newLesson: Lesson = {
      id: String(this.idCounter++),
      ...createLessonDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.lessons.push(newLesson);
    return newLesson;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Lesson>> {
    const total = this.lessons.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = this.lessons.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = this.lessons.find((l) => l.id === id);

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lessonIndex = this.lessons.findIndex((l) => l.id === id);

    if (lessonIndex === -1) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    const updatedLesson = {
      ...this.lessons[lessonIndex],
      ...updateLessonDto,
      updatedAt: new Date(),
    };

    this.lessons[lessonIndex] = updatedLesson;
    return updatedLesson;
  }

  async remove(id: string): Promise<void> {
    const lessonIndex = this.lessons.findIndex((l) => l.id === id);

    if (lessonIndex === -1) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    this.lessons.splice(lessonIndex, 1);
  }
}
