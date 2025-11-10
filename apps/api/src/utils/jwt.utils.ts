import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { JWTPayload, RefreshTokenPayload, AuthTokens } from '../types/auth.types';

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwt.accessTokenSecret, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshTokenSecret, {
    expiresIn: '7d',
  });
};

export const generateAuthTokens = (userId: string, email: string, role: string): AuthTokens => {
  const accessToken = generateAccessToken({ userId, email, role } as JWTPayload);
  const refreshToken = generateRefreshToken({ userId, tokenVersion: 1 });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.accessTokenSecret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshTokenSecret) as RefreshTokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};
