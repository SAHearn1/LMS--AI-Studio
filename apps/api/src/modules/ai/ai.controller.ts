import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LessonGeneratorService } from './services/lesson-generator.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

class GenerateLessonDto {
  topic: string;
  gradeLevel?: string;
  learningObjectives?: string[];
  duration?: number;
  type?: 'TEXT' | 'VIDEO' | 'QUIZ' | 'INTERACTIVE';
}

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(RolesGuard)
export class AiController {
  constructor(private readonly lessonGeneratorService: LessonGeneratorService) {}

  @Post('generate-lesson')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Generate a lesson using AI' })
  @ApiResponse({ status: 201, description: 'Lesson generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async generateLesson(@Body() dto: GenerateLessonDto) {
    return this.lessonGeneratorService.generateLesson(dto);
  }
}
