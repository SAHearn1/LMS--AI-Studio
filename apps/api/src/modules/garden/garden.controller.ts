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
import { GardenService } from './garden.service';
import {
  CreateGardenDto,
  UpdateGardenDto,
  CreatePlantDto,
  UpdatePlantDto,
  AddRewardDto,
} from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('garden')
@ApiBearerAuth()
@Controller('garden')
@UseGuards(RolesGuard)
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  // Garden Endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new garden' })
  @ApiResponse({ status: 201, description: 'Garden created successfully' })
  async createGarden(@Body() dto: CreateGardenDto) {
    return this.gardenService.createGarden(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gardens' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of gardens' })
  async findAllGardens(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.gardenService.findAllGardens(page || 1, limit || 10);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user garden' })
  @ApiResponse({ status: 200, description: 'User garden data' })
  async getMyGarden(@CurrentUser('id') studentId: string) {
    return this.gardenService.getStudentGarden(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get garden by ID' })
  @ApiResponse({ status: 200, description: 'Garden found' })
  @ApiResponse({ status: 404, description: 'Garden not found' })
  async findOneGarden(@Param('id', ParseUUIDPipe) id: string) {
    return this.gardenService.findOneGarden(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update garden' })
  @ApiResponse({ status: 200, description: 'Garden updated successfully' })
  @ApiResponse({ status: 404, description: 'Garden not found' })
  async updateGarden(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGardenDto,
  ) {
    return this.gardenService.updateGarden(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete garden (Admin only)' })
  @ApiResponse({ status: 200, description: 'Garden deleted successfully' })
  @ApiResponse({ status: 404, description: 'Garden not found' })
  async removeGarden(@Param('id', ParseUUIDPipe) id: string) {
    return this.gardenService.removeGarden(id);
  }

  // Plant Endpoints
  @Post('plants')
  @ApiOperation({ summary: 'Create a new plant' })
  @ApiResponse({ status: 201, description: 'Plant created successfully' })
  async createPlant(@Body() dto: CreatePlantDto) {
    return this.gardenService.createPlant(dto);
  }

  @Get('plants/:id')
  @ApiOperation({ summary: 'Get plant by ID' })
  @ApiResponse({ status: 200, description: 'Plant found' })
  @ApiResponse({ status: 404, description: 'Plant not found' })
  async findOnePlant(@Param('id', ParseUUIDPipe) id: string) {
    return this.gardenService.findOnePlant(id);
  }

  @Patch('plants/:id')
  @ApiOperation({ summary: 'Update plant' })
  @ApiResponse({ status: 200, description: 'Plant updated successfully' })
  @ApiResponse({ status: 404, description: 'Plant not found' })
  async updatePlant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlantDto,
  ) {
    return this.gardenService.updatePlant(id, dto);
  }

  @Post('plants/:id/water')
  @ApiOperation({ summary: 'Water a plant' })
  @ApiResponse({ status: 200, description: 'Plant watered successfully' })
  @ApiResponse({ status: 404, description: 'Plant not found' })
  async waterPlant(@Param('id', ParseUUIDPipe) id: string) {
    return this.gardenService.waterPlant(id);
  }

  @Delete('plants/:id')
  @ApiOperation({ summary: 'Delete plant' })
  @ApiResponse({ status: 200, description: 'Plant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Plant not found' })
  async removePlant(@Param('id', ParseUUIDPipe) id: string) {
    return this.gardenService.removePlant(id);
  }

  // Reward Endpoints
  @Post('rewards')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Add a reward (Teacher/Admin only)' })
  @ApiResponse({ status: 201, description: 'Reward added successfully' })
  async addReward(@Body() dto: AddRewardDto) {
    return this.gardenService.addReward(dto);
  }

  @Get('rewards/my')
  @ApiOperation({ summary: 'Get current user rewards' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User rewards' })
  async getMyRewards(
    @CurrentUser('id') studentId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.gardenService.getStudentRewards(studentId, page || 1, limit || 20);
  }

  @Get('students/:studentId')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get student garden (Teacher/Admin only)' })
  @ApiResponse({ status: 200, description: 'Student garden data' })
  async getStudentGarden(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.gardenService.getStudentGarden(studentId);
  }
}
