import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GradeAssignmentDto {
  @ApiProperty({
    description: 'Score for the submission',
    example: 85,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(1000)
  score: number;

  @ApiPropertyOptional({
    description: 'Feedback for the student',
    example: 'Great work! Consider improving...',
  })
  @IsString()
  @IsOptional()
  feedback?: string;
}
