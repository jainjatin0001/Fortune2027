import Link from 'next/link';
import { CheckCircle2, FileText, XCircle } from 'lucide-react';
import type { QuizSummary } from '@/lib/progress/queries';
import { EmptyState, SectionCard } from './SectionCard';

export function RecentQuizzes({ quizzes, tz }: { quizzes: QuizSummary; tz: string }) {
  return (
    <SectionCard
      className="h-full"
      title="Recent quizzes"
      description={quizzes.completed > 0 ? `${quizzes.completed} completed · ${quizzes.passed} passed` : undefined}
      action={{ label: 'All quizzes', href: '/dashboard/quizzes' }}
    >
      {quizzes.recent.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No quizzes completed"
          body="Finish a quiz to see your score and track how you improve."
          cta={{ label: 'Find a quiz', href: '/dashboard/quizzes' }}
        />
      ) : (
        <ul className="h-full overflow-y-auto pr-2 -mr-2 -mt-2 divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {quizzes.recent.map(q => (
            <li key={q.id}>
              <Link href={`/dashboard/quizzes/${q.quizId}`} className="flex items-center gap-3 py-3 group">
                {q.passed
                  ? <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: 'var(--color-success)' }} aria-label="Passed" />
                  : <XCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-danger)' }} aria-label="Below passing score" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:underline" style={{ color: 'var(--color-foreground)' }}>{q.title}</p>
                  <p className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
                    {q.completedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: tz })}
                  </p>
                </div>
                <div className="w-20 shrink-0 hidden sm:block" aria-hidden>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--chart-empty)' }}>
                    <div className="h-full rounded-full" style={{ width: `${q.score}%`, background: 'var(--chart-series)' }} />
                  </div>
                </div>
                <span className="w-10 text-right text-sm font-bold tabular-nums" style={{ color: 'var(--color-foreground)' }}>{q.score}%</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
