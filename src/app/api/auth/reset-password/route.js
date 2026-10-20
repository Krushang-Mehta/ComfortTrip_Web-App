import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/User';
import { logActivity } from '@/services/auditService';

export async function POST(request) {
  try {
    const body = await request.json();
    const token = body?.token?.trim();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;
    const confirmPassword = body?.confirmPassword;

    if (!token || !email) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing password reset token.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match. Please verify your entry.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify token matching and ensure not expired (< 30 minutes from issuance)
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'The password reset link is invalid or has expired (sessions last 30 minutes). Please request a new link.',
        },
        { status: 400 }
      );
    }

    // Hash the new password securely
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user record and invalidate the one-time token
    user.passwordHash = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    logActivity({
      action: 'PASSWORD_RESET_COMPLETED',
      module: 'auth',
      targetId: String(user._id),
      description: `Password successfully updated via reset token for ${user.email}`,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully! You can now sign in with your new credentials.',
    });
  } catch (error) {
    console.error('[/api/auth/reset-password Error]', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred while resetting your password.' },
      { status: 500 }
    );
  }
}
