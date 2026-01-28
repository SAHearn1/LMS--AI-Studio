import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export enum LessonStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
}

export class CreateLessonDto {
  @ApiProperty({
    description: 'Title of the lesson',
    example: 'Variables and Data Types',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Content of the lesson',
    example: 'In this lesson, we will learn about variables...',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'ID of the course this lesson belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Order of the lesson in the course',
    example: 1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  orderIndex: number;

  @ApiPropertyOptional({
    description: 'Duration of the lesson in minutes',
    example: 45,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Type of lesson',
    example: 'TEXT',
    enum: LessonType,
    default: LessonType.TEXT,
  })
  @IsEnum(LessonType)
  @IsOptional()
  type?: LessonType;

  @ApiPropertyOptional({
    description: 'Status of the lesson',
    example: 'DRAFT',
    enum: LessonStatus,
    default: LessonStatus.DRAFT,
  })
  @IsEnum(LessonStatus)
  @IsOptional()
  status?: LessonStatus;

  @ApiPropertyOptional({
    description: 'Video URL for video lessons',
    example: 'https://example.com/video.mp4',
  })
  @IsString()
  @IsOptional()
  videoUrl?: string;
}
