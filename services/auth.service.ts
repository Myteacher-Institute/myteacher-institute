// Authentication Service
import axiosInstance from '../lib/axios';
import {
  LoginRequest,
  VerifyPasswordRequest,
  VerifyOtpRequest,
  OnboardingRequest,
  AuthResponse,
  OnboardingResponse,
  ResetPasswordRequest,
  TokenResponse,
} from '../types';

export const authService = {
  async checkUserExists(email: string): Promise<{ userExists: boolean }> {
    const response = await axiosInstance.post('/api/auth/check-user', { email });
    return response.data;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
  },

  async resendOtp(email: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/auth/resend-otp', { email });
    return response.data;
  },

  async register(data: {
    email: string;
    name: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await axiosInstance.post('/api/auth/register', data);
    return response.data;
  },

  async verifyPassword(request: VerifyPasswordRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post('/api/auth/verify-password', request);
    return response.data;
  },

  async verifyOtp(request: VerifyOtpRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post('/api/auth/verify-otp', request);
    return response.data;
  },

  async completeOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
    const response = await axiosInstance.post('/api/auth/complete-onboarding', data);
    return response.data;
  },

  async resetPassword(request: ResetPasswordRequest): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/auth/request-reset-account-instructions', request);
    return response.data;
  },

  async resetPasswordWithCode(request: {
    code: string;
    password: string;
    confirmPassword: string;
    logoutAllDevices?: boolean;
  }): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/auth/reset-password-with-code', request);
    return response.data;
  },

  async getNewAccessToken(): Promise<TokenResponse> {
    const response = await axiosInstance.get('/api/auth/new-access-code');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      // Hit the backend logout endpoint so the server can revoke the refresh
      // token stored in MongoDB. withCredentials is set globally on axiosInstance
      // so the httpOnly refresh token cookie is automatically included.
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      // Network error or token already gone — still safe to clear local state.
      console.error('Logout request failed (session may already be expired):', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
};