import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsNumber, Min } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Title of the course',
    example: 'Introduction to JavaScript',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the course',
    example: 'Learn the fundamentals of JavaScript programming',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'ID of the instructor',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  instructorId: string;

  @ApiProperty({
    description: 'Duration of the course in hours',
    example: 40,
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Status of the course',
    example: 'draft',
    enum: ['draft', 'published', 'archived'],
  })
  @IsEnum(['draft', 'published', 'archived'])
  @IsNotEmpty()
  status: string;
}
