import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, password } = body;

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Find and validate token
    // Note: verificationToken model is not yet in the Prisma schema
    const verificationToken = await (prisma as any).verificationToken.findFirst(
      {
        where: {
          identifier: email.toLowerCase(),
          expires: { gt: new Date() },
        },
      }
    );

    if (!verificationToken || verificationToken.token !== token) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: passwordHash },
    });

    // Delete used token
    // Note: verificationToken model is not yet in the Prisma schema
    await (prisma as any).verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email.toLowerCase(),
          token: verificationToken.token,
        },
      },
    });

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
