// Course Service
import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../config/api';
import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseResponse,
} from '../types';

export interface BrowseCourse {
  _id: string;
  courseName: string;
  description: string;
  price: number;
  duration: number;
  courseRequirements: string[];
  ratings: Array<{ rating: number; comment?: string }>;
  averageRating: number;
  instructorName?: string;
  lessons: number;
  previewThumbnail: string;
}

export interface BrowseCoursesResponse {
  status: 'success' | 'failed';
  message: string;
  courses?: BrowseCourse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface CoursePreview {
  _id: string;
  courseName: string;
  description: string;
  price: number;
  duration: number;
  certificate: string;
  courseRequirements: string[];
  ratings: Array<{ rating: number; comment?: string }>;
  averageRating: number;
  instructorName?: string;
  lessons: number;
  previewThumbnail: string;
  previewVideos: Array<{
    videoUrl: string;
    videoTitle: string;
    videoDuration: number;
  }>;
  appliedUsers: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    ipAddress: string;
    appliedAt: string;
  }>;
}

export interface CoursePreviewResponse {
  status: 'success' | 'failed';
  message: string;
  course?: CoursePreview;
}

export const courseService = {
  async getAllCourses(): Promise<CourseResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_ALL);
    return response.data;
  },

  async browseCourses(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<BrowseCoursesResponse> {
    const response = await axiosInstance.get('/api/course/browse', { params });
    return response.data;
  },

  async getCourseById(courseId: string): Promise<CourseResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_BY_ID(courseId));
    return response.data;
  },

  async getMyCourses(): Promise<{
    status: 'success' | 'failed';
    message: string;
    courses?: Course[];
  }> {
    const response = await axiosInstance.get('/api/course/my-courses');
    return response.data;
  },

  async getCoursePreview(courseId: string): Promise<CoursePreviewResponse> {
    const response = await axiosInstance.get(`/api/course/${courseId}/preview`);
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

  async rateCourse(courseId: string, rating: number, comment: string): Promise<{
    status: 'success' | 'failed';
    message: string;
    averageRating?: number;
  }> {
    const response = await axiosInstance.post(`/api/course/${courseId}/rating`, { rating, comment });
    return response.data;
  },
};