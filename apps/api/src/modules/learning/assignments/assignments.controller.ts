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

class SubmitAssignmentDto {
  content?: string;
  attachments?: string[];
}

class GradeSubmissionDto {
  score: number;
  feedback?: string;
}

@ApiTags('assignments')
@ApiBearerAuth()
@Controller('assignments')
@UseGuards(RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Assignment has been successfully created.',
    type: Assignment,
  })
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<Assignment> {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'courseId', required: false, type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all assignments.' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
    @Query('courseId') courseId?: string,
  ): Promise<PaginatedResult<Assignment>> {
    return this.assignmentsService.findAll(
      paginationDto.page,
      paginationDto.limit,
      status,
      courseId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assignment by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the assignment.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Assignment not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Assignment> {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Assignment updated.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Assignment deleted.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.assignmentsService.remove(id);
  }

  // Submission endpoints
  @Post(':id/submit')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit an assignment' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Submission created.' })
  async submitAssignment(
    @Param('id', ParseUUIDPipe) assignmentId: string,
    @Body() dto: SubmitAssignmentDto,
    @CurrentUser('id') studentId: string,
  ) {
    return this.assignmentsService.submit(assignmentId, studentId, dto);
  }

  @Get(':id/submissions')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all submissions for an assignment' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all submissions.' })
  async getSubmissions(@Param('id', ParseUUIDPipe) assignmentId: string) {
    return this.assignmentsService.getSubmissions(assignmentId);
  }

  @Get(':id/my-submission')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user submission for an assignment' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the submission.' })
  async getMySubmission(
    @Param('id', ParseUUIDPipe) assignmentId: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.assignmentsService.getStudentSubmission(assignmentId, studentId);
  }
}

// Separate controller for submissions to handle grading
@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Patch(':id/grade')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Grade a submission' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Submission graded.' })
  async gradeSubmission(
    @Param('id', ParseUUIDPipe) submissionId: string,
    @Body() dto: GradeSubmissionDto,
  ) {
    return this.assignmentsService.gradeSubmission(submissionId, dto.score, dto.feedback);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a submission by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the submission.' })
  async getSubmission(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentsService.getSubmissionById(id);
  }
}
