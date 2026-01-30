import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentStatus as PrismaAssignmentStatus, SubmissionStatus } from '@prisma/client';

interface SubmitDto {
  content?: string;
  attachments?: string[];
}

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAssignmentDto) {
    return this.prisma.assignment.create({
      data: {
        courseId: dto.courseId,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        maxPoints: dto.maxPoints ?? 100,
        status: (dto.status as PrismaAssignmentStatus) || PrismaAssignmentStatus.DRAFT,
        rubric: dto.rubric || undefined,
        attachments: dto.attachments || undefined,
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

  async findAll(page = 1, limit = 10, status?: string, courseId?: string) {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status as PrismaAssignmentStatus;
    }
    if (courseId) {
      where.courseId = courseId;
    }

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
          orderBy: { submittedAt: 'desc' },
        },
        _count: {
          select: {
            submissions: true,
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
        rubric: dto.rubric,
        attachments: dto.attachments,
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
  }

  // Submission methods
  async submit(assignmentId: string, studentId: string, dto: SubmitDto) {
    await this.findOne(assignmentId);

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
        attachments: dto.attachments || undefined,
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
      },
      update: {
        content: dto.content,
        attachments: dto.attachments || undefined,
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
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

  async getSubmissions(assignmentId: string) {
    await this.findOne(assignmentId);

    return this.prisma.assignmentSubmission.findMany({
      where: { assignmentId },
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
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getStudentSubmission(assignmentId: string, studentId: string) {
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
            dueDate: true,
          },
        },
      },
    });
  }

  async getSubmissionById(id: string) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id },
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

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    return submission;
  }

  async gradeSubmission(submissionId: string, score: number, feedback?: string) {
    const submission = await this.getSubmissionById(submissionId);

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score,
        feedback,
        status: SubmissionStatus.GRADED,
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
}
