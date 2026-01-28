import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto';
import { UserRole as PrismaUserRole } from '@rootwork/database';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;
  private readonly ACCESS_TOKEN_EXPIRY_SECONDS = 15 * 60; // 15 minutes

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: (dto.role as PrismaUserRole) || PrismaUserRole.STUDENT,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens> {
    // Find the refresh token
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    if (!storedToken.user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Delete the used refresh token
    await this.prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    return this.generateTokens({
      sub: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Delete specific refresh token
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Delete all refresh tokens for user
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  private async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const refreshExpirySeconds = this.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.ACCESS_TOKEN_EXPIRY_SECONDS,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: refreshExpirySeconds,
      }),
    ]);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        token: refreshToken,
        expiresAt: new Date(Date.now() + refreshExpirySeconds * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
