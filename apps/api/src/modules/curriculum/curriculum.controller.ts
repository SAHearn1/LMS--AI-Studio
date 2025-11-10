import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { Curriculum } from './entities/curriculum.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('curriculum')
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new curriculum' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Curriculum has been successfully created.',
    type: Curriculum,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async create(
    @Body() createCurriculumDto: CreateCurriculumDto,
  ): Promise<Curriculum> {
    return this.curriculumService.create(createCurriculumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all curriculums with pagination' })
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
    description: 'Return all curriculums.',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Curriculum>> {
    return this.curriculumService.findAll(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a curriculum by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the curriculum.',
    type: Curriculum,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Curriculum not found.',
  })
  async findOne(@Param('id') id: string): Promise<Curriculum> {
    return this.curriculumService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a curriculum' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Curriculum has been successfully updated.',
    type: Curriculum,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Curriculum not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
  ): Promise<Curriculum> {
    return this.curriculumService.update(id, updateCurriculumDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a curriculum (Admin only)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Curriculum has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Curriculum not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.curriculumService.remove(id);
  }
}
