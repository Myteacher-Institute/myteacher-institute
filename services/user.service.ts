// User Service
import axiosInstance from '../lib/axios';
import { User, Admin, Instructor } from '../types';

export const userService = {
  async getCurrentUser(): Promise<{ user: User | Admin | Instructor }> {
    const response = await axiosInstance.get('/api/user/me');
    return response.data;
  },

  async updateProfile(data: Partial<User> | Partial<Admin> | Partial<Instructor>): Promise<{ user: User | Admin | Instructor; message: string }> {
    const response = await axiosInstance.put('/api/user/profile', data);
    return response.data;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await axiosInstance.post('/api/user/change-password', data);
    return response.data;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const response = await axiosInstance.delete('/api/user/account');
    return response.data;
  },

  async sendResetInstructions(email: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/auth/send-reset-instructions', { email });
    return response.data;
  },

  async resetPasswordWithCode(code: string, password: string, confirmPassword: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/auth/reset-password-with-code', { code, password, confirmPassword });
    return response.data;
  },

  async resendOtp(email: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/auth/resend-otp', { email });
    return response.data;
  },
};