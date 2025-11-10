import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
): Promise<void> => {
  const verificationUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;

  await transporter.sendMail({
    from: config.email.from,
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: config.email.from,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

export const sendWelcomeEmail = async (email: string, firstName?: string): Promise<void> => {
  await transporter.sendMail({
    from: config.email.from,
    to: email,
    subject: 'Welcome to LMS!',
    html: `
      <h1>Welcome ${firstName || 'there'}!</h1>
      <p>Thank you for signing up. We're excited to have you on board!</p>
    `,
  });
};
