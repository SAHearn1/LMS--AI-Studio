import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  provider: AuthProvider;
  providerId?: string;
  emailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  GUEST = 'guest',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface OAuthProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  provider: AuthProvider;
}
