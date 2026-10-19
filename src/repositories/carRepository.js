import Car from '@/models/Car';

/**
 * Find car by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function findCarById(id) {
  if (!id) return null;
  return await Car.findOne({ _id: id, isDeleted: false }).lean();
}

/**
 * Find active cars for public fleet page and booking wizard
 * @param {Object} [filter={}]
 * @returns {Promise<Array>}
 */
export async function findActiveCars(filter = {}) {
  const query = { isDeleted: false, status: 'available' };

  if (filter.category) {
    query.category = filter.category;
  }
  if (filter.transmission) {
    query.transmission = filter.transmission;
  }
  if (filter.seatingCapacity) {
    query.seatingCapacity = { $gte: Number(filter.seatingCapacity) };
  }

  return await Car.find(query)
    .sort({ pricePerDay: 1 })
    .lean();
}

/**
 * Create a new car in fleet inventory
 * @param {Object} carData
 * @returns {Promise<Object>}
 */
export async function createCar(carData) {
  const car = await Car.create({ ...carData, isDeleted: false });
  return car.toObject();
}

/**
 * Update an existing car record
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object|null>}
 */
export async function updateCar(id, updateData) {
  return await Car.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
}

/**
 * Soft delete a car
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function softDeleteCar(id) {
  return await Car.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true, status: 'maintenance' } },
    { new: true }
  ).lean();
}

/**
 * Paginated query for Admin Fleet Desk
 * @param {Object} options
 * @returns {Promise<{ cars: Array, total: number, pages: number }>}
 */
export async function findAllCarsAdmin({
  page = 1,
  limit = 10,
  search = '',
  category = '',
  status = '',
}) {
  const query = { isDeleted: false };

  if (search) {
    query.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) {
    query.category = category;
  }
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [cars, total] = await Promise.all([
    Car.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Car.countDocuments(query),
  ]);

  return {
    cars,
    total,
    pages: Math.ceil(total / limit) || 1,
    currentPage: page,
  };
}
