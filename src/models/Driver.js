import mongoose, { Schema } from 'mongoose';

const driverSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Driver full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Driver phone number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'Driver license number is required'],
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 2,
      min: [0, 'Experience years cannot be negative'],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0,
    },
    totalRides: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Available', 'On-Trip', 'Off-Duty'],
      default: 'Available',
      index: true,
    },
    assignedCar: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

driverSchema.index({ status: 1, isDeleted: 1 });

const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);

export default Driver;
