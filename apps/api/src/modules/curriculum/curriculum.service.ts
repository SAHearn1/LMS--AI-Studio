import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { Curriculum } from './entities/curriculum.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class CurriculumService {
  private curriculums: Curriculum[] = [];
  private idCounter = 1;

  async create(createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
    const newCurriculum: Curriculum = {
      id: String(this.idCounter++),
      ...createCurriculumDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.curriculums.push(newCurriculum);
    return newCurriculum;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Curriculum>> {
    const total = this.curriculums.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = this.curriculums.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Curriculum> {
    const curriculum = this.curriculums.find((c) => c.id === id);

    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    return curriculum;
  }

  async update(
    id: string,
    updateCurriculumDto: UpdateCurriculumDto,
  ): Promise<Curriculum> {
    const curriculumIndex = this.curriculums.findIndex((c) => c.id === id);

    if (curriculumIndex === -1) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    const updatedCurriculum = {
      ...this.curriculums[curriculumIndex],
      ...updateCurriculumDto,
      updatedAt: new Date(),
    };

    this.curriculums[curriculumIndex] = updatedCurriculum;
    return updatedCurriculum;
  }

  async remove(id: string): Promise<void> {
    const curriculumIndex = this.curriculums.findIndex((c) => c.id === id);

    if (curriculumIndex === -1) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    this.curriculums.splice(curriculumIndex, 1);
  }
}
