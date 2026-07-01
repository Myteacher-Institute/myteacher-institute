// Authentication Types
import { User, Admin, Instructor } from './user.types';

export type AuthUser = User | Admin | Instructor;

export interface LoginRequest {
  email: string;
  role: 'user' | 'instructor' | 'admin';
}

export interface VerifyPasswordRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  otp: string;
}

export interface OnboardingRequest {
  userId: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  status: 'success' | 'failed';
  message: string;
  errorOnInput?: boolean | string;
  instruction?: 'give-code' | 'give-password';
  authUser?: AuthUser;
  accessToken?: string;
  nextStep?: 'onboarding';
  userId?: string;
  isGiveCode?: boolean;
  isTrusted?: boolean;
  isCompleted?: boolean;
  access_code?: string;
}

// Backend-specific response types
export interface InitiateAuthResponse {
  status: 'success' | 'failed';
  message: string;
  errorOnInput?: boolean;
  instruction?: 'give-code' | 'give-password';
}

export interface VerifyOtpResponse {
  status: 'success' | 'failed';
  message: string;
  nextStep?: 'onboarding';
  userId?: string;
  authUser?: AuthUser;
  accessToken?: string;
}

export interface VerifyPasswordResponse {
  status: 'success' | 'failed';
  message: string;
  errorOnInput?: 'email' | 'password' | boolean;
  isTrusted?: boolean;
  isGiveCode?: boolean;
  isCompleted?: boolean;
  access_code?: string;
}

export interface OnboardingResponse {
  status: 'success' | 'failed';
  message: string;
  authUser?: User;
  accessToken?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordWithCodeRequest {
  code: string;
  password: string;
  confirmPassword: string;
  logoutAllDevices?: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

// Authentication State
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userType: 'user' | 'admin' | 'instructor' | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  instruction?: 'give-code' | 'give-password' | null;
  pendingUserId?: string | null;
}