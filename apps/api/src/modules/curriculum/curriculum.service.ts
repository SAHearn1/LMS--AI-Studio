import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCurriculumDto, UpdateCurriculumDto } from './dto';
import { CurriculumStatus as PrismaCurriculumStatus } from '@rootwork/database';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCurriculumDto) {
    return this.prisma.curriculum.create({
      data: {
        title: dto.title,
        description: dto.description,
        gradeLevel: dto.gradeLevel,
        subject: dto.subject,
        status: (dto.status as PrismaCurriculumStatus) || PrismaCurriculumStatus.DRAFT,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [curricula, total] = await Promise.all([
      this.prisma.curriculum.findMany({
        skip,
        take: limit,
        include: {
          courses: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.curriculum.count(),
    ]);

    return {
      data: curricula,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    return curriculum;
  }

  async update(id: string, dto: UpdateCurriculumDto) {
    await this.findOne(id);

    return this.prisma.curriculum.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        gradeLevel: dto.gradeLevel,
        subject: dto.subject,
        status: dto.status as PrismaCurriculumStatus,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.curriculum.delete({
      where: { id },
    });

    return { message: `Curriculum with ID ${id} deleted successfully` };
  }
}
