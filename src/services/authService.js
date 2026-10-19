import bcrypt from 'bcryptjs';
import { loginSchema, registerSchema } from '@/lib/validations/authValidation';
import {
  findUserByEmail,
  createUser,
  updateLastActive,
} from '@/repositories/userRepository';
import { logActivity } from '@/lib/utils/activityLogger';

/**
 * Register a new customer account
 * Client registration strictly enforces role: 'user' per governance policy.
 * 
 * @param {Object} rawData
 * @returns {Promise<Object>}
 */
export async function registerUserService(rawData) {
  const validated = registerSchema.parse(rawData);

  const existing = await findUserByEmail(validated.email);
  if (existing) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(validated.password, saltRounds);

  const user = await createUser({
    name: validated.name,
    email: validated.email,
    passwordHash,
    phone: validated.phone || '',
    role: 'user', // Strict policy: self-registration is ALWAYS 'user'
    rewardPoints: 100, // 100 welcome bonus points
    isVerified: false,
    isActive: true,
  });

  logActivity({
    action: 'USER_REGISTERED',
    module: 'auth',
    targetId: user._id.toString(),
    description: `New customer registered: ${user.email}`,
    details: { name: user.name, email: user.email },
  }).catch(() => {});

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Validate customer or administrator login credentials
 * 
 * @param {Object} rawCredentials
 * @returns {Promise<Object>}
 */
export async function validateUserCredentials(rawCredentials) {
  const validated = loginSchema.parse(rawCredentials);

  const user = await findUserByEmail(validated.email);
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new Error('ACCOUNT_SUSPENDED');
  }

  if (!user.passwordHash) {
    throw new Error('PLEASE_LOGIN_WITH_GOOGLE');
  }

  const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  await updateLastActive(user._id.toString());

  logActivity({
    adminId: user.role !== 'user' ? user._id.toString() : undefined,
    adminEmail: user.role !== 'user' ? user.email : undefined,
    adminRole: user.role,
    action: 'USER_LOGIN',
    module: 'auth',
    targetId: user._id.toString(),
    description: `Login success for: ${user.email} (${user.role})`,
  }).catch(() => {});

  return user;
}

/**
 * Format standard NextAuth JWT / Session user payload
 * 
 * @param {Object} user
 * @returns {Object}
 */
export function buildSessionUser(user) {
  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'user',
    avatarUrl: user.avatarUrl || '',
    rewardPoints: user.rewardPoints || 0,
    isActive: Boolean(user.isActive),
  };
}
