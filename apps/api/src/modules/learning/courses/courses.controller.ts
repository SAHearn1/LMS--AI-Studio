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
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of courses' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.coursesService.findAll(page || 1, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiResponse({ status: 200, description: 'Course found' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete course (Admin only)' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/enroll/:studentId')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Enroll a student in a course' })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully' })
  async enrollStudent(
    @Param('id', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.coursesService.enrollStudent(courseId, studentId);
  }

  @Get(':id/enrollments')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get course enrollments' })
  @ApiResponse({ status: 200, description: 'List of enrollments' })
  async getEnrollments(@Param('id', ParseUUIDPipe) courseId: string) {
    return this.coursesService.getEnrollments(courseId);
  }
}
