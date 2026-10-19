import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { registerUserService } from '@/services/authService';
import { sendEmail } from '@/lib/smtp/transporter';
import { welcomeEmailTemplate } from '@/lib/smtp/emailTemplates';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function POST(request) {
  try {
    const body = await request.json();

    await connectToDatabase();
    const newUser = await registerUserService(body);

    // Send welcome email asynchronously without blocking the response
    const emailHtml = welcomeEmailTemplate({
      name: newUser.name,
      email: newUser.email,
    });

    sendEmail({
      to: newUser.email,
      subject: 'Welcome to Comfort Trip Car Rentals! 🚗 (100 Bonus Points Inside)',
      html: emailHtml,
    }).catch((err) => {
      console.error('[Async Welcome Email Error]', err);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully! You received 100 welcome reward points.',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Register API Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
