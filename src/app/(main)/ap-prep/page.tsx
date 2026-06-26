import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, BookOpen, Star, Trophy,
  GraduationCap, Target, Brain, TrendingUp, Award,
  Clock, FileText,
} from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { prisma } from '@/lib/prisma';
import { formatPrice, getCategoryBadgeClass, getCategoryLabel } from '@/lib/utils';

const apGradient = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
const AP_AMBER = '#d97706';
const AP_AMBER_DARK = '#b45309';
const AP_AMBER_LIGHT = '#fef3c7';

export const metadata: Metadata = {
  title: 'AP Exam Preparation | Delta Tutors',
  description: 'Comprehensive AP preparation for 20+ subjects. 98% pass rate among Delta Tutors students.',
};

const whyReasons = [
  { icon: Award,        title: 'Earn College Credit',     desc: 'Get credit for college courses and save thousands in tuition.' },
  { icon: Trophy,       title: 'Stand Out in Admissions', desc: "Show colleges you're ready for academic challenges." },
  { icon: Brain,        title: 'Challenge Yourself',      desc: 'Build confidence and master college-level material early.' },
  { icon: GraduationCap, title: 'Get Ahead in College',  desc: 'Skip intro courses and focus on what matters.' },
];

const roadmapSteps = [
  { step: 1, title: 'Learn',            desc: 'Study concept-based lessons at your pace.',               icon: BookOpen   },
  { step: 2, title: 'Practice',         desc: 'Solve topic-wise questions and build accuracy.',           icon: Target     },
  { step: 3, title: 'Mock Exams',       desc: 'Take full-length practice tests under timed conditions.',  icon: FileText   },
  { step: 4, title: 'Review & Improve', desc: 'Analyze performance and strengthen weak areas.',           icon: TrendingUp },
  { step: 5, title: 'Score 4 or 5',    desc: 'Achieve your target score and earn college credit.',       icon: Trophy     },
];


const scoreReportSubjects = [
  { name: 'Calculus AB',      score: 5 },
  { name: 'Physics C',        score: 5 },
  { name: 'Biology',          score: 5 },
  { name: 'English Language', score: 4 },
  { name: 'US History',       score: 5 },
];

const testimonials = [
  {
    quote: 'Delta Tutors helped me score a 5 in AP Calculus AB. The practice tests were incredibly close to the real exam!',
    name: 'Sarah J.',    role: 'High School Student', flag: '🇺🇸', avatar: 'SJ',
  },
  {
    quote: 'I earned 12 college credits with AP Physics C & Calculus AB. It saved me both time and money.',
    name: 'David M.',   role: 'College Freshman',    flag: '🇨🇦', avatar: 'DM',
  },
  {
    quote: 'Great platform! My daughter is more confident and independent in her studies now.',
    name: 'Jennifer L.', role: 'Parent',             flag: '🇺🇸', avatar: 'JL',
  },
];

const practiceFeatures = [
  { icon: CheckCircle, text: '1000+ Practice Questions' },
  { icon: CheckCircle, text: 'Topic-wise & Exam-based'  },
  { icon: Clock,       text: 'Timed Practice Mode'      },
  { icon: FileText,    text: 'Detailed Explanations'    },
];

const sampleOptions = [
  { label: 'A', text: 'x² − 2' },
  { label: 'B', text: 'x² + 2', correct: true },
  { label: 'C', text: 'x² − 4' },
  { label: 'D', text: 'x² + 4' },
];

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
      take: 4,
    });
    return rows.map((c) => ({ ...c, price: Number(c.price) }));
  } catch {
    return [];
  }
}

export default async function APPage() {
  const [user, apCourses] = await Promise.all([currentUser(), getAPCourses()]);
  const isSignedIn = !!user;
  const practiceHref = isSignedIn ? '/dashboard' : '/sign-up';

  return (
    <div style={{ background: 'var(--color-background)' }}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        className="py-16 overflow-hidden"
        style={{
          backgroundColor: 'var(--color-background-alt)',
          backgroundImage:
            'radial-gradient(ellipse at 68% 50%, rgba(37,99,235,0.09) 0%, transparent 56%),' +
            'radial-gradient(circle, var(--color-border) 1.5px, transparent 1.5px)',
          backgroundSize: 'auto, 24px 24px',
        }}
      >
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Left copy ── */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: AP_AMBER_LIGHT, color: AP_AMBER_DARK }}>
                <Star className="h-3.5 w-3.5 fill-current" />
                #1 AP PREP PLATFORM FOR US &amp; CANADA STUDENTS
              </div>

              <h1 className="text-hero mb-5" style={{ color: 'var(--color-foreground)' }}>
                Earn College Credit with{' '}
                <span style={{ color: AP_AMBER }}>5-Score Prep.</span>
              </h1>

              <p className="text-body-lg mb-8" style={{ color: 'var(--color-muted-foreground)' }}>
                Expert-designed AP preparation for 20+ subjects. Our students achieve a 98% pass rate and a 67% rate of scoring a 5.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/courses">
                  <Button size="lg" className="font-semibold text-white"
                    style={{ background: 'var(--color-foreground)' }}>
                    Explore Courses <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href={practiceHref}>
                  <Button size="lg" variant="outline">Try Free Practice</Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6">
                {['20+ AP Subjects', '98% Pass Rate', '67% Score a 5'].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--color-muted-foreground)' }}>
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-success)' }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right  —  floating score card ── */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md">

                {/* Graduation cap — TODO: replace with proper 3D asset */}
                {/* <div className="absolute pointer-events-none z-20" style={{ top: '-4.5rem', right: '-1.5rem' }}>
                  <GraduationCap
                    style={{ width: 160, height: 160, fill: '#1e3272', color: '#142254' }}
                    strokeWidth={0.4}
                  />
                </div> */}

                {/* Score Report Card */}
                <div
                  className="relative z-10 rounded-2xl bg-white px-6 py-10"
                  style={{
                    boxShadow: '0 12px 40px -8px rgba(0,0,0,0.15), 0 4px 12px -4px rgba(0,0,0,0.10)',
                    border: '1px solid #f0f0f0',
                  }}
                >
                  <p className="text-md font-bold mb-6" style={{ color: 'var(--color-foreground)' }}>
                    AP Score Report
                  </p>

                  <div className="flex gap-6 items-center mb-8">
                    {/* Big score circle */}
                    <div className="relative shrink-0 flex flex-col items-center">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-white font-black"
                        style={{ background: apGradient, fontSize: '2.5rem' }}
                      >
                        5
                      </div>
                      <span
                        className="mt-3 px-3 py-1 rounded-full text-[10px] font-bold text-white whitespace-nowrap"
                        style={{ background: '#16a34a' }}
                      >
                        Congratulations!
                      </span>
                    </div>

                    {/* Subject scores */}
                    <div className="flex-1 space-y-3">
                      {scoreReportSubjects.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-md">
                          <span style={{ color: '#64748b' }}>{s.name}</span>
                          <span className="font-bold"
                            style={{ color: s.score === 5 ? AP_AMBER : '#0f172a' }}>
                            {s.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* College Credit Earned badge */}
                  <div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                    style={{ background: '#dcfce7', color: '#16a34a' }}
                  >
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    College Credit Earned
                  </div>
                </div>

                {/* Trophy — bottom-right, standalone amber icon */}
                <div
                  className="absolute -bottom-6 -right-4 w-14 h-14 rounded-2xl flex items-center justify-center z-20"
                  style={{ background: apGradient, boxShadow: '0 4px 16px rgba(180,83,9,0.35)' }}
                >
                  <Trophy className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY AP EXAMS MATTER
      ══════════════════════════════════════════ */}
      <section className="py-14" style={{ background: 'var(--color-background)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="Why AP Exams Matter"
            title="Get Ahead. Save Time. Stand Out."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyReasons.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-base p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: AP_AMBER_LIGHT, color: AP_AMBER }}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          AP SUCCESS ROADMAP
      ══════════════════════════════════════════ */}
      <section className="py-14" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="Your Path to Success"
            title="The AP Success Roadmap"
          />
          <div className="relative grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-px"
              style={{ background: 'var(--color-border)', zIndex: 0 }} />
            {roadmapSteps.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative flex flex-col items-center text-center z-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--color-card)', border: `2px solid ${AP_AMBER}`, color: AP_AMBER }}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold mb-1" style={{ color: AP_AMBER }}>
                  {step < 10 ? `0${step}` : step}
                </span>
                <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>{title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          AP SCORES THAT OPEN DOORS  —  commented out, to be redesigned
      ══════════════════════════════════════════ */}
      {/* <section className="py-14" style={{ background: 'var(--color-background)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="Earn College Credit"
            title="AP Scores That Open Doors"
            subtitle="Top colleges accept AP scores for credit and placement."
          />
          <div className="card-base overflow-hidden">
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x"
              style={{ borderColor: 'var(--color-border)' }}>
              <div className="p-6 flex flex-col justify-center gap-1.5 lg:w-52 shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>AP Calculus AB</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: '#dcfce7', color: '#16a34a' }}>
                    <CheckCircle className="h-3 w-3" /> Score 5
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Potential College Credit</p>
              </div>
              <div className="flex-1 p-6 flex flex-wrap items-center gap-5 justify-center">
                {colleges.map((c) => (
                  <div key={c.name} className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs"
                      style={{ background: c.bg, color: c.color, border: `1.5px solid ${c.color}22` }}>
                      {c.abbr}
                    </div>
                    <span className="text-[10px] text-center leading-snug max-w-[64px]"
                      style={{ color: 'var(--color-muted-foreground)' }}>
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center lg:w-44 shrink-0"
                style={{ background: 'var(--color-background-alt)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Average Credits Earned</p>
                <p className="text-5xl font-black leading-none mb-1" style={{ color: 'var(--color-foreground)' }}>3–8</p>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>credits</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--color-muted-foreground)' }}>depending on score and university</p>
              </div>
            </div>
            <div className="px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-background-alt)' }}>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                Check your target colleges for their AP credit policy.
              </p>
              <Link href="/courses">
                <Button variant="outline" size="sm" className="gap-1.5 whitespace-nowrap text-xs">
                  View College Credit Policies <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════
          EXPERT-BUILT AP COURSES
      ══════════════════════════════════════════ */}
      {apCourses.length > 0 && (
        <section id="ap-courses" className="py-14" style={{ background: 'var(--color-background)' }}>
          <div className="container-app">
            <SectionHeader
              eyebrow="AP Courses"
              title="Expert-Built AP Courses"
              subtitle="Structured, aligned, and exam-ready."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Button variant="outline" size="lg" className="gap-2">
                  View All AP Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          PRACTICE & IMPROVE
      ══════════════════════════════════════════ */}
      <section className="py-14" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left copy */}
            <div>
              <span className="text-label block mb-3" style={{ color: AP_AMBER }}>
                Practice &amp; Improve
              </span>
              <h2 className="text-heading-2 mb-4" style={{ color: 'var(--color-foreground)' }}>
                Practice AP Questions
              </h2>
              <ul className="space-y-3 mb-8">
                {practiceFeatures.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" style={{ color: AP_AMBER }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{text}</span>
                  </li>
                ))}
              </ul>
              <Link href={practiceHref}>
                <Button size="lg" className="font-semibold text-white" style={{ background: apGradient }}>
                  Start Practicing Now <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Right — static UI mockup */}
            <div className="relative flex gap-4 items-end">

              {/* Question card */}
              <div className="flex-1 card-base overflow-hidden">
                <div className="px-4 py-2.5 flex items-center justify-between"
                  style={{ background: apGradient }}>
                  <span className="text-xs font-bold text-white">AP Calculus AB</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
                    AP Exam
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-foreground)' }}>
                    If f(x) = x² − 4 and g(x) = x + 2, what is f(g(x))?
                  </p>
                  <div className="space-y-2">
                    {sampleOptions.map((o) => (
                      <div key={o.label}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border"
                        style={{
                          borderColor: o.correct ? '#16a34a' : 'var(--color-border)',
                          background:  o.correct ? '#dcfce7' : 'var(--color-card)',
                          color:       o.correct ? '#15803d' : 'var(--color-foreground)',
                          fontWeight:  o.correct ? 600 : 400,
                        }}
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{
                            background: o.correct ? '#16a34a' : 'var(--color-muted)',
                            color: o.correct ? 'white' : 'var(--color-muted-foreground)',
                          }}>
                          {o.label}
                        </span>
                        {o.text}
                        {o.correct && <CheckCircle className="ml-auto h-3.5 w-3.5 shrink-0" style={{ color: '#16a34a' }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress card + trophy column */}
              <div className="flex flex-col gap-3 shrink-0 w-36">
                <div className="card-base p-4">
                  <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--color-muted-foreground)' }}>
                    Your Progress
                  </p>
                  <p className="text-2xl font-black mb-2" style={{ color: 'var(--color-foreground)' }}>72%</p>
                  {/* Progress bar — green */}
                  <div className="w-full h-2 rounded-full mb-3 overflow-hidden"
                    style={{ background: 'var(--color-muted)' }}>
                    <div className="h-full rounded-full" style={{ width: '72%', background: '#16a34a' }} />
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--color-muted-foreground)' }}>Correct Answers</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>36/50</p>
                </div>
                <div className="rounded-2xl p-4 flex items-center justify-center"
                  style={{ background: apGradient }}>
                  <Trophy className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-14" style={{ background: 'var(--color-background)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="Students Achieve. We're Proud."
            title="What Students & Parents Say"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="card-base p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-muted-foreground)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: apGradient }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                      {t.name} {t.flag}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{t.role}</p>
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
