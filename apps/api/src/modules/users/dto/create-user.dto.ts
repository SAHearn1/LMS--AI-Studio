import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
  IsOptional,
} from 'class-validator';

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'SecurePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'STUDENT',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'User bio',
    example: 'A passionate learner',
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
