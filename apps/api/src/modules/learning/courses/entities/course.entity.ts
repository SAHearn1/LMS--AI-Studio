import { ApiProperty } from '@nestjs/swagger';

export class Course {
  @ApiProperty({
    description: 'Unique identifier of the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the course',
    example: 'Introduction to JavaScript',
  })
  title: string;

  @ApiProperty({
    description: 'Description of the course',
    example: 'Learn the fundamentals of JavaScript programming',
  })
  description: string;

  @ApiProperty({
    description: 'ID of the instructor',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  instructorId: string;

  @ApiProperty({
    description: 'Duration of the course in hours',
    example: 40,
  })
  duration: number;

  @ApiProperty({
    description: 'Status of the course',
    example: 'published',
    enum: ['draft', 'published', 'archived'],
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp when the course was created',
    example: '2024-01-10T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the course was last updated',
    example: '2024-01-10T12:00:00Z',
  })
  updatedAt: Date;
}
