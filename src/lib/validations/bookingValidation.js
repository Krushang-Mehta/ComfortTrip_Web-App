import { z } from 'zod';

export const createBookingSchema = z
  .object({
    carId: z
      .string({ required_error: 'Please select a car' })
      .trim()
      .min(1, 'Please select a car'),

    tripType: z.enum(
      ['Local', 'Airport', 'Outstation-OneWay', 'Outstation-Round'],
      { required_error: 'Please select a trip type' }
    ),

    pickupAddress: z
      .string({ required_error: 'Pickup address is required' })
      .trim()
      .min(3, 'Pickup address must be at least 3 characters')
      .max(250, 'Pickup address is too long'),

    destinationAddress: z
      .string({ required_error: 'Destination address is required' })
      .trim()
      .min(3, 'Destination address must be at least 3 characters')
      .max(250, 'Destination address is too long'),

    pickupDateTime: z.coerce
      .date({ required_error: 'Pickup date and time is required' })
      .refine(
        (date) => date.getTime() > Date.now() - 60000 * 5, // Allow up to 5 min clock skew
        { message: 'Pickup date and time cannot be in the past' }
      ),

    returnDateTime: z.coerce.date().optional().nullable(),

    passengers: z.coerce
      .number({ required_error: 'Number of passengers is required' })
      .int('Passengers must be a whole number')
      .min(1, 'At least 1 passenger is required')
      .max(50, 'Passenger count exceeds maximum vehicle capacity'),

    customerNotes: z
      .string()
      .trim()
      .max(500, 'Notes cannot exceed 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.tripType === 'Outstation-Round' && data.returnDateTime) {
        return data.returnDateTime.getTime() > data.pickupDateTime.getTime();
      }
      return true;
    },
    {
      message: 'Return date and time must be after pickup date and time',
      path: ['returnDateTime'],
    }
  );

export const updateBookingStatusSchema = z.object({
  status: z.enum([
    'Pending',
    'Confirmed',
    'Driver-Assigned',
    'In-Journey',
    'Completed',
    'Cancelled',
  ]),
  adminNotes: z
    .string()
    .trim()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional(),
  totalEstimatedAmount: z
    .number()
    .positive('Amount must be positive')
    .optional(),
});

export const assignDriverSchema = z.object({
  driverId: z
    .string({ required_error: 'Driver ID is required' })
    .trim()
    .min(1, 'Driver ID is required'),
});
