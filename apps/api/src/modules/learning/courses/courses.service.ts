import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class CoursesService {
  private courses: Course[] = [];
  private idCounter = 1;

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const newCourse: Course = {
      id: String(this.idCounter++),
      ...createCourseDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.courses.push(newCourse);
    return newCourse;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Course>> {
    const total = this.courses.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = this.courses.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Course> {
    const course = this.courses.find((c) => c.id === id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const courseIndex = this.courses.findIndex((c) => c.id === id);

    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    const updatedCourse = {
      ...this.courses[courseIndex],
      ...updateCourseDto,
      updatedAt: new Date(),
    };

    this.courses[courseIndex] = updatedCourse;
    return updatedCourse;
  }

  async remove(id: string): Promise<void> {
    const courseIndex = this.courses.findIndex((c) => c.id === id);

    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    this.courses.splice(courseIndex, 1);
  }
}
