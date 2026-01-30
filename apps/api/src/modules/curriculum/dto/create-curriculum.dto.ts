import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum CurriculumStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateCurriculumDto {
  @ApiProperty({
    description: 'Title of the curriculum',
    example: 'Mathematics Grade 10',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the curriculum',
    example: 'Complete mathematics curriculum for grade 10 students',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Grade level for the curriculum',
    example: '10',
  })
  @IsString()
  @IsNotEmpty()
  gradeLevel: string;

  @ApiProperty({
    description: 'Subject area',
    example: 'Mathematics',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiPropertyOptional({
    description: 'Status of the curriculum',
    example: 'DRAFT',
    enum: CurriculumStatus,
    default: CurriculumStatus.DRAFT,
  })
  @IsEnum(CurriculumStatus)
  @IsOptional()
  status?: CurriculumStatus;
}
