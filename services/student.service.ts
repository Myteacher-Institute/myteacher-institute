import axiosInstance from '@/lib/axios';

export interface StudentStats {
  completedCourses: number;
  activeLearning: number;
  hoursStudied: number;
  badgesAndAwards: number;
}

export interface StudentProfile {
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  recommendations?: string[];
  recommendationsProvided?: boolean;
}

export interface Certificate {
  _id: string;
  courseName: string;
  description: string;
  duration: number;
  certificate: string;
  instructorDetails: {
    userId: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  averageRating: number;
  completedAt: string;
  completionDate: string;
}

export const studentService = {
  getStats: async () => {
    const res = await axiosInstance.get('/api/student/stats');
    return res.data;
  },
  
  getProfile: async () => {
    const res = await axiosInstance.get('/api/student/profile');
    return res.data;
  },

  updateRecommendations: async (recommendations: string[]) => {
    const res = await axiosInstance.put('/api/student/recommendations', { recommendations });
    return res.data;
  },

  getRecommendedCourses: async () => {
    const res = await axiosInstance.get('/api/student/recommended-courses');
    return res.data;
  },

  getCertificates: async () => {
    const res = await axiosInstance.get('/api/student/certificates');
    return res.data;
  }
};
