import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'Title of the assignment',
    example: 'JavaScript Functions Quiz',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the assignment',
    example: 'Complete the quiz on JavaScript functions',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'ID of the course this assignment belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Due date for the assignment',
    example: '2024-02-15T23:59:59Z',
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({
    description: 'Maximum points for the assignment',
    example: 100,
  })
  @IsNumber()
  @Min(1)
  maxPoints: number;

  @ApiProperty({
    description: 'Status of the assignment',
    example: 'draft',
    enum: ['draft', 'published', 'closed'],
  })
  @IsEnum(['draft', 'published', 'closed'])
  @IsNotEmpty()
  status: string;
}
