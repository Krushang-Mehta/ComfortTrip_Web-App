import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking reference is required'],
      unique: true,
      index: true,
    },
    bookingId: {
      type: String,
      required: [true, 'Booking ID is required'],
      trim: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
      index: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      default: null,
    },
    overallRating: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    driverRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    carCleanlinessRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    comments: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    rewardPointsAwarded: {
      type: Number,
      default: 5,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ isPublic: 1, createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
