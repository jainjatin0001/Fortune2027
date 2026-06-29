import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Clock, BookOpen, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDbUser } from '@/lib/auth';
import { DEMO_QUIZZES } from '@/../data/demo';

export const metadata: Metadata = { title: 'Demo Questions' };

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  return `${m}m`;
}

export default async function DemoPage() {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Demo Questions</h1>
        <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          Free practice quizzes across SAT, ACT, AP, and more. No purchase required.
        </p>
      </div>

      {/* Quick links to full exams */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/dashboard/sat-exam"
          className="card-base p-4 flex items-center gap-4 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0" style={{ background: '#7c3aed' }}>
            SAT
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>SAT Mock Tests</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Full-length Digital SAT with calculator</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: '#7c3aed' }} />
        </Link>

        <Link
          href="/dashboard/act-exam"
          className="card-base p-4 flex items-center gap-4 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0" style={{ background: '#0891b2' }}>
            ACT
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>ACT Mock Tests</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>English, Math, Reading & Science</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: '#0891b2' }} />
        </Link>

        <Link
          href="/dashboard/ap-exam"
          className="card-base p-4 flex items-center gap-4 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0" style={{ background: '#b45309' }}>
            AP
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>AP Subject Quizzes</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Calc, Chem, Bio, Physics, History & more</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: '#b45309' }} />
        </Link>

        <Link
          href="/pricing"
          className="card-base p-4 flex items-center gap-4 hover:opacity-80 transition-opacity group"
          style={{ border: '1px solid var(--color-primary)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>Unlock Full Access</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>1000+ questions, analytics & full courses</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--color-primary)' }} />
        </Link>
      </div>

      {/* Demo quiz cards */}
      <div>
        <h2 className="font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
          Free Practice Quizzes
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {DEMO_QUIZZES.map((quiz, idx) => (
            <Link
              key={quiz.id}
              href={`/dashboard/demo/quiz/${quiz.id}`}
              className="card-base p-5 flex flex-col gap-4 hover:opacity-80 transition-opacity group"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0"
                  style={{ background: quiz.badge }}
                >
                  {idx + 1}
                </div>
                <ArrowRight
                  className="h-4 w-4 mt-1 group-hover:translate-x-0.5 transition-transform"
                  style={{ color: quiz.badge }}
                />
              </div>

              <div>
                <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--color-foreground)' }}>
                  {quiz.title}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                  {quiz.description}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {quiz.questions.length} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(quiz.timeLimit)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {quiz.topics.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: quiz.badge + '18', color: quiz.badge }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upsell */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <GraduationCap className="h-8 w-8 mx-auto mb-3 text-white/80" />
        <h3 className="text-heading-3 text-white mb-2">Want 1000+ more questions?</h3>
        <p className="text-sm text-white/80 mb-4">
          Unlock complete SAT, ACT, AP, and Coding question banks with detailed explanations and analytics.
        </p>
        <Link href="/pricing">
          <Button className="bg-white font-semibold" style={{ color: 'var(--color-primary)' }}>
            See Pricing Plans
          </Button>
        </Link>
      </div>
    </div>
  );
}
