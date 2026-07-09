import type { Metadata } from 'next';
import type { ElementType } from 'react';
import Link from 'next/link';
import {
  BookOpen, Users, Star, ShieldCheck, Search,
  GraduationCap, Target, Code2, Monitor, BarChart2, Headphones,
  ChevronDown,
} from 'lucide-react';
import { getCategoryBadgeClass, getCategoryLabel, getDifficultyClass, getDifficultyLabel, formatPrice } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import type { CourseCategory } from '@/types';
import { CoursesFilter } from './CoursesFilter';

export const metadata: Metadata = {
  title: 'All Courses — Delta Tutors',
  description: 'Browse all SAT, ACT, AP, High School, and Coding courses on Delta Tutors.',
};

const gradients: Record<string, string> = {
  SAT_PREP:   'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
  ACT_PREP:   'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
  AP_EXAM:    'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  CODING:     'linear-gradient(135deg, #059669 0%, #047857 100%)',
  HIGH_SCHOOL:'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
  OTHER:      'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
};

const categoryIcons: Record<string, ElementType> = {
  SAT_PREP:    BookOpen,
  ACT_PREP:    Target,
  AP_EXAM:     GraduationCap,
  CODING:      Code2,
  HIGH_SCHOOL: Monitor,
  OTHER:       BookOpen,
};

function programSlugToCategory(slug: string): CourseCategory {
  const s = slug.toLowerCase();
  if (s.includes('sat')) return 'SAT_PREP';
  if (s.includes('act')) return 'ACT_PREP';
  if (s.includes('ap'))  return 'AP_EXAM';
  if (s.includes('cod')) return 'CODING';
  if (s.includes('high') || s.includes('school')) return 'HIGH_SCHOOL';
  return 'OTHER';
}

async function getCoursesData(category?: string, q?: string) {
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
        thumbnailUrl: true,
        program: { select: { name: true, slug: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    const all = rows.map((c) => ({
      ...c,
      price: Number(c.price),
      category: programSlugToCategory(c.program.slug),
    }));

    const totalEnrollments = all.reduce((sum, c) => sum + c._count.enrollments, 0);
    const totalCourses = all.length;

    let filtered = category ? all.filter((c) => c.category === category) : all;
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (c) => c.title.toLowerCase().includes(lower) || c.shortDesc?.toLowerCase().includes(lower),
      );
    }

    return { courses: filtered, totalCourses, totalEnrollments };
  } catch {
    return { courses: [], totalCourses: 0, totalEnrollments: 0 };
  }
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category = '', q = '' } = await searchParams;
  const { courses, totalCourses, totalEnrollments } = await getCoursesData(category || undefined, q || undefined);

  const enrollDisplay =
    totalEnrollments >= 1000
      ? `${Math.round(totalEnrollments / 1000)}K+`
      : totalEnrollments > 0
        ? `${totalEnrollments}+`
        : '250K+';

  return (
    <div style={{ background: 'var(--color-background)' }}>

      {/* ── HERO ───────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
          position: 'relative',
          overflow: 'hidden',
          paddingBlock: '3.5rem',
        }}
      >
        {/* Decorative open-book illustration */}
        {/* <svg
          viewBox="0 0 480 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '28rem',
            height: 'auto',
            opacity: 0.22,
            pointerEvents: 'none',
          }}
        >
          
          <rect x="14" y="24" width="212" height="290" rx="5"
            fill="white" fillOpacity="0.09" stroke="white" strokeWidth="1.6" />
          
          <rect x="254" y="24" width="212" height="290" rx="5"
            fill="white" fillOpacity="0.09" stroke="white" strokeWidth="1.6" />
          
          <line x1="235" y1="24" x2="235" y2="314" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="245" y1="24" x2="245" y2="314" stroke="white" strokeWidth="1" opacity="0.5" />
          <rect x="234" y="24" width="12" height="290" fill="white" fillOpacity="0.12" />
          
          <line x1="16" y1="21" x2="224" y2="21" stroke="white" strokeWidth="1.2" opacity="0.55" />
          <line x1="18" y1="18" x2="222" y2="18" stroke="white" strokeWidth="0.8" opacity="0.3" />
          <line x1="256" y1="21" x2="464" y2="21" stroke="white" strokeWidth="1.2" opacity="0.55" />
          <line x1="258" y1="18" x2="462" y2="18" stroke="white" strokeWidth="0.8" opacity="0.3" />
          
          <line x1="40" y1="82"  x2="210" y2="82"  stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="40" y1="108" x2="210" y2="108" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="40" y1="134" x2="210" y2="134" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="40" y1="160" x2="210" y2="160" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="40" y1="186" x2="210" y2="186" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="40" y1="212" x2="210" y2="212" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="40" y1="238" x2="210" y2="238" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="40" y1="264" x2="136" y2="264" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        
          <line x1="270" y1="82"  x2="440" y2="82"  stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="270" y1="108" x2="440" y2="108" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="270" y1="134" x2="440" y2="134" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="270" y1="160" x2="440" y2="160" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="270" y1="186" x2="440" y2="186" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="270" y1="212" x2="440" y2="212" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="270" y1="238" x2="440" y2="238" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="270" y1="264" x2="362" y2="264" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </svg> */}

        <div className="container-app" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <li><Link href="/" style={{ color: 'rgba(255,255,255,0.55)' }} className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li style={{ color: 'rgba(255,255,255,0.9)' }}>Courses</li>
            </ol>
          </nav>

          {/* Heading */}
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2.75rem', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            All Courses
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: '38rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Explore our expert-designed courses across SAT, ACT, AP, Coding, and High School subjects.
          </p>

          {/* Stats + Search row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.75rem', flex: 1, minWidth: 0 }}>
              {[
                { icon: BookOpen,    value: String(totalCourses || '9'), label: 'Courses' },
                { icon: Users,       value: enrollDisplay,                label: 'Students Enrolled' },
                { icon: ShieldCheck, value: 'Expert',                    label: 'IIT Educators' },
                { icon: Star,        value: '4.8/5',                     label: 'Average Rating', gold: true },
              ].map(({ icon: Icon, value, label, gold }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 16, height: 16, color: (gold as boolean | undefined) ? '#fbbf24' : 'white', fill: (gold as boolean | undefined) ? '#fbbf24' : 'none' }} />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>{value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search bar */}
            <form method="GET" action="/courses" style={{ flexShrink: 0, width: '17rem' }}>
              {category && <input type="hidden" name="category" value={category} />}
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }} />
                <input
                  type="text" name="q" defaultValue={q}
                  placeholder="Search courses, topics..."
                  style={{
                    width: '100%', paddingLeft: '2.25rem', paddingRight: '1rem', paddingBlock: '0.6rem',
                    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)',
                    borderRadius: '9999px', color: 'white', fontSize: '0.85rem', outline: 'none',
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <div className="container-app" style={{ paddingBlock: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <aside style={{
            width: 220,
            flexShrink: 0,
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-card)',
            position: 'sticky',
            top: '1.5rem',
          }}>
            <CoursesFilter activeCategory={category} q={q} />
          </aside>

          {/* Grid area */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Count + sort header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-foreground)' }}>
                {courses.length} Course{courses.length !== 1 ? 's' : ''}
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                fontSize: '0.875rem', color: 'var(--color-muted-foreground)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                padding: '0.375rem 0.75rem',
                background: 'var(--color-card)',
              }}>
                <span>Most Popular</span>
                <ChevronDown style={{ width: 14, height: 14 }} />
              </div>
            </div>

            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', paddingBlock: '5rem', color: 'var(--color-muted-foreground)' }}>
                <BookOpen style={{ width: 56, height: 56, margin: '0 auto 1.5rem', opacity: 0.2 }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>
                  No courses found
                </h2>
                <p style={{ fontSize: '0.9rem', maxWidth: '24rem', margin: '0 auto' }}>
                  {q ? `No courses match "${q}".` : 'Try a different category or check back soon.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.25rem' }}>
                {courses.map((course) => {
                  const Icon = (categoryIcons[course.category] ?? BookOpen) as ElementType;
                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      style={{
                        display: 'block',
                        background: 'var(--color-card)',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-card)',
                        textDecoration: 'none',
                        transition: 'box-shadow 0.2s, transform 0.2s',
                      }}
                      className="group hover:shadow-lg"
                    >
                      {/* Card header */}
                      <div style={{
                        aspectRatio: '16/9',
                        background: course.thumbnailUrl ? undefined : gradients[course.category],
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        {course.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={course.thumbnailUrl} alt={course.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Icon style={{ width: '2.75rem', height: '2.75rem', color: 'rgba(255,255,255,0.28)' }} />
                        )}

                        {course.isFree && (
                          <span style={{
                            position: 'absolute', top: '0.6rem', left: '0.6rem',
                            padding: '0.15rem 0.5rem',
                            background: '#16a34a',
                            color: '#fff',
                            borderRadius: '0.3rem',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                          }}>FREE</span>
                        )}

                        <span
                          className={getCategoryBadgeClass(course.category)}
                          style={{
                            position: 'absolute', top: '0.6rem', right: '0.6rem',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '0.3rem',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                          }}
                        >
                          {getCategoryLabel(course.category)}
                        </span>
                      </div>

                      {/* Card body */}
                      <div style={{ padding: '1rem' }}>
                        <h3
                          style={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            lineHeight: 1.4,
                            marginBottom: '0.4rem',
                            color: 'var(--color-foreground)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                          className="group-hover:text-[var(--color-accent)] transition-colors"
                        >
                          {course.title}
                        </h3>

                        {course.shortDesc && (
                          <p style={{
                            fontSize: '0.78rem',
                            color: 'var(--color-muted-foreground)',
                            marginBottom: '0.75rem',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {course.shortDesc}
                          </p>
                        )}

                        {/* Difficulty + rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <span
                            className={getDifficultyClass(course.difficulty)}
                            style={{
                              padding: '0.1rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                            }}
                          >
                            {getDifficultyLabel(course.difficulty)}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                            <Star style={{ width: 11, height: 11, fill: '#fbbf24', color: '#fbbf24' }} />
                            4.8
                          </span>
                        </div>

                        {/* Enrolled + price */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--color-border)',
                        }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                            {course._count.enrollments.toLocaleString()} enrolled
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                            {formatPrice(course.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FEATURE STRIP ───────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingBlock: '2.5rem', background: 'var(--color-background)' }}>
        <div className="container-app">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '2rem' }}>
            {[
              { icon: GraduationCap, color: '#7c3aed', title: 'Expert Instructors',  desc: 'Learn from IIT graduates and subject matter experts.' },
              { icon: BarChart2,     color: '#0891b2', title: 'Proven Results',      desc: '250K+ students with 220+ average score improvement.' },
              { icon: Monitor,       color: '#059669', title: 'Smart Learning',      desc: 'AI-powered analytics and personalized learning paths.' },
              { icon: Headphones,    color: '#d97706', title: 'Always Here',         desc: 'Doubt support via chat, email & WhatsApp.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{
                  width: 42, height: 42,
                  borderRadius: '0.625rem',
                  background: color + '1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon style={{ width: 20, height: 20, color }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-foreground)', marginBottom: '0.25rem' }}>{title}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ──────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
        paddingBlock: '2rem',
      }}>
        <div
          className="container-app"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '0.875rem',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <GraduationCap style={{ width: 28, height: 28, color: 'white' }} />
            </div>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.3rem' }}>
                Not sure which course is right for you?
              </h3>
              {/* <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}>
                Take our short quiz and get personalized course recommendations.
              </p> */}
            </div>
          </div>
          <Link
            href="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f59e0b',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Find My Perfect Course →
          </Link>
        </div>
      </div>

    </div>
  );
}
