import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Clock, Trophy, BookOpen, Star,
  TrendingUp, PenTool, ClipboardList,
  BarChart3, Target, Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { formatPrice, getCategoryBadgeClass, getCategoryLabel } from '@/lib/utils';

const actGradient = 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)';

export const metadata: Metadata = {
  title: 'ACT Preparation — Delta Tutors',
  description:
    'Comprehensive ACT prep for all four sections — English, Math, Reading, and Science. Improve your score and open doors to top universities.',
};

const actSections = [
  {
    name: 'English',
    letter: 'E',
    questions: 75,
    minutes: 45,
    topics: ['Usage & Mechanics', 'Rhetorical Skills', 'Punctuation', 'Strategy'],
    color: '#0891b2',
  },
  {
    name: 'Math',
    letter: 'M',
    questions: 60,
    minutes: 60,
    topics: ['Pre-Algebra', 'Algebra', 'Geometry', 'Trigonometry'],
    color: '#7c3aed',
  },
  {
    name: 'Reading',
    letter: 'R',
    questions: 40,
    minutes: 35,
    topics: ['Key Ideas', 'Craft & Structure', 'Integration of Knowledge', 'Strategy'],
    color: '#b45309',
  },
  {
    name: 'Science',
    letter: 'S',
    questions: 40,
    minutes: 35,
    topics: ['Data Interpretation', 'Research Summaries', 'Conflicting Viewpoints', 'Strategy'],
    color: '#059669',
  },
];

const benefits = [
  {
    icon: Trophy,
    title: 'Increase Scholarship Chances',
    desc: 'A higher ACT score can help you earn more merit scholarships.',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    icon: Building2,
    title: 'Stand Out in Admissions',
    desc: 'Show colleges your readiness and academic potential.',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    icon: TrendingUp,
    title: 'More College Options',
    desc: 'Strengthen your application to competitive universities.',
    color: '#0891b2',
    bg: '#cffafe',
  },
  {
    icon: Clock,
    title: 'Save Time & Money',
    desc: 'Get ahead in college and graduate on your terms.',
    color: '#059669',
    bg: '#d1fae5',
  },
];

const steps = [
  {
    icon: BookOpen,
    label: 'Learn',
    desc: 'Concept-based lessons built for the ACT.',
    color: '#0891b2',
    bg: '#cffafe',
  },
  {
    icon: PenTool,
    label: 'Practice',
    desc: 'Targeted questions to build speed and accuracy.',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    icon: ClipboardList,
    label: 'Full-Length Tests',
    desc: 'Real ACT tests under timed conditions.',
    color: '#b45309',
    bg: '#fef3c7',
  },
  {
    icon: BarChart3,
    label: 'Review & Improve',
    desc: 'Detailed explanations and performance analytics.',
    color: '#059669',
    bg: '#d1fae5',
  },
  {
    icon: Target,
    label: 'Increase Your Score',
    desc: 'Track progress and hit your target score.',
    color: '#e11d48',
    bg: '#ffe4e6',
  },
];

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'High School Junior',
    flag: '🇺🇸',
    quote:
      'Delta Tutors helped me improve my ACT score by 6 points. The practice tests are just like the real thing!',
  },
  {
    name: 'David M.',
    role: 'High School Senior',
    flag: '🇨🇦',
    quote:
      'The detailed questions and score analytics helped me understand my weak areas perfectly.',
  },
  {
    name: 'Jennifer L.',
    role: 'Parent',
    flag: '🇺🇸',
    quote:
      "Great platform! My son scored 31 composite and got into his dream university.",
  },
];

async function getACTCourses() {
  try {
    const rows = await prisma.course.findMany({
      where: {
        isPublished: true,
        program: { OR: [{ slug: { contains: 'act' } }, { name: { contains: 'ACT' } }] },
      },
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
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      take: 6,
    });
    return rows.map((c) => ({ ...c, price: Number(c.price) }));
  } catch {
    return [];
  }
}

export default async function ACTPage() {
  const [user, actCourses] = await Promise.all([currentUser(), getACTCourses()]);
  const isSignedIn = !!user;

  return (
    <div style={{ background: 'var(--color-background)' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-bg py-20 overflow-hidden">
        <div className="container-app">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-8">

            {/* Left: text */}
            <div className="flex-1 min-w-0">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{
                  background: 'rgba(56,189,248,0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56,189,248,0.25)',
                }}
              >
                <Star className="h-3 w-3 fill-sky-400" />
                #1 ACT PREP PLATFORM FOR US &amp; CANADA STUDENTS
              </div>
              <h1 className="text-hero text-white mb-5">
                Ace the ACT with{' '} <br></br>
                <span style={{ color: '#38bdf8' }}>Targeted Preparation.</span>
              </h1>
              <p className="text-body-lg mb-8" style={{ color: 'rgba(203,213,225,0.85)' }}>
                Comprehensive ACT prep for all four sections — English, Math, Reading,
                and Science. <br></br>
                Improve your score and open doors to top universities.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="font-bold"
                    style={{ background: '#0891b2', color: 'white' }}
                  >
                    Start ACT Prep Free <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard/act-exam">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-bold bg-transparent text-white hover:bg-white/10"
                    style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    Take Practice Exam
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  '+6 Avg. Composite Improvement',
                  '800+ Practice Questions',
                  '8 Full-Length ACTs',
                  'Trusted by Students',
                ].map((stat) => (
                  <div
                    key={stat}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'rgba(203,213,225,0.85)' }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                    {stat}
                  </div>
                ))}
              </div>
            </div>

            {/* Center: target illustration with floating subject icons */}
            <div
              className="hidden lg:flex flex-shrink-0 relative items-center justify-center"
              style={{ width: '350px', height: '350px' }}
            >
              {/* Ring 1 — outermost */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: '1.5px dashed rgba(255,255,255,0.18)' }}
              />
              {/* Ring 2 — new middle ring */}
              <div
                className="absolute rounded-full"
                style={{ inset: '40px', border: '1px dashed rgba(255,255,255,0.12)' }}
              />
              {/* Ring 3 — inner */}
              <div
                className="absolute rounded-full"
                style={{ inset: '80px', border: '1px dashed rgba(255,255,255,0.07)' }}
              />

              

              {/* Bullseye */}
              <div
                className="w-[120px] h-[120px] rounded-full flex items-center justify-center shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                <div
                  className="w-[88px] h-[88px] rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)' }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #38bdf8 100%)' }}
                  >
                    <Target className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>

              {/* English — top-left */}
              <div className="absolute top-5 left-8 flex flex-col items-center gap-1 z-10">
                <div
                  className="w-13 h-13 rounded-xl shadow-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                >
                  <BookOpen className="h-5 w-5" style={{ color: '#0891b2' }} />
                </div>
                <span className="text-[11px] font-semibold text-white">English</span>
              </div>

              {/* Math — top-right */}
              <div className="absolute top-5 right-8 flex flex-col items-center gap-1 z-10">
                <div
                  className="w-13 h-13 rounded-xl shadow-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                >
                  <BarChart3 className="h-5 w-5" style={{ color: '#7c3aed' }} />
                </div>
                <span className="text-[11px] font-semibold text-white">Math</span>
              </div>

              {/* Reading — bottom-left */}
              <div className="absolute bottom-5 left-8 flex flex-col items-center gap-1">
                <div
                  className="w-13 h-13 rounded-xl shadow-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                >
                  <ClipboardList className="h-5 w-5" style={{ color: '#b45309' }} />
                </div>
                <span className="text-[11px] font-semibold text-white">Reading</span>
              </div>

              {/* Science — bottom-right */}
              <div className="absolute bottom-5 right-8 flex flex-col items-center gap-1">
                <div
                  className="w-13 h-13 rounded-xl shadow-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                >
                  <TrendingUp className="h-5 w-5" style={{ color: '#059669' }} />
                </div>
                <span className="text-[11px] font-semibold text-white">Science</span>
              </div>
            </div>

            {/* Right: score report card */}
            {/* <div className="flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-2xl p-5 w-60">
                <p className="text-sm font-semibold mb-3" style={{ color: '#0f172a' }}>
                  ACT Score Report
                </p>

                <div className="flex justify-center mb-3">
                  <svg viewBox="0 0 120 120" className="w-[108px] h-[108px]">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="9" />
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke="#0891b2"
                      strokeWidth="9"
                      strokeDasharray="314.16"
                      strokeDashoffset="43.7"
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                    <text x="60" y="56" textAnchor="middle" fontSize="28" fontWeight="700" fill="#0f172a">
                      31
                    </text>
                    <text x="60" y="72" textAnchor="middle" fontSize="8" fill="#64748b">
                      Composite Score
                    </text>
                  </svg>
                </div>

                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium mb-3"
                  style={{ background: '#dcfce7', color: '#16a34a' }}
                >
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  You&apos;re on the right track!
                </div>

                <div className="space-y-2 pt-3 border-t" style={{ borderColor: '#e2e8f0' }}>
                  {[
                    { name: 'English', score: 30 },
                    { name: 'Math', score: 32 },
                    { name: 'Reading', score: 31 },
                    { name: 'Science', score: 30 },
                  ].map(({ name, score }) => (
                    <div key={name} className="flex items-center justify-between text-sm">
                      <span style={{ color: '#64748b' }}>{name}</span>
                      <span className="font-semibold" style={{ color: '#0f172a' }}>{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </section>

      {/* ── WHY ACT PREP MATTERS ─────────────────────────────────── */}
      <section className="section-padding-sm" style={{ background: 'var(--color-background)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="WHY ACT PREP MATTERS"
            title="A Higher Score. More Opportunities."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card-base p-6 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: bg }}
                >
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
                  {title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACT STRUCTURE ────────────────────────────────────────── */}
      <section className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="ACT STRUCTURE"
            title="Four Sections. One Composite Score."
            subtitle="Each section is scored 1–36. Your composite score is the average of all four."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actSections.map((s) => (
              <div key={s.name} className="card-base p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-bold text-white text-sm"
                  style={{ background: s.color }}
                >
                  {s.letter}
                </div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--color-foreground)' }}>
                  {s.name}
                </h3>
                <p
                  className="text-xs mb-3 flex items-center gap-1.5"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  <span>{s.questions} Questions</span>
                  <span>•</span>
                  <span>{s.minutes} min</span>
                </p>
                <ul className="space-y-1.5">
                  {s.topics.map((t) => (
                    <li
                      key={t}
                      className="text-xs flex items-center gap-1.5"
                      style={{ color: 'var(--color-muted-foreground)' }}
                    >
                      <CheckCircle className="h-3 w-3 shrink-0" style={{ color: s.color }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOUR PATH ────────────────────────────────────────────── */}
      <section className="section-padding-sm" style={{ background: 'var(--color-background)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="YOUR PATH TO A HIGHER SCORE"
            title="A Simple Plan for ACT Success"
          />
          <div className="relative">
            {/* Horizontal connecting line through circle centers */}
            <div
              className="hidden lg:block absolute h-0.5 z-0"
              style={{
                top: '48px',
                left: '10%',
                right: '10%',
                background: 'var(--color-border)',
              }}
            />
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">
              {steps.map((step, i) => (
                <div
                  key={step.label}
                  className="flex flex-col items-center text-center flex-1 px-2 relative z-10"
                >
                  {/* Numbered circle */}
                  <div
                    className="w-24 h-24 rounded-full relative flex items-center justify-center mb-4"
                    style={{
                      background: step.bg,
                      border: `2.5px solid ${step.color}`,
                    }}
                  >
                    {/* <span
                      className="absolute top-3 left-4 text-xs font-bold leading-none"
                      style={{ color: step.color }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span> */}
                    <step.icon className="h-8 w-8 mt-2" style={{ color: step.color }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>
                    {step.label}
                  </p>
                  <p
                    className="text-xs leading-relaxed max-w-[130px]"
                    style={{ color: 'var(--color-muted-foreground)' }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRY FULL ACT PRACTICE BANNER ─────────────────────────── */}
      <section
        className="py-14 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0284c7 120%)' }}
      >
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

            {/* Laptop mockup */}
            <div className="hidden md:block flex-shrink-0">
              <div className="relative w-52">
                <div
                  className="w-52 h-32 rounded-t-xl border-2 flex flex-col overflow-hidden"
                  style={{ borderColor: '#334155', background: '#0f172a' }}
                >
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 border-b"
                    style={{ background: '#1e293b', borderColor: '#334155' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500/70" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                    <div className="w-2 h-2 rounded-full bg-green-500/70" />
                    <div className="flex-1 h-3 rounded ml-2" style={{ background: '#334155' }} />
                  </div>
                  <div className="flex-1 p-2.5 flex flex-col gap-1.5">
                    <div className="h-1.5 rounded w-2/3" style={{ background: '#0891b2' }} />
                    <div className="h-1 rounded w-full" style={{ background: '#1e293b' }} />
                    <div className="h-1 rounded w-5/6" style={{ background: '#1e293b' }} />
                    <div className="h-1 rounded w-3/4" style={{ background: '#1e293b' }} />
                    <div className="flex gap-1.5 mt-1">
                      {['A', 'B', 'C', 'D'].map((l, idx) => (
                        <div
                          key={l}
                          className="flex-1 h-4 rounded flex items-center justify-center text-[7px] font-bold"
                          style={{
                            background: idx === 2 ? '#0891b2' : '#1e293b',
                            color: idx === 2 ? 'white' : '#64748b',
                          }}
                        >
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-56 h-2 -ml-2 rounded-b-lg" style={{ background: '#1e293b' }} />
                <div className="w-24 h-1.5 mx-auto rounded-b" style={{ background: '#334155' }} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-3"
                style={{ background: '#0891b2', color: 'white' }}
              >
                New
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Experience the Real ACT Test Interface
              </h2>
              <p className="text-base mb-5" style={{ color: 'rgba(203,213,225,0.85)' }}>
                Practice like the real exam with our official-style ACT test environment.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-start">
                {[
                  'Real Exam Interface',
                  'Timed Section Tests',
                  'Instant Results',
                  'Detailed Explanations',
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-1.5 text-sm"
                    style={{ color: 'rgba(203,213,225,0.85)' }}
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <Link href={isSignedIn ? '/dashboard/act-exam' : '/sign-up'}>
                <Button
                  size="lg"
                  className="font-semibold text-white whitespace-nowrap"
                  style={{ background: '#0891b2' }}
                >
                  Try Full ACT Practice <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── ACT COURSES ──────────────────────────────────────────── */}
      {actCourses.length > 0 && (
      <section className="section-padding-sm" style={{ background: 'var(--color-background)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="ACT COURSES"
            title="Expert-Built ACT Prep Courses"
            subtitle="Structured, comprehensive, and results-driven."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="card-base overflow-hidden group block">
                <div className="h-40 relative" style={{ background: actGradient }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white opacity-30" />
                  </div>
                  {course.isFree && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white bg-green-600">FREE</span>
                  )}
                  <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getCategoryBadgeClass('ACT_PREP')}`}>
                    {getCategoryLabel('ACT_PREP')}
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
              <Button variant="outline" size="lg" className="gap-2">
                View All ACT Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="STUDENTS ACHIEVE. WE'RE PROUD."
            title="What Students & Parents Say"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, flag, quote }) => (
              <div key={name} className="card-base p-6 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-5 flex-1"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: actGradient }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                      {name}
                    </p>
                    <p
                      className="text-xs flex items-center gap-1"
                      style={{ color: 'var(--color-muted-foreground)' }}
                    >
                      {role} <span>{flag}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

    </div>
  );
}
