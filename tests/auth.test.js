import test from 'node:test';
import assert from 'node:assert/strict';
import {
  requireAuth,
  requireAdmin,
  requireSuperAdmin,
  hasRole,
  isOwnerOrAdmin,
  ROLES,
} from '@/lib/auth/rbac';
import {
  welcomeEmailTemplate,
  bookingConfirmationEmailTemplate,
  driverAssignedEmailTemplate,
  tripCompletedEmailTemplate,
} from '@/lib/smtp/emailTemplates';
import { buildSessionUser } from '@/services/authService';
import { getTransporter } from '@/lib/smtp/transporter';

test('RBAC: requireAuth enforces valid session', () => {
  assert.throws(
    () => requireAuth(null),
    (err) => err.statusCode === 401 && err.message === 'UNAUTHENTICATED'
  );

  assert.throws(
    () => requireAuth({}),
    (err) => err.statusCode === 401 && err.message === 'UNAUTHENTICATED'
  );

  const validSession = { user: { id: 'user-123', email: 'test@example.com', role: ROLES.USER } };
  const user = requireAuth(validSession);
  assert.equal(user.id, 'user-123');
  assert.equal(user.role, 'user');
});

test('RBAC: requireAdmin allows admin/super-admin and blocks standard user', () => {
  const customerSession = { user: { id: 'cust-1', role: ROLES.USER } };
  const adminSession = { user: { id: 'adm-1', role: ROLES.ADMIN } };
  const superAdminSession = { user: { id: 'sup-1', role: ROLES.SUPER_ADMIN } };

  assert.throws(
    () => requireAdmin(customerSession),
    (err) => err.statusCode === 403 && err.message === 'FORBIDDEN_ADMIN_ACCESS_REQUIRED'
  );

  assert.doesNotThrow(() => requireAdmin(adminSession));
  assert.doesNotThrow(() => requireAdmin(superAdminSession));
});

test('RBAC: requireSuperAdmin strictly allows super-admin only', () => {
  const adminSession = { user: { id: 'adm-1', role: ROLES.ADMIN } };
  const superAdminSession = { user: { id: 'sup-1', role: ROLES.SUPER_ADMIN } };

  assert.throws(
    () => requireSuperAdmin(adminSession),
    (err) => err.statusCode === 403 && err.message === 'FORBIDDEN_SUPER_ADMIN_REQUIRED'
  );

  const superUser = requireSuperAdmin(superAdminSession);
  assert.equal(superUser.role, 'super-admin');
});

test('RBAC: hasRole and isOwnerOrAdmin checks', () => {
  const customerSession = { user: { id: 'user-456', role: 'user' } };
  const adminSession = { user: { id: 'admin-999', role: 'admin' } };

  assert.equal(hasRole(customerSession.user, ['admin', 'super-admin']), false);
  assert.equal(hasRole(adminSession.user, ['admin', 'super-admin']), true);

  // User owns their resource
  assert.equal(isOwnerOrAdmin(customerSession, 'user-456'), true);
  // User does NOT own another user's resource
  assert.equal(isOwnerOrAdmin(customerSession, 'user-789'), false);
  // Admin can access anyone's resource
  assert.equal(isOwnerOrAdmin(adminSession, 'user-789'), true);
});

test('Email Templates: Welcome email contains branding, customer name, and bonus points', () => {
  const html = welcomeEmailTemplate({
    name: 'Rajesh Patel',
    email: 'rajesh@example.com',
  });

  assert.match(html, /Comfort Trip Car Rentals/);
  assert.match(html, /Rajesh Patel/);
  assert.match(html, /100 Reward Points/);
  assert.match(html, /Rajkot/);
});

test('Email Templates: Booking confirmation contains sequential booking ID and details', () => {
  const html = bookingConfirmationEmailTemplate({
    booking: {
      bookingId: 'CT-2026-001',
      carModel: 'Toyota Innova Crysta',
      carCategory: 'SUV',
      tripType: 'Outstation Round Trip',
      pickupLocation: 'Rajkot Airport',
      dropLocation: 'Somnath Temple',
      pickupDateTime: new Date('2026-10-25T10:00:00Z'),
      totalAmount: 7500,
      status: 'confirmed',
    },
    user: { name: 'Amit Shah' },
  });

  assert.match(html, /CT-2026-001/);
  assert.match(html, /Toyota Innova Crysta/);
  assert.match(html, /Rajkot Airport/);
  assert.match(html, /Somnath Temple/);
  assert.match(html, /7,500/);
});

test('Email Templates: Driver assigned and trip completed templates contain essential fields', () => {
  const driverHtml = driverAssignedEmailTemplate({
    booking: { bookingId: 'CT-2026-002', carModel: 'Maruti Ertiga', vehicleNumber: 'GJ-03-ER-4521' },
    driver: { name: 'Kishan Dave', phone: '+91 98250 12345' },
  });
  assert.match(driverHtml, /Kishan Dave/);
  assert.match(driverHtml, /\+91 98250 12345/);
  assert.match(driverHtml, /GJ-03-ER-4521/);

  const completedHtml = tripCompletedEmailTemplate({
    booking: { bookingId: 'CT-2026-002' },
    user: { name: 'Kishan' },
    rewardPointsEarned: 5,
  });
  assert.match(completedHtml, /\+5 reward points/);
  assert.match(completedHtml, /CT-2026-002/);
});

test('Auth Service: buildSessionUser sanitizes passwordHash and sets defaults', () => {
  const rawDbUser = {
    _id: { toString: () => 'user-xyz-987' },
    name: 'Pooja Dave',
    email: 'pooja@example.com',
    passwordHash: '$2a$12$someHashedPasswordSecret',
    role: 'user',
    rewardPoints: 120,
    isActive: true,
  };

  const sessionUser = buildSessionUser(rawDbUser);
  assert.equal(sessionUser.id, 'user-xyz-987');
  assert.equal(sessionUser.name, 'Pooja Dave');
  assert.equal(sessionUser.email, 'pooja@example.com');
  assert.equal(sessionUser.role, 'user');
  assert.equal(sessionUser.rewardPoints, 120);
  assert.equal(sessionUser.passwordHash, undefined, 'passwordHash must never be exposed');
});

test('SMTP Transporter: getTransporter initializes successfully with verify support', async () => {
  const transporter = getTransporter();
  assert.ok(transporter, 'Transporter must be defined');
  assert.equal(typeof transporter.sendMail, 'function');
  assert.equal(typeof transporter.verify, 'function');
});

test('Error Sanitizer: formatErrorResponse transforms Zod errors into friendly human messages', async () => {
  const { formatErrorResponse } = await import('@/lib/utils/formatApiError');
  const mockZodError = {
    name: 'ZodError',
    errors: [
      {
        path: ['password'],
        message: 'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special symbol (e.g. @, #, $, %)',
      },
    ],
  };

  const response = formatErrorResponse(mockZodError);
  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /uppercase letter \(A-Z\)/);
  assert.ok(response.body.fieldErrors?.password);

  const mockDuplicateError = {
    code: 11000,
    keyPattern: { email: 1 },
  };
  const dupResponse = formatErrorResponse(mockDuplicateError);
  assert.equal(dupResponse.status, 409);
  assert.match(dupResponse.body.message, /email already exists/);
});

