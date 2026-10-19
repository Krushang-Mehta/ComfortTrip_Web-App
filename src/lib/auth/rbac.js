/**
 * Role-Based Access Control (RBAC) definitions and route guard utilities
 */

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',
};

/**
 * Check if the user possesses the required role or roles
 * @param {Object} user - User object or session.user
 * @param {string|string[]} requiredRoles - Allowed role(s)
 * @returns {boolean}
 */
export function hasRole(user, requiredRoles) {
  if (!user || !user.role) return false;
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return rolesArray.includes(user.role);
}

/**
 * Enforce that caller is authenticated
 * @param {Object} session - NextAuth session
 * @returns {Object} Safe session user
 * @throws {Error} If unauthenticated
 */
export function requireAuth(session) {
  if (!session?.user) {
    const error = new Error('UNAUTHENTICATED');
    error.statusCode = 401;
    throw error;
  }
  return session.user;
}

/**
 * Enforce that caller is either an 'admin' or 'super-admin'
 * @param {Object} session - NextAuth session
 * @returns {Object} Safe session user
 * @throws {Error} If unauthorized
 */
export function requireAdmin(session) {
  const user = requireAuth(session);
  if (!['admin', 'super-admin'].includes(user.role)) {
    const error = new Error('FORBIDDEN_ADMIN_ACCESS_REQUIRED');
    error.statusCode = 403;
    throw error;
  }
  return user;
}

/**
 * Enforce that caller is strictly 'super-admin'
 * @param {Object} session - NextAuth session
 * @returns {Object} Safe session user
 * @throws {Error} If unauthorized
 */
export function requireSuperAdmin(session) {
  const user = requireAuth(session);
  if (user.role !== 'super-admin') {
    const error = new Error('FORBIDDEN_SUPER_ADMIN_REQUIRED');
    error.statusCode = 403;
    throw error;
  }
  return user;
}

/**
 * Enforce resource ownership: caller must either own the resource or be an admin
 * @param {Object} session - NextAuth session
 * @param {string} resourceOwnerId - ID of user who owns the record
 * @returns {boolean}
 */
export function isOwnerOrAdmin(session, resourceOwnerId) {
  if (!session?.user) return false;
  if (['admin', 'super-admin'].includes(session.user.role)) return true;
  return session.user.id?.toString() === resourceOwnerId?.toString();
}
