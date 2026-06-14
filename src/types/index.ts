// ═══════════════════════════════════════════════════════════════
// SHARED TYPES — all application-wide types live here
// ═══════════════════════════════════════════════════════════════

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'PARENT' | 'ADMIN' | 'SUPER_ADMIN';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
// Kept for static display pages (courses/page.tsx, FeaturedCoursesSection)
export type CourseCategory = 'SAT_PREP' | 'ACT_PREP' | 'AP_EXAM' | 'HIGH_SCHOOL' | 'CODING' | 'OTHER';
export type AssetType = 'VIDEO' | 'PDF' | 'ARTICLE' | 'QUIZ' | 'QUESTION_SET';
export type QuestionType = 'SINGLE_CORRECT' | 'MULTIPLE_CORRECT' | 'NUMERIC' | 'TEXT';
export type QuizType = 'CHAPTER_TEST' | 'PRACTICE' | 'DAILY_QUIZ' | 'MOCK_TEST';
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED' | 'EXPIRED';
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
// CURRICULUM
// ─────────────────────────────────────────────
export interface Program {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Subject {
  id: string;
  programId: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  color?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  parentTopicId?: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

// ─────────────────────────────────────────────
// COURSE
// ─────────────────────────────────────────────
export interface Course {
  id: string;
  programId: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  difficulty: DifficultyLevel;
  price: number;
  comparePrice?: number;
  isFree: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  requirements: string[];
  objectives: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  program?: Program;
  instructors?: CourseInstructor[];
  reviews?: Review[];
  enrollments?: Enrollment[];
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
  assets?: LearningAsset[];
}

export interface LearningAsset {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  assetType: AssetType;
  sortOrder: number;
  isFree: boolean;
  isPublished: boolean;
  videoUrl?: string;
  videoDuration?: number;
  videoProvider?: string;
  pdfUrl?: string;
  articleContent?: string;
  quizId?: string;
  questionSetId?: string;
}

// ─────────────────────────────────────────────
// ENROLLMENT & PROGRESS
// ─────────────────────────────────────────────
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  course?: Course;
  courseProgress?: CourseProgress;
}

export interface CourseProgress {
  id: string;
  enrollmentId: string;
  completionPct: number;
  totalAssets: number;
  completedAssets: number;
  lastAccessedAt?: Date;
}

export interface ModuleProgress {
  id: string;
  enrollmentId: string;
  moduleId: string;
  completionPct: number;
  totalAssets: number;
  completedAssets: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface LearningAssetProgress {
  id: string;
  enrollmentId: string;
  assetId: string;
  isCompleted: boolean;
  watchedSecs: number;
  lastPosition: number;
  completedAt?: Date;
}

// ─────────────────────────────────────────────
// QUIZ & QUESTIONS
// ─────────────────────────────────────────────
export interface Question {
  id: string;
  subjectId: string;
  topicId?: string;
  statement: string;
  explanation?: string;
  imageUrl?: string;
  difficulty: DifficultyLevel;
  questionType: QuestionType;
  tags: string[];
  points: number;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  questionId: string;
  content: string;
  imageUrl?: string;
  explanation?: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface Quiz {
  id: string;
  subjectId?: string;
  title: string;
  description?: string;
  quizType: QuizType;
  timeLimit?: number;
  passingScore: number;
  isPublished: boolean;
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
  questionAttempts?: UserQuestionAttempt[];
}

export interface UserQuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  quizAttemptId?: string;
  selectedOptionIds: string[];
  textAnswer?: string;
  numericAnswer?: number;
  isCorrect?: boolean;
  timeTaken?: number;
  isSkipped: boolean;
  attemptedAt: Date;
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
  courseId?: string;
  questionId?: string;
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
