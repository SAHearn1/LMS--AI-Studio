import { ApiProperty } from '@nestjs/swagger';

export class Garden {
  @ApiProperty({
    description: 'Unique identifier of the garden item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the student who owns this garden',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Name of the garden item',
    example: 'My Learning Garden',
  })
  name: string;

  @ApiProperty({
    description: 'Type of garden item',
    example: 'flower',
    enum: ['flower', 'tree', 'plant', 'decoration'],
  })
  type: string;

  @ApiProperty({
    description: 'Level or growth stage of the garden item',
    example: 5,
  })
  level: number;

  @ApiProperty({
    description: 'Points earned related to this garden item',
    example: 250,
  })
  points: number;

  @ApiProperty({
    description: 'Timestamp when the garden item was created',
    example: '2024-01-10T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the garden item was last updated',
    example: '2024-01-10T12:00:00Z',
  })
  updatedAt: Date;
}
