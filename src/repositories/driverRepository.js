import Driver from '@/models/Driver';

/**
 * Find driver by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function findDriverById(id) {
  if (!id) return null;
  return await Driver.findOne({ _id: id, isDeleted: false }).lean();
}

/**
 * Find available drivers for dispatch dropdown
 * @returns {Promise<Array>}
 */
export async function findAvailableDrivers() {
  return await Driver.find({ isDeleted: false, status: 'Available' })
    .sort({ rating: -1, fullName: 1 })
    .lean();
}

/**
 * Create a new driver record
 * @param {Object} driverData
 * @returns {Promise<Object>}
 */
export async function createDriver(driverData) {
  const driver = await Driver.create({ ...driverData, isDeleted: false });
  return driver.toObject();
}

/**
 * Update driver details
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object|null>}
 */
export async function updateDriver(id, updateData) {
  return await Driver.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
}

/**
 * Update driver duty status
 * @param {string} id
 * @param {string} status - 'Available' | 'On-Trip' | 'Off-Duty'
 * @returns {Promise<Object|null>}
 */
export async function updateDriverStatus(id, status) {
  return await Driver.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  ).lean();
}

/**
 * Update driver metrics upon trip completion
 * @param {string} id
 * @param {number} [newRating]
 * @returns {Promise<Object|null>}
 */
export async function recordDriverRideCompletion(id, newRating) {
  const driver = await Driver.findById(id);
  if (!driver) return null;

  const currentTotal = driver.totalRides || 0;
  const currentRating = driver.rating || 5.0;

  let updatedRating = currentRating;
  if (typeof newRating === 'number' && newRating >= 1 && newRating <= 5) {
    updatedRating =
      Number(((currentRating * currentTotal + newRating) / (currentTotal + 1)).toFixed(1));
  }

  driver.totalRides = currentTotal + 1;
  driver.rating = updatedRating;
  driver.status = 'Available';
  await driver.save();

  return driver.toObject();
}

/**
 * Paginated query for Admin Drivers Registry
 * @param {Object} options
 * @returns {Promise<{ drivers: Array, total: number, pages: number }>}
 */
export async function findAllDriversAdmin({
  page = 1,
  limit = 10,
  search = '',
  status = '',
}) {
  const query = { isDeleted: false };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { licenseNumber: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [drivers, total] = await Promise.all([
    Driver.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Driver.countDocuments(query),
  ]);

  return {
    drivers,
    total,
    pages: Math.ceil(total / limit) || 1,
    currentPage: page,
  };
}
