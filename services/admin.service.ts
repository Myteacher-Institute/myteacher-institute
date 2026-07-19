// Admin Service
import axiosInstance from '../lib/axios';
import { Admin } from '../types';

export const adminService = {
  async login(data: {
    email: string;
    password: string;
  }): Promise<{ authUser: Admin; accessToken: string; message: string }> {
    const response = await axiosInstance.post('/api/admin/login', data);
    return response.data;
  },

  async createAdmin(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ admin: Admin; message: string; status: string }> {
    const response = await axiosInstance.post('/api/admin/add', data);
    return response.data;
  },

  async getAllAdmins(): Promise<{ admins: Admin[] }> {
    const response = await axiosInstance.get('/api/admin');
    return response.data;
  },

  async getAdminById(adminId: string): Promise<{ admin: Admin }> {
    const response = await axiosInstance.get(`/api/admin/${adminId}`);
    return response.data;
  },

  async getDashboardStats(): Promise<{
    users: number;
    instructors: number;
    courses: number;
    revenue: number;
  }> {
    const response = await axiosInstance.get('/api/admin/dashboard');
    return response.data;
  },

  async verifyOtp(otp: string): Promise<{ authUser: any; accessToken: string; message: string }> {
    const response = await axiosInstance.post('/api/admin/verify-otp', { otp });
    return response.data;
  },

  async resendOtp(email: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/admin/resend-otp', { email });
    return response.data;
  },

  async sendResetCode(email: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/admin/send-reset-code', { email });
    return response.data;
  },

  async resetPassword(code: string, password: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/admin/reset-password', { code, password });
    return response.data;
  },
};