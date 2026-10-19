import mongoose, { Schema } from 'mongoose';

const assignedDriverSchema = new Schema(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      required: [true, 'Booking ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car reference is required'],
      index: true,
    },
    tripType: {
      type: String,
      required: [true, 'Trip type is required'],
      enum: {
        values: ['Local', 'Airport', 'Outstation-OneWay', 'Outstation-Round'],
        message: '{VALUE} is not a valid trip type',
      },
      default: 'Local',
    },
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },
    destinationAddress: {
      type: String,
      required: [true, 'Destination address is required'],
      trim: true,
    },
    pickupDateTime: {
      type: Date,
      required: [true, 'Pickup date and time is required'],
      index: true,
    },
    returnDateTime: {
      type: Date,
      default: null,
    },
    passengers: {
      type: Number,
      required: [true, 'Number of passengers is required'],
      min: [1, 'At least 1 passenger is required'],
      max: [50, 'Passenger count exceeds maximum vehicle capacity'],
    },
    totalEstimatedAmount: {
      type: Number,
      required: [true, 'Total estimated amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Driver-Assigned',
        'In-Journey',
        'Completed',
        'Cancelled',
      ],
      default: 'Pending',
      index: true,
    },
    assignedDriver: {
      type: assignedDriverSchema,
      default: () => ({}),
    },
    customerNotes: {
      type: String,
      trim: true,
      default: '',
    },
    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
    emailNotificationSent: {
      type: Boolean,
      default: false,
    },
    invoiceGenerated: {
      type: Boolean,
      default: false,
    },
    reviewSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ pickupDateTime: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
