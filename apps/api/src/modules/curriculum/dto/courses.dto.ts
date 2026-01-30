import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  curriculumId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  curriculumId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class EnrollCourseDto {
  @IsUUID()
  studentId: string;
}

export class CourseResponseDto {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  instructorId: string;
  curriculumId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
