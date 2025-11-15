import { ApiProperty } from '@nestjs/swagger';

export class Assignment {
  @ApiProperty({
    description: 'Unique identifier of the assignment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the assignment',
    example: 'JavaScript Functions Quiz',
  })
  title: string;

  @ApiProperty({
    description: 'Description of the assignment',
    example: 'Complete the quiz on JavaScript functions',
  })
  description: string;

  @ApiProperty({
    description: 'ID of the course this assignment belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  courseId: string;

  @ApiProperty({
    description: 'Due date for the assignment',
    example: '2024-02-15T23:59:59Z',
  })
  dueDate: Date;

  @ApiProperty({
    description: 'Maximum points for the assignment',
    example: 100,
  })
  maxPoints: number;

  @ApiProperty({
    description: 'Status of the assignment',
    example: 'published',
    enum: ['draft', 'published', 'closed'],
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp when the assignment was created',
    example: '2024-01-10T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the assignment was last updated',
    example: '2024-01-10T12:00:00Z',
  })
  updatedAt: Date;
}
