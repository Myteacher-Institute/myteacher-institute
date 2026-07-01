// Instructor Service
import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';
import { Instructor, AuthUser } from '../types';

export const instructorService = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ instructor: Instructor; accessToken: string; message: string }> {
    const response = await axiosInstance.post('/api/instructor/login', credentials);
    return response.data;
  },

  async apply(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    profilePicture: string;
  }): Promise<{ status: string; message: string; instructor?: any }> {
    const response = await axiosInstance.post('/api/instructor/apply', data);
    return response.data;
  },

  async getAllInstructors(): Promise<{ instructors: Instructor[] }> {
    const response = await axiosInstance.get('/api/instructor');
    return response.data;
  },

  async getInstructorById(instructorId: string): Promise<{ instructor: Instructor }> {
    const response = await axiosInstance.get(`/api/instructor/${instructorId}`);
    return response.data;
  },

  async updateInstructor(
    instructorId: string,
    data: Partial<Instructor>
  ): Promise<{ instructor: Instructor; message: string }> {
    const response = await axiosInstance.put(`/api/instructor/${instructorId}`, data);
    return response.data;
  },

  async deleteInstructor(instructorId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/api/instructor/${instructorId}`);
    return response.data;
  },

  async verifyInstructor(instructorId: string): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/api/instructor/verify/${instructorId}`);
    return response.data;
  },

  async rejectInstructor(instructorId: string): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/api/instructor/reject/${instructorId}`);
    return response.data;
  },

  async verifyOtp(otp: string): Promise<{ instructor: any; accessToken: string; message: string }> {
    const response = await axiosInstance.post('/api/instructor/verify-otp', { otp });
    return response.data;
  },

  async resendOtp(email: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/instructor/resend-otp', { email });
    return response.data;
  },

  async sendResetCode(email: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/instructor/send-reset-code', { email });
    return response.data;
  },

  async resendResetCode(email: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/instructor/resend-reset-code', { email });
    return response.data;
  },

  async resetPassword(code: string, password: string): Promise<{ status: 'success' | 'failed'; message: string }> {
    const response = await axiosInstance.post('/api/instructor/reset-password', { code, password });
    return response.data;
  },
};