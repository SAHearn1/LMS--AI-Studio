import { ApiProperty } from '@nestjs/swagger';

export class IEP {
  @ApiProperty({
    description: 'Unique identifier of the IEP',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the student this IEP belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Title of the IEP',
    example: 'Annual IEP Review 2024',
  })
  title: string;

  @ApiProperty({
    description: 'Goals defined in the IEP',
    example: ['Improve reading comprehension', 'Develop social skills'],
    isArray: true,
    type: String,
  })
  goals: string[];

  @ApiProperty({
    description: 'Accommodations specified in the IEP',
    example: ['Extended time on tests', 'Preferential seating'],
    isArray: true,
    type: String,
  })
  accommodations: string[];

  @ApiProperty({
    description: 'Start date of the IEP',
    example: '2024-01-10T00:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the IEP',
    example: '2025-01-10T00:00:00Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Status of the IEP',
    example: 'active',
    enum: ['draft', 'active', 'completed', 'archived'],
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp when the IEP was created',
    example: '2024-01-10T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the IEP was last updated',
    example: '2024-01-10T12:00:00Z',
  })
  updatedAt: Date;
}
