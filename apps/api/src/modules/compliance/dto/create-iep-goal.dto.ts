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

export enum IEPGoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateIEPGoalDto {
  @ApiProperty({
    description: 'ID of the IEP this goal belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  iepId: string;

  @ApiProperty({
    description: 'Description of the goal',
    example: 'Improve reading comprehension to grade level',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Target date for achieving the goal',
    example: '2024-06-01T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  targetDate: string;

  @ApiPropertyOptional({
    description: 'Current progress (0-100)',
    example: 0,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    description: 'Status of the goal',
    example: 'NOT_STARTED',
    enum: IEPGoalStatus,
    default: IEPGoalStatus.NOT_STARTED,
  })
  @IsEnum(IEPGoalStatus)
  @IsOptional()
  status?: IEPGoalStatus;

  @ApiPropertyOptional({
    description: 'Notes about the goal',
    example: 'Student shows improvement in comprehension',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
