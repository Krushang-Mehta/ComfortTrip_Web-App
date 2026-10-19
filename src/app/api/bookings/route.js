import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import { createBookingService, getUserBookingsService } from '@/services/bookingService';
import { findAllBookingsAdmin } from '@/repositories/bookingRepository';
import { creditRewardPoints } from '@/repositories/userRepository';
import { sendEmail } from '@/lib/smtp/transporter';
import { bookingConfirmationEmailTemplate } from '@/lib/smtp/emailTemplates';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to view bookings.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super-admin';

    if (isAdmin) {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status') || '';
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '20', 10);

      const filter = {};
      if (status && status !== 'All') {
        filter.status = status;
      }

      const result = await findAllBookingsAdmin(filter, { page, limit });
      return NextResponse.json({ success: true, ...result });
    }

    const bookings = await getUserBookingsService(session.user.id, session);
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('[/api/bookings GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please sign in or create an account to confirm your booking and earn 100 reward points.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    const booking = await createBookingService(body, session);

    // If customer opted to redeem reward points
    const pointsToRedeem = parseInt(body.redeemedPoints || '0', 10);
    if (pointsToRedeem > 0 && session.user.id) {
      await creditRewardPoints(session.user.id, -pointsToRedeem);
    }

    // Send confirmation email asynchronously
    const emailHtml = bookingConfirmationEmailTemplate({
      booking: {
        bookingId: booking.bookingId,
        carModel: body.carModel || 'Vehicle',
        carCategory: body.carCategory || 'Sedan',
        tripType: booking.tripType,
        pickupLocation: booking.pickupAddress,
        dropLocation: booking.destinationAddress,
        pickupDateTime: booking.pickupDateTime,
        totalAmount: booking.totalEstimatedAmount,
        status: booking.status,
      },
      user: {
        name: session.user.name,
        email: session.user.email,
      },
    });

    sendEmail({
      to: session.user.email,
      subject: `Booking Confirmed: ${booking.bookingId} — Comfort Trip Car Rentals`,
      html: emailHtml,
    }).catch((err) => {
      console.error('[Async Booking Email Error]', err);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Booking placed successfully!',
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[/api/bookings POST Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
