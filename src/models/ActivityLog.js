import mongoose, { Schema } from 'mongoose';

const activityLogSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    adminEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    adminRole: {
      type: String,
      default: 'admin',
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    module: {
      type: String,
      trim: true,
      index: true, // e.g. "bookings", "fleet", "users", "drivers"
    },
    targetId: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

activityLogSchema.index({ createdAt: -1 });

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
