import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateCurriculumDto {
  @ApiProperty({
    description: 'Title of the curriculum',
    example: 'Mathematics Grade 10',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the curriculum',
    example: 'Complete mathematics curriculum for grade 10 students',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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

  @ApiProperty({
    description: 'Status of the curriculum',
    example: 'draft',
    enum: ['draft', 'active', 'archived'],
  })
  @IsEnum(['draft', 'active', 'archived'])
  @IsNotEmpty()
  status: string;
}
