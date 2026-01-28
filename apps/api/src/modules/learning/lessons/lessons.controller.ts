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
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('lessons')
@ApiBearerAuth()
@Controller('lessons')
@UseGuards(RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  async create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'courseId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of lessons' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('courseId') courseId?: string,
  ) {
    return this.lessonsService.findAll(page || 1, limit || 10, courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson found' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update lesson' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete lesson (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.remove(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark lesson as complete for current user' })
  @ApiResponse({ status: 200, description: 'Lesson marked as complete' })
  async markComplete(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.lessonsService.markComplete(lessonId, studentId);
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get lesson progress for current user' })
  @ApiResponse({ status: 200, description: 'Lesson progress' })
  async getProgress(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.lessonsService.getProgress(lessonId, studentId);
  }
}
