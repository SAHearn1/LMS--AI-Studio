import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGardenDto {
  @ApiProperty({
    description: 'ID of the student who owns this garden',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Name of the garden',
    example: 'My Learning Garden',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the garden',
    example: 'A garden where my knowledge grows',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
