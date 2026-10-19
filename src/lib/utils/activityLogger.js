import ActivityLog from '@/models/ActivityLog';

/**
 * Log administrative operations and lifecycle audit trails.
 * 
 * @param {Object} params
 * @param {string} [params.adminId]
 * @param {string} [params.adminEmail]
 * @param {string} [params.adminRole]
 * @param {string} params.action
 * @param {string} [params.module]
 * @param {string} [params.targetId]
 * @param {string} [params.description]
 * @param {string} [params.ipAddress]
 * @param {Object} [params.details]
 */
export async function logActivity({
  adminId,
  adminEmail,
  adminRole = 'admin',
  action,
  module = 'system',
  targetId = '',
  description = '',
  ipAddress = '127.0.0.1',
  details = {},
}) {
  try {
    return await ActivityLog.create({
      adminId,
      adminEmail,
      adminRole,
      action,
      module,
      targetId,
      description,
      ipAddress,
      details,
    });
  } catch (error) {
    // Non-blocking logger failure
    console.warn('Activity logging warning:', error?.message || error);
  }
}
