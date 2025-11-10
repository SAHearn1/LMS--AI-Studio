import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GardenService } from './garden.service';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { Garden } from './entities/garden.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';

@ApiTags('garden')
@Controller('garden')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new garden item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Garden item has been successfully created.',
    type: Garden,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async create(@Body() createGardenDto: CreateGardenDto): Promise<Garden> {
    return this.gardenService.create(createGardenDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all garden items with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all garden items.',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Garden>> {
    return this.gardenService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a garden item by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the garden item.',
    type: Garden,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Garden item not found.',
  })
  async findOne(@Param('id') id: string): Promise<Garden> {
    return this.gardenService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a garden item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Garden item has been successfully updated.',
    type: Garden,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Garden item not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateGardenDto: UpdateGardenDto,
  ): Promise<Garden> {
    return this.gardenService.update(id, updateGardenDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a garden item' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Garden item has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Garden item not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.gardenService.remove(id);
  }
}
