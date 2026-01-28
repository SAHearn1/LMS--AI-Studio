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
import { ComplianceService } from './compliance.service';
import {
  CreateIEPDto,
  UpdateIEPDto,
  CreateIEPGoalDto,
  UpdateIEPGoalDto,
} from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('compliance')
@ApiBearerAuth()
@Controller('compliance')
@UseGuards(RolesGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // IEP Endpoints
  @Post('ieps')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Create a new IEP' })
  @ApiResponse({ status: 201, description: 'IEP created successfully' })
  async createIEP(@Body() dto: CreateIEPDto) {
    return this.complianceService.createIEP(dto);
  }

  @Get('ieps')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get all IEPs (Teacher/Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'studentId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of IEPs' })
  async findAllIEPs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('studentId') studentId?: string,
  ) {
    return this.complianceService.findAllIEPs(page || 1, limit || 10, studentId);
  }

  @Get('ieps/:id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get IEP by ID (Teacher/Admin only)' })
  @ApiResponse({ status: 200, description: 'IEP found' })
  @ApiResponse({ status: 404, description: 'IEP not found' })
  async findOneIEP(@Param('id', ParseUUIDPipe) id: string) {
    return this.complianceService.findOneIEP(id);
  }

  @Patch('ieps/:id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update IEP' })
  @ApiResponse({ status: 200, description: 'IEP updated successfully' })
  @ApiResponse({ status: 404, description: 'IEP not found' })
  async updateIEP(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIEPDto,
  ) {
    return this.complianceService.updateIEP(id, dto);
  }

  @Delete('ieps/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete IEP (Admin only)' })
  @ApiResponse({ status: 200, description: 'IEP deleted successfully' })
  @ApiResponse({ status: 404, description: 'IEP not found' })
  async removeIEP(@Param('id', ParseUUIDPipe) id: string) {
    return this.complianceService.removeIEP(id);
  }

  // IEP Goal Endpoints
  @Post('goals')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Create a new IEP goal' })
  @ApiResponse({ status: 201, description: 'IEP Goal created successfully' })
  async createGoal(@Body() dto: CreateIEPGoalDto) {
    return this.complianceService.createGoal(dto);
  }

  @Get('goals/:id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get IEP Goal by ID' })
  @ApiResponse({ status: 200, description: 'IEP Goal found' })
  @ApiResponse({ status: 404, description: 'IEP Goal not found' })
  async findOneGoal(@Param('id', ParseUUIDPipe) id: string) {
    return this.complianceService.findOneGoal(id);
  }

  @Patch('goals/:id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update IEP Goal' })
  @ApiResponse({ status: 200, description: 'IEP Goal updated successfully' })
  @ApiResponse({ status: 404, description: 'IEP Goal not found' })
  async updateGoal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIEPGoalDto,
  ) {
    return this.complianceService.updateGoal(id, dto);
  }

  @Delete('goals/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete IEP Goal (Admin only)' })
  @ApiResponse({ status: 200, description: 'IEP Goal deleted successfully' })
  @ApiResponse({ status: 404, description: 'IEP Goal not found' })
  async removeGoal(@Param('id', ParseUUIDPipe) id: string) {
    return this.complianceService.removeGoal(id);
  }

  // Student IEPs
  @Get('students/:studentId/ieps')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get all IEPs for a student' })
  @ApiResponse({ status: 200, description: 'Student IEPs' })
  async getStudentIEPs(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.complianceService.getStudentIEPs(studentId);
  }
}
