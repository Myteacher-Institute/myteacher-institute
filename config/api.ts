// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    INITIATE: '/api/auth/initiate',
    VERIFY_OTP: '/api/auth/verify-otp',
    VERIFY_PASSWORD: '/api/auth/verify-password',
    COMPLETE_ONBOARDING: '/api/auth/complete-onboarding',
    NEW_ACCESS_CODE: '/api/auth/new-access-code',
    REQUEST_RESET_INSTRUCTIONS: '/api/auth/request-reset-account-instructions',
    RESET_PASSWORD_WITH_CODE: '/api/auth/reset-password-with-code',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
  },
  
  // Course endpoints
  COURSES: {
    GET_ALL: '/api/course',
    GET_BY_ID: (id: string) => `/api/course/${id}`,
    GET_BY_USER: '/api/course/user',
    CREATE: '/api/course',
    UPDATE: (id: string) => `/api/course/${id}`,
    DELETE: (id: string) => `/api/course/${id}`,
  },
  
  // Instructor endpoints
  INSTRUCTOR: {
    LOGIN: '/api/instructor/login',
    APPLY: '/api/instructor/apply',
    GET_ALL: '/api/instructor',
    GET_BY_ID: (id: string) => `/api/instructor/${id}`,
    UPDATE: (id: string) => `/api/instructor/${id}`,
    DELETE: (id: string) => `/api/instructor/${id}`,
    VERIFY: (id: string) => `/api/instructor/verify/${id}`,
    REJECT: (id: string) => `/api/instructor/reject/${id}`,
  },
  
  // Admin endpoints
  ADMIN: {
    CREATE: '/api/admin',
    GET_ALL: '/api/admin',
    GET_BY_ID: (id: string) => `/api/admin/${id}`,
  },
  
  // Payment endpoints
  PAYMENT: {
    CREATE: '/api/payment/create',
    VERIFY: '/api/payment/verify',
  },
  
  // YouTube endpoints
  YOUTUBE: {
    UPLOAD: '/api/youtube/upload',
  },
} as const;

// API Response Types
export type ApiResponse<T = any> = {
  status: 'success' | 'failed';
  message: string;
  data?: T;
  error?: string;
};