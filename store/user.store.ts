// User Store using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, User, Admin, Instructor } from '../types';
import { userService } from '../services';

interface UserActions extends UserState {
  fetchCurrentUser: () => Promise<void>;
  updateUser: (data: Partial<User> | Partial<Admin> | Partial<Instructor>) => Promise<void>;
  setUser: (user: User | Admin | Instructor | null) => void;
  setUserType: (userType: 'user' | 'admin' | 'instructor' | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserActions>()(
  persist(
    (set) => ({
      user: null,
      userType: null,
      isLoading: false,
      error: null,

      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await userService.getCurrentUser();
          
          if (response.user) {
            // Determine user type based on the response structure
            let userType: 'user' | 'admin' | 'instructor' | null = null;
            if ('isAdmin' in response.user && response.user.isAdmin) {
              userType = 'admin';
            } else if ('isVerified' in response.user) {
              userType = 'instructor';
            } else {
              userType = 'user';
            }
            
            set({ user: response.user, userType, isLoading: false });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch user data',
          });
        }
      },

      updateUser: async (data: Partial<User> | Partial<Admin> | Partial<Instructor>) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await userService.updateProfile(data);
          
          if (response.user) {
            // Determine user type based on the response structure
            let userType: 'user' | 'admin' | 'instructor' | null = null;
            if ('isAdmin' in response.user && response.user.isAdmin) {
              userType = 'admin';
            } else if ('isVerified' in response.user) {
              userType = 'instructor';
            } else {
              userType = 'user';
            }
            
            set({ user: response.user, userType, isLoading: false });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update profile',
          });
        }
      },

      setUser: (user: User | Admin | Instructor | null) => {
        set({ user });
      },

      setUserType: (userType: 'user' | 'admin' | 'instructor' | null) => {
        set({ userType });
      },

      clearUser: () => {
        set({ user: null, userType: null, error: null });
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        userType: state.userType,
      }),
    }
  )
);