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
  HttpStatus,
  ParseUUIDPipe,
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
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

class EnrollStudentDto {
  studentId: string;
}

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
  @ApiOperation({ summary: 'Get all courses with pagination' })
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
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all courses.',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
  ): Promise<PaginatedResult<Course>> {
    return this.coursesService.findAll(paginationDto.page, paginationDto.limit, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the course.',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course (Admin only)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Course has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.coursesService.remove(id);
  }

  // Enrollment endpoints
  @Post(':id/enroll')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll a student in a course' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Student enrolled successfully.',
  })
  async enrollStudent(
    @Param('id', ParseUUIDPipe) courseId: string,
    @Body() dto: EnrollStudentDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    // If no studentId provided, enroll the current user
    const studentId = dto.studentId || currentUserId;
    return this.coursesService.enrollStudent(courseId, studentId);
  }

  @Delete(':id/enroll/:studentId')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unenroll a student from a course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student unenrolled successfully.',
  })
  async unenrollStudent(
    @Param('id', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.coursesService.unenrollStudent(courseId, studentId);
  }

  @Get(':id/enrollments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enrollments for a course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all enrollments.',
  })
  async getEnrollments(@Param('id', ParseUUIDPipe) courseId: string) {
    return this.coursesService.getEnrollments(courseId);
  }
}
