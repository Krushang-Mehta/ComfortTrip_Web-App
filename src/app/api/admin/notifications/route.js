import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import Booking from '@/models/Booking';
import ActivityLog from '@/models/ActivityLog';
import Review from '@/models/Review';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin privileges required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const [pendingBookings, recentActivities, recentReviews] = await Promise.all([
      Booking.find({ status: 'Pending' })
        .populate('user', 'name email phone')
        .populate('car', 'brand model category')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      Review.find()
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const notifications = [];

    // 1. Pending booking inquiries (High Priority)
    pendingBookings.forEach((b) => {
      notifications.push({
        id: `booking-${b._id}`,
        type: 'pending_booking',
        category: 'Dispatch',
        title: `Pending Booking: ${b.bookingId}`,
        message: `${b.user?.name || 'Customer'} requested ${b.car ? `${b.car.brand} ${b.car.model}` : 'rental'} (${b.tripType || 'Trip'})`,
        amount: b.totalEstimatedAmount ? `₹${Number(b.totalEstimatedAmount).toLocaleString('en-IN')}` : null,
        timestamp: b.createdAt,
        priority: 'high',
        link: '/admin/bookings',
      });
    });

    // 2. Real-time Activity Logs (Operational)
    recentActivities.forEach((act) => {
      const isStatus = act.action === 'BOOKING_STATUS_UPDATED';
      const isDriver = act.action === 'DRIVER_ASSIGNED';
      const isBooking = act.action === 'BOOKING_CREATED';

      notifications.push({
        id: `act-${act._id}`,
        type: isDriver ? 'driver_assigned' : isStatus ? 'status_updated' : 'activity',
        category: act.module ? act.module.toUpperCase() : 'SYSTEM',
        title: isDriver
          ? 'Chauffeur Dispatched'
          : isStatus
          ? 'Trip Status Update'
          : isBooking
          ? 'New Booking Placed'
          : act.action.replace(/_/g, ' '),
        message: act.description || 'System operation executed',
        timestamp: act.createdAt,
        priority: isDriver || isBooking ? 'medium' : 'low',
        link:
          act.module === 'bookings'
            ? '/admin/bookings'
            : act.module === 'fleet'
            ? '/admin/cars'
            : act.module === 'drivers'
            ? '/admin/drivers'
            : '/admin',
      });
    });

    // 3. Customer Reviews & Feedback
    recentReviews.forEach((rev) => {
      notifications.push({
        id: `rev-${rev._id}`,
        type: 'review',
        category: 'FEEDBACK',
        title: `New ${rev.overallRating}★ Review Received`,
        message: rev.comments
          ? `"${rev.comments.length > 70 ? rev.comments.slice(0, 70) + '...' : rev.comments}" — ${rev.user?.name || 'Rider'}`
          : `Rider rated trip with ${rev.overallRating} stars (+5 pts awarded)`,
        timestamp: rev.createdAt,
        priority: 'medium',
        link: '/admin/reviews',
      });
    });

    // Sort chronologically (newest first) and deduplicate
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const topNotifications = notifications.slice(0, 20);

    return NextResponse.json({
      success: true,
      notifications: topNotifications,
      count: topNotifications.length,
    });
  } catch (error) {
    console.error('[/api/admin/notifications GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
