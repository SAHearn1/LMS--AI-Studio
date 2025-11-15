import { ApiProperty } from '@nestjs/swagger';

export class Curriculum {
  @ApiProperty({
    description: 'Unique identifier of the curriculum',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the curriculum',
    example: 'Mathematics Grade 10',
  })
  title: string;

  @ApiProperty({
    description: 'Description of the curriculum',
    example: 'Complete mathematics curriculum for grade 10 students',
  })
  description: string;

  @ApiProperty({
    description: 'Grade level for the curriculum',
    example: '10',
  })
  gradeLevel: string;

  @ApiProperty({
    description: 'Subject area',
    example: 'Mathematics',
  })
  subject: string;

  @ApiProperty({
    description: 'Status of the curriculum',
    example: 'active',
    enum: ['draft', 'active', 'archived'],
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp when the curriculum was created',
    example: '2024-01-10T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the curriculum was last updated',
    example: '2024-01-10T12:00:00Z',
  })
  updatedAt: Date;
}
