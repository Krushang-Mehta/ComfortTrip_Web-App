import mongoose, { Schema } from 'mongoose';

const carImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const carSchema = new Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required (e.g. Toyota, Maruti Suzuki)'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required (e.g. Innova Crysta, Dzire)'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Sedan', 'SUV', 'Luxury', 'Tempo Traveller', 'Hatchback'],
        message: '{VALUE} is not a valid car category',
      },
      index: true,
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: [2, 'Seating capacity must be at least 2'],
      max: [50, 'Seating capacity cannot exceed 50'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric'],
      default: 'Diesel',
    },
    transmission: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: ['Manual', 'Automatic'],
      default: 'Manual',
    },
    pricePerKm: {
      type: Number,
      required: [true, 'Price per km is required'],
      min: [0, 'Price per km cannot be negative'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price per day cannot be negative'],
    },
    images: {
      type: [carImageSchema],
      default: [],
    },
    features: {
      type: [String],
      default: ['Air Conditioning', 'Bluetooth', 'Luggage Carrier'],
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance'],
      default: 'available',
      index: true,
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

carSchema.index({ category: 1, status: 1 });
carSchema.index({ isDeleted: 1, status: 1 });
carSchema.index({ pricePerDay: 1 });

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

export default Car;
