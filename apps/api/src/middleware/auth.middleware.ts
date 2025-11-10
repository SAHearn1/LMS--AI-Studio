import { Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthRequest, UserRole } from '../types/auth.types';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: info?.message || 'Invalid or expired token',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: 'User not authenticated',
      });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        error: 'Insufficient permissions',
      });
    }

    next();
  };
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
