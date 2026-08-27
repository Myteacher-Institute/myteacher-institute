// Course Types

export interface ProgrammingCode {
  code: string;
  language: string;
  explanation: string;
  fileName: string;
}

export interface Asset {
  name: string;
  url: string;
  file?: File;
}

export interface QuizQuestion {
  question: string;
  options: {
    option: string;
    isCorrect: boolean;
  }[];
  correctAnswer: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface CourseVideo {
  videoUrl: string;
  videoTitle: string;
  videoDescription: string;
  videoDuration: number;
  isProgrammingVideo: boolean;
  isPreview: boolean;
  file?: File;
}

export interface Chapter {
  title: string;
  explanation: string;
  videos: CourseVideo[];
  programmingCodes: ProgrammingCode[];
  assets: Asset[];
  quizzes: Quiz[];
}

export interface InstructorDetails {
  userId: string;
  name: string;
  email: string;
  profilePicture: string;
}

export interface AppliedUser {
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  appliedAt: Date;
}

export interface CourseRating {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  ratedAt: Date;
}

export interface Course {
  _id: string;
  courseName: string;
  description: string;
  chapters: Chapter[];
  courseVideos: CourseVideo[];
  programmingCodes: ProgrammingCode[];
  assets: Asset[];
  quizzes: Quiz[];
  courseRequirements: string[];
  appliedUsers: AppliedUser[];
  ratings: CourseRating[];
  averageRating: number;
  price: number;
  duration: number;
  certificate: string;
  instructorDetails: InstructorDetails;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCourseRequest {
  courseName: string;
  description: string;
  chapters: Chapter[];
  courseVideos: CourseVideo[];
  programmingCodes: ProgrammingCode[];
  assets: Asset[];
  quizzes: Quiz[];
  courseRequirements: string[];
  price: number;
  duration: number;
  certificate: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  _id: string;
}

export interface CourseResponse {
  status: 'success' | 'failed';
  message: string;
  course?: Course;
  courses?: Course[];
}

// Course State
export interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
}