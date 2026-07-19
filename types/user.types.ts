// User Types

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  isEmailVerified: boolean;
  hasOnboarded: boolean;
  coursesBought: string[];
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Separate Admin model (from backend admin.model.ts)
export interface Admin {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Separate Instructor model (from backend instructor.model.ts)
export interface Instructor {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  phone: string;
  courses: string[];
  password?: string;
  moneyMade: number;
  isVerified: boolean;
  specialization?: string;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  youtubeTokens?: {
    accessToken?: string;
    refreshToken?: string;
    expiryDate?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  user: User | Admin | Instructor;
  userType: 'user' | 'admin' | 'instructor';
  isLoading: boolean;
  error: string | null;
}

// User State
export interface UserState {
  user: User | Admin | Instructor | null;
  userType: 'user' | 'admin' | 'instructor' | null;
  isLoading: boolean;
  error: string | null;
}