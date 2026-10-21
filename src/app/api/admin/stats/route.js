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

    // Compute 6-month start date
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

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
      monthlyRevenueAgg,
      categoryDemandAgg,
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
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
            status: { $in: ['Confirmed', 'Driver-Assigned', 'In-Journey', 'Completed'] },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            total: { $sum: '$totalEstimatedAmount' },
            count: { $sum: 1 },
          },
        },
      ]),
      Booking.aggregate([
        {
          $lookup: {
            from: 'cars',
            localField: 'car',
            foreignField: '_id',
            as: 'carDetails',
          },
        },
        { $unwind: { path: '$carDetails', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { $ifNull: ['$carDetails.category', 'Sedan'] },
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalEstimatedAmount' },
          },
        },
        { $sort: { count: -1 } },
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

    // Build standard 6-month continuous trend
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const revenueMonths = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yr = d.getFullYear();
      const mo = d.getMonth() + 1; // 1-12
      const found = monthlyRevenueAgg.find((m) => m._id.year === yr && m._id.month === mo);
      const amountVal = found ? found.total : 0;
      // In thousands for compact display, e.g. 45 for ₹45,000
      const displayK = Math.round(amountVal / 1000) || (i === 0 && totalRevenue > 0 ? Math.round(totalRevenue / 1000) : 0);
      revenueMonths.push({
        month: monthNames[d.getMonth()],
        year: yr,
        amount: displayK,
        rawAmount: amountVal,
      });
    }

    // Determine max for height percentage
    const maxK = Math.max(...revenueMonths.map((r) => r.amount), 50);
    const formattedRevenueMonths = revenueMonths.map((r) => ({
      ...r,
      height: `${Math.max(18, Math.min(100, Math.round((r.amount / maxK) * 100)))}%`,
    }));

    // Calculate category percentages
    const totalCategoryBookings = categoryDemandAgg.reduce((sum, c) => sum + c.count, 0) || 1;
    const popularCategories = categoryDemandAgg.map((cat, idx) => {
      const pct = Math.round((cat.count / totalCategoryBookings) * 100);
      const color = idx === 0 ? '#7C3AED' : idx === 1 ? '#D97706' : idx === 2 ? '#38BDF8' : '#10B981';
      return {
        category: cat._id,
        count: cat.count,
        percentage: pct,
        color,
      };
    });

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
          months: formattedRevenueMonths,
        },
        popularCategories,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('[/api/admin/stats GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
