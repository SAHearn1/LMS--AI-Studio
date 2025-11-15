import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsNumber, Min } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({
    description: 'Title of the lesson',
    example: 'Variables and Data Types',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the lesson',
    example: 'In this lesson, we will learn about variables...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID of the course this lesson belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Order of the lesson in the course',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  orderIndex: number;

  @ApiProperty({
    description: 'Duration of the lesson in minutes',
    example: 45,
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Status of the lesson',
    example: 'draft',
    enum: ['draft', 'published'],
  })
  @IsEnum(['draft', 'published'])
  @IsNotEmpty()
  status: string;
}
