import { Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AuthRequest, LoginCredentials, SignupData } from '../../types/auth.types';

export class AuthController {
  signup = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const signupData: SignupData = req.body;
      const result = await authService.signup(signupData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for verification.',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.user.role,
            emailVerified: result.user.emailVerified,
          },
          tokens: result.tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const credentials: LoginCredentials = req.body;
      const result = await authService.login(credentials);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.user.role,
            emailVerified: result.user.emailVerified,
          },
          tokens: result.tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  refreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  }

  verifyEmail = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      await authService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  forgotPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  }

  resetPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const user = await authService.getCurrentUser(req.user.id);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            emailVerified: user.emailVerified,
            provider: user.provider,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      await authService.logout(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // OAuth callback handlers
  googleCallback = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
      }

      const tokens = await authService.refreshToken(req.user.id);

      // Redirect to frontend with tokens
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }
  }

  microsoftCallback = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
      }

      const tokens = await authService.refreshToken(req.user.id);

      // Redirect to frontend with tokens
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }
  }
}

export const authController = new AuthController();
