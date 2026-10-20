import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import Booking from '@/models/Booking';
import Car from '@/models/Car';
import User from '@/models/User';
import Review from '@/models/Review';
import Driver from '@/models/Driver';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Parallel aggregate counts
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCars,
      availableCars,
      totalUsers,
      totalDrivers,
      availableDrivers,
      totalReviews,
      reviewsAggregation,
      revenueAggregation,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: { $in: ['Confirmed', 'Driver-Assigned', 'In-Journey'] } }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Cancelled' }),
      Car.countDocuments({ isDeleted: false }),
      Car.countDocuments({ isDeleted: false, status: 'available' }),
      User.countDocuments(),
      Driver.countDocuments({ isDeleted: false }),
      Driver.countDocuments({ isDeleted: false, status: 'Available' }),
      Review.countDocuments(),
      Review.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$overallRating' } } },
      ]),
      Booking.aggregate([
        { $match: { status: { $in: ['Confirmed', 'Driver-Assigned', 'In-Journey', 'Completed'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalEstimatedAmount' } } },
      ]),
      Booking.find()
        .populate('user', 'name email phone avatarUrl')
        .populate('car', 'brand model category')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    const averageRating = reviewsAggregation[0]?.avgRating
      ? Number(reviewsAggregation[0].avgRating.toFixed(1))
      : 5.0;

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    return NextResponse.json({
      success: true,
      stats: {
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          active: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
        fleet: {
          total: totalCars,
          available: availableCars,
          booked: totalCars - availableCars,
        },
        users: {
          total: totalUsers,
        },
        drivers: {
          total: totalDrivers,
          available: availableDrivers,
          onTrip: totalDrivers - availableDrivers,
        },
        reviews: {
          total: totalReviews,
          averageRating,
        },
        revenue: {
          total: totalRevenue,
        },
        recentBookings,
      },
    });
  } catch (error) {
    console.error('[/api/admin/stats GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
