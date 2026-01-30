import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum GardenItemType {
  FLOWER = 'FLOWER',
  TREE = 'TREE',
  PLANT = 'PLANT',
  DECORATION = 'DECORATION',
}

export class CreatePlantDto {
  @ApiProperty({
    description: 'ID of the garden this plant belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  gardenId: string;

  @ApiProperty({
    description: 'Name of the plant',
    example: 'Math Mastery Flower',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Type of garden item',
    example: 'FLOWER',
    enum: GardenItemType,
    default: GardenItemType.PLANT,
  })
  @IsEnum(GardenItemType)
  @IsOptional()
  type?: GardenItemType;

  @ApiPropertyOptional({
    description: 'Level of the plant (1-100)',
    example: 1,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  level?: number;

  @ApiPropertyOptional({
    description: 'Experience points',
    example: 0,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  xp?: number;
}
