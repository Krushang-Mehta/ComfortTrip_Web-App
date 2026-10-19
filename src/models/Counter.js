import mongoose, { Schema } from 'mongoose';

const counterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true, // e.g. "booking_2026"
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

/**
 * Atomically increments and retrieves the next sequential number for an entity key.
 * Guarantees zero duplicates even under concurrent booking submissions.
 * 
 * @param {string} counterId - E.g. "booking_2026"
 * @returns {Promise<number>}
 */
counterSchema.statics.getNextSequence = async function (counterId) {
  const result = await this.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, returnDocument: 'after' }
  );
  return result.seq;
};

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

export default Counter;
