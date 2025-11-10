import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIEPDto } from './dto/create-iep.dto';
import { UpdateIEPDto } from './dto/update-iep.dto';
import { IEP } from './entities/iep.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class ComplianceService {
  private ieps: IEP[] = [];
  private idCounter = 1;

  async create(createIEPDto: CreateIEPDto): Promise<IEP> {
    const newIEP: IEP = {
      id: String(this.idCounter++),
      ...createIEPDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.ieps.push(newIEP);
    return newIEP;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<IEP>> {
    const total = this.ieps.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = this.ieps.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<IEP> {
    const iep = this.ieps.find((i) => i.id === id);

    if (!iep) {
      throw new NotFoundException(`IEP with ID ${id} not found`);
    }

    return iep;
  }

  async update(id: string, updateIEPDto: UpdateIEPDto): Promise<IEP> {
    const iepIndex = this.ieps.findIndex((i) => i.id === id);

    if (iepIndex === -1) {
      throw new NotFoundException(`IEP with ID ${id} not found`);
    }

    const updatedIEP = {
      ...this.ieps[iepIndex],
      ...updateIEPDto,
      updatedAt: new Date(),
    };

    this.ieps[iepIndex] = updatedIEP;
    return updatedIEP;
  }

  async remove(id: string): Promise<void> {
    const iepIndex = this.ieps.findIndex((i) => i.id === id);

    if (iepIndex === -1) {
      throw new NotFoundException(`IEP with ID ${id} not found`);
    }

    this.ieps.splice(iepIndex, 1);
  }
}
