import User from '@/models/User';

/**
 * Find user by email (case-insensitive)
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
export async function findUserByEmail(email) {
  if (!email) return null;
  return await User.findOne({ email: email.toLowerCase().trim() }).lean();
}

/**
 * Find user by MongoDB ObjectId
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function findUserById(id) {
  if (!id) return null;
  return await User.findById(id).select('-passwordHash').lean();
}

/**
 * Create a new user record
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export async function createUser(userData) {
  const user = await User.create({
    ...userData,
    email: userData.email.toLowerCase().trim(),
  });
  return user.toObject();
}

/**
 * Update user profile details
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object|null>}
 */
export async function updateUserProfile(id, updateData) {
  return await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .select('-passwordHash')
    .lean();
}

/**
 * Update user password
 * @param {string} id
 * @param {string} passwordHash
 * @returns {Promise<boolean>}
 */
export async function updateUserPassword(id, passwordHash) {
  const result = await User.findByIdAndUpdate(id, {
    $set: { passwordHash, resetPasswordToken: null, resetPasswordExpiry: null },
  });
  return Boolean(result);
}

/**
 * Update user last active timestamp
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function updateLastActive(id) {
  if (!id) return;
  await User.findByIdAndUpdate(id, { $set: { lastActive: new Date() } });
}

/**
 * Atomically credit or debit reward points
 * @param {string} id
 * @param {number} points
 * @returns {Promise<Object|null>}
 */
export async function creditRewardPoints(id, points) {
  return await User.findByIdAndUpdate(
    id,
    { $inc: { rewardPoints: points } },
    { new: true }
  )
    .select('rewardPoints')
    .lean();
}

/**
 * Paginated user query for Admin Users desk
 * @param {Object} options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @param {string} [options.search='']
 * @returns {Promise<{ users: Array, total: number, pages: number }>}
 */
export async function findUsersPaginated({ page = 1, limit = 10, search = '' }) {
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    users,
    total,
    pages: Math.ceil(total / limit) || 1,
    currentPage: page,
  };
}

/**
 * Toggle user active/deactivated state
 * @param {string} id
 * @param {boolean} isActive
 * @returns {Promise<Object|null>}
 */
export async function setUserActiveStatus(id, isActive) {
  return await User.findByIdAndUpdate(
    id,
    { $set: { isActive } },
    { new: true }
  )
    .select('-passwordHash')
    .lean();
}
