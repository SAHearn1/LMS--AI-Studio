import { Router } from 'express';
import passport from '../../config/passport.config';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import {
  loginValidation,
  signupValidation,
  refreshTokenValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
} from './auth.validators';

const router = Router();

// Local authentication routes
router.post('/signup', validate(signupValidation), authController.signup);
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh-token', validate(refreshTokenValidation), authController.refreshToken);
router.post('/verify-email', validate(verifyEmailValidation), authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordValidation), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), authController.resetPassword);
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

// Microsoft OAuth routes
router.get(
  '/microsoft',
  passport.authenticate('microsoft', {
    scope: ['user.read'],
    session: false,
  })
);

router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { session: false, failureRedirect: '/login' }),
  authController.microsoftCallback
);

export default router;
