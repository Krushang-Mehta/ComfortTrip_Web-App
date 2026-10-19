import Review from '@/models/Review';

/**
 * Create a new customer ride review
 * @param {Object} reviewData
 * @returns {Promise<Object>}
 */
export async function createReview(reviewData) {
  const review = await Review.create(reviewData);
  return review.toObject();
}

/**
 * Check if a review already exists for a booking
 * @param {string} bookingId
 * @returns {Promise<Object|null>}
 */
export async function findReviewByBooking(bookingId) {
  if (!bookingId) return null;
  return await Review.findOne({ booking: bookingId }).lean();
}

/**
 * Find public approved reviews for homepage & testimonials
 * @param {number} [limit=6]
 * @returns {Promise<Array>}
 */
export async function findPublicReviews(limit = 6) {
  return await Review.find({ isPublic: true })
    .populate('car', 'brand model')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

/**
 * Find all reviews submitted by a specific user (for Admin user review browser & customer profile)
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function findReviewsByUser(userId) {
  if (!userId) return [];
  return await Review.find({ user: userId })
    .populate('car', 'brand model')
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Paginated query for Admin Customer Reviews Desk
 * @param {Object} options
 * @returns {Promise<{ reviews: Array, total: number, pages: number }>}
 */
export async function findAllReviewsAdmin({
  page = 1,
  limit = 10,
  rating = '',
  search = '',
}) {
  const query = {};

  if (rating) {
    query.overallRating = Number(rating);
  }

  if (search) {
    query.$or = [
      { bookingId: { $regex: search, $options: 'i' } },
      { userName: { $regex: search, $options: 'i' } },
      { comments: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate('user', 'name email phone avatarUrl')
      .populate('driver', 'fullName phone')
      .populate('car', 'brand model')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(query),
  ]);

  return {
    reviews,
    total,
    pages: Math.ceil(total / limit) || 1,
    currentPage: page,
  };
}

/**
 * Toggle public marketing display visibility for a review
 * @param {string} id
 * @param {boolean} isPublic
 * @returns {Promise<Object|null>}
 */
export async function toggleReviewPublic(id, isPublic) {
  return await Review.findByIdAndUpdate(
    id,
    { $set: { isPublic } },
    { new: true }
  ).lean();
}
