// Authentication Validation Schemas using Zod
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  role: z.enum(['user', 'instructor', 'admin']),
});

export const verifyPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

export const verifyOtpSchema = z.object({
  otp: z.string()
    .min(1, 'OTP is required')
    .length(6, 'OTP must be 6 characters')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export const onboardingSchema = z.object({
  userId: z.string().optional(),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
    .min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
});

export const resetPasswordWithCodeSchema = z.object({
  code: z.string()
    .min(1, 'Reset code is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
    .min(6, 'Password must be at least 6 characters'),
  logoutAllDevices: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required')
    .min(6, 'Password must be at least 6 characters'),
  newPassword: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordWithCodeFormData = z.infer<typeof resetPasswordWithCodeSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;