import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Star } from 'lucide-react';
import { getCategoryBadgeClass, getCategoryLabel, formatPrice } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import type { CourseCategory } from '@/types';

export const metadata: Metadata = {
  title: 'All Courses',
  description: 'Browse all SAT, ACT, AP, High School, and Coding courses on EduReach.',
};

// Static courses (commented out — replaced by DB query below)
// const allCourses = [
//   { id: '1', slug: 'sat-complete-prep', title: 'Complete SAT Prep', shortDesc: 'Master every SAT section with 1,400+ questions and 10 mock exams.', category: 'SAT_PREP' as CourseCategory, difficulty: 'MEDIUM', durationHours: 80, totalLessons: 120, price: 0, rating: 4.9, enrollCount: 48000 },
//   { id: '2', slug: 'sat-math-intensive', title: 'SAT Math Intensive', shortDesc: 'Deep focus on SAT Math: algebra, data analysis, and advanced topics.', category: 'SAT_PREP' as CourseCategory, difficulty: 'HARD', durationHours: 35, totalLessons: 55, price: 14.99, rating: 4.8, enrollCount: 22000 },
//   { id: '3', slug: 'act-prep-masterclass', title: 'ACT Prep Masterclass', shortDesc: 'Complete ACT prep with English, Math, Reading, and Science.', category: 'ACT_PREP' as CourseCategory, difficulty: 'MEDIUM', durationHours: 60, totalLessons: 95, price: 19.99, rating: 4.8, enrollCount: 32000 },
//   { id: '4', slug: 'ap-calculus-ab', title: 'AP Calculus AB', shortDesc: 'Complete AP Calc AB aligned with College Board. FRQ included.', category: 'AP_EXAM' as CourseCategory, difficulty: 'HARD', durationHours: 45, totalLessons: 72, price: 19.99, rating: 4.9, enrollCount: 21000 },
//   { id: '5', slug: 'ap-us-history', title: 'AP United States History', shortDesc: 'Colonial era to present with DBQ, LEQ, and SAQ writing practice.', category: 'AP_EXAM' as CourseCategory, difficulty: 'HARD', durationHours: 50, totalLessons: 80, price: 19.99, rating: 4.7, enrollCount: 15000 },
//   { id: '6', slug: 'ap-biology', title: 'AP Biology', shortDesc: 'Cells, genetics, evolution, ecology — comprehensive AP Bio prep.', category: 'AP_EXAM' as CourseCategory, difficulty: 'HARD', durationHours: 48, totalLessons: 76, price: 19.99, rating: 4.8, enrollCount: 17000 },
//   { id: '7', slug: 'python-for-beginners', title: 'Python Programming — Zero to Pro', shortDesc: 'Build real projects from day one. No prior experience required.', category: 'CODING' as CourseCategory, difficulty: 'EASY', durationHours: 40, totalLessons: 65, price: 0, rating: 4.9, enrollCount: 67000 },
//   { id: '8', slug: 'machine-learning-fundamentals', title: 'Machine Learning Fundamentals', shortDesc: 'Supervised, unsupervised, and neural networks. Build real models.', category: 'CODING' as CourseCategory, difficulty: 'HARD', durationHours: 65, totalLessons: 100, price: 39.99, rating: 4.9, enrollCount: 12000 },
//   { id: '9', slug: 'data-science-fundamentals', title: 'Data Science Fundamentals', shortDesc: 'Python, pandas, matplotlib, and scikit-learn with real datasets.', category: 'CODING' as CourseCategory, difficulty: 'MEDIUM', durationHours: 55, totalLessons: 88, price: 29.99, rating: 4.8, enrollCount: 18000 },
//   { id: '10', slug: 'web-development-bootcamp', title: 'Web Development Bootcamp', shortDesc: 'HTML, CSS, JavaScript, React, and Next.js — build full apps.', category: 'CODING' as CourseCategory, difficulty: 'MEDIUM', durationHours: 75, totalLessons: 115, price: 34.99, rating: 4.8, enrollCount: 24000 },
//   { id: '11', slug: 'algebra-2', title: 'Algebra 2 Mastery', shortDesc: 'Functions, polynomials, exponentials, and statistics.', category: 'HIGH_SCHOOL' as CourseCategory, difficulty: 'MEDIUM', durationHours: 30, totalLessons: 48, price: 0, rating: 4.7, enrollCount: 28000 },
//   { id: '12', slug: 'chemistry-honors', title: 'Chemistry — Honors Level', shortDesc: 'Stoichiometry, bonding, thermodynamics, and electrochemistry.', category: 'HIGH_SCHOOL' as CourseCategory, difficulty: 'HARD', durationHours: 38, totalLessons: 60, price: 14.99, rating: 4.6, enrollCount: 12000 },
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

async function getAllCourses() {
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
        program: { select: { name: true, slug: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
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

export default async function CoursesPage() {
  const allCourses = await getAllCourses();

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
            {allCourses.length > 0
              ? `${allCourses.length} course${allCourses.length !== 1 ? 's' : ''} · SAT, ACT, AP, Coding, and High School subjects`
              : 'SAT, ACT, AP, Coding, and High School subjects'}
          </p>
        </div>
      </div>

      <div className="container-app py-10">
        {allCourses.length === 0 ? (
          <div className="text-center py-24" style={{ color: 'var(--color-muted-foreground)' }}>
            <BookOpen className="h-16 w-16 mx-auto mb-6 opacity-20" />
            <h2 className="text-heading-2 mb-3" style={{ color: 'var(--color-foreground)' }}>Courses coming soon</h2>
            <p className="text-body max-w-md mx-auto">
              Our team is building world-class content. Check back shortly or sign up to get notified.
            </p>
          </div>
        ) : (
          <>
            {/* Course grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="card-base overflow-hidden group block">
                  <div className="h-36 relative" style={{ background: gradients[course.category] }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-white opacity-30" />
                    </div>
                    {course.isFree && (
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
                    {course.shortDesc && (
                      <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-muted-foreground)' }}>{course.shortDesc}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--color-muted-foreground)' }}>
                      <span className="px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--color-muted)' }}>{course.difficulty}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />New</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{course._count.enrollments.toLocaleString()} enrolled</span>
                      <span className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>{formatPrice(course.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
