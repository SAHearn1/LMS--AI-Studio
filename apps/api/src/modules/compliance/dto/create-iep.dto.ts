import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateIEPDto {
  @ApiProperty({
    description: 'ID of the student this IEP belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Title of the IEP',
    example: 'Annual IEP Review 2024',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Goals defined in the IEP',
    example: ['Improve reading comprehension', 'Develop social skills'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  goals: string[];

  @ApiProperty({
    description: 'Accommodations specified in the IEP',
    example: ['Extended time on tests', 'Preferential seating'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  accommodations: string[];

  @ApiProperty({
    description: 'Start date of the IEP',
    example: '2024-01-10T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the IEP',
    example: '2025-01-10T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    description: 'Status of the IEP',
    example: 'draft',
    enum: ['draft', 'active', 'completed', 'archived'],
  })
  @IsEnum(['draft', 'active', 'completed', 'archived'])
  @IsNotEmpty()
  status: string;
}
