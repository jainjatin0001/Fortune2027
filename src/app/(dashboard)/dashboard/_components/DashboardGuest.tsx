'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import {
  ArrowRight, BarChart2, Calculator, CheckCircle2, GraduationCap, Lightbulb,
  RefreshCw, Sparkles, Target, Trophy, UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardGuestProps {
  questionCount: number;
  quizCount: number;
  mockTestCount: number;
}

// 4237 → "4,200+", 213 → "210+", 48 → "48"
function formatCount(n: number) {
  if (n < 100) return n.toLocaleString('en-US');
  const step = n >= 1000 ? 100 : 10;
  return `${(Math.floor(n / step) * step).toLocaleString('en-US')}+`;
}

const FEATURES = [
  {
    icon: Trophy,
    color: 'var(--color-accent)',
    title: 'Topic-wise quizzes',
    body: 'Short, focused quizzes for SAT, ACT and AP topics, with a question navigator and flag-for-review.',
  },
  {
    icon: GraduationCap,
    color: 'var(--color-sat)',
    title: 'Full-length mock tests',
    body: 'Timed SAT, ACT and AP practice exams that feel like the real test day.',
  },
  {
    icon: BarChart2,
    color: 'var(--color-success)',
    title: 'Progress tracking',
    body: 'Scores, accuracy and trends over time, so you always know which topics to work on next.',
  },
  {
    icon: Lightbulb,
    color: 'var(--color-warning)',
    title: 'Clear explanations',
    body: 'Every question comes with a step-by-step explanation once you submit.',
  },
  {
    icon: Calculator,
    color: 'var(--color-info)',
    title: 'Built-in Desmos calculator',
    body: 'Practice with the same graphing calculator you’ll use on the digital SAT.',
  },
  {
    icon: RefreshCw,
    color: 'var(--color-danger)',
    title: 'Saved to your account',
    body: 'Your attempts and scores are saved, so you can pick up on any device.',
  },
];

const STEPS = [
  { icon: UserPlus, title: 'Create a free account', body: 'Takes under a minute' },
  { icon: Target, title: 'Take a quiz or mock test', body: 'Pick any topic or full exam' },
  { icon: BarChart2, title: 'Track and improve', body: 'Your dashboard shows what to fix' },
];

// Illustrative only: shows what the progress panel looks like once you start practicing
const PREVIEW_TOPICS = [
  { label: 'Algebra', pct: 82 },
  { label: 'Problem solving & data', pct: 68 },
  { label: 'Reading & writing', pct: 74 },
];

export function DashboardGuest({ questionCount, quizCount, mockTestCount }: DashboardGuestProps) {
  const stats = [
    { value: formatCount(questionCount), label: 'Practice questions' },
    { value: formatCount(quizCount), label: 'Quizzes' },
    ...(mockTestCount > 0 ? [{ value: formatCount(mockTestCount), label: 'Mock tests' }] : []),
    { value: 'Free', label: 'No credit card needed' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12 text-white"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div aria-hidden className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.25fr_1fr] items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 ring-1 ring-white/25 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              100% free · No credit card needed
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight">
              Your SAT &amp; ACT prep,<br className="hidden sm:block" /> all in one dashboard.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl">
              Sign up free to unlock {formatCount(questionCount)} practice questions, {formatCount(quizCount)} quizzes
              {mockTestCount > 0 ? ' and full-length mock tests' : ''}, with progress tracking that shows exactly where to improve.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard">
                <Button
                  size="lg"
                  className="group h-12 px-7 text-base font-semibold bg-white hover:bg-white/90 shadow-lg"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Create free account
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-12 px-6 text-base font-medium text-white ring-1 ring-white/40 hover:bg-white/10 hover:text-white"
                >
                  I already have an account
                </Button>
              </SignInButton>
            </div>
          </div>

          {/* Progress preview */}
          <div aria-hidden className="hidden sm:block rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Your progress</span>
              <span className="text-[11px] uppercase tracking-wider rounded-full bg-white/15 px-2 py-0.5">Preview</span>
            </div>
            <div className="mt-5 flex items-center gap-5">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'conic-gradient(#ffffff 74%, rgba(255,255,255,0.2) 0)' }}
              >
                <div className="w-[76px] h-[76px] rounded-full flex flex-col items-center justify-center" style={{ background: 'var(--color-primary)' }}>
                  <span className="text-2xl font-bold leading-none">74%</span>
                  <span className="text-[11px] text-white/70 mt-0.5">accuracy</span>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-white/85">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 12 quizzes completed</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 2 mock tests taken</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 5-day practice streak</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {PREVIEW_TOPICS.map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="What's included">
        {stats.map(({ value, label }) => (
          <div key={label} className="card-base p-5 text-center">
            <div className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-accent)' }}>{value}</div>
            <div className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{label}</div>
          </div>
        ))}
      </section> */}

      {/* Features */}
      <section className="space-y-5">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
            Everything you get with a free account
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            One place to practice, take full exams and see your progress.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, color, title, body }) => (
            <div key={title} className="card-base p-6 transition-transform hover:-translate-y-0.5">
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold" style={{ color: 'var(--color-foreground)' }}>{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works + final CTA */}
      <section className="card-base p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="flex items-start gap-3.5">
              <span
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'var(--gradient-primary)' }}
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--color-foreground)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
                  {title}
                </div>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Ready to start practicing?</p>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Join free in seconds and take your first quiz today.</p>
          </div>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard">
            <Button size="lg" className="group h-12 px-7 text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
              Sign up free
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
}
