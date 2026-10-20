import {
  createBookingSchema,
  updateBookingStatusSchema,
  assignDriverSchema,
} from '@/lib/validations/bookingValidation';
import { findCarById } from '@/repositories/carRepository';
import { findDriverById, updateDriverStatus } from '@/repositories/driverRepository';
import {
  createBooking,
  findBookingById,
  findBookingByBookingId,
  findUserBookings,
  updateBookingStatus,
  assignDriverToBooking,
  findAllBookingsAdmin,
} from '@/repositories/bookingRepository';
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
 * Asserts caller is either the owner of the resource or an admin
 * @param {string} resourceOwnerId
 * @param {Object} session
 */
function assertOwnerOrAdmin(resourceOwnerId, session) {
  assertAuthenticated(session);
  const isOwner = String(session.user.id) === String(resourceOwnerId);
  const isAdmin = session.user.role === 'admin' || session.user.role === 'super-admin';
  if (!isOwner && !isAdmin) {
    throw new Error('FORBIDDEN_NOT_RESOURCE_OWNER');
  }
}

/**
 * Place a new rental booking (Auth-gated)
 * 
 * @param {Object} rawData
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function createBookingService(rawData, session) {
  assertAuthenticated(session);
  const validated = createBookingSchema.parse(rawData);

  const car = await findCarById(validated.carId);
  if (!car) {
    throw new Error('CAR_NOT_FOUND');
  }

  if (car.status !== 'available') {
    throw new Error('CAR_NOT_AVAILABLE');
  }

  // Calculate fare estimate based on Gujarat rental standard: (Car rate/km * 350 km/day * days)
  const ratePerKm = Number(car.pricePerKm) || 12;
  let tripDays = 1;
  if (validated.returnDateTime && validated.pickupDateTime) {
    const diffMs = new Date(validated.returnDateTime) - new Date(validated.pickupDateTime);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    tripDays = Math.max(1, diffDays);
  }
  const baseEstimatedAmount = ratePerKm * 350 * tripDays;
  const estimatedAmount = Math.max(baseEstimatedAmount, Number(car.pricePerDay) || 2000);

  const booking = await createBooking({
    user: session.user.id,
    car: car._id,
    tripType: validated.tripType,
    pickupAddress: validated.pickupAddress,
    destinationAddress: validated.destinationAddress,
    pickupDateTime: validated.pickupDateTime,
    returnDateTime: validated.returnDateTime || null,
    passengers: validated.passengers,
    totalEstimatedAmount: estimatedAmount,
    customerNotes: validated.customerNotes || '',
  });

  logActivity({
    action: 'BOOKING_CREATED',
    module: 'bookings',
    targetId: booking.bookingId,
    description: `Booking ${booking.bookingId} placed by user ${session.user.email}`,
    details: { car: `${car.brand} ${car.model}`, route: `${validated.pickupAddress} -> ${validated.destinationAddress}` },
  }).catch(() => {});

  return booking;
}

/**
 * Get booking history for current logged-in customer
 * 
 * @param {string} targetUserId
 * @param {Object} session
 * @param {Object} [options]
 * @returns {Promise<Array>}
 */
export async function getUserBookingsService(targetUserId, session, options = {}) {
  assertOwnerOrAdmin(targetUserId, session);
  return await findUserBookings(targetUserId, options);
}

/**
 * Get single booking details by MongoDB ID
 * 
 * @param {string} bookingId
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function getBookingDetailsService(bookingId, session) {
  assertAuthenticated(session);
  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new Error('BOOKING_NOT_FOUND');
  }

  const ownerId = booking.user?._id || booking.user;
  assertOwnerOrAdmin(ownerId, session);

  return booking;
}

/**
 * Update booking status (Admin dispatch desk)
 * 
 * @param {string} id
 * @param {Object} rawData
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function updateBookingStatusService(id, rawData, session) {
  assertAdminRole(session);
  const validated = updateBookingStatusSchema.parse(rawData);

  const updatedBooking = await updateBookingStatus(
    id,
    validated.status,
    validated.adminNotes
  );

  if (!updatedBooking) {
    throw new Error('BOOKING_NOT_FOUND');
  }

  // If marked completed, free up the assigned driver if present
  if (validated.status === 'Completed' && updatedBooking.assignedDriver?.driverId) {
    await updateDriverStatus(updatedBooking.assignedDriver.driverId, 'Available').catch(() => {});
  }

  logActivity({
    adminId: session.user.id,
    adminEmail: session.user.email,
    adminRole: session.user.role,
    action: 'BOOKING_STATUS_UPDATED',
    module: 'bookings',
    targetId: updatedBooking.bookingId,
    description: `Booking ${updatedBooking.bookingId} status changed to ${validated.status}`,
  }).catch(() => {});

  return updatedBooking;
}

/**
 * Assign a driver to a booking (Admin dispatch desk)
 * 
 * @param {string} bookingId
 * @param {Object} rawData
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function assignDriverService(bookingId, rawData, session) {
  assertAdminRole(session);
  const validated = assignDriverSchema.parse(rawData);

  const driver = await findDriverById(validated.driverId);
  if (!driver) {
    throw new Error('DRIVER_NOT_FOUND');
  }

  const driverSnapshot = {
    driverId: driver._id,
    name: driver.fullName,
    phone: driver.phone,
    licenseNumber: driver.licenseNumber,
  };

  const updatedBooking = await assignDriverToBooking(bookingId, driverSnapshot);
  if (!updatedBooking) {
    throw new Error('BOOKING_NOT_FOUND');
  }

  // Update driver status to On-Trip
  await updateDriverStatus(driver._id, 'On-Trip').catch(() => {});

  logActivity({
    adminId: session.user.id,
    adminEmail: session.user.email,
    adminRole: session.user.role,
    action: 'DRIVER_ASSIGNED',
    module: 'bookings',
    targetId: updatedBooking.bookingId,
    description: `Assigned chauffeur ${driver.fullName} to booking ${updatedBooking.bookingId}`,
  }).catch(() => {});

  return updatedBooking;
}

/**
 * Paginated booking query for Admin Live Dispatch Desk
 * 
 * @param {Object} params
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function getAdminBookingsDeskService(params, session) {
  assertAdminRole(session);
  return await findAllBookingsAdmin(params);
}
