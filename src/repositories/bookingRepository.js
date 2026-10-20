import Booking from '@/models/Booking';
import Counter from '@/models/Counter';

/**
 * Generate collision-proof sequential Booking ID: CT-{YYYY}-{SEQ:003}
 * E.g. CT-2026-001, CT-2026-002
 * @returns {Promise<string>}
 */
export async function generateSequentialBookingId() {
  const currentYear = new Date().getFullYear();
  const counterKey = `booking_${currentYear}`;
  const seq = await Counter.getNextSequence(counterKey);
  const formattedSeq = String(seq).padStart(3, '0');
  return `CT-${currentYear}-${formattedSeq}`;
}

/**
 * Create a new booking with an atomic sequential booking ID
 * @param {Object} bookingData
 * @returns {Promise<Object>}
 */
export async function createBooking(bookingData) {
  const bookingId = await generateSequentialBookingId();
  const booking = await Booking.create({
    ...bookingData,
    bookingId,
    status: 'Pending',
  });
  return booking.toObject();
}

/**
 * Find booking by MongoDB ObjectId
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function findBookingById(id) {
  if (!id) return null;
  return await Booking.findById(id)
    .populate('user', 'name email phone avatarUrl')
    .populate('car', 'brand model category pricePerKm pricePerDay images features')
    .lean();
}

/**
 * Find booking by human-readable sequential ID (e.g. CT-2026-001)
 * @param {string} bookingId
 * @returns {Promise<Object|null>}
 */
export async function findBookingByBookingId(bookingId) {
  if (!bookingId) return null;
  return await Booking.findOne({ bookingId: bookingId.trim() })
    .populate('user', 'name email phone avatarUrl')
    .populate('car', 'brand model category pricePerKm pricePerDay images')
    .lean();
}

/**
 * Find bookings for a specific customer (for /profile dashboard)
 * @param {string} userId
 * @param {Object} [options={}]
 * @returns {Promise<Array>}
 */
export async function findUserBookings(userId, options = {}) {
  const query = { user: userId };
  if (options.status) {
    query.status = options.status;
  }

  return await Booking.find(query)
    .populate('car', 'brand model category pricePerKm pricePerDay images')
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Update booking status and optional administrative notes
 * @param {string} id
 * @param {string} status
 * @param {string} [adminNotes]
 * @param {number} [totalEstimatedAmount]
 * @returns {Promise<Object|null>}
 */
export async function updateBookingStatus(id, status, adminNotes, totalEstimatedAmount) {
  const update = { status };
  if (typeof adminNotes === 'string') {
    update.adminNotes = adminNotes;
  }
  if (typeof totalEstimatedAmount === 'number' && totalEstimatedAmount > 0) {
    update.totalEstimatedAmount = totalEstimatedAmount;
  }

  return await Booking.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true }
  )
    .populate('user', 'name email phone')
    .populate('car', 'brand model category')
    .lean();
}

/**
 * Assign a driver snapshot to a booking and transition to 'Driver-Assigned' or 'Confirmed'
 * @param {string} id
 * @param {Object} driverInfo
 * @param {string} driverInfo.driverId
 * @param {string} driverInfo.name
 * @param {string} driverInfo.phone
 * @param {string} driverInfo.licenseNumber
 * @returns {Promise<Object|null>}
 */
export async function assignDriverToBooking(id, driverInfo) {
  return await Booking.findByIdAndUpdate(
    id,
    {
      $set: {
        assignedDriver: driverInfo,
        status: 'Driver-Assigned',
      },
    },
    { new: true }
  )
    .populate('user', 'name email phone')
    .populate('car', 'brand model category')
    .lean();
}

/**
 * Paginated query for Admin Live Dispatch Desk
 * @param {Object} options
 * @returns {Promise<{ bookings: Array, total: number, pages: number }>}
 */
export async function findAllBookingsAdmin({
  page = 1,
  limit = 10,
  status = '',
  search = '',
}) {
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { bookingId: { $regex: search, $options: 'i' } },
      { pickupAddress: { $regex: search, $options: 'i' } },
      { destinationAddress: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('user', 'name email phone')
      .populate('car', 'brand model category pricePerKm pricePerDay')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Booking.countDocuments(query),
  ]);

  return {
    bookings,
    total,
    pages: Math.ceil(total / limit) || 1,
    currentPage: page,
  };
}

/**
 * Flag that review has been submitted for this booking
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function markReviewSubmitted(id) {
  return await Booking.findByIdAndUpdate(
    id,
    { $set: { reviewSubmitted: true } },
    { new: true }
  ).lean();
}

/**
 * Flag that invoice PDF has been generated
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function markInvoiceGenerated(id) {
  return await Booking.findByIdAndUpdate(
    id,
    { $set: { invoiceGenerated: true } },
    { new: true }
  ).lean();
}
