import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum AssignmentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'Title of the assignment',
    example: 'JavaScript Functions Quiz',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the assignment',
    example: 'Complete the quiz on JavaScript functions',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID of the course this assignment belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @ApiPropertyOptional({
    description: 'Due date for the assignment',
    example: '2024-02-15T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Maximum points for the assignment',
    example: 100,
    minimum: 0,
    maximum: 1000,
    default: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1000)
  maxPoints?: number;

  @ApiPropertyOptional({
    description: 'Status of the assignment',
    example: 'DRAFT',
    enum: AssignmentStatus,
    default: AssignmentStatus.DRAFT,
  })
  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus;
}
