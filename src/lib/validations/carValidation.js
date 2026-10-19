import { z } from 'zod';

export const carImageSchema = z.object({
  url: z
    .string({ required_error: 'Image URL is required' })
    .url('Image must be a valid URL'),
  publicId: z.string().optional().default(''),
});

export const createCarSchema = z.object({
  brand: z
    .string({ required_error: 'Brand is required' })
    .trim()
    .min(2, 'Brand must be at least 2 characters')
    .max(50, 'Brand cannot exceed 50 characters'),

  model: z
    .string({ required_error: 'Model is required' })
    .trim()
    .min(2, 'Model must be at least 2 characters')
    .max(50, 'Model cannot exceed 50 characters'),

  category: z.enum(
    ['Sedan', 'SUV', 'Luxury', 'Tempo Traveller', 'Hatchback'],
    { required_error: 'Please select a valid category' }
  ),

  seatingCapacity: z.coerce
    .number({ required_error: 'Seating capacity is required' })
    .int('Seating capacity must be a whole number')
    .min(2, 'Minimum 2 seats required')
    .max(50, 'Maximum 50 seats permitted'),

  fuelType: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric'], {
    required_error: 'Please select fuel type',
  }),

  transmission: z.enum(['Manual', 'Automatic'], {
    required_error: 'Please select transmission type',
  }),

  pricePerKm: z.coerce
    .number({ required_error: 'Price per km is required' })
    .min(1, 'Price per km must be greater than 0'),

  pricePerDay: z.coerce
    .number({ required_error: 'Price per day is required' })
    .min(100, 'Price per day must be at least 100'),

  images: z
    .array(carImageSchema)
    .optional()
    .default([]),

  features: z
    .array(z.string().trim().min(1))
    .optional()
    .default(['Air Conditioning', 'Bluetooth', 'Luggage Carrier']),

  status: z
    .enum(['available', 'booked', 'maintenance'])
    .optional()
    .default('available'),
});

export const updateCarSchema = createCarSchema.partial();
