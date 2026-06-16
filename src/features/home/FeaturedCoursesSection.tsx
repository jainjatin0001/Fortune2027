import Link from 'next/link';
import { ArrowRight, BookOpen, Star } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { getCategoryLabel, getCategoryBadgeClass, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import type { CourseCategory } from '@/types';

// Static featured courses (commented out — replaced by DB query below)
// const featuredCourses = [
//   { id: '1', slug: 'sat-complete-prep', title: 'Complete SAT Preparation Course', shortDesc: 'Master every section of the SAT with 1,400+ practice questions, 10 full-length mock tests, and adaptive drills.', category: 'SAT_PREP' as CourseCategory, difficulty: 'MEDIUM', durationHours: 80, totalLessons: 120, price: 0, isFree: true, thumbnailUrl: null, rating: 4.9, reviewCount: 4200, enrollCount: 48000 },
//   { id: '2', slug: 'act-prep-masterclass', title: 'ACT Prep Masterclass', shortDesc: 'Systematic preparation covering all four ACT sections with targeted timing strategies.', category: 'ACT_PREP' as CourseCategory, difficulty: 'MEDIUM', durationHours: 60, totalLessons: 95, price: 19.99, isFree: false, thumbnailUrl: null, rating: 4.8, reviewCount: 3100, enrollCount: 32000 },
//   { id: '3', slug: 'ap-calculus-ab', title: 'AP Calculus AB — Exam Ready', shortDesc: 'Complete AP Calculus AB course aligned with College Board standards. FRQ practice included.', category: 'AP_EXAM' as CourseCategory, difficulty: 'HARD', durationHours: 45, totalLessons: 72, price: 19.99, isFree: false, thumbnailUrl: null, rating: 4.9, reviewCount: 2800, enrollCount: 21000 },
//   { id: '4', slug: 'python-for-beginners', title: 'Python Programming — Zero to Pro', shortDesc: 'Build real projects from day one. Perfect for students with zero coding experience.', category: 'CODING' as CourseCategory, difficulty: 'EASY', durationHours: 40, totalLessons: 65, price: 0, isFree: true, thumbnailUrl: null, rating: 4.9, reviewCount: 5900, enrollCount: 67000 },
//   { id: '5', slug: 'data-science-fundamentals', title: 'Data Science Fundamentals', shortDesc: 'Python, pandas, matplotlib, and scikit-learn. Build your first ML model in Week 3.', category: 'CODING' as CourseCategory, difficulty: 'MEDIUM', durationHours: 55, totalLessons: 88, price: 29.99, isFree: false, thumbnailUrl: null, rating: 4.8, reviewCount: 2200, enrollCount: 18000 },
//   { id: '6', slug: 'ap-us-history', title: 'AP United States History', shortDesc: 'From colonial America to the 21st century — with DBQ writing, LEQ, and SAQ strategies.', category: 'AP_EXAM' as CourseCategory, difficulty: 'HARD', durationHours: 50, totalLessons: 80, price: 19.99, isFree: false, thumbnailUrl: null, rating: 4.7, reviewCount: 1900, enrollCount: 15000 },
// ];

const gradients: Record<string, string> = {
  SAT_PREP: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
  ACT_PREP: 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
  AP_EXAM: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  CODING: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  HIGH_SCHOOL: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
  OTHER: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
};

function programSlugToCategory(slug: string): CourseCategory {
  const s = slug.toLowerCase();
  if (s.includes('sat')) return 'SAT_PREP';
  if (s.includes('act')) return 'ACT_PREP';
  if (s.includes('ap')) return 'AP_EXAM';
  if (s.includes('cod')) return 'CODING';
  if (s.includes('high') || s.includes('school')) return 'HIGH_SCHOOL';
  return 'OTHER';
}

async function getFeaturedCourses() {
  try {
    const rows = await prisma.course.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDesc: true,
        difficulty: true,
        price: true,
        isFree: true,
        isFeatured: true,
        program: { select: { name: true, slug: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
    });
    return rows.map((c) => ({
      ...c,
      price: Number(c.price),
      category: programSlugToCategory(c.program.slug),
    }));
  } catch {
    return [];
  }
}

export async function FeaturedCoursesSection() {
  const courses = await getFeaturedCourses();

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

        {courses.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--color-muted-foreground)' }}>
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>Courses coming soon</p>
            <p className="text-sm">We're preparing amazing content. Check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="card-base overflow-hidden group block">
                <div
                  className="h-40 relative"
                  style={{ background: gradients[course.category] ?? gradients.OTHER }}
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
                  {course.shortDesc && (
                    <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
                      {course.shortDesc}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
                      {course.difficulty}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      New
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                      {course._count.enrollments.toLocaleString()} enrolled
                    </span>
                    <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(course.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

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
