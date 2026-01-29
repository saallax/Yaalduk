
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  ADMIN = 'ADMIN'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum PaymentMethod {
  ZAAD = 'ZAAD',
  EVC_PLUS = 'EVC_PLUS',
  EDAHAB = 'EDAHAB',
  STRIPE = 'STRIPE'
}

export type ContentBlockType = 'video' | 'text' | 'gallery' | 'file' | 'quiz';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  // Video properties
  videoUrl?: string;
  thumbnail?: string;
  resolutions?: string[];
  // Text properties
  body?: string; // Supports simple markdown/html
  isNote?: boolean;
  // Gallery properties
  images?: { url: string; caption: string }[];
  // File properties
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  // Quiz properties
  questions?: { question: string; options: string[]; correct: number }[];
}

export interface Lesson {
  lessonId: string;
  title: string;
  description?: string;
  duration: string;
  order: number;
  isPreview: boolean;
  contentBlocks: ContentBlock[];
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  thumbnail: string;
  lessons: Lesson[];
  isPremium: boolean;
  isPublished: boolean;
  price?: number;
  createdAt: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  avatarSeed?: string;
  profileImage?: string;
  enrolledCourses: string[];
  progress: Record<string, number>;
  completedLessons: string[];
  lessonResumes?: Record<string, number>; // Maps lessonId to seconds watched
  createdAt: string;
  subscription?: {
    subscriptionId: string;
    userId: string;
    plan: 'MONTHLY' | 'YEARLY';
    amount: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Payment {
  paymentId: string;
  userId: string;
  userName: string;
  courseId?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentType: 'COURSE_PURCHASE' | 'SUBSCRIPTION';
  status: PaymentStatus;
  reference?: string;
  createdAt: string;
}

export interface AuditLog {
  logId: string;
  action: string;
  adminName: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export type AppLanguage = 'Somali' | 'English';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface TeacherQA {
  id: string;
  teacherName: string;
  teacherTitle: string;
  question: string;
  answer: string;
  category: string;
  likes: number;
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  membersCount: number;
  isLocked: boolean;
}

// Added missing Plan interface to fix import errors in App.tsx and PricingScreen.tsx
export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: string[];
  isPopular?: boolean;
}
