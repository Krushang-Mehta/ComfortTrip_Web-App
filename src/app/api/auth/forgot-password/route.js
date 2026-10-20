import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/User';
import { sendEmail } from '@/lib/smtp/transporter';
import { passwordResetEmailTemplate } from '@/lib/smtp/emailTemplates';
import { logActivity } from '@/services/auditService';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    // Always return success for security (prevents account enumeration), but only send if user exists and is active
    if (!user || user.isActive === false) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email address, a secure password reset link has been dispatched.',
      });
    }

    // Generate secure token (32 bytes = 64 hex chars)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiry

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = expiryDate;
    await user.save();

    // Determine site origin from request or env
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
    const origin = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
    const resetUrl = `${origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    // Dispatch email
    const emailHtml = passwordResetEmailTemplate({
      name: user.name,
      resetUrl,
    });

    await sendEmail({
      to: user.email,
      subject: 'Reset Your Comfort~Trip Password (Valid for 30 Minutes)',
      html: emailHtml,
    });

    logActivity({
      action: 'PASSWORD_RESET_REQUESTED',
      module: 'auth',
      targetId: String(user._id),
      description: `Password reset requested for ${user.email} (token expires in 30 mins)`,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email address, a secure password reset link has been dispatched.',
    });
  } catch (error) {
    console.error('[/api/auth/forgot-password Error]', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
