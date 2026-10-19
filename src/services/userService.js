import {
  findUserById,
  updateUserProfile,
  findUsersPaginated,
  setUserActiveStatus,
} from '@/repositories/userRepository';
import { logActivity } from '@/lib/utils/activityLogger';

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
 * Asserts caller is either the owner of the user profile or an admin
 * @param {string} targetUserId
 * @param {Object} session
 */
function assertOwnerOrAdmin(targetUserId, session) {
  if (!session || !session.user || !session.user.id) {
    throw new Error('UNAUTHENTICATED');
  }
  const isOwner = String(session.user.id) === String(targetUserId);
  const isAdmin = session.user.role === 'admin' || session.user.role === 'super-admin';
  if (!isOwner && !isAdmin) {
    throw new Error('FORBIDDEN_NOT_RESOURCE_OWNER');
  }
}

/**
 * Fetch profile data for customer dashboard
 * @param {string} userId
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function getUserProfileService(userId, session) {
  assertOwnerOrAdmin(userId, session);
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }
  return user;
}

/**
 * Update personal customer profile details
 * @param {string} userId
 * @param {Object} rawData
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function updateUserProfileService(userId, rawData, session) {
  assertOwnerOrAdmin(userId, session);

  const allowedUpdates = {};
  if (typeof rawData.name === 'string' && rawData.name.trim().length >= 2) {
    allowedUpdates.name = rawData.name.trim();
  }
  if (typeof rawData.phone === 'string') {
    allowedUpdates.phone = rawData.phone.trim();
  }
  if (typeof rawData.avatarUrl === 'string') {
    allowedUpdates.avatarUrl = rawData.avatarUrl.trim();
  }

  const updatedUser = await updateUserProfile(userId, allowedUpdates);
  if (!updatedUser) {
    throw new Error('USER_NOT_FOUND');
  }

  return updatedUser;
}

/**
 * Paginated user query for Admin Users Desk
 * @param {Object} params
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function getAdminUsersService(params, session) {
  assertAdminRole(session);
  return await findUsersPaginated(params);
}

/**
 * Toggle user active/suspend status (Admin only)
 * @param {string} userId
 * @param {boolean} isActive
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function setUserActiveService(userId, isActive, session) {
  assertAdminRole(session);
  const user = await setUserActiveStatus(userId, isActive);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  logActivity({
    adminId: session.user.id,
    adminEmail: session.user.email,
    adminRole: session.user.role,
    action: isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
    module: 'users',
    targetId: userId,
    description: `Admin changed active status to ${isActive} for user ${user.email}`,
  }).catch(() => {});

  return user;
}
