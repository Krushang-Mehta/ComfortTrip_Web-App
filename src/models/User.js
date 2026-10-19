import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin', 'super-admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
      index: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    rewardPoints: {
      type: Number,
      default: 100, // 100 signup welcome points
      min: [0, 'Reward points cannot be negative'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiry: {
      type: Date,
      default: null,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isActive: {
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

userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1, role: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
