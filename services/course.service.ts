// Course Service
import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';
import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseResponse,
} from '../types';

export const courseService = {
  async getAllCourses(): Promise<CourseResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_ALL);
    return response.data;
  },

  async getCourseById(courseId: string): Promise<CourseResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_BY_ID(courseId));
    return response.data;
  },

  async getCoursesByUser(userId: string): Promise<CourseResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_BY_USER, {
      params: { userId },
    });
    return response.data;
  },

  async createCourse(course: CreateCourseRequest): Promise<CourseResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.COURSES.CREATE, course);
    return response.data;
  },

  async updateCourse(courseId: string, course: UpdateCourseRequest): Promise<CourseResponse> {
    const response = await axiosInstance.put(API_ENDPOINTS.COURSES.UPDATE(courseId), course);
    return response.data;
  },

  async deleteCourse(courseId: string): Promise<CourseResponse> {
    const response = await axiosInstance.delete(API_ENDPOINTS.COURSES.DELETE(courseId));
    return response.data;
  },
};