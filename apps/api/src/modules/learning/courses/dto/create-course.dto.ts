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

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateCourseDto {
  @ApiProperty({
    description: 'Title of the course',
    example: 'Introduction to JavaScript',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the course',
    example: 'Learn the fundamentals of JavaScript programming',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID of the instructor',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  instructorId: string;

  @ApiPropertyOptional({
    description: 'ID of the curriculum this course belongs to',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  @IsOptional()
  curriculumId?: string;

  @ApiPropertyOptional({
    description: 'Duration of the course in hours',
    example: 40,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Status of the course',
    example: 'DRAFT',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;

  @ApiPropertyOptional({
    description: 'Thumbnail URL for the course',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}
