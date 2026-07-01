// Authentication Store using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthUser } from '../types';
import { authService } from '../services';
import { adminService } from '../services';
import { instructorService } from '../services';
import { userService } from '../services';

// Helper to set cookies
const setAuthCookies = (accessToken: string, userType: 'user' | 'admin' | 'instructor' | null) => {
  if (typeof document !== 'undefined') {
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=lax`;
    if (userType) {
      document.cookie = `userType=${userType}; path=/; max-age=86400; SameSite=lax`;
    }
  }
};

// Helper to clear cookies
const clearAuthCookies = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'userType=; path=/; max-age=0';
  }
};

interface AuthActions extends AuthState {
  checkUserExists: (email: string) => Promise<{ userExists: boolean }>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; name: string; phone: string; password: string }) => Promise<void>;
  resendOtp: (email: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  verifyPassword: (email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  completeOnboarding: (userId: string, name: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminVerifyOtp: (otp: string) => Promise<void>;
  adminResendOtp: (email: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  adminSendResetCode: (email: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  adminResetPassword: (code: string, password: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  instructorLogin: (email: string, password: string) => Promise<void>;
  instructorApply: (data: { name: string; email: string; password: string; phone: string; profilePicture: string }) => Promise<void>;
  instructorVerifyOtp: (otp: string) => Promise<void>;
  instructorResendOtp: (email: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  instructorSendResetCode: (email: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  instructorResendResetCode: (email: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  instructorResetPassword: (code: string, password: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  userSendResetInstructions: (email: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  userResetPasswordWithCode: (code: string, password: string, confirmPassword: string) => Promise<{ status: 'success' | 'failed'; message: string }>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null, userType: 'user' | 'admin' | 'instructor' | null) => void;
  setAccessToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
  setUserType: (userType: 'user' | 'admin' | 'instructor' | null) => void;
  clearInstruction: () => void;
}

export const useAuthStore = create<AuthActions>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      userType: null,
      accessToken: null,
      isLoading: false,
      error: null,
      instruction: null,
      pendingUserId: null,

      checkUserExists: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.checkUserExists(email);

          console.log(`this is the response ${JSON.stringify(response)}`)
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to check user',
          });
          return { userExists: false };
        }
      },

      register: async (data: { email: string; name: string; phone: string; password: string }) => {
        set({ isLoading: true, error: null, instruction: null });
        try {
          const response = await authService.register(data);

          if (response.status === 'success') {
            // Handle new registration response format
            if (response.instruction === 'give-code' && response.userId) {
              // Registration successful - need OTP verification
              set({
                instruction: response.instruction,
                pendingUserId: response.userId,
                isLoading: false,
                error: null,
              });
            } else if (response.authUser) {
              // User was created/authenticated successfully (legacy format)
              set({
                isAuthenticated: true,
                user: response.authUser,
                userType: 'user',
                accessToken: response.accessToken || null,
                isLoading: false,
                error: null,
              });

              if (response.accessToken) {
                localStorage.setItem('accessToken', response.accessToken);
                setAuthCookies(response.accessToken, 'user');
              }
            }
          } else {
            set({
              isLoading: false,
              error: response.message || 'Registration failed',
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed',
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null, instruction: null });
        try {
          const response = await authService.login({ email, password });

          if (response.status === 'success') {
            set({
              instruction: response.instruction || null,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: response.message,
              instruction: null,
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed',
            instruction: null,
          });
        }
      },

      resendOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.resendOtp(email);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to resend OTP',
          });
          return { status: 'failed', message: 'Failed to resend OTP' };
        }
      },

      verifyPassword: async (email: string, password: string) => {
        set({ isLoading: true, error: null, instruction: null });
        try {
          const response = await authService.verifyPassword({ email, password });
          
          if (response.status === 'success') {
            if (response.isTrusted && response.access_code) {
              // Direct login with trusted device
              set({
                isAuthenticated: true,
                accessToken: response.access_code,
                isLoading: false,
                error: null,
                instruction: null,
              });
              localStorage.setItem('accessToken', response.access_code);
              setAuthCookies(response.access_code, null);
            } else if (response.isGiveCode) {
              // New device - need OTP
              set({
                instruction: 'give-code',
                isLoading: false,
                error: null,
              });
            } else if (response.authUser) {
              // Determine user type based on the response structure
              let userType: 'user' | 'admin' | 'instructor' | null = null;
              if ('isAdmin' in response.authUser && response.authUser.isAdmin) {
                userType = 'admin';
              } else if ('isVerified' in response.authUser) {
                userType = 'instructor';
              } else {
                userType = 'user';
              }
              
              set({
                isAuthenticated: true,
                user: response.authUser,
                userType,
                accessToken: response.accessToken || response.access_code || null,
                isLoading: false,
                error: null,
                instruction: null,
              });
              
              const token = response.accessToken || response.access_code;
              if (token) {
                localStorage.setItem('accessToken', token);
                setAuthCookies(token, userType);
              }
            }
          } else {
            set({
              isLoading: false,
              error: response.message,
              instruction: null,
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Password verification failed',
            instruction: null,
          });
        }
      },

      verifyOtp: async (otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.verifyOtp({ otp });
          
          if (response.status === 'success') {
            if (response.nextStep === 'onboarding' && response.userId) {
              // New account - go to onboarding
              set({
                pendingUserId: response.userId,
                isLoading: false,
                error: null,
              });
            } else if (response.authUser) {
              // Determine user type based on the response structure
              let userType: 'user' | 'admin' | 'instructor' | null = null;
              if ('isAdmin' in response.authUser && response.authUser.isAdmin) {
                userType = 'admin';
              } else if ('isVerified' in response.authUser) {
                userType = 'instructor';
              } else {
                userType = 'user';
              }
              
              set({
                isAuthenticated: true,
                user: response.authUser,
                userType,
                accessToken: response.accessToken || null,
                isLoading: false,
                error: null,
                instruction: null,
                pendingUserId: null,
              });
              
              if (response.accessToken) {
                localStorage.setItem('accessToken', response.accessToken);
                setAuthCookies(response.accessToken, userType);
              }
            }
          } else {
            set({
              isLoading: false,
              error: response.message,
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'OTP verification failed',
          });
        }
      },

      completeOnboarding: async (userId: string, name: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.completeOnboarding({ userId, name, password, confirmPassword: password });
          
          if (response.status === 'success' && response.authUser) {
            set({
              isAuthenticated: true,
              user: response.authUser,
              userType: 'user',
              accessToken: response.accessToken || null,
              isLoading: false,
              error: null,
              pendingUserId: null,
            });
            
            if (response.accessToken) {
              localStorage.setItem('accessToken', response.accessToken);
              setAuthCookies(response.accessToken, 'user');
            }
          } else {
            set({
              isLoading: false,
              error: response.message,
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Onboarding failed',
          });
        }
      },

      adminLogin: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminService.login({ email, password });
          
          // Backend returns { authUser, accessToken, message }
          // If OTP is required, response will have authUser but no accessToken
          if (response.authUser && !response.accessToken) {
            // OTP required - set admin data but not authenticated yet
            set({
              isAuthenticated: false,
              user: response.authUser,
              userType: 'admin',
              accessToken: null,
              isLoading: false,
              error: null,
            });
          } else if (response.authUser && response.accessToken) {
            // Direct login (shouldn't happen with current backend flow)
            set({
              isAuthenticated: true,
              user: response.authUser,
              userType: 'admin',
              accessToken: response.accessToken,
              isLoading: false,
              error: null,
            });
            
            localStorage.setItem('accessToken', response.accessToken);
            setAuthCookies(response.accessToken, 'admin');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Admin login failed',
          });
        }
      },

      adminVerifyOtp: async (otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminService.verifyOtp(otp);
          
          if (response.authUser && response.accessToken) {
            set({
              isAuthenticated: true,
              user: response.authUser,
              userType: 'admin',
              accessToken: response.accessToken,
              isLoading: false,
              error: null,
            });
            
            localStorage.setItem('accessToken', response.accessToken);
            setAuthCookies(response.accessToken, 'admin');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Admin OTP verification failed',
          });
        }
      },

      adminResendOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminService.resendOtp(email);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to resend OTP',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to resend OTP' };
        }
      },

      adminSendResetCode: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminService.sendResetCode(email);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to send reset code',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to send reset code' };
        }
      },

      adminResetPassword: async (code: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminService.resetPassword(code, password);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to reset password',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to reset password' };
        }
      },

      instructorLogin: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await instructorService.login({ email, password });
          
          // Backend returns { instructor, accessToken, message }
          // If OTP is required, response will have instructor but no accessToken
          if (response.instructor && !response.accessToken) {
            // OTP required - set instructor data but not authenticated yet
            set({
              isAuthenticated: false,
              user: response.instructor,
              userType: 'instructor',
              accessToken: null,
              isLoading: false,
              error: null,
            });
          } else if (response.instructor && response.accessToken) {
            // Direct login (shouldn't happen with current backend flow)
            set({
              isAuthenticated: true,
              user: response.instructor,
              userType: 'instructor',
              accessToken: response.accessToken,
              isLoading: false,
              error: null,
            });
            
            localStorage.setItem('accessToken', response.accessToken);
            setAuthCookies(response.accessToken, 'instructor');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Instructor login failed',
          });
        }
      },

      instructorApply: async (data: { name: string; email: string; password: string; phone: string; profilePicture: string }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await instructorService.apply(data);
          
          if (response.status === 'success') {
            set({
              isLoading: false,
              error: null,
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Instructor application failed',
          });
        }
      },

      instructorVerifyOtp: async (otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await instructorService.verifyOtp(otp);
          
          if (response.instructor && response.accessToken) {
            set({
              isAuthenticated: true,
              user: response.instructor,
              userType: 'instructor',
              accessToken: response.accessToken,
              isLoading: false,
              error: null,
            });
            
            localStorage.setItem('accessToken', response.accessToken);
            setAuthCookies(response.accessToken, 'instructor');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'OTP verification failed',
          });
        }
      },

      instructorResendOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await instructorService.resendOtp(email);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to resend OTP',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to resend OTP' };
        }
      },

      instructorSendResetCode: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await instructorService.sendResetCode(email);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to send reset code',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to send reset code' };
        }
      },

      instructorResendResetCode: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await instructorService.resendResetCode(email);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to resend reset code',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to resend reset code' };
        }
      },

      instructorResetPassword: async (code: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await instructorService.resetPassword(code, password);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to reset password',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to reset password' };
        }
      },

      userSendResetInstructions: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await userService.sendResetInstructions(email);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to send reset instructions',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to send reset instructions' };
        }
      },

      userResetPasswordWithCode: async (code: string, password: string, confirmPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await userService.resetPasswordWithCode(code, password, confirmPassword);
          set({ isLoading: false, error: null });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to reset password',
          });
          return { status: 'failed', message: error.response?.data?.message || 'Failed to reset password' };
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            isAuthenticated: false,
            user: null,
            userType: null,
            accessToken: null,
            isLoading: false,
            error: null,
            instruction: null,
            pendingUserId: null,
          });
          localStorage.removeItem('accessToken');
          clearAuthCookies();
        }
      },

      setUser: (user: AuthUser | null, userType: 'user' | 'admin' | 'instructor' | null) => {
        set({ user, userType, isAuthenticated: !!user });
      },

      setAccessToken: (token: string | null) => {
        set({ accessToken: token });
        if (token) {
          localStorage.setItem('accessToken', token);
          const { userType } = get();
          setAuthCookies(token, userType);
        } else {
          localStorage.removeItem('accessToken');
          clearAuthCookies();
        }
      },

      setUserType: (userType: 'user' | 'admin' | 'instructor' | null) => {
        set({ userType });
      },

      clearInstruction: () => {
        set({ instruction: null, pendingUserId: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isAuthenticated: false, user: null, userType: null, accessToken: null });
          return;
        }

        set({ isLoading: true });
        try {
          // Verify token with backend
          // For now, we'll just check if token exists
          set({
            isAuthenticated: true,
            accessToken: token,
            isLoading: false,
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            userType: null,
            accessToken: null,
            isLoading: false,
          });
          localStorage.removeItem('accessToken');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        userType: state.userType,
        accessToken: state.accessToken,
      }),
    }
  )
);