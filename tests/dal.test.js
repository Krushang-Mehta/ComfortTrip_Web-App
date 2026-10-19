import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCarService,
  updateCarService,
  deleteCarService,
  getAdminFleetService,
} from '../src/services/carService.js';

import {
  createBookingService,
  getUserBookingsService,
  updateBookingStatusService,
  assignDriverService,
  getAdminBookingsDeskService,
} from '../src/services/bookingService.js';

import {
  getUserProfileService,
  updateUserProfileService,
  getAdminUsersService,
  setUserActiveService,
} from '../src/services/userService.js';

import {
  submitReviewService,
  getUserReviewsService,
  getAdminReviewsDeskService,
  toggleReviewPublicService,
} from '../src/services/reviewService.js';

// ==============================================================================
// 1. CAR SERVICE AUTHORIZATION TESTS (AGENTS.md §3)
// ==============================================================================

test('CarService: Rejects unauthenticated caller from creating a vehicle', async () => {
  await assert.rejects(
    async () => {
      await createCarService({ brand: 'Toyota' }, null);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );
});

test('CarService: Rejects non-admin user role from creating, updating, or deleting a vehicle', async () => {
  const regularUserSession = {
    user: { id: 'usr_1', email: 'user@comforttrip.com', role: 'user' },
  };

  await assert.rejects(
    async () => {
      await createCarService({ brand: 'Toyota' }, regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );

  await assert.rejects(
    async () => {
      await updateCarService('car_1', { pricePerDay: 5000 }, regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );

  await assert.rejects(
    async () => {
      await deleteCarService('car_1', regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );

  await assert.rejects(
    async () => {
      await getAdminFleetService({}, regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );
});

// ==============================================================================
// 2. BOOKING SERVICE AUTHORIZATION & OWNER TESTS (AGENTS.md §3)
// ==============================================================================

test('BookingService: Rejects unauthenticated caller from booking', async () => {
  await assert.rejects(
    async () => {
      await createBookingService({}, null);
    },
    { message: 'UNAUTHENTICATED' }
  );
});

test('BookingService: Rejects caller attempting to view another user’s bookings (Resource Ownership)', async () => {
  const userASession = {
    user: { id: 'usr_A', email: 'usera@example.com', role: 'user' },
  };

  await assert.rejects(
    async () => {
      // User A attempts to view User B's bookings
      await getUserBookingsService('usr_B', userASession);
    },
    { message: 'FORBIDDEN_NOT_RESOURCE_OWNER' }
  );
});

test('BookingService: Rejects non-admin from updating status or assigning drivers', async () => {
  const regularUserSession = {
    user: { id: 'usr_A', email: 'usera@example.com', role: 'user' },
  };

  await assert.rejects(
    async () => {
      await updateBookingStatusService('bkg_1', { status: 'Confirmed' }, regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );

  await assert.rejects(
    async () => {
      await assignDriverService('bkg_1', { driverId: 'drv_1' }, regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );

  await assert.rejects(
    async () => {
      await getAdminBookingsDeskService({}, regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );
});

// ==============================================================================
// 3. USER PROFILE SERVICE AUTHORIZATION TESTS (AGENTS.md §3)
// ==============================================================================

test('UserService: Rejects unauthenticated and unauthorized profile access', async () => {
  // Unauthenticated
  await assert.rejects(
    async () => {
      await getUserProfileService('usr_A', null);
    },
    { message: 'UNAUTHENTICATED' }
  );

  // Unauthorized (User B trying to edit User A)
  const userBSession = {
    user: { id: 'usr_B', email: 'userb@example.com', role: 'user' },
  };

  await assert.rejects(
    async () => {
      await updateUserProfileService('usr_A', { name: 'Hacked' }, userBSession);
    },
    { message: 'FORBIDDEN_NOT_RESOURCE_OWNER' }
  );

  // Non-admin trying to suspend users or access admin user directory
  await assert.rejects(
    async () => {
      await getAdminUsersService({}, userBSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );

  await assert.rejects(
    async () => {
      await setUserActiveService('usr_A', false, userBSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );
});

// ==============================================================================
// 4. REVIEW SERVICE AUTHORIZATION TESTS (AGENTS.md §3)
// ==============================================================================

test('ReviewService: Rejects unauthenticated caller and non-admin desk access', async () => {
  // Unauthenticated
  await assert.rejects(
    async () => {
      await submitReviewService({ bookingId: 'CT-2026-001', overallRating: 5 }, null);
    },
    { message: 'UNAUTHENTICATED' }
  );

  const regularUserSession = {
    user: { id: 'usr_A', email: 'usera@example.com', role: 'user' },
  };

  // User B trying to view User A's private reviews
  await assert.rejects(
    async () => {
      await getUserReviewsService('usr_B', regularUserSession);
    },
    { message: 'FORBIDDEN_NOT_RESOURCE_OWNER' }
  );

  // Non-admin trying to access admin review desk or toggle public visibility
  await assert.rejects(
    async () => {
      await getAdminReviewsDeskService({}, regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );

  await assert.rejects(
    async () => {
      await toggleReviewPublicService('rev_1', false, regularUserSession);
    },
    { message: 'UNAUTHORIZED_ADMIN_ONLY' }
  );
});
