import Link from 'next/link';
import { ArrowRight, Clock, BookOpen, Star } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { getCategoryLabel, getCategoryBadgeClass, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CourseCategory, DifficultyLevel } from '@/types';

// Static featured courses (replaced by DB query after backend is live)
const featuredCourses = [
  {
    id: '1',
    slug: 'sat-complete-prep',
    title: 'Complete SAT Preparation Course',
    shortDesc: 'Master every section of the SAT with 1,400+ practice questions, 10 full-length mock tests, and adaptive drills.',
    category: 'SAT_PREP' as CourseCategory,
    difficulty: 'MEDIUM' as DifficultyLevel,
    durationHours: 80,
    totalLessons: 120,
    price: 0,
    isFree: true,
    thumbnailUrl: null,
    rating: 4.9,
    reviewCount: 4200,
    enrollCount: 48000,
  },
  {
    id: '2',
    slug: 'act-prep-masterclass',
    title: 'ACT Prep Masterclass',
    shortDesc: 'Systematic preparation covering all four ACT sections with targeted timing strategies.',
    category: 'ACT_PREP' as CourseCategory,
    difficulty: 'MEDIUM' as DifficultyLevel,
    durationHours: 60,
    totalLessons: 95,
    price: 19.99,
    isFree: false,
    thumbnailUrl: null,
    rating: 4.8,
    reviewCount: 3100,
    enrollCount: 32000,
  },
  {
    id: '3',
    slug: 'ap-calculus-ab',
    title: 'AP Calculus AB — Exam Ready',
    shortDesc: 'Complete AP Calculus AB course aligned with College Board standards. FRQ practice included.',
    category: 'AP_EXAM' as CourseCategory,
    difficulty: 'HARD' as DifficultyLevel,
    durationHours: 45,
    totalLessons: 72,
    price: 19.99,
    isFree: false,
    thumbnailUrl: null,
    rating: 4.9,
    reviewCount: 2800,
    enrollCount: 21000,
  },
  {
    id: '4',
    slug: 'python-for-beginners',
    title: 'Python Programming — Zero to Pro',
    shortDesc: 'Build real projects from day one. Perfect for students with zero coding experience.',
    category: 'CODING' as CourseCategory,
    difficulty: 'EASY' as DifficultyLevel,
    durationHours: 40,
    totalLessons: 65,
    price: 0,
    isFree: true,
    thumbnailUrl: null,
    rating: 4.9,
    reviewCount: 5900,
    enrollCount: 67000,
  },
  {
    id: '5',
    slug: 'data-science-fundamentals',
    title: 'Data Science Fundamentals',
    shortDesc: 'Python, pandas, matplotlib, and scikit-learn. Build your first ML model in Week 3.',
    category: 'CODING' as CourseCategory,
    difficulty: 'MEDIUM' as DifficultyLevel,
    durationHours: 55,
    totalLessons: 88,
    price: 29.99,
    isFree: false,
    thumbnailUrl: null,
    rating: 4.8,
    reviewCount: 2200,
    enrollCount: 18000,
  },
  {
    id: '6',
    slug: 'ap-us-history',
    title: 'AP United States History',
    shortDesc: 'From colonial America to the 21st century — with DBQ writing, LEQ, and SAQ strategies.',
    category: 'AP_EXAM' as CourseCategory,
    difficulty: 'HARD' as DifficultyLevel,
    durationHours: 50,
    totalLessons: 80,
    price: 19.99,
    isFree: false,
    thumbnailUrl: null,
    rating: 4.7,
    reviewCount: 1900,
    enrollCount: 15000,
  },
];

const gradients: Record<string, string> = {
  SAT_PREP: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
  ACT_PREP: 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
  AP_EXAM: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  CODING: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  HIGH_SCHOOL: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
};

export function FeaturedCoursesSection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
      <div className="container-app">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            eyebrow="Popular Courses"
            title="Start with Our Best"
            subtitle="Handpicked by students. Designed by experts."
            align="left"
            className="mb-0"
          />
          <Link href="/courses" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline shrink-0">
            View all courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`} className="card-base overflow-hidden group block">
              {/* Thumbnail */}
              <div
                className="h-40 relative"
                style={{ background: gradients[course.category] ?? gradients.SAT_PREP }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white opacity-30" />
                </div>
                {course.isFree && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white bg-green-600">
                    FREE
                  </span>
                )}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getCategoryBadgeClass(course.category)}`}>
                  {getCategoryLabel(course.category)}
                </span>
              </div>

              <div className="p-5">
                <h3
                  className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {course.title}
                </h3>
                <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
                  {course.shortDesc}
                </p>

                <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {course.durationHours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {course.totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                    <span className="opacity-70">({course.reviewCount.toLocaleString()})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    {course.enrollCount.toLocaleString()} enrolled
                  </span>
                  <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(course.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/courses">
            <Button variant="outline" size="lg" className="gap-2">
              Browse All Courses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
