import { z } from 'zod';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]+$/;

const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),

    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),

    phone: z
      .string()
      .trim()
      .regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)')
      .optional()
      .or(z.literal('')),

    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password cannot exceed 64 characters')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special symbol (e.g. @, #, $, %)'
      ),

    confirmPassword: z
      .string({ required_error: 'Please confirm your password' })
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    token: z
      .string({ required_error: 'Reset token is required' })
      .trim()
      .min(1, 'Reset token is required'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must contain at least 8 characters')
      .max(64, 'Password cannot exceed 64 characters')
      .regex(
        passwordRegex,
        'Password must contain uppercase, lowercase, number and special character'
      ),

    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
