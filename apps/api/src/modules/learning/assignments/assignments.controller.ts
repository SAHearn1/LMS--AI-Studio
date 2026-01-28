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
import { AssignmentsService } from './assignments.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  SubmitAssignmentDto,
  GradeAssignmentDto,
} from './dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('assignments')
@ApiBearerAuth()
@Controller('assignments')
@UseGuards(RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  async create(@Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'courseId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('courseId') courseId?: string,
  ) {
    return this.assignmentsService.findAll(page || 1, limit || 10, courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment found' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update assignment' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete assignment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentsService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit assignment (Student)' })
  @ApiResponse({ status: 201, description: 'Assignment submitted successfully' })
  @ApiResponse({ status: 400, description: 'Assignment closed or past due' })
  async submit(
    @Param('id', ParseUUIDPipe) assignmentId: string,
    @CurrentUser('id') studentId: string,
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.assignmentsService.submit(assignmentId, studentId, dto);
  }

  @Patch('submissions/:submissionId/grade')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Grade a submission (Teacher/Admin)' })
  @ApiResponse({ status: 200, description: 'Submission graded successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  async grade(
    @Param('submissionId', ParseUUIDPipe) submissionId: string,
    @Body() dto: GradeAssignmentDto,
  ) {
    return this.assignmentsService.grade(submissionId, dto);
  }

  @Get(':id/submission')
  @ApiOperation({ summary: 'Get current user submission for an assignment' })
  @ApiResponse({ status: 200, description: 'Submission found' })
  async getSubmission(
    @Param('id', ParseUUIDPipe) assignmentId: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.assignmentsService.getSubmission(assignmentId, studentId);
  }
}
