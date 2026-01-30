import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto, UpdateCurriculumDto } from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('curriculum')
@ApiBearerAuth()
@Controller('curriculum')
@UseGuards(RolesGuard)
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Create a new curriculum' })
  @ApiResponse({ status: 201, description: 'Curriculum created successfully' })
  async create(@Body() dto: CreateCurriculumDto) {
    return this.curriculumService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all curricula' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of curricula' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.curriculumService.findAll(page || 1, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get curriculum by ID' })
  @ApiResponse({ status: 200, description: 'Curriculum found' })
  @ApiResponse({ status: 404, description: 'Curriculum not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.curriculumService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update curriculum' })
  @ApiResponse({ status: 200, description: 'Curriculum updated successfully' })
  @ApiResponse({ status: 404, description: 'Curriculum not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCurriculumDto,
  ) {
    return this.curriculumService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete curriculum (Admin only)' })
  @ApiResponse({ status: 200, description: 'Curriculum deleted successfully' })
  @ApiResponse({ status: 404, description: 'Curriculum not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.curriculumService.remove(id);
  }
}
