import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Play, FileText, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDbUser } from '@/lib/auth';
import { getDemoQuestions } from '@/../data/demo';

export const metadata: Metadata = { title: 'Demo Questions' };

const CATEGORY_COLOR: Record<string, string> = {
  SAT_PREP: '#7c3aed',
  ACT_PREP: '#0891b2',
  AP_EXAM: '#b45309',
  CODING: '#059669',
};

const CATEGORY_LABEL: Record<string, string> = {
  SAT_PREP: 'SAT',
  ACT_PREP: 'ACT',
  AP_EXAM: 'AP',
  CODING: 'Coding',
};

const CATEGORY_LINK: Record<string, string> = {
  SAT_PREP: '/dashboard/sat-exam',
  ACT_PREP: '/dashboard/act-exam',
  AP_EXAM: '/dashboard/demo/quiz',
  CODING: '/dashboard/demo/quiz',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'var(--color-success)',
  Medium: 'var(--color-warning)',
  Hard: 'var(--color-danger)',
};

export default async function DemoPage() {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const questions = getDemoQuestions();
  const grouped = questions.reduce<Record<string, typeof questions>>((acc, q) => {
    acc[q.category] = acc[q.category] ?? [];
    acc[q.category].push(q);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Demo Questions</h1>
        <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          Free practice questions across SAT, ACT, AP, and Coding. No purchase required.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/dashboard/demo/quiz" className="card-base p-5 hover:opacity-80 transition-opacity group">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: '#7c3aed15', color: '#7c3aed' }}>
            <Play className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>Demo Quiz</h3>
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>10 mixed questions, timed, with instant feedback</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: '#7c3aed' }}>
            Start <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link href="/dashboard/sat-exam" className="card-base p-5 hover:opacity-80 transition-opacity group">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: '#7c3aed15', color: '#7c3aed' }}>
            <GraduationCap className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>SAT Practice Exam</h3>
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Timed, section-based with question palette & score report</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: '#7c3aed' }}>
            Start <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link href="/dashboard/act-exam" className="card-base p-5 hover:opacity-80 transition-opacity group">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: '#0891b215', color: '#0891b2' }}>
            <GraduationCap className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>ACT Practice Exam</h3>
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>English, Math & Science — real exam conditions</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: '#0891b2' }}>
            Start <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link href="/dashboard/demo/exam" className="card-base p-5 hover:opacity-80 transition-opacity group">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: '#b4530915', color: '#b45309' }}>
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>Demo Exam</h3>
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>General mixed exam simulation with score report</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: '#b45309' }}>
            Start <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link href="/pricing" className="card-base p-5 hover:opacity-80 transition-opacity group" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>Unlock Full Access</h3>
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>1000+ questions, full courses & analytics</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
            View plans <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Questions by category */}
      {Object.entries(grouped).map(([category, qs]) => (
        <div key={category}>
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-foreground)' }}>
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded text-white text-xs font-bold"
              style={{ background: CATEGORY_COLOR[category] ?? 'var(--color-primary)' }}
            >
              {(CATEGORY_LABEL[category] ?? category).charAt(0)}
            </span>
            {CATEGORY_LABEL[category] ?? category} Questions
          </h2>
          <div className="grid gap-3">
            {qs.map((q, idx) => (
              <Link
                key={q.id}
                href={CATEGORY_LINK[category] ?? '/dashboard/demo/quiz'}
                className="card-base p-5 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: CATEGORY_COLOR[category] ?? 'var(--color-primary)' }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{q.question}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-semibold" style={{ color: DIFFICULTY_COLOR[q.difficulty] }}>
                        {q.difficulty}
                      </span>
                      {q.subject && (
                        <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{q.subject}</span>
                      )}
                      <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{q.options.length} options</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--color-muted-foreground)' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Upsell CTA */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'var(--gradient-primary)' }}
      >
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
