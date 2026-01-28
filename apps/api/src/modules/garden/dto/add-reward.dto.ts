import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export enum RewardType {
  SEED = 'SEED',
  FERTILIZER = 'FERTILIZER',
  DECORATION = 'DECORATION',
  XP = 'XP',
}

export class AddRewardDto {
  @ApiProperty({
    description: 'ID of the student receiving the reward',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Type of reward',
    example: 'XP',
    enum: RewardType,
  })
  @IsEnum(RewardType)
  @IsNotEmpty()
  rewardType: RewardType;

  @ApiPropertyOptional({
    description: 'Amount of the reward',
    example: 10,
    minimum: 1,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  amount?: number;

  @ApiProperty({
    description: 'Reason for the reward',
    example: 'Completed lesson: Variables and Data Types',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
