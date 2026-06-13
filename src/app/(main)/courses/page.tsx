import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, Star, Filter } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { getCategoryBadgeClass, getCategoryLabel, formatPrice } from '@/lib/utils';
import type { CourseCategory, DifficultyLevel } from '@/types';

export const metadata: Metadata = {
  title: 'All Courses',
  description: 'Browse all SAT, ACT, AP, High School, and Coding courses on EduReach.',
};

const allCourses = [
  { id: '1', slug: 'sat-complete-prep', title: 'Complete SAT Prep', shortDesc: 'Master every SAT section with 1,400+ questions and 10 mock exams.', category: 'SAT_PREP' as CourseCategory, difficulty: 'MEDIUM' as DifficultyLevel, durationHours: 80, totalLessons: 120, price: 0, rating: 4.9, enrollCount: 48000 },
  { id: '2', slug: 'sat-math-intensive', title: 'SAT Math Intensive', shortDesc: 'Deep focus on SAT Math: algebra, data analysis, and advanced topics.', category: 'SAT_PREP' as CourseCategory, difficulty: 'HARD' as DifficultyLevel, durationHours: 35, totalLessons: 55, price: 14.99, rating: 4.8, enrollCount: 22000 },
  { id: '3', slug: 'act-prep-masterclass', title: 'ACT Prep Masterclass', shortDesc: 'Complete ACT prep with English, Math, Reading, and Science.', category: 'ACT_PREP' as CourseCategory, difficulty: 'MEDIUM' as DifficultyLevel, durationHours: 60, totalLessons: 95, price: 19.99, rating: 4.8, enrollCount: 32000 },
  { id: '4', slug: 'ap-calculus-ab', title: 'AP Calculus AB', shortDesc: 'Complete AP Calc AB aligned with College Board. FRQ included.', category: 'AP_EXAM' as CourseCategory, difficulty: 'HARD' as DifficultyLevel, durationHours: 45, totalLessons: 72, price: 19.99, rating: 4.9, enrollCount: 21000 },
  { id: '5', slug: 'ap-us-history', title: 'AP United States History', shortDesc: 'Colonial era to present with DBQ, LEQ, and SAQ writing practice.', category: 'AP_EXAM' as CourseCategory, difficulty: 'HARD' as DifficultyLevel, durationHours: 50, totalLessons: 80, price: 19.99, rating: 4.7, enrollCount: 15000 },
  { id: '6', slug: 'ap-biology', title: 'AP Biology', shortDesc: 'Cells, genetics, evolution, ecology — comprehensive AP Bio prep.', category: 'AP_EXAM' as CourseCategory, difficulty: 'HARD' as DifficultyLevel, durationHours: 48, totalLessons: 76, price: 19.99, rating: 4.8, enrollCount: 17000 },
  { id: '7', slug: 'python-for-beginners', title: 'Python Programming — Zero to Pro', shortDesc: 'Build real projects from day one. No prior experience required.', category: 'CODING' as CourseCategory, difficulty: 'EASY' as DifficultyLevel, durationHours: 40, totalLessons: 65, price: 0, rating: 4.9, enrollCount: 67000 },
  { id: '8', slug: 'machine-learning-fundamentals', title: 'Machine Learning Fundamentals', shortDesc: 'Supervised, unsupervised, and neural networks. Build real models.', category: 'CODING' as CourseCategory, difficulty: 'HARD' as DifficultyLevel, durationHours: 65, totalLessons: 100, price: 39.99, rating: 4.9, enrollCount: 12000 },
  { id: '9', slug: 'data-science-fundamentals', title: 'Data Science Fundamentals', shortDesc: 'Python, pandas, matplotlib, and scikit-learn with real datasets.', category: 'CODING' as CourseCategory, difficulty: 'MEDIUM' as DifficultyLevel, durationHours: 55, totalLessons: 88, price: 29.99, rating: 4.8, enrollCount: 18000 },
  { id: '10', slug: 'web-development-bootcamp', title: 'Web Development Bootcamp', shortDesc: 'HTML, CSS, JavaScript, React, and Next.js — build full apps.', category: 'CODING' as CourseCategory, difficulty: 'MEDIUM' as DifficultyLevel, durationHours: 75, totalLessons: 115, price: 34.99, rating: 4.8, enrollCount: 24000 },
  { id: '11', slug: 'algebra-2', title: 'Algebra 2 Mastery', shortDesc: 'Functions, polynomials, exponentials, and statistics.', category: 'HIGH_SCHOOL' as CourseCategory, difficulty: 'MEDIUM' as DifficultyLevel, durationHours: 30, totalLessons: 48, price: 0, rating: 4.7, enrollCount: 28000 },
  { id: '12', slug: 'chemistry-honors', title: 'Chemistry — Honors Level', shortDesc: 'Stoichiometry, bonding, thermodynamics, and electrochemistry.', category: 'HIGH_SCHOOL' as CourseCategory, difficulty: 'HARD' as DifficultyLevel, durationHours: 38, totalLessons: 60, price: 14.99, rating: 4.6, enrollCount: 12000 },
];

const categories = ['All', 'SAT_PREP', 'ACT_PREP', 'AP_EXAM', 'CODING', 'HIGH_SCHOOL'];

const gradients: Record<string, string> = {
  SAT_PREP: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
  ACT_PREP: 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
  AP_EXAM: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  CODING: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  HIGH_SCHOOL: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
};

export default function CoursesPage() {
  return (
    <div style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <div className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2" style={{ color: 'var(--color-muted-foreground)' }}>
              <li><Link href="/" className="hover:text-[var(--color-accent)]">Home</Link></li>
              <li>/</li>
              <li style={{ color: 'var(--color-foreground)' }}>Courses</li>
            </ol>
          </nav>
          <h1 className="text-heading-1 mb-3" style={{ color: 'var(--color-foreground)' }}>All Courses</h1>
          <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
            {allCourses.length} courses · SAT, ACT, AP, Coding, and High School subjects
          </p>
        </div>
      </div>

      <div className="container-app py-10">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={
                cat === 'All'
                  ? { background: 'var(--color-primary)', color: '#fff' }
                  : { background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }
              }
            >
              {cat === 'All' ? 'All Courses' : getCategoryLabel(cat as CourseCategory)}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`} className="card-base overflow-hidden group block">
              <div className="h-36 relative" style={{ background: gradients[course.category] }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-white opacity-30" />
                </div>
                {course.price === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white bg-green-600">FREE</span>
                )}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${getCategoryBadgeClass(course.category)}`}>
                  {getCategoryLabel(course.category)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>
                  {course.title}
                </h3>
                <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-muted-foreground)' }}>{course.shortDesc}</p>
                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--color-muted-foreground)' }}>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.durationHours}h</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.totalLessons}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{course.rating}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{course.enrollCount.toLocaleString()} enrolled</span>
                  <span className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>{formatPrice(course.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
