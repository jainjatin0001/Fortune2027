import Link from 'next/link';
import { AlertTriangle, BarChart3, CircleDashed, Star, TrendingUp } from 'lucide-react';
import { MIN_ANSWERS_FOR_SIGNAL, STRONG_ACCURACY, WEAK_ACCURACY, type SubjectStrength } from '@/lib/progress/queries';
import { EmptyState, SectionCard } from './SectionCard';

const STATUS = {
  strong: { label: 'Strong', icon: Star, color: 'var(--color-success)' },
  developing: { label: 'Developing', icon: TrendingUp, color: 'var(--color-warning)' },
  weak: { label: 'Needs work', icon: AlertTriangle, color: 'var(--color-danger)' },
  'not-enough-data': { label: 'Too few answers', icon: CircleDashed, color: 'var(--color-muted-foreground)' },
} as const;

export function SubjectStrengths({ subjects }: { subjects: SubjectStrength[] }) {
  const focus = subjects
    .filter(s => s.status === 'weak')
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return (
    <SectionCard
      className="h-full"
      title="Subject strengths"
      description={`Accuracy across quizzes and mock tests · ${STRONG_ACCURACY}%+ strong, under ${WEAK_ACCURACY}% needs work`}
    >
      {subjects.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No answers yet"
          body="Your strongest and weakest subjects show up once you complete a quiz or mock test."
          cta={{ label: 'Browse quizzes', href: '/dashboard/quizzes' }}
        />
      ) : (
        <div className="flex flex-col gap-5 h-full">
          {focus.length > 0 && (
            <div className="rounded-xl p-3 shrink-0" style={{ background: 'var(--color-danger-light)' }}>
              <p className="text-xs font-bold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--color-foreground)' }}>
                <AlertTriangle className="h-3.5 w-3.5" style={{ color: 'var(--color-danger)' }} aria-hidden />
                Focus areas
              </p>
              <ul className="space-y-1">
                {focus.map(s => (
                  <li key={s.subjectId} className="flex items-center justify-between gap-2 text-xs" style={{ color: 'var(--color-foreground)' }}>
                    <span className="truncate">{s.name} · {s.accuracy}%</span>
                    <Link href="/dashboard/quizzes" className="font-semibold hover:underline shrink-0" style={{ color: 'var(--color-accent)' }}>
                      Practice
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Scrolls inside the card; on desktop the card is pinned to the accuracy chart's height */}
          <ul className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-2 -mr-2 max-h-[420px] lg:max-h-none">
            {subjects.map(s => {
              const st = STATUS[s.status];
              const Icon = st.icon;
              return (
                <li key={s.subjectId}>
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>{s.name}</span>
                    <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: 'var(--color-foreground)' }}>{s.accuracy}%</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--chart-empty)' }}
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={s.accuracy}
                    aria-label={`${s.name} accuracy`}
                  >
                    <div className="h-full rounded-full" style={{ width: `${s.accuracy}%`, background: 'var(--chart-series)' }} />
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1 text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
                    <span className="flex items-center gap-1">
                      <Icon className="h-3 w-3" style={{ color: st.color }} aria-hidden />
                      {st.label}
                      {s.status === 'not-enough-data' && ` (need ${MIN_ANSWERS_FOR_SIGNAL})`}
                    </span>
                    <span className="tabular-nums">{s.correct}/{s.answered} correct</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}
