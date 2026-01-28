import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  SubmitAssignmentDto,
  GradeAssignmentDto,
} from './dto';
import { AssignmentStatus as PrismaAssignmentStatus } from '@rootwork/database';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAssignmentDto) {
    return this.prisma.assignment.create({
      data: {
        title: dto.title,
        description: dto.description,
        courseId: dto.courseId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        maxPoints: dto.maxPoints ?? 100,
        status: (dto.status as PrismaAssignmentStatus) || PrismaAssignmentStatus.DRAFT,
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

    const [assignments, total] = await Promise.all([
      this.prisma.assignment.findMany({
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
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.assignment.count({ where }),
    ]);

    return {
      data: assignments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(id: string, dto: UpdateAssignmentDto) {
    await this.findOne(id);

    return this.prisma.assignment.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        maxPoints: dto.maxPoints,
        status: dto.status as PrismaAssignmentStatus,
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

    await this.prisma.assignment.delete({
      where: { id },
    });

    return { message: `Assignment with ID ${id} deleted successfully` };
  }

  async submit(assignmentId: string, studentId: string, dto: SubmitAssignmentDto) {
    const assignment = await this.findOne(assignmentId);

    if (assignment.status === 'CLOSED') {
      throw new BadRequestException('This assignment is closed for submissions');
    }

    if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
      throw new BadRequestException('This assignment is past due');
    }

    return this.prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
      create: {
        assignmentId,
        studentId,
        content: dto.content,
        fileUrl: dto.fileUrl,
      },
      update: {
        content: dto.content,
        fileUrl: dto.fileUrl,
        submittedAt: new Date(),
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            maxPoints: true,
          },
        },
      },
    });
  }

  async grade(submissionId: string, dto: GradeAssignmentDto) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${submissionId} not found`);
    }

    if (dto.score > submission.assignment.maxPoints) {
      throw new BadRequestException(
        `Score cannot exceed max points (${submission.assignment.maxPoints})`,
      );
    }

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score: dto.score,
        feedback: dto.feedback,
        gradedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            maxPoints: true,
          },
        },
      },
    });
  }

  async getSubmission(assignmentId: string, studentId: string) {
    return this.prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            maxPoints: true,
          },
        },
      },
    });
  }
}
