import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, EnrollCourseDto } from './dto/courses.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/dto/auth.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('published') published?: string,
  ) {
    const publishedOnly = published === 'true';
    return this.coursesService.findAll(Number(page), Number(limit), publishedOnly);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/lessons')
  async getLessons(@Param('id') id: string) {
    return this.coursesService.getLessons(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async create(@Body() dto: CreateCourseDto, @Request() req) {
    return this.coursesService.create(dto, req.user.sub);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  async enroll(@Param('id') id: string, @Body() dto: EnrollCourseDto, @Request() req) {
    // If no studentId provided, enroll the current user
    const studentId = dto.studentId || req.user.sub;
    return this.coursesService.enrollStudent(id, studentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @Request() req,
  ) {
    return this.coursesService.update(id, dto, req.user.sub, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async remove(@Param('id') id: string, @Request() req) {
    return this.coursesService.remove(id, req.user.sub, req.user.role);
  }
}
