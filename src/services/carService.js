import { createCarSchema, updateCarSchema } from '@/lib/validations/carValidation';
import {
  findActiveCars,
  findCarById,
  createCar,
  updateCar,
  softDeleteCar,
  findAllCarsAdmin,
} from '@/repositories/carRepository';
import { logActivity } from '@/lib/utils/activityLogger';

/**
 * Helper to assert admin or super-admin role
 * @param {Object} session
 */
function assertAdminRole(session) {
  if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
    throw new Error('UNAUTHORIZED_ADMIN_ONLY');
  }
}

/**
 * Public fleet catalog query
 * @param {Object} [filter]
 * @returns {Promise<Array>}
 */
export async function getActiveFleetService(filter) {
  return await findActiveCars(filter);
}

/**
 * Get car details by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getCarByIdService(id) {
  const car = await findCarById(id);
  if (!car) {
    throw new Error('CAR_NOT_FOUND');
  }
  return car;
}

/**
 * Create a new car in fleet (Admin only)
 * @param {Object} rawData
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function createCarService(rawData, session) {
  assertAdminRole(session);
  const validated = createCarSchema.parse(rawData);

  const car = await createCar(validated);

  logActivity({
    adminId: session.user.id,
    adminEmail: session.user.email,
    adminRole: session.user.role,
    action: 'CAR_CREATED',
    module: 'fleet',
    targetId: car._id.toString(),
    description: `Added vehicle: ${car.brand} ${car.model} (${car.category})`,
  }).catch(() => {});

  return car;
}

/**
 * Update an existing car in fleet (Admin only)
 * @param {string} id
 * @param {Object} rawData
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function updateCarService(id, rawData, session) {
  assertAdminRole(session);
  const validated = updateCarSchema.parse(rawData);

  const car = await updateCar(id, validated);
  if (!car) {
    throw new Error('CAR_NOT_FOUND');
  }

  logActivity({
    adminId: session.user.id,
    adminEmail: session.user.email,
    adminRole: session.user.role,
    action: 'CAR_UPDATED',
    module: 'fleet',
    targetId: id,
    description: `Updated vehicle details for ID: ${id}`,
  }).catch(() => {});

  return car;
}

/**
 * Soft delete a car from fleet (Admin only)
 * @param {string} id
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function deleteCarService(id, session) {
  assertAdminRole(session);
  const car = await softDeleteCar(id);
  if (!car) {
    throw new Error('CAR_NOT_FOUND');
  }

  logActivity({
    adminId: session.user.id,
    adminEmail: session.user.email,
    adminRole: session.user.role,
    action: 'CAR_DELETED',
    module: 'fleet',
    targetId: id,
    description: `Vehicle soft-deleted: ${car.brand} ${car.model}`,
  }).catch(() => {});

  return car;
}

/**
 * Admin Fleet Inventory directory query
 * @param {Object} params
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function getAdminFleetService(params, session) {
  assertAdminRole(session);
  return await findAllCarsAdmin(params);
}
