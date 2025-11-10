import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsNumber, Min } from 'class-validator';

export class CreateGardenDto {
  @ApiProperty({
    description: 'ID of the student who owns this garden',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Name of the garden item',
    example: 'My Learning Garden',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Type of garden item',
    example: 'flower',
    enum: ['flower', 'tree', 'plant', 'decoration'],
  })
  @IsEnum(['flower', 'tree', 'plant', 'decoration'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Level or growth stage of the garden item',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  level: number;

  @ApiProperty({
    description: 'Points earned related to this garden item',
    example: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  points: number;
}
