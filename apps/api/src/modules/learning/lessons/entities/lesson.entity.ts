import { ApiProperty } from '@nestjs/swagger';

export class Lesson {
  @ApiProperty({
    description: 'Unique identifier of the lesson',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the lesson',
    example: 'Variables and Data Types',
  })
  title: string;

  @ApiProperty({
    description: 'Content of the lesson',
    example: 'In this lesson, we will learn about variables...',
  })
  content: string;

  @ApiProperty({
    description: 'ID of the course this lesson belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  courseId: string;

  @ApiProperty({
    description: 'Order of the lesson in the course',
    example: 1,
  })
  orderIndex: number;

  @ApiProperty({
    description: 'Duration of the lesson in minutes',
    example: 45,
  })
  duration: number;

  @ApiProperty({
    description: 'Status of the lesson',
    example: 'published',
    enum: ['draft', 'published'],
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp when the lesson was created',
    example: '2024-01-10T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the lesson was last updated',
    example: '2024-01-10T12:00:00Z',
  })
  updatedAt: Date;
}
