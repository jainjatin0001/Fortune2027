import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, FlaskConical, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { QuizInterface } from '@/components/shared/QuizInterface';
import { getDemoQuestions } from '../../../../data/demo';
import { prisma } from '@/lib/prisma';
import { formatPrice, getCategoryBadgeClass, getCategoryLabel } from '@/lib/utils';

const apGradient = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';

export const metadata: Metadata = {
  title: 'AP Exam Preparation',
  description: 'Comprehensive AP preparation for 20+ subjects. 98% pass rate among EduReach students.',
};

const apSubjects = [
  { name: 'Calculus AB', difficulty: 'Hard', enrolled: 21000 },
  { name: 'Calculus BC', difficulty: 'Expert', enrolled: 14000 },
  { name: 'US History', difficulty: 'Hard', enrolled: 15000 },
  { name: 'World History', difficulty: 'Hard', enrolled: 12000 },
  { name: 'Biology', difficulty: 'Hard', enrolled: 17000 },
  { name: 'Chemistry', difficulty: 'Expert', enrolled: 11000 },
  { name: 'Physics 1', difficulty: 'Hard', enrolled: 13000 },
  { name: 'Physics C', difficulty: 'Expert', enrolled: 8000 },
  { name: 'English Language', difficulty: 'Medium', enrolled: 19000 },
  { name: 'English Literature', difficulty: 'Hard', enrolled: 16000 },
  { name: 'Psychology', difficulty: 'Easy', enrolled: 22000 },
  { name: 'Computer Science A', difficulty: 'Medium', enrolled: 18000 },
  { name: 'Statistics', difficulty: 'Medium', enrolled: 20000 },
  { name: 'Environmental Science', difficulty: 'Medium', enrolled: 14000 },
  { name: 'Government & Politics', difficulty: 'Medium', enrolled: 15000 },
  { name: 'Economics (Macro)', difficulty: 'Medium', enrolled: 13000 },
  { name: 'Spanish Language', difficulty: 'Hard', enrolled: 10000 },
  { name: 'French Language', difficulty: 'Hard', enrolled: 7000 },
  { name: 'Human Geography', difficulty: 'Easy', enrolled: 17000 },
  { name: 'Art History', difficulty: 'Medium', enrolled: 6000 },
];

const diffColors: Record<string, string> = {
  Easy: 'difficulty-easy',
  Medium: 'difficulty-medium',
  Hard: 'difficulty-hard',
  Expert: 'difficulty-expert',
};

async function getAPCourses() {
  try {
    const rows = await prisma.course.findMany({
      where: {
        isPublished: true,
        program: { OR: [{ slug: { startsWith: 'ap' } }, { name: { contains: 'AP' } }] },
      },
      select: {
        id: true, title: true, slug: true, shortDesc: true,
        difficulty: true, price: true, isFree: true,
        program: { select: { name: true, slug: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      take: 6,
    });
    return rows.map((c) => ({ ...c, price: Number(c.price) }));
  } catch {
    return [];
  }
}

export default async function APPage() {
  const [apQuestions, apCourses] = await Promise.all([
    Promise.resolve(getDemoQuestions('AP_EXAM')),
    getAPCourses(),
  ]);

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <section className="hero-bg py-20">
        <div className="container-app max-w-3xl">
          <span className="text-label mb-4 block" style={{ color: '#93c5fd' }}>AP EXAM PREPARATION</span>
          <h1 className="text-hero text-white mb-6">
            Earn College Credit with{' '}
            <span className="gradient-text-accent">5-Score Prep</span>
          </h1>
          <p className="text-body-lg mb-8" style={{ color: 'rgba(203,213,225,0.9)' }}>
            Expert-designed prep for 20+ AP subjects. Our students achieve a 98% pass rate and a 67% rate of scoring a 5.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-white font-semibold" style={{ background: 'var(--gradient-accent)' }}>
                Start AP Prep <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 mt-8">
            {['20+ AP subjects', '98% pass rate', '67% score a 5'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(203,213,225,0.9)' }}>
                <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-app">
          <SectionHeader eyebrow="AP Subjects" title="20+ Subjects Covered" subtitle="Click any subject to begin your AP preparation." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {apSubjects.map((subject) => (
              <Link
                key={subject.name}
                href={`/ap-prep/${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="card-base p-4 group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-4 w-4 shrink-0" style={{ color: 'var(--color-ap)' }} />
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${diffColors[subject.difficulty]}`}>
                    {subject.difficulty}
                  </span>
                </div>
                <h3 className="text-sm font-semibold group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>
                  AP {subject.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                  {subject.enrolled.toLocaleString()} enrolled
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AP Courses from DB */}
      {apCourses.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--color-background)' }}>
          <div className="container-app">
            <SectionHeader eyebrow="AP Courses" title="Enroll in an AP Course" subtitle="Expert-built courses for every AP subject — structured, aligned, and exam-ready." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {apCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="card-base overflow-hidden group block">
                  <div className="h-40 relative" style={{ background: apGradient }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white opacity-30" />
                    </div>
                    {course.isFree && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white bg-green-600">FREE</span>
                    )}
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getCategoryBadgeClass('AP_EXAM')}`}>
                      {getCategoryLabel('AP_EXAM')}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>
                      {course.title}
                    </h3>
                    {course.shortDesc && (
                      <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--color-muted-foreground)' }}>{course.shortDesc}</p>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>{course.difficulty}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />New
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{course._count.enrollments.toLocaleString()} enrolled</span>
                      <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>{formatPrice(course.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/courses">
                <Button variant="outline" size="lg" className="gap-2">View All Courses <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader eyebrow="Try It Now" title="Practice AP Questions" />
          {apQuestions.length > 0 && <QuizInterface questions={apQuestions.slice(0, 3)} title="AP Practice Quiz" />}
        </div>
      </section>
    </div>
  );
}
