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
        student_id: createIEPDto.studentId,
        accommodations: createIEPDto.accommodations || [],
        start_date: new Date(createIEPDto.startDate),
        end_date: new Date(createIEPDto.endDate),
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
          users: {
            select: { id: true, first_name: true, last_name: true },
          },
        },
        orderBy: { created_at: 'desc' },
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
        users: {
          select: { id: true, first_name: true, last_name: true, email: true },
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
    if (updateIEPDto.description)
      updateData.description = updateIEPDto.description;
    if (updateIEPDto.accommodations)
      updateData.accommodations = updateIEPDto.accommodations;
    if (updateIEPDto.startDate)
      updateData.start_date = new Date(updateIEPDto.startDate);
    if (updateIEPDto.endDate)
      updateData.end_date = new Date(updateIEPDto.endDate);

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
