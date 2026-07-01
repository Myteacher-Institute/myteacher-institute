// IndexedDB configuration using Dexie
import Dexie, { Table } from 'dexie';
import { ENV_CONFIG } from '../config/env';
import { Course } from '../types';

export interface CourseRecord {
  id?: number;
  _id: string;
  data: Course;
  timestamp: number;
}

export interface CacheRecord {
  id?: number;
  key: string;
  data: any;
  timestamp: number;
  expiresAt: number;
}

class MyteacherDatabase extends Dexie {
  courses!: Table<CourseRecord>;
  cache!: Table<CacheRecord>;

  constructor() {
    super(ENV_CONFIG.NEXT_PUBLIC_INDEXED_DB_NAME);
    
    this.version(ENV_CONFIG.NEXT_PUBLIC_INDEXED_DB_VERSION).stores({
      courses: '_id, timestamp',
      cache: 'key, timestamp, expiresAt',
    });
  }
}

const db = new MyteacherDatabase();

// Course operations
export const courseDB = {
  async saveCourse(course: Course): Promise<void> {
    await db.courses.put({
      _id: course._id,
      data: course,
      timestamp: Date.now(),
    });
  },

  async saveCourses(courses: Course[]): Promise<void> {
    const records = courses.map(course => ({
      _id: course._id,
      data: course,
      timestamp: Date.now(),
    }));
    await db.courses.bulkPut(records);
  },

  async getCourse(courseId: string): Promise<Course | null> {
    const record = await db.courses.get(courseId);
    return record?.data || null;
  },

  async getAllCourses(): Promise<Course[]> {
    const records = await db.courses.toArray();
    return records.map(record => record.data);
  },

  async deleteCourse(courseId: string): Promise<void> {
    await db.courses.delete(courseId);
  },

  async clearCourses(): Promise<void> {
    await db.courses.clear();
  },

  async getCoursesOlderThan(timestamp: number): Promise<Course[]> {
    const records = await db.courses
      .where('timestamp')
      .below(timestamp)
      .toArray();
    return records.map(record => record.data);
  },
};

// Cache operations
export const cacheDB = {
  async set(key: string, data: any, ttl: number = 3600000): Promise<void> {
    const expiresAt = Date.now() + ttl;
    await db.cache.put({
      key,
      data,
      timestamp: Date.now(),
      expiresAt,
    });
  },

  async get(key: string): Promise<any | null> {
    const record = await db.cache.get(key);
    
    if (!record) return null;
    
    // Check if expired
    if (Date.now() > record.expiresAt) {
      await db.cache.delete(record.id!);
      return null;
    }
    
    return record.data;
  },

  async delete(key: string): Promise<void> {
    await db.cache.delete(key);
  },

  async clear(): Promise<void> {
    await db.cache.clear();
  },

  async clearExpired(): Promise<void> {
    const now = Date.now();
    const expiredRecords = await db.cache
      .where('expiresAt')
      .below(now)
      .toArray();
    
    await db.cache.bulkDelete(expiredRecords.map(r => r.id!));
  },
};

export default db;