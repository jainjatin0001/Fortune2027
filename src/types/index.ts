// ═══════════════════════════════════════════════════════════════
// SHARED TYPES — all application-wide types live here
// ═══════════════════════════════════════════════════════════════

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'PARENT' | 'ADMIN' | 'SUPER_ADMIN';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type CourseCategory = 'SAT_PREP' | 'ACT_PREP' | 'AP_EXAM' | 'HIGH_SCHOOL' | 'CODING' | 'OTHER';
export type ContentType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'CODING' | 'PDF';
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
export type QuizAttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  grade?: string;
  school?: string;
  country: string;
  state?: string;
  timezone: string;
  targetScore?: number;
  examDate?: Date;
  phone?: string;
}

// ─────────────────────────────────────────────
// COURSE
// ─────────────────────────────────────────────
export interface Course {
  id: string;
  sectionId: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  category: CourseCategory;
  difficulty: DifficultyLevel;
  durationHours?: number;
  totalLessons: number;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  requirements: string[];
  objectives: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  section?: CourseSection;
  instructors?: CourseInstructor[];
  reviews?: Review[];
  enrollments?: Enrollment[];
}

export interface CourseSection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  title?: string;
  credentials: string[];
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface CourseInstructor {
  id: string;
  courseId: string;
  instructorId: string;
  isPrimary: boolean;
  instructor: Instructor;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  sortOrder: number;
  isPublished: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  content?: string;
  videoUrl?: string;
  videoDuration?: number;
  contentType: ContentType;
  sortOrder: number;
  isFree: boolean;
  isPublished: boolean;
}

// ─────────────────────────────────────────────
// ENROLLMENT & PROGRESS
// ─────────────────────────────────────────────
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  completedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  course?: Course;
  lessonProgress?: LessonProgress[];
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  watchedSecs: number;
  completedAt?: Date;
}

// ─────────────────────────────────────────────
// QUIZ & QUESTIONS
// ─────────────────────────────────────────────
export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: CourseCategory;
  iconUrl?: string;
  color?: string;
}

export interface Question {
  id: string;
  subjectId?: string;
  content: string;
  explanation?: string;
  imageUrl?: string;
  difficulty: DifficultyLevel;
  topic?: string;
  tags: string[];
  points: number;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface Quiz {
  id: string;
  subjectId?: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore: number;
  isPublished: boolean;
  isMockTest: boolean;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionId: string;
  sortOrder: number;
  points: number;
  question: Question;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  status: QuizAttemptStatus;
  score?: number;
  totalPoints: number;
  earnedPoints: number;
  timeTaken?: number;
  startedAt: Date;
  completedAt?: Date;
  answers?: AttemptAnswer[];
}

export interface AttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionId?: string;
  isCorrect: boolean;
}

// ─────────────────────────────────────────────
// DEMO QUESTION (used until Admin Portal is built)
// ─────────────────────────────────────────────
export interface DemoQuestion {
  id: string;
  subject: string;
  topic: string;
  category: CourseCategory;
  difficulty: DifficultyLevel;
  question: string;
  options: DemoOption[];
  correctAnswerId: string;
  explanation: string;
  points: number;
  tags: string[];
}

export interface DemoOption {
  id: string;
  content: string;
}

// ─────────────────────────────────────────────
// REVIEW & SOCIAL
// ─────────────────────────────────────────────
export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  content?: string;
  createdAt: Date;
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
}

export interface Bookmark {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  course?: Course;
}

// ─────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────
export interface BlogPost {
  id: string;
  authorId: string;
  categoryId?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  author?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
  category?: BlogCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ANNOUNCEMENT';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// ─────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────
export interface StudentStats {
  totalEnrollments: number;
  completedCourses: number;
  totalQuizzesTaken: number;
  averageScore: number;
  currentStreak: number;
  totalStudyHours: number;
  bookmarkedCourses: number;
  certificates: number;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  revenueThisMonth: number;
  activeToday: number;
  completionRate: number;
  averageRating: number;
}

// ─────────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
  requiredRole?: UserRole[];
}

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  ctaLabel: string;
}
