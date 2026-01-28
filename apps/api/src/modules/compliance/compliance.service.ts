import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../../../../packages/database/generated/prisma';

@Injectable()
export class ComplianceService {
  private prisma = new PrismaClient();

  async create(createIEPDto: any) {
    const iep = await this.prisma.iEP.create({
      data: {
        title: createIEPDto.title || 'IEP',
        description: createIEPDto.description,
        student: {
          connect: { id: createIEPDto.studentId },
        },
        accommodations: createIEPDto.accommodations || [],
        goals: createIEPDto.goals || [],
        startDate: new Date(createIEPDto.startDate),
        endDate: new Date(createIEPDto.endDate),
      },
    });
    return iep;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [ieps, total] = await Promise.all([
      this.prisma.iEP.findMany({
        skip,
        take: limit,
        include: {
          student: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.iEP.count(),
    ]);

    return {
      data: ieps,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const iep = await this.prisma.iEP.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!iep) {
      throw new NotFoundException('IEP not found');
    }

    return iep;
  }

  async update(id: string, updateIEPDto: any) {
    const iep = await this.prisma.iEP.findUnique({
      where: { id },
    });

    if (!iep) {
      throw new NotFoundException('IEP not found');
    }

    const updateData: any = {};
    if (updateIEPDto.title) updateData.title = updateIEPDto.title;
    if (updateIEPDto.description) updateData.description = updateIEPDto.description;
    if (updateIEPDto.accommodations) updateData.accommodations = updateIEPDto.accommodations;
    if (updateIEPDto.goals) updateData.goals = updateIEPDto.goals;
    if (updateIEPDto.startDate) updateData.startDate = new Date(updateIEPDto.startDate);
    if (updateIEPDto.endDate) updateData.endDate = new Date(updateIEPDto.endDate);

    const updatedIEP = await this.prisma.iEP.update({
      where: { id },
      data: updateData,
    });

    return updatedIEP;
  }

  async remove(id: string) {
    const iep = await this.prisma.iEP.findUnique({
      where: { id },
    });

    if (!iep) {
      throw new NotFoundException('IEP not found');
    }

    await this.prisma.iEP.delete({
      where: { id },
    });

    return { message: 'IEP deleted successfully' };
  }
}
