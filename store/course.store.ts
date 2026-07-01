// Course Store using Zustand
import { create } from 'zustand';
import { CourseState, Course } from '../types';
import { courseService } from '../services';
import { courseDB, cacheDB } from '../lib';

interface CourseActions extends CourseState {
  fetchAllCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  setCurrentCourse: (course: Course | null) => void;
  clearCourses: () => void;
  refreshCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseActions>()((set, get) => ({
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,

  fetchAllCourses: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Try to get from IndexedDB cache first
      const cachedCourses = await cacheDB.get('all-courses');
      if (cachedCourses) {
        set({ courses: cachedCourses, isLoading: false });
      }

      // Fetch from API
      const response = await courseService.getAllCourses();
      
      if (response.status === 'success' && response.courses) {
        set({ courses: response.courses, isLoading: false });
        
        // Cache in IndexedDB
        await cacheDB.set('all-courses', response.courses, 300000); // 5 minutes
        await courseDB.saveCourses(response.courses);
      } else {
        set({ isLoading: false, error: response.message });
      }
    } catch (error: any) {
      // If API fails, try to get from IndexedDB as fallback
      const indexedDBCourses = await courseDB.getAllCourses();
      if (indexedDBCourses.length > 0) {
        set({ courses: indexedDBCourses, isLoading: false });
      } else {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to fetch courses',
        });
      }
    }
  },

  fetchCourseById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Try to get from IndexedDB cache first
      const cachedCourse = await courseDB.getCourse(id);
      if (cachedCourse) {
        set({ currentCourse: cachedCourse, isLoading: false });
      }

      // Fetch from API
      const response = await courseService.getCourseById(id);
      
      if (response.status === 'success' && response.course) {
        set({ currentCourse: response.course, isLoading: false });
        
        // Cache in IndexedDB
        await courseDB.saveCourse(response.course);
      } else {
        set({ isLoading: false, error: response.message });
      }
    } catch (error: any) {
      // If API fails, try to get from IndexedDB as fallback
      const indexedDBCourse = await courseDB.getCourse(id);
      if (indexedDBCourse) {
        set({ currentCourse: indexedDBCourse, isLoading: false });
      } else {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to fetch course',
        });
      }
    }
  },

  setCurrentCourse: (course: Course | null) => {
    set({ currentCourse: course });
  },

  clearCourses: () => {
    set({ courses: [], currentCourse: null });
  },

  refreshCourses: async () => {
    await get().fetchAllCourses();
  },
}));