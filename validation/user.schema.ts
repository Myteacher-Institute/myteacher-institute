// User Validation Schemas using Zod
import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must not exceed 15 characters')
    .optional(),
  bio: z.string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional(),
});

export const instructorApplicationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  specialization: z.string()
    .min(3, 'Specialization must be at least 3 characters')
    .max(200, 'Specialization must not exceed 200 characters'),
  bio: z.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(1000, 'Bio must not exceed 1000 characters'),
  experience: z.string().optional(),
  qualifications: z.string().optional(),
});

export const adminCreateSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type InstructorApplicationFormData = z.infer<typeof instructorApplicationSchema>;
export type AdminCreateFormData = z.infer<typeof adminCreateSchema>;