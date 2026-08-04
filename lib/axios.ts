// Axios configuration with interceptors
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add access token from auth-storage if available
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage && config.headers) {
      try {
        const parsedAuth = JSON.parse(authStorage);
        const token = parsedAuth?.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // If parsing fails, continue without token
      }
    }

    // Only set Content-Type to application/json if not FormData
    // FormData requires axios to set the boundary automatically
    if (!(config.data instanceof FormData) && config.headers) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Never attempt a token refresh for auth endpoints — a 401 there means
    // wrong credentials or no session, not an expired access token.
    const isAuthEndpoint = originalRequest?.url?.includes('/api/auth/') ||
      originalRequest?.url?.includes('/api/instructor/login') ||
      originalRequest?.url?.includes('/api/instructor/verify-otp') ||
      originalRequest?.url?.includes('/api/instructor/resend-otp') ||
      originalRequest?.url?.includes('/api/admin/login') ||
      originalRequest?.url?.includes('/api/admin/verify-otp') ||
      originalRequest?.url?.includes('/api/admin/resend-otp');

    // A 401 with status "reauth_required" (expired/revoked YouTube or Drive OAuth
    // token) must NOT trigger the session refresh — the payload's authUrl is
    // needed by the caller to re-authenticate with the external service.
    const reauthData = error.response?.data as { status?: string; requiresReauth?: boolean; message?: string } | undefined;
    const isReauthRequired =
      error.response?.status === 401 &&
      (reauthData?.status === "reauth_required" ||
        reauthData?.requiresReauth === true ||
        String(reauthData?.message ?? "").includes("re-authentication"));

    // Handle 401 errors - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint && !isReauthRequired) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.get(`${API_CONFIG.baseURL}/api/auth/new-access-code`, {
          withCredentials: true, // Include cookies for refresh token
          timeout: 30000,        // 30 s is plenty for a token refresh
        });
        
        const { accessToken } = response.data;
        
        // Update auth-storage with new token
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const parsedAuth = JSON.parse(authStorage);
            parsedAuth.state.accessToken = accessToken;
            localStorage.setItem('auth-storage', JSON.stringify(parsedAuth));
          } catch (e) {
            console.error('Failed to update auth-storage:', e);
          }
        }
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Check if this is a permanent auth failure vs temporary issue
        const error = refreshError as any;
        const isPermanentFailure = error.response?.status === 401 && 
          (error.response?.data?.type === 'invalid-refresh' || 
           error.response?.data?.type === 'no-refresh');
        
        if (isPermanentFailure) {
          console.log('Permanent auth failure, clearing storage');
          // Only clear storage on permanent auth failures
          localStorage.removeItem('auth-storage');
          // Don't redirect immediately - let the component handle it
        } else {
          // For temporary failures, keep storage and let user retry
          console.error('Temporary token refresh failure:', refreshError);
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;