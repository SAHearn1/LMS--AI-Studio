import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { Garden } from './entities/garden.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class GardenService {
  private gardens: Garden[] = [];
  private idCounter = 1;

  async create(createGardenDto: CreateGardenDto): Promise<Garden> {
    const newGarden: Garden = {
      id: String(this.idCounter++),
      ...createGardenDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.gardens.push(newGarden);
    return newGarden;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Garden>> {
    const total = this.gardens.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = this.gardens.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Garden> {
    const garden = this.gardens.find((g) => g.id === id);

    if (!garden) {
      throw new NotFoundException(`Garden with ID ${id} not found`);
    }

    return garden;
  }

  async update(id: string, updateGardenDto: UpdateGardenDto): Promise<Garden> {
    const gardenIndex = this.gardens.findIndex((g) => g.id === id);

    if (gardenIndex === -1) {
      throw new NotFoundException(`Garden with ID ${id} not found`);
    }

    const updatedGarden = {
      ...this.gardens[gardenIndex],
      ...updateGardenDto,
      updatedAt: new Date(),
    };

    this.gardens[gardenIndex] = updatedGarden;
    return updatedGarden;
  }

  async remove(id: string): Promise<void> {
    const gardenIndex = this.gardens.findIndex((g) => g.id === id);

    if (gardenIndex === -1) {
      throw new NotFoundException(`Garden with ID ${id} not found`);
    }

    this.gardens.splice(gardenIndex, 1);
  }
}
