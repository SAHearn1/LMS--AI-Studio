import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateGardenDto,
  UpdateGardenDto,
  CreatePlantDto,
  UpdatePlantDto,
  AddRewardDto,
} from './dto';
import {
  GardenItemType as PrismaGardenItemType,
  RewardType as PrismaRewardType,
} from '@rootwork/database';

@Injectable()
export class GardenService {
  constructor(private prisma: PrismaService) {}

  // Garden CRUD
  async createGarden(dto: CreateGardenDto) {
    return this.prisma.garden.create({
      data: {
        student_id: dto.studentId,
        name: dto.name,
        description: dto.description,
      },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        plants: true,
      },
    });
  }

  async findAllGardens(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [gardens, total] = await Promise.all([
      this.prisma.garden.findMany({
        skip,
        take: limit,
        include: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
          _count: {
            select: {
              plants: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.garden.count(),
    ]);

    return {
      data: gardens,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneGarden(id: string) {
    const garden = await this.prisma.garden.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        plants: {
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!garden) {
      throw new NotFoundException(`Garden with ID ${id} not found`);
    }

    return garden;
  }

  async updateGarden(id: string, dto: UpdateGardenDto) {
    await this.findOneGarden(id);

    return this.prisma.garden.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
      },
      include: {
        plants: true,
      },
    });
  }

  async removeGarden(id: string) {
    await this.findOneGarden(id);

    await this.prisma.garden.delete({
      where: { id },
    });

    return { message: `Garden with ID ${id} deleted successfully` };
  }

  // Plant Operations
  async createPlant(dto: CreatePlantDto) {
    // Verify garden exists
    await this.findOneGarden(dto.gardenId);

    return this.prisma.plants.create({
      data: {
        garden_id: dto.gardenId,
        name: dto.name,
        type: (dto.type as PrismaGardenItemType) || PrismaGardenItemType.PLANT,
        level: dto.level ?? 1,
        xp: dto.xp ?? 0,
        health: 100,
      },
    });
  }

  async findOnePlant(id: string) {
    const plant = await this.prisma.plants.findUnique({
      where: { id },
      include: {
        gardens: {
          select: {
            id: true,
            name: true,
            student_id: true,
          },
        },
      },
    });

    if (!plant) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }

    return plant;
  }

  async updatePlant(id: string, dto: UpdatePlantDto) {
    await this.findOnePlant(id);

    return this.prisma.plants.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type as PrismaGardenItemType,
        level: dto.level,
        xp: dto.xp,
      },
    });
  }

  async waterPlant(id: string) {
    await this.findOnePlant(id);

    return this.prisma.plants.update({
      where: { id },
      data: {
        last_watered: new Date(),
        health: 100, // Restore health when watered
      },
    });
  }

  async removePlant(id: string) {
    await this.findOnePlant(id);

    await this.prisma.plants.delete({
      where: { id },
    });

    return { message: `Plant with ID ${id} deleted successfully` };
  }

  // Reward Operations
  async addReward(dto: AddRewardDto) {
    return this.prisma.gardenReward.create({
      data: {
        student_id: dto.studentId,
        reward_type: dto.rewardType as PrismaRewardType,
        amount: dto.amount ?? 1,
        reason: dto.reason,
      },
    });
  }

  async getStudentRewards(studentId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [rewards, total] = await Promise.all([
      this.prisma.gardenReward.findMany({
        where: { student_id: studentId },
        skip,
        take: limit,
        orderBy: { earned_at: 'desc' },
      }),
      this.prisma.gardenReward.count({ where: { student_id: studentId } }),
    ]);

    return {
      data: rewards,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get student's garden with all details
  async getStudentGarden(studentId: string) {
    const gardens = await this.prisma.garden.findMany({
      where: { student_id: studentId },
      include: {
        plants: {
          orderBy: { created_at: 'asc' },
        },
      },
    });

    const totalRewards = await this.prisma.gardenReward.aggregate({
      where: { student_id: studentId },
      _sum: {
        amount: true,
      },
    });

    return {
      gardens,
      totalRewardPoints: totalRewards._sum.amount || 0,
    };
  }
}
