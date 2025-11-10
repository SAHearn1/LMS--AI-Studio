import crypto from 'crypto';
import { supabaseService } from '../../utils/supabase.service';
import { hashPassword, comparePassword } from '../../utils/password.utils';
import { generateAuthTokens, verifyRefreshToken } from '../../utils/jwt.utils';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../../utils/email.utils';
import { AppError } from '../../middleware/error.middleware';
import { User, LoginCredentials, SignupData, AuthTokens, UserRole } from '../../types/auth.types';

// Store verification and reset tokens in memory (in production, use Redis or database)
const verificationTokens = new Map<string, { userId: string; expiresAt: Date }>();
const resetTokens = new Map<string, { userId: string; expiresAt: Date }>();

export class AuthService {
  async signup(signupData: SignupData): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await supabaseService.getUserByEmail(signupData.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(signupData.password);

    // Create user in Supabase
    const user = await supabaseService.createUser(
      signupData.email,
      hashedPassword,
      signupData.firstName,
      signupData.lastName
    );

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    verificationTokens.set(verificationToken, {
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail signup if email fails
    }

    // Generate tokens
    const tokens = generateAuthTokens(user.id, user.email, user.role);

    return { user, tokens };
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Get user by email
    const user = await supabaseService.getUserByEmail(credentials.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is disabled', 403);
    }

    // Check if user has a password (OAuth users don't)
    if (!user.password) {
      throw new AppError('Please login using your SSO provider', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    await supabaseService.updateUser(user.id, { lastLogin: new Date() });

    // Generate tokens
    const tokens = generateAuthTokens(user.id, user.email, user.role);

    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Get user
      const user = await supabaseService.getUserById(payload.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (!user.isActive) {
        throw new AppError('Account is disabled', 403);
      }

      // Generate new tokens
      return generateAuthTokens(user.id, user.email, user.role);
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenData = verificationTokens.get(token);
    
    if (!tokenData) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    if (new Date() > tokenData.expiresAt) {
      verificationTokens.delete(token);
      throw new AppError('Verification token has expired', 400);
    }

    // Verify email in Supabase
    await supabaseService.verifyEmail(tokenData.userId);

    // Send welcome email
    const user = await supabaseService.getUserById(tokenData.userId);
    if (user) {
      try {
        await sendWelcomeEmail(user.email, user.firstName);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
    }

    // Remove token
    verificationTokens.delete(token);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await supabaseService.getUserByEmail(email);
    
    // Don't reveal if user exists or not
    if (!user) {
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    resetTokens.set(resetToken, {
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new AppError('Failed to send password reset email', 500);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenData = resetTokens.get(token);
    
    if (!tokenData) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    if (new Date() > tokenData.expiresAt) {
      resetTokens.delete(token);
      throw new AppError('Reset token has expired', 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in Supabase
    await supabaseService.updatePassword(tokenData.userId, hashedPassword);

    // Remove token
    resetTokens.delete(token);
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await supabaseService.getUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async logout(userId: string): Promise<void> {
    // In a production system, you would invalidate refresh tokens here
    // For now, we'll just log the action
    console.log(`User ${userId} logged out`);
  }
}

export const authService = new AuthService();
