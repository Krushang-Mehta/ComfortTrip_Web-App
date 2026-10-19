import test from 'node:test';
import assert from 'node:assert/strict';

import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../src/lib/validations/authValidation.js';

import {
  createBookingSchema,
  updateBookingStatusSchema,
  assignDriverSchema,
} from '../src/lib/validations/bookingValidation.js';

import {
  createCarSchema,
  updateCarSchema,
} from '../src/lib/validations/carValidation.js';

import {
  createReviewSchema,
} from '../src/lib/validations/reviewValidation.js';

test('Auth Validations: loginSchema rejects invalid inputs and accepts valid', () => {
  // Invalid inputs
  assert.throws(() => loginSchema.parse({ email: 'invalid-email', password: '' }));
  assert.throws(() => loginSchema.parse({ email: 'test@example.com', password: '' }));
  assert.throws(() => loginSchema.parse({}));

  // Valid input
  const valid = loginSchema.parse({ email: 'Test@example.com', password: 'ValidPassword123!' });
  assert.equal(valid.email, 'test@example.com');
});

test('Auth Validations: registerSchema enforces password complexity and matching', () => {
  // Invalid: weak password
  assert.throws(() =>
    registerSchema.parse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      confirmPassword: 'password',
    })
  );

  // Invalid: mismatched passwords
  assert.throws(() =>
    registerSchema.parse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPassword1!',
      confirmPassword: 'DifferentPassword2@',
    })
  );

  // Valid
  const valid = registerSchema.parse({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'StrongPassword1!',
    confirmPassword: 'StrongPassword1!',
    phone: '9876543210',
  });
  assert.equal(valid.name, 'John Doe');
});

test('Booking Validations: createBookingSchema rejects invalid dates, passengers, and routes', () => {
  // Invalid: missing carId
  assert.throws(() =>
    createBookingSchema.parse({
      tripType: 'Local',
      pickupAddress: 'Rajkot',
      destinationAddress: 'Somnath',
      pickupDateTime: new Date(Date.now() + 86400000),
      passengers: 4,
    })
  );

  // Invalid: passengers <= 0
  assert.throws(() =>
    createBookingSchema.parse({
      carId: 'car_123',
      tripType: 'Local',
      pickupAddress: 'Rajkot',
      destinationAddress: 'Somnath',
      pickupDateTime: new Date(Date.now() + 86400000),
      passengers: 0,
    })
  );

  // Valid
  const valid = createBookingSchema.parse({
    carId: 'car_123',
    tripType: 'Local',
    pickupAddress: 'Kalawad Road, Rajkot',
    destinationAddress: 'Somnath Temple',
    pickupDateTime: new Date(Date.now() + 86400000),
    passengers: 4,
  });
  assert.equal(valid.passengers, 4);
});

test('Booking Validations: updateBookingStatusSchema and assignDriverSchema', () => {
  assert.throws(() => updateBookingStatusSchema.parse({ status: 'InvalidStatus' }));
  const validStatus = updateBookingStatusSchema.parse({ status: 'Confirmed', adminNotes: 'Approved' });
  assert.equal(validStatus.status, 'Confirmed');

  assert.throws(() => assignDriverSchema.parse({ driverId: '' }));
  const validDriver = assignDriverSchema.parse({ driverId: 'drv_001' });
  assert.equal(validDriver.driverId, 'drv_001');
});

test('Car Validations: createCarSchema rejects invalid category and negative pricing', () => {
  // Invalid category
  assert.throws(() =>
    createCarSchema.parse({
      brand: 'Toyota',
      model: 'Innova Crysta',
      category: 'Rocket',
      seatingCapacity: 7,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      pricePerKm: 18,
      pricePerDay: 4500,
    })
  );

  // Invalid pricing
  assert.throws(() =>
    createCarSchema.parse({
      brand: 'Toyota',
      model: 'Innova Crysta',
      category: 'SUV',
      seatingCapacity: 7,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      pricePerKm: -1,
      pricePerDay: 50,
    })
  );

  // Valid
  const valid = createCarSchema.parse({
    brand: 'Toyota',
    model: 'Innova Crysta',
    category: 'SUV',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    pricePerKm: 18,
    pricePerDay: 4500,
  });
  assert.equal(valid.brand, 'Toyota');
});

test('Review Validations: createReviewSchema enforces 1-5 star ratings', () => {
  // Invalid ratings
  assert.throws(() => createReviewSchema.parse({ bookingId: 'CT-2026-001', overallRating: 0 }));
  assert.throws(() => createReviewSchema.parse({ bookingId: 'CT-2026-001', overallRating: 6 }));
  assert.throws(() => createReviewSchema.parse({ overallRating: 5 }));

  // Valid
  const valid = createReviewSchema.parse({
    bookingId: 'CT-2026-001',
    overallRating: 5,
    driverRating: 5,
    carCleanlinessRating: 4,
    comments: 'Excellent and smooth ride from Rajkot to Dwarka!',
  });
  assert.equal(valid.overallRating, 5);
});
