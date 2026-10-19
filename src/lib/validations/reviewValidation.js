import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z
    .string({ required_error: 'Booking ID is required' })
    .trim()
    .min(1, 'Booking ID is required'),

  overallRating: z.coerce
    .number({ required_error: 'Overall rating is required' })
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),

  driverRating: z.coerce
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable(),

  carCleanlinessRating: z.coerce
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable(),

  comments: z
    .string()
    .trim()
    .max(1000, 'Comments cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});
