import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SubmitAssignmentDto {
  @ApiPropertyOptional({
    description: 'Content/answer for the assignment',
    example: 'My answer to the assignment...',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'URL to uploaded file',
    example: 'https://example.com/submission.pdf',
  })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
