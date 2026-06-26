import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  Play,
  FileText,
  HelpCircle,
  BarChart2,
  Globe,
  Tag,
  ChevronRight,
  ShieldCheck,
  ListChecks,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import {
  formatPrice,
  getDifficultyLabel,
  getCategoryLabel,
  getCategoryBadgeClass,
} from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CourseCurriculum } from './_components/CourseCurriculum';
import type { CourseCategory } from '@/types';

// ─── Meta parser ─────────────────────────────────────────────────────────────
const SEP = '---META---';

function parseMeta(description: string): { descText: string; meta: Record<string, string> } {
  const idx = description.indexOf(SEP);
  if (idx === -1) return { descText: description.trim(), meta: {} };
  const descText = description.slice(0, idx).trim();
  const meta: Record<string, string> = {};
  for (const line of description.slice(idx + SEP.length).split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const val = line.slice(colon + 1).trim();
    if (key && val) meta[key] = val;
  }
  return { descText, meta };
}

// ─── Meta key → display config ────────────────────────────────────────────────
// Add new keys here whenever you add them to a course description.
const META_CONFIG: Record<string, {
  statLabel: string;
  statValue: (v: string) => string;
  includeLabel: (v: string) => string;
  icon: React.ReactNode;
}> = {
  video_lessons: {
    statLabel: 'Video lessons',
    statValue: (v) => `${v}+`,
    includeLabel: (v) => `${v}+ video lessons`,
    icon: <Play className="h-4 w-4" />,
  },
  pdf_pages: {
    statLabel: 'PDF pages',
    statValue: (v) => v,
    includeLabel: (v) => `${v} PDF notes`,
    icon: <FileText className="h-4 w-4" />,
  },
  quizzes: {
    statLabel: 'Quizzes',
    statValue: (v) => v,
    includeLabel: (v) => `${v} quizzes`,
    icon: <HelpCircle className="h-4 w-4" />,
  },
  mock_tests: {
    statLabel: 'Mock tests',
    statValue: (v) => v,
    includeLabel: (v) => `${v} full-length mock tests`,
    icon: <BookOpen className="h-4 w-4" />,
  },
  question_sets: {
    statLabel: 'Question sets',
    statValue: (v) => v,
    includeLabel: (v) => `${v} question sets`,
    icon: <ListChecks className="h-4 w-4" />,
  },
  month_access: {
    statLabel: 'Months access',
    statValue: (v) => v,
    includeLabel: (v) => `${v} months access`,
    icon: <Clock className="h-4 w-4" />,
  },
};

// ─── Category hero gradients ─────────────────────────────────────────────────
const HERO_GRADIENTS: Record<string, string> = {
  SAT_PREP: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
  ACT_PREP: 'linear-gradient(135deg, #0c4a6e 0%, #0891b2 100%)',
  AP_EXAM: 'linear-gradient(135deg, #451a03 0%, #d97706 100%)',
  CODING: 'linear-gradient(135deg, #052e16 0%, #059669 100%)',
  HIGH_SCHOOL: 'linear-gradient(135deg, #4a044e 0%, #be185d 100%)',
  OTHER: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
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

// ─── DB fetch ────────────────────────────────────────────────────────────────
async function getCourse(slug: string) {
  try {
    return await prisma.course.findUnique({
      where: { slug, isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDesc: true,
        difficulty: true,
        price: true,
        comparePrice: true,
        isFree: true,
        objectives: true,
        requirements: true,
        tags: true,
        program: { select: { name: true, slug: true } },
        modules: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            title: true,
            assets: {
              where: { isPublished: true },
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                title: true,
                assetType: true,
                isFree: true,
                videoDuration: true,
              },
            },
          },
        },
        instructors: {
          orderBy: { isPrimary: 'desc' },
          take: 1,
          select: {
            instructor: {
              select: {
                name: true,
                title: true,
                bio: true,
                avatarUrl: true,
                credentials: true,
              },
            },
          },
        },
        _count: { select: { enrollments: true } },
      },
    });
  } catch {
    return null;
  }
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: 'Course Not Found' };
  return {
    title: `${course.title} | Delta Tutors`,
    description: course.shortDesc ?? course.description?.slice(0, 160),
  };
}

// ─── Static fallbacks ────────────────────────────────────────────────────────
const FALLBACK_OBJECTIVES = [
  'Master foundational concepts and build a strong academic base',
  'Solve practice problems aligned with real exam formats',
  'Apply core techniques with confidence through guided examples',
  'Develop effective study strategies for long-term retention',
  'Work through full-length practice tests with detailed walkthroughs',
  'Build exam-day confidence through structured review and mock tests',
];

const FALLBACK_MODULES = [
  {
    id: 'fm1',
    title: 'Module 1: Foundations',
    assets: [
      { id: 'fa1', title: 'Introduction & Course Overview', assetType: 'VIDEO', isFree: true, videoDuration: 600 },
      { id: 'fa2', title: 'Core Concepts — Part 1', assetType: 'VIDEO', isFree: true, videoDuration: 1260 },
      { id: 'fa3', title: 'Core Concepts — Part 2', assetType: 'VIDEO', isFree: false, videoDuration: 1020 },
      { id: 'fa4', title: 'Chapter Notes (PDF)', assetType: 'PDF', isFree: false, videoDuration: null },
      { id: 'fa5', title: 'Foundations Quiz', assetType: 'QUIZ', isFree: false, videoDuration: null },
    ],
  },
  {
    id: 'fm2',
    title: 'Module 2: Core Techniques',
    assets: [
      { id: 'fa6', title: 'Strategy Deep Dive', assetType: 'VIDEO', isFree: false, videoDuration: 1560 },
      { id: 'fa7', title: 'Worked Examples & Applications', assetType: 'VIDEO', isFree: false, videoDuration: 1800 },
      { id: 'fa8', title: 'Practice Problem Set', assetType: 'QUESTION_SET', isFree: false, videoDuration: null },
      { id: 'fa9', title: 'Module Notes (PDF)', assetType: 'PDF', isFree: false, videoDuration: null },
    ],
  },
  {
    id: 'fm3',
    title: 'Module 3: Advanced Topics',
    assets: [
      { id: 'fa10', title: 'Advanced Concepts Explained', assetType: 'VIDEO', isFree: false, videoDuration: 2100 },
      { id: 'fa11', title: 'Exam-Style Question Walkthrough', assetType: 'VIDEO', isFree: false, videoDuration: 1380 },
      { id: 'fa12', title: 'Advanced Notes & Summary', assetType: 'PDF', isFree: false, videoDuration: null },
      { id: 'fa13', title: 'Advanced Practice Set', assetType: 'QUESTION_SET', isFree: false, videoDuration: null },
    ],
  },
  {
    id: 'fm4',
    title: 'Module 4: Practice & Review',
    assets: [
      { id: 'fa14', title: 'Full-Length Practice Test', assetType: 'QUIZ', isFree: false, videoDuration: null },
      { id: 'fa15', title: 'Answer Walkthroughs — Video', assetType: 'VIDEO', isFree: false, videoDuration: 2700 },
      { id: 'fa16', title: 'Review Notes PDF', assetType: 'PDF', isFree: false, videoDuration: null },
    ],
  },
  {
    id: 'fm5',
    title: 'Module 5: Exam Preparation',
    assets: [
      { id: 'fa17', title: 'Exam Day Strategies & Tips', assetType: 'VIDEO', isFree: false, videoDuration: 960 },
      { id: 'fa18', title: 'Mock Exam — Full Length', assetType: 'QUIZ', isFree: false, videoDuration: null },
      { id: 'fa19', title: 'Final Summary & Review Notes', assetType: 'PDF', isFree: false, videoDuration: null },
    ],
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'David R.',
    rating: 5,
    text: 'The explanations are crystal clear and the practice questions are very similar to the real exam. Highly recommended!',
  },
  {
    id: 2,
    name: 'Sophie L.',
    rating: 5,
    text: 'The notes are incredibly detailed. The instructor breaks down complex topics in a very understandable way.',
  },
  {
    id: 3,
    name: 'Ethan W.',
    rating: 5,
    text: 'Well structured and easy to follow. I went from failing practice tests to scoring in the top 5%.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) notFound();

  const price = Number(course.price);
  const comparePrice = course.comparePrice ? Number(course.comparePrice) : null;
  const discountPct =
    comparePrice && comparePrice > price
      ? Math.round((1 - price / comparePrice) * 100)
      : null;

  const category = programSlugToCategory(course.program.slug);
  const heroGradient = HERO_GRADIENTS[category] ?? HERO_GRADIENTS.OTHER;

  const objectives = course.objectives.length > 0 ? course.objectives : FALLBACK_OBJECTIVES;
  const modules =
    course.modules.length > 0
      ? course.modules.map((m) => ({
          ...m,
          assets: m.assets.map((a) => ({ ...a, videoDuration: a.videoDuration ?? null })),
        }))
      : FALLBACK_MODULES;

  const instructor = course.instructors[0]?.instructor ?? null;

  const totalLessons = modules.reduce((s, m) => s + m.assets.length, 0);
  const enrollCount = course._count.enrollments;

  const { descText, meta } = parseMeta(course.description);

  const metaEntries = Object.entries(meta);

  const statItems = metaEntries.slice(0, 5).map(([key, val]) => {
    const cfg = META_CONFIG[key];
    return {
      value: cfg ? cfg.statValue(val) : val,
      label: cfg ? cfg.statLabel : key.replace(/_/g, ' '),
    };
  });

  const includeItems = metaEntries.map(([key, val]) => {
    const cfg = META_CONFIG[key];
    return {
      icon: cfg ? cfg.icon : <Tag className="h-4 w-4" />,
      label: cfg ? cfg.includeLabel(val) : `${key.replace(/_/g, ' ')}: ${val}`,
    };
  });

  return (
    <div style={{ background: 'var(--color-background)' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ background: heroGradient }} className="relative overflow-hidden">
        {/* Radial glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 50%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(circle at 90% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)',
          }}
        />
        <div className="container-app py-10 lg:py-14 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol
              className="flex items-center flex-wrap gap-1.5 text-sm"
              style={{ color: 'rgba(255,255,255,0.60)' }}
            >
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li><ChevronRight className="h-3.5 w-3.5" /></li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
              </li>
              <li><ChevronRight className="h-3.5 w-3.5" /></li>
              <li>
                <Link
                  href={`/${course.program.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {course.program.name}
                </Link>
              </li>
              <li><ChevronRight className="h-3.5 w-3.5" /></li>
              <li
                className="font-medium truncate max-w-[180px] sm:max-w-xs"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {course.title}
              </li>
            </ol>
          </nav>

          {/* Badge */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getCategoryBadgeClass(category)}`}
          >
            {getCategoryLabel(category)}
          </span>

          {/* Title */}
          <h1
            className="font-extrabold text-white mb-4 max-w-3xl leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: '1.2' }}
          >
            {course.title}
          </h1>

          {/* Short description */}
          {course.shortDesc && (
            <p
              className="text-lg max-w-2xl mb-6 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.82)' }}
            >
              {course.shortDesc}
            </p>
          )}

          {/* Meta row */}
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <Star className="h-4 w-4 fill-yellow-400/40 text-yellow-400/40" />
              </div>
              <span className="font-semibold text-white">4.8</span>
              <span>(342 reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{Math.max(enrollCount, 2450).toLocaleString()} students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4" />
              <span>{getDifficultyLabel(course.difficulty)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              <span>English</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Updated May 2024</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div className="container-app py-10 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">

            {/* Tags */}
            {course.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-4 w-4 shrink-0" style={{ color: 'var(--color-muted-foreground)' }} />
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* What You'll Learn */}
            <div
              className="rounded-xl border p-6 lg:p-8"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-card)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2 className="text-heading-3 mb-6" style={{ color: 'var(--color-foreground)' }}>
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 mt-0.5"
                      style={{ color: 'var(--color-success)' }}
                    />
                    <span className="text-sm leading-snug" style={{ color: 'var(--color-foreground)' }}>
                      {obj}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-heading-3" style={{ color: 'var(--color-foreground)' }}>
                  Course Curriculum
                </h2>
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  {modules.length} modules · {totalLessons} lessons
                </span>
              </div>
              <CourseCurriculum modules={modules} />
            </div>

            {/* Requirements */}
            {course.requirements.length > 0 && (
              <div>
                <h2 className="text-heading-3 mb-4" style={{ color: 'var(--color-foreground)' }}>
                  Requirements
                </h2>
                <ul className="space-y-2.5">
                  {course.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                        style={{ background: 'var(--color-primary)' }}
                      />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About This Course */}
            <div>
              <h2 className="text-heading-3 mb-4" style={{ color: 'var(--color-foreground)' }}>
                About This Course
              </h2>
              <div className="space-y-3">
                {descText
                  .split('\n')
                  .filter(Boolean)
                  .map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      {para}
                    </p>
                  ))}
              </div>
            </div>

            {/* Course Stats Bar */}
            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-background-alt)',
              }}
            >
              <div className="grid gap-4 text-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))' }}>
                {statItems.map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="text-xl font-extrabold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--color-muted-foreground)' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div>
              <h2 className="text-heading-3 mb-5" style={{ color: 'var(--color-foreground)' }}>
                Your Instructor
              </h2>
              <div
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-card)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xl"
                    style={{
                      background: heroGradient,
                      minWidth: '4rem',
                      minHeight: '4rem',
                    }}
                  >
                    {(instructor?.name ?? 'Dr. Sarah Johnson').charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-lg leading-tight"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      {instructor?.name ?? 'Dr. Sarah Johnson'}
                    </h3>
                    <p
                      className="text-sm mb-4 mt-0.5"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {instructor?.title ?? `${getCategoryLabel(category)} Expert`}
                    </p>

                    {/* Credentials */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
                      {(
                        instructor?.credentials?.length
                          ? instructor.credentials
                          : [
                              '12+ years teaching experience',
                              '18,000+ students taught',
                              'Former AP Exam grader',
                            ]
                      ).map((cred, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-sm"
                          style={{ color: 'var(--color-muted-foreground)' }}
                        >
                          <CheckCircle2
                            className="h-4 w-4 shrink-0"
                            style={{ color: 'var(--color-success)' }}
                          />
                          {cred}
                        </div>
                      ))}
                    </div>

                    {instructor?.bio && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--color-muted-foreground)' }}
                      >
                        {instructor.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Reviews */}
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <h2 className="text-heading-3" style={{ color: 'var(--color-foreground)' }}>
                  What Students Say
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span
                    className="text-2xl font-extrabold"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    4.8
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                    (342 reviews)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TESTIMONIALS.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border p-5 flex flex-col gap-3"
                    style={{
                      borderColor: 'var(--color-border)',
                      background: 'var(--color-card)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p
                      className="text-sm leading-relaxed flex-1"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      "{t.text}"
                    </p>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: 'var(--color-muted-foreground)' }}
                    >
                      — {t.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ────────────────────────────────────── */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
            <div
              className="sticky"
              style={{ top: 'calc(var(--nav-height) + 1.5rem)' }}
            >
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-card)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                {/* Preview thumbnail */}
                <div
                  className="h-48 relative overflow-hidden flex items-center justify-center"
                  style={{ background: heroGradient }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: 'rgba(0,0,0,0.22)' }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/40 bg-white/15 backdrop-blur-sm">
                      <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                    </div>
                    <span className="text-sm font-semibold text-white drop-shadow">
                      Preview this course
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="flex items-center flex-wrap gap-2.5 mb-5">
                    <span
                      className="text-3xl font-extrabold"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      {formatPrice(price)}
                    </span>
                    {comparePrice && comparePrice > price && (
                      <>
                        <span
                          className="text-base font-medium line-through"
                          style={{ color: 'var(--color-muted-foreground)' }}
                        >
                          {formatPrice(comparePrice)}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-bold text-white"
                          style={{ background: 'var(--color-danger)' }}
                        >
                          {discountPct}% OFF
                        </span>
                      </>
                    )}
                    {course.isFree && (
                      <span className="px-2.5 py-0.5 rounded-md text-sm font-bold text-white bg-green-600">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3 mb-5">
                    <Button
                      className="w-full h-12 text-base font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      {course.isFree ? 'Enroll for Free' : 'Enroll Now'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-11 font-medium"
                    >
                      Add to Wishlist
                    </Button>
                  </div>

                  {/* Guarantee */}
                  <p
                    className="text-xs text-center mb-5 flex items-center justify-center gap-1.5"
                    style={{ color: 'var(--color-muted-foreground)' }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    30-Day Money-Back Guarantee
                  </p>

                  {/* Divider */}
                  <div
                    className="border-t mb-5"
                    style={{ borderColor: 'var(--color-border)' }}
                  />

                  {/* Course includes */}
                  <h4
                    className="text-sm font-semibold mb-4"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    This course includes:
                  </h4>
                  <ul className="space-y-3">
                    {includeItems.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        <span style={{ color: 'var(--color-muted-foreground)' }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE STICKY BOTTOM BAR ──────────────────────────────────────── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t px-4 py-3"
        style={{
          background: 'var(--color-card)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 -4px 16px rgb(0 0 0 / 0.08)',
        }}
      >
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div>
            <div
              className="text-xl font-extrabold leading-tight"
              style={{ color: 'var(--color-foreground)' }}
            >
              {formatPrice(price)}
            </div>
            {comparePrice && comparePrice > price && (
              <div
                className="text-xs line-through leading-tight"
                style={{ color: 'var(--color-muted-foreground)' }}
              >
                {formatPrice(comparePrice)}
              </div>
            )}
          </div>
          <Button
            className="flex-1 font-bold text-white h-11"
            style={{ background: 'var(--gradient-primary)' }}
          >
            {course.isFree ? 'Enroll Free' : 'Enroll Now'}
          </Button>
        </div>
      </div>

      {/* Bottom padding for mobile bar */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
