// Course Validation Schemas using Zod
import { z } from 'zod';

const programmingCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Programming language is required'),
  explanation: z.string().min(1, 'Explanation is required'),
  fileName: z.string().min(1, 'File name is required'),
});

const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  url: z.string().url('Invalid URL'),
});

const quizQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.object({
    option: z.string().min(1, 'Option is required'),
    isCorrect: z.boolean(),
  })).min(2, 'At least 2 options required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(quizQuestionSchema).min(1, 'At least 1 question required'),
});

const courseVideoSchema = z.object({
  videoUrl: z.string().url('Invalid video URL'),
  videoTitle: z.string().min(1, 'Video title is required').max(200, 'Title too long'),
  videoDescription: z.string().min(1, 'Video description is required').max(1000, 'Description too long'),
  videoDuration: z.number().min(1, 'Duration must be positive'),
  isProgrammingVideo: z.boolean(),
  isPreview: z.boolean(),
  programmingCodes: z.array(programmingCodeSchema).optional(),
  assets: z.array(assetSchema).optional(),
  quizzes: z.array(quizSchema).optional(),
});

export const createCourseSchema = z.object({
  courseName: z.string()
    .min(3, 'Course name must be at least 3 characters')
    .max(200, 'Course name must not exceed 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  courseVideos: z.array(courseVideoSchema).min(1, 'At least 1 video required'),
  courseRequirements: z.array(z.string()).min(1, 'At least 1 requirement required'),
  price: z.number().min(0, 'Price must be non-negative'),
  duration: z.number().min(1, 'Duration must be positive'),
  certificate: z.string().min(1, 'Certificate name is required'),
});

export const updateCourseSchema = createCourseSchema.partial().extend({
  _id: z.string().min(1, 'Course ID is required'),
});

export const getCourseByIdSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;
export type GetCourseByIdFormData = z.infer<typeof getCourseByIdSchema>;