import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class AssignmentsService {
  private assignments: Assignment[] = [];
  private idCounter = 1;

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const newAssignment: Assignment = {
      id: String(this.idCounter++),
      ...createAssignmentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.assignments.push(newAssignment);
    return newAssignment;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Assignment>> {
    const total = this.assignments.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = this.assignments.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Assignment> {
    const assignment = this.assignments.find((a) => a.id === id);

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const assignmentIndex = this.assignments.findIndex((a) => a.id === id);

    if (assignmentIndex === -1) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    const updatedAssignment = {
      ...this.assignments[assignmentIndex],
      ...updateAssignmentDto,
      updatedAt: new Date(),
    };

    this.assignments[assignmentIndex] = updatedAssignment;
    return updatedAssignment;
  }

  async remove(id: string): Promise<void> {
    const assignmentIndex = this.assignments.findIndex((a) => a.id === id);

    if (assignmentIndex === -1) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    this.assignments.splice(assignmentIndex, 1);
  }
}
