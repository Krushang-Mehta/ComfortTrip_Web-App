import { createReviewSchema } from '@/lib/validations/reviewValidation';
import {
  createReview,
  findReviewByBooking,
  findPublicReviews,
  findReviewsByUser,
  findAllReviewsAdmin,
  toggleReviewPublic,
} from '@/repositories/reviewRepository';
import {
  findBookingByBookingId,
  markReviewSubmitted,
} from '@/repositories/bookingRepository';
import { creditRewardPoints } from '@/repositories/userRepository';
import { recordDriverRideCompletion } from '@/repositories/driverRepository';
import { logActivity } from '@/lib/utils/activityLogger';

/**
 * Asserts user is authenticated
 * @param {Object} session
 */
function assertAuthenticated(session) {
  if (!session || !session.user || !session.user.id) {
    throw new Error('UNAUTHENTICATED');
  }
}

/**
 * Asserts user is an administrator
 * @param {Object} session
 */
function assertAdminRole(session) {
  if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
    throw new Error('UNAUTHORIZED_ADMIN_ONLY');
  }
}

/**
 * Submit post-trip review and claim +5 reward points
 * 
 * @param {Object} rawData
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function submitReviewService(rawData, session) {
  assertAuthenticated(session);
  const validated = createReviewSchema.parse(rawData);

  const booking = await findBookingByBookingId(validated.bookingId);
  if (!booking) {
    throw new Error('BOOKING_NOT_FOUND');
  }

  // Ensure booking belongs to this user
  const bookingUserId = booking.user?._id ? booking.user._id.toString() : booking.user.toString();
  if (bookingUserId !== String(session.user.id)) {
    throw new Error('FORBIDDEN_NOT_YOUR_BOOKING');
  }

  // Ensure trip is completed
  if (booking.status !== 'Completed') {
    throw new Error('CANNOT_REVIEW_INCOMPLETE_TRIP');
  }

  // Check duplicate review
  if (booking.reviewSubmitted) {
    throw new Error('REVIEW_ALREADY_SUBMITTED');
  }

  const existingReview = await findReviewByBooking(booking._id.toString());
  if (existingReview) {
    throw new Error('REVIEW_ALREADY_SUBMITTED');
  }

  // Create review
  const review = await createReview({
    booking: booking._id,
    bookingId: booking.bookingId,
    user: session.user.id,
    userName: session.user.name || booking.user?.name || 'Customer',
    driver: booking.assignedDriver?.driverId || null,
    car: booking.car?._id || booking.car || null,
    overallRating: validated.overallRating,
    driverRating: validated.driverRating || null,
    carCleanlinessRating: validated.carCleanlinessRating || null,
    comments: validated.comments || '',
    rewardPointsAwarded: 5,
    isPublic: true,
  });

  // Mark booking reviewSubmitted flag
  await markReviewSubmitted(booking._id.toString());

  // Atomically credit +5 reward points to customer wallet
  const updatedWallet = await creditRewardPoints(session.user.id, 5);

  // Recalculate driver aggregate rating if driver was assigned
  if (booking.assignedDriver?.driverId && validated.driverRating) {
    await recordDriverRideCompletion(
      booking.assignedDriver.driverId.toString(),
      validated.driverRating
    ).catch(() => {});
  }

  logActivity({
    action: 'REVIEW_SUBMITTED',
    module: 'reviews',
    targetId: review.bookingId,
    description: `User ${session.user.email} submitted ${validated.overallRating}★ review for booking ${review.bookingId} (+5 pts awarded)`,
  }).catch(() => {});

  return {
    review,
    rewardPointsAwarded: 5,
    newBalance: updatedWallet?.rewardPoints || 0,
  };
}

/**
 * Public testimonials query for homepage & services
 * @param {number} [limit=6]
 * @returns {Promise<Array>}
 */
export async function getPublicTestimonialsService(limit = 6) {
  return await findPublicReviews(limit);
}

/**
 * Find all reviews submitted by a specific user (for Admin user review browser)
 * @param {string} userId
 * @param {Object} session
 * @returns {Promise<Array>}
 */
export async function getUserReviewsService(userId, session) {
  if (!session || !session.user) {
    throw new Error('UNAUTHENTICATED');
  }
  const isOwner = String(session.user.id) === String(userId);
  const isAdmin = session.user.role === 'admin' || session.user.role === 'super-admin';
  if (!isOwner && !isAdmin) {
    throw new Error('FORBIDDEN_NOT_RESOURCE_OWNER');
  }

  return await findReviewsByUser(userId);
}

/**
 * Paginated query for Admin Customer Reviews Desk
 * @param {Object} params
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function getAdminReviewsDeskService(params, session) {
  assertAdminRole(session);
  return await findAllReviewsAdmin(params);
}

/**
 * Toggle public testimonial visibility
 * @param {string} id
 * @param {boolean} isPublic
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function toggleReviewPublicService(id, isPublic, session) {
  assertAdminRole(session);
  const review = await toggleReviewPublic(id, isPublic);
  if (!review) {
    throw new Error('REVIEW_NOT_FOUND');
  }

  logActivity({
    adminId: session.user.id,
    adminEmail: session.user.email,
    adminRole: session.user.role,
    action: 'REVIEW_VISIBILITY_TOGGLED',
    module: 'reviews',
    targetId: id,
    description: `Admin toggled public display to ${isPublic} for review on booking ${review.bookingId}`,
  }).catch(() => {});

  return review;
}
