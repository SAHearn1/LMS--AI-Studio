import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateIEPDto,
  UpdateIEPDto,
  CreateIEPGoalDto,
  UpdateIEPGoalDto,
} from './dto';
import {
  IEPStatus as PrismaIEPStatus,
  IEPGoalStatus as PrismaIEPGoalStatus,
} from '@rootwork/database';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  // IEP CRUD Operations
  async createIEP(dto: CreateIEPDto) {
    return this.prisma.iEP.create({
      data: {
        studentId: dto.studentId,
        title: dto.title,
        description: dto.description,
        accommodations: dto.accommodations || [],
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: (dto.status as PrismaIEPStatus) || PrismaIEPStatus.DRAFT,
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
        goals: true,
      },
    });
  }

  async findAllIEPs(page = 1, limit = 10, studentId?: string) {
    const skip = (page - 1) * limit;
    const where = studentId ? { studentId } : {};

    const [ieps, total] = await Promise.all([
      this.prisma.iEP.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              goals: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.iEP.count({ where }),
    ]);

    return {
      data: ieps,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneIEP(id: string) {
    const iep = await this.prisma.iEP.findUnique({
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
        goals: {
          orderBy: { targetDate: 'asc' },
        },
      },
    });

    if (!iep) {
      throw new NotFoundException(`IEP with ID ${id} not found`);
    }

    return iep;
  }

  async updateIEP(id: string, dto: UpdateIEPDto) {
    await this.findOneIEP(id);

    return this.prisma.iEP.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        accommodations: dto.accommodations,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status as PrismaIEPStatus,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        goals: true,
      },
    });
  }

  async removeIEP(id: string) {
    await this.findOneIEP(id);

    await this.prisma.iEP.delete({
      where: { id },
    });

    return { message: `IEP with ID ${id} deleted successfully` };
  }

  // IEP Goal Operations
  async createGoal(dto: CreateIEPGoalDto) {
    await this.findOneIEP(dto.iepId);

    return this.prisma.iEPGoal.create({
      data: {
        iepId: dto.iepId,
        description: dto.description,
        targetDate: new Date(dto.targetDate),
        progress: dto.progress ?? 0,
        status: (dto.status as PrismaIEPGoalStatus) || PrismaIEPGoalStatus.NOT_STARTED,
        notes: dto.notes,
      },
    });
  }

  async findOneGoal(id: string) {
    const goal = await this.prisma.iEPGoal.findUnique({
      where: { id },
      include: {
        iep: {
          select: {
            id: true,
            title: true,
            studentId: true,
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`IEP Goal with ID ${id} not found`);
    }

    return goal;
  }

  async updateGoal(id: string, dto: UpdateIEPGoalDto) {
    await this.findOneGoal(id);

    return this.prisma.iEPGoal.update({
      where: { id },
      data: {
        description: dto.description,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        progress: dto.progress,
        status: dto.status as PrismaIEPGoalStatus,
        notes: dto.notes,
      },
    });
  }

  async removeGoal(id: string) {
    await this.findOneGoal(id);

    await this.prisma.iEPGoal.delete({
      where: { id },
    });

    return { message: `IEP Goal with ID ${id} deleted successfully` };
  }

  // Helper to get all IEPs for a specific student
  async getStudentIEPs(studentId: string) {
    return this.prisma.iEP.findMany({
      where: { studentId },
      include: {
        goals: {
          orderBy: { targetDate: 'asc' },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }
}
