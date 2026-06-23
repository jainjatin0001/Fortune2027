import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Star, TrendingUp, Trophy,
  BookOpen, Clock, GraduationCap, DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { formatPrice, getCategoryBadgeClass, getCategoryLabel } from '@/lib/utils';

const satGradient = 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)';
const SAT_COLOR = '#7c3aed';

export const metadata: Metadata = {
  title: 'SAT Preparation — EduReach',
  description:
    'Comprehensive SAT preparation with 1,400+ practice questions, 10 full-length mock tests, and a personalized study plan that helps you score higher.',
};

const benefits = [
  {
    icon: GraduationCap,
    title: 'Get Into Top Universities',
    desc: 'A higher SAT score can open doors to your dream colleges.',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    icon: Trophy,
    title: 'Stand Out in Admissions',
    desc: 'Show colleges your academic readiness and potential.',
    color: '#0891b2',
    bg: '#cffafe',
  },
  {
    icon: DollarSign,
    title: 'Earn More Scholarships',
    desc: 'Increase your chances of earning merit-based scholarships.',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    icon: Clock,
    title: 'Save Time & Money',
    desc: 'Get ahead in college and graduate on your terms.',
    color: '#059669',
    bg: '#d1fae5',
  },
];

const satSections = [
  {
    name: 'Evidence-Based Reading & Writing',
    icon: BookOpen,
    score: '200–800',
    topics: [
      'Reading Comprehension',
      'Writing & Language',
      'Cross-Test Skills',
      'Information & Ideas',
    ],
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    name: 'Math',
    icon: TrendingUp,
    score: '200–800',
    topics: [
      'Algebra',
      'Advanced Math',
      'Problem-Solving & Data Analysis',
      'Geometry & Trigonometry',
    ],
    color: '#4f46e5',
    bg: '#e0e7ff',
  },
];

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'High School Junior',
    flag: '🇺🇸',
    quote:
      'EduReach helped me improve my SAT score by 220 points. The practice tests were exactly like the real thing!',
  },
  {
    name: 'David M.',
    role: 'High School Senior',
    flag: '🇨🇦',
    quote:
      'The adaptive practice and score analytics helped me focus on my weak areas and hit my target score.',
  },
  {
    name: 'Jennifer L.',
    role: 'Parent',
    flag: '🇺🇸',
    quote:
      'Great platform! The live test interface made my daughter feel fully prepared and confident.',
  },
];

async function getSATCourses() {
  try {
    const rows = await prisma.course.findMany({
      where: {
        isPublished: true,
        program: { OR: [{ slug: { contains: 'sat' } }, { name: { contains: 'SAT' } }] },
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

export default async function SATPage() {
  const [user, satCourses] = await Promise.all([currentUser(), getSATCourses()]);
  const isSignedIn = !!user;

  return (
    <div style={{ background: 'var(--color-background)' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-bg py-16 overflow-hidden">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left: text */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{
                  background: 'rgba(167,139,250,0.15)',
                  color: '#c4b5fd',
                  border: '1px solid rgba(167,139,250,0.3)',
                }}
              >
                <Star className="h-3 w-3 fill-violet-400" />
                #1 SAT PREP PLATFORM FOR US &amp; CANADA STUDENTS
              </div>
              <h1 className="text-hero text-white mb-4">
                Conquer the SAT with{' '}
                <span style={{ color: '#a78bfa' }}>Expert Prep</span>
              </h1>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(203,213,225,0.85)' }}>
                Comprehensive SAT preparation with 1,400+ practice questions,
                10 full-length mock tests, and a personalized study plan
                that helps you score higher.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="font-bold text-white"
                    style={{ background: SAT_COLOR }}
                  >
                    Start SAT Prep Free <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard/sat-exam">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-bold bg-transparent text-white hover:bg-white/10"
                    style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    Take Practice Test
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-4">
                {[
                  { value: '+220', label: 'Avg Score Increase' },
                  { value: '1,400+', label: 'Practice Questions' },
                  { value: '10', label: 'Full-Length Tests' },
                  { value: '50,000+', label: 'Students Trusted' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-extrabold text-white leading-none">{stat.value}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'rgba(203,213,225,0.65)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: large SAT interface mockup */}
            <div className="hidden lg:block">
              {/* Laptop outer shell */}
              <div className="relative w-full">
                {/* Screen bezel */}
                <div
                  className="rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    border: '2px solid #334155',
                    background: '#0f172a',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Browser chrome */}
                  <div
                    className="flex items-center gap-1.5 px-4 py-2.5 border-b"
                    style={{ background: '#1e293b', borderColor: '#334155' }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <div
                      className="flex-1 h-5 rounded-md ml-3 flex items-center px-2 text-[10px]"
                      style={{ background: '#0f172a', color: '#475569' }}
                    >
                      edureach.com/sat-exam
                    </div>
                    <div
                      className="ml-2 px-2 py-0.5 rounded text-[9px] font-bold"
                      style={{ background: '#7c3aed', color: 'white' }}
                    >
                      LIVE
                    </div>
                  </div>

                  {/* SAT question interface */}
                  <div className="flex" style={{ height: '300px', background: '#f8fafc' }}>

                    {/* Left: question panel */}
                    <div className="flex-1 flex flex-col border-r" style={{ borderColor: '#e2e8f0' }}>
                      {/* Top bar */}
                      <div
                        className="flex items-center justify-between px-4 py-2 border-b"
                        style={{ background: '#fff', borderColor: '#e2e8f0' }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold" style={{ color: '#1e293b' }}>Reading & Writing</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                            Question 12 of 54
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded"
                          style={{ background: '#fef3c7', color: '#92400e' }}
                        >
                          ⏱ 00:38
                        </div>
                      </div>

                      {/* Passage excerpt */}
                      <div className="px-4 py-3 flex-1 overflow-hidden">
                        <p className="text-[9px] mb-2 font-semibold uppercase tracking-wide" style={{ color: '#7c3aed' }}>
                          Passage
                        </p>
                        <p className="text-[9px] leading-relaxed mb-3" style={{ color: '#374151' }}>
                          In the passage, the author suggests that the experimental results were significant because they challenged previous assumptions about cellular behavior under controlled conditions...
                        </p>

                        <p className="text-[9px] mb-2.5 font-medium" style={{ color: '#1e293b' }}>
                          Which choice best states the main purpose of the passage?
                        </p>

                        {/* Answer choices */}
                        <div className="space-y-1.5">
                          {[
                            { l: 'A', text: 'The method used in the study was overproportionate for the size' },
                            { l: 'B', text: 'The results of the study were more significant than expected', selected: true },
                            { l: 'C', text: 'Similar studies have produced conflicting results' },
                            { l: 'D', text: 'The sample size was too small to draw conclusions' },
                          ].map(({ l, text, selected }) => (
                            <div
                              key={l}
                              className="flex items-start gap-2 px-2.5 py-1.5 rounded-md text-[9px]"
                              style={{
                                background: selected ? '#ede9fe' : '#f1f5f9',
                                border: `1.5px solid ${selected ? '#7c3aed' : 'transparent'}`,
                                color: selected ? '#4c1d95' : '#475569',
                              }}
                            >
                              <span
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-px"
                                style={{
                                  background: selected ? '#7c3aed' : '#e2e8f0',
                                  color: selected ? 'white' : '#64748b',
                                }}
                              >
                                {l}
                              </span>
                              <span className="leading-relaxed">{text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom nav */}
                      <div
                        className="flex items-center justify-between px-4 py-2 border-t"
                        style={{ background: '#fff', borderColor: '#e2e8f0' }}
                      >
                        <button
                          className="text-[9px] px-3 py-1 rounded font-medium"
                          style={{ background: '#f1f5f9', color: '#64748b' }}
                        >
                          ← Prev
                        </button>
                        <span className="text-[9px]" style={{ color: '#94a3b8' }}>Time per question: 00:38</span>
                        <button
                          className="text-[9px] px-3 py-1 rounded font-medium text-white"
                          style={{ background: '#7c3aed' }}
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                    {/* Right: review panel */}
                    <div className="w-36 flex flex-col" style={{ background: '#fff' }}>
                      <div
                        className="px-3 py-2 border-b text-[9px] font-bold"
                        style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
                      >
                        Review
                      </div>
                      {/* Question grid */}
                      <div className="p-2 flex-1">
                        <div className="grid grid-cols-5 gap-1 mb-3">
                          {Array.from({ length: 20 }, (_, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded text-[8px] flex items-center justify-center font-bold"
                              style={{
                                background:
                                  i < 11
                                    ? '#7c3aed'
                                    : i === 11
                                    ? '#fef3c7'
                                    : '#f1f5f9',
                                color:
                                  i < 11
                                    ? 'white'
                                    : i === 11
                                    ? '#92400e'
                                    : '#94a3b8',
                              }}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        <div
                          className="text-[8px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: '#64748b' }}
                        >
                          Section Progress
                        </div>
                        <div className="h-1.5 rounded-full mb-1" style={{ background: '#e2e8f0' }}>
                          <div className="h-1.5 rounded-full" style={{ width: '54%', background: '#7c3aed' }} />
                        </div>
                        <div className="flex justify-between text-[8px]" style={{ color: '#94a3b8' }}>
                          <span>12/54</span>
                          <span>54%</span>
                        </div>
                      </div>
                      <div
                        className="p-2 border-t flex items-center gap-1.5"
                        style={{ borderColor: '#e2e8f0', background: '#f0fdf4' }}
                      >
                        <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                        <span className="text-[8px] font-medium" style={{ color: '#16a34a' }}>
                          You&apos;re on track!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop base */}
                <div
                  className="h-3 rounded-b-xl mx-2"
                  style={{ background: '#1e293b', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}
                />
                <div className="h-1.5 rounded-b w-32 mx-auto" style={{ background: '#334155' }} />
              </div>
            </div>

            {/* Right: score predictor card */}
            {/* <div className="flex-none lg:w-[220px] xl:w-[240px]">
              <div className="bg-white rounded-2xl shadow-2xl p-5">
                <p className="text-[10px] font-bold mb-3 uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                  Your SAT Score Predictor
                </p>
                <p className="text-[11px] mb-0.5" style={{ color: '#64748b' }}>Projected Score</p>
                <div className="text-5xl font-extrabold leading-none mb-1" style={{ color: '#1e40af' }}>
                  1520
                </div>
                <div
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold mb-1"
                  style={{ background: '#dcfce7', color: '#16a34a' }}
                >
                  <TrendingUp className="h-3 w-3 shrink-0" />
                  +280 Points
                </div>
                <p className="text-[10px] mb-4" style={{ color: '#94a3b8' }}>from 1240 to 1520</p>

                <div className="space-y-3 pt-3 border-t" style={{ borderColor: '#e2e8f0' }}>
                  {[
                    { name: 'Evidence-Based\nReading & Writing', score: 740, max: 800, color: '#7c3aed' },
                    { name: 'Math', score: 780, max: 800, color: '#4f46e5' },
                  ].map(({ name, score, max, color }) => (
                    <div key={name}>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span style={{ color: '#475569' }}>{name}</span>
                        <span className="font-bold" style={{ color: '#0f172a' }}>
                          {score} / {max}
                        </span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: '#e2e8f0' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${(score / max) * 100}%`, background: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-4 flex items-center gap-2 text-[11px] font-medium px-3 py-2 rounded-xl"
                  style={{ background: '#f0fdf4', color: '#16a34a' }}
                >
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  You&apos;re on the right track! 🎯
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </section>

      {/* ── WHY SAT PREP MATTERS ────────────────────────────────── */}
      <section className="section-padding-sm" style={{ background: 'var(--color-background)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="WHY SAT PREP MATTERS"
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

      {/* ── SAT STRUCTURE ────────────────────────────────────────── */}
      <section className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="SAT STRUCTURE"
            title="Two Sections. One Total Score."
            subtitle="Each section is scored 200–800 for a total score of 400–1600."
          />
          <div className="grid md:grid-cols-2 gap-8">
            {satSections.map((section) => (
              <div
                key={section.name}
                className="card-base p-8"
                style={{ borderTop: `3px solid ${section.color}` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: section.bg }}
                  >
                    <section.icon className="h-6 w-6" style={{ color: section.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: 'var(--color-foreground)' }}>
                      {section.name}
                    </h3>
                    <span className="text-sm font-semibold" style={{ color: section.color }}>
                      Score: {section.score}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {section.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-center gap-2.5 text-sm"
                      style={{ color: 'var(--color-muted-foreground)' }}
                    >
                      <CheckCircle className="h-4 w-4 shrink-0" style={{ color: section.color }} />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRY FULL SAT PRACTICE BANNER ─────────────────────────── */}
      <section
        className="py-14 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #4f46e5 120%)' }}
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
                    <div className="h-1.5 rounded w-2/3" style={{ background: '#7c3aed' }} />
                    <div className="h-1 rounded w-full" style={{ background: '#1e293b' }} />
                    <div className="h-1 rounded w-5/6" style={{ background: '#1e293b' }} />
                    <div className="h-1 rounded w-3/4" style={{ background: '#1e293b' }} />
                    <div className="flex gap-1.5 mt-1">
                      {['A', 'B', 'C', 'D'].map((l, idx) => (
                        <div
                          key={l}
                          className="flex-1 h-4 rounded flex items-center justify-center text-[7px] font-bold"
                          style={{
                            background: idx === 2 ? '#7c3aed' : '#1e293b',
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
                style={{ background: SAT_COLOR, color: 'white' }}
              >
                New
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Experience the Real SAT Test Interface
              </h2>
              <p className="text-base mb-5" style={{ color: 'rgba(203,213,225,0.85)' }}>
                Practice like the real exam with our official-style SAT test environment.
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
                    <CheckCircle className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <Link href={isSignedIn ? '/dashboard/sat-exam' : '/sign-up'}>
                <Button
                  size="lg"
                  className="font-semibold text-white whitespace-nowrap"
                  style={{ background: SAT_COLOR }}
                >
                  Try Full SAT Practice <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── SAT COURSES ──────────────────────────────────────────── */}
      {satCourses.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--color-background)' }}>
          <div className="container-app">
            <SectionHeader
              eyebrow="SAT COURSES"
              title="Expert-Built SAT Prep Courses"
              subtitle="Structured, comprehensive, and results-driven."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {satCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="card-base overflow-hidden group block"
                >
                  <div className="h-40 relative" style={{ background: satGradient }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white opacity-30" />
                    </div>
                    {course.isFree && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white bg-green-600">
                        FREE
                      </span>
                    )}
                    <span
                      className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getCategoryBadgeClass('SAT_PREP')}`}
                    >
                      {getCategoryLabel('SAT_PREP')}
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
                      <p
                        className="text-xs line-clamp-2 mb-4"
                        style={{ color: 'var(--color-muted-foreground)' }}
                      >
                        {course.shortDesc}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
                      >
                        {course.difficulty}
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />New
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between pt-4 border-t"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
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
            <div className="text-center mt-8">
              <Link href="/courses">
                <Button variant="outline" size="lg" className="gap-2">
                  View All SAT Courses <ArrowRight className="h-4 w-4" />
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
            title="What Students &amp; Parents Say"
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
                    style={{ background: satGradient }}
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

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      {/* <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #2e1065 100%)' }}
      >
        <div className="container-narrow text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)' }}
          >
            <Trophy className="h-7 w-7" style={{ color: '#a78bfa' }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Achieve Your Best SAT Score?
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(203,213,225,0.8)' }}>
            Start your SAT prep today and take the first step toward your dream college.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="font-semibold text-white"
                style={{ background: SAT_COLOR }}
              >
                Start SAT Prep Free
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold bg-transparent text-white hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

    </div>
  );
}
