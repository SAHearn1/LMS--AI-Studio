import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentStatus as PrismaAssignmentStatus } from '@rootwork/database';

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
        course_id: dto.courseId,
        title: dto.title,
        description: dto.description,
        due_date: dto.dueDate ? new Date(dto.dueDate) : null,
        max_points: dto.maxPoints ?? 100,
        status:
          (dto.status as PrismaAssignmentStatus) ||
          PrismaAssignmentStatus.DRAFT,
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

  async findAll(page = 1, limit = 10, status?: string, courseId?: string) {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status as PrismaAssignmentStatus;
    }
    if (courseId) {
      where.course_id = courseId;
    }

    const [assignments, total] = await Promise.all([
      this.prisma.assignment.findMany({
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
          _count: {
            select: {
              assignment_submissions: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
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
        courses: {
          select: {
            id: true,
            title: true,
            instructor_id: true,
          },
        },
        assignment_submissions: {
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
          orderBy: { submitted_at: 'desc' },
        },
        _count: {
          select: {
            assignment_submissions: true,
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
        due_date: dto.dueDate ? new Date(dto.dueDate) : undefined,
        max_points: dto.maxPoints,
        status: dto.status as PrismaAssignmentStatus,
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

    await this.prisma.assignment.delete({
      where: { id },
    });
  }

  // Submission methods
  async submit(assignmentId: string, studentId: string, dto: SubmitDto) {
    await this.findOne(assignmentId);

    return this.prisma.assignmentSubmission.upsert({
      where: {
        assignment_id_student_id: {
          assignment_id: assignmentId,
          student_id: studentId,
        },
      },
      create: {
        assignment_id: assignmentId,
        student_id: studentId,
        content: dto.content,
        submitted_at: new Date(),
      },
      update: {
        content: dto.content,
        submitted_at: new Date(),
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
        assignments: {
          select: {
            id: true,
            title: true,
            max_points: true,
          },
        },
      },
    });
  }

  async getSubmissions(assignmentId: string) {
    await this.findOne(assignmentId);

    return this.prisma.assignmentSubmission.findMany({
      where: { assignment_id: assignmentId },
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
      orderBy: { submitted_at: 'desc' },
    });
  }

  async getStudentSubmission(assignmentId: string, studentId: string) {
    return this.prisma.assignmentSubmission.findUnique({
      where: {
        assignment_id_student_id: {
          assignment_id: assignmentId,
          student_id: studentId,
        },
      },
      include: {
        assignments: {
          select: {
            id: true,
            title: true,
            max_points: true,
            due_date: true,
          },
        },
      },
    });
  }

  async getSubmissionById(id: string) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
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
        assignments: {
          select: {
            id: true,
            title: true,
            max_points: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    return submission;
  }

  async gradeSubmission(
    submissionId: string,
    score: number,
    feedback?: string,
  ) {
    await this.getSubmissionById(submissionId);

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score,
        feedback,
        graded_at: new Date(),
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
        assignments: {
          select: {
            id: true,
            title: true,
            max_points: true,
          },
        },
      },
    });
  }
}
