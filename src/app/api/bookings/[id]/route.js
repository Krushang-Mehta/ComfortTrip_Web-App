import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import { findBookingById, findBookingByBookingId } from '@/repositories/bookingRepository';
import { updateBookingStatusService, assignDriverService } from '@/services/bookingService';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    let booking = await findBookingById(id);
    if (!booking) {
      booking = await findBookingByBookingId(id);
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    const isOwner = String(session.user.id) === String(booking.user?._id || booking.user);
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super-admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('[/api/bookings/[id] GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();

    let updated;
    if (body.driverId) {
      updated = await assignDriverService(id, body, session);
    } else {
      updated = await updateBookingStatusService(id, body, session);
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('[/api/bookings/[id] PATCH Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
