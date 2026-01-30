import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum IEPStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateIEPDto {
  @ApiProperty({
    description: 'ID of the student this IEP belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Title of the IEP',
    example: 'Annual IEP Review 2024',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the IEP',
    example: 'Comprehensive educational plan for the academic year',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Accommodations specified in the IEP',
    example: ['Extended time on tests', 'Preferential seating'],
    isArray: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  accommodations?: string[];

  @ApiProperty({
    description: 'Start date of the IEP',
    example: '2024-01-10T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'End date of the IEP',
    example: '2025-01-10T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Status of the IEP',
    example: 'DRAFT',
    enum: IEPStatus,
    default: IEPStatus.DRAFT,
  })
  @IsEnum(IEPStatus)
  @IsOptional()
  status?: IEPStatus;
}
