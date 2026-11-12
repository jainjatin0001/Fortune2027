import { CalendarClock, CheckCircle2, Flame } from 'lucide-react';
import type { EngagementSummary } from '@/lib/progress/queries';
import { daysBetween, toDateKey } from '@/lib/progress/time';
import { GoalEditor } from './GoalEditor';

const STREAK_COLOR = '#f97316';

const weekdayInitial = (key: string) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'narrow', timeZone: 'UTC' });

export function StreakCard({ engagement }: { engagement: EngagementSummary }) {
  const { streak, heatmap, todayKey } = engagement;
  const last7 = heatmap.slice(-7);

  const hint = streak.current === 0
    ? 'Answer a question to start one'
    : streak.activeToday
      ? 'You’ve studied today'
      : 'Study today to keep it alive';

  return (
    <section className="card-base p-5 h-full flex flex-col gap-4" aria-label="Study streak">
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${STREAK_COLOR}1f`, color: STREAK_COLOR }}
        >
          <Flame className="h-5 w-5" aria-hidden />
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
          Best {streak.longest}
        </span>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>Study streak</p>
        <p className="text-2xl font-black leading-tight tabular-nums" style={{ color: 'var(--color-foreground)' }}>
          {streak.current} day{streak.current === 1 ? '' : 's'}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{hint}</p>
      </div>

      <ol className="mt-auto grid grid-cols-7 gap-1" aria-label="Last 7 days">
        {last7.map(d => {
          const active = d.answered > 0;
          const isToday = d.date === todayKey;
          return (
            <li key={d.date} className="flex flex-col items-center gap-1">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: active ? STREAK_COLOR : 'var(--chart-empty)',
                  color: active ? '#fff' : 'var(--color-muted-foreground)',
                  outline: isToday ? '1.5px solid var(--color-foreground)' : undefined,
                  outlineOffset: 1,
                }}
                aria-label={`${d.date}: ${active ? 'studied' : 'no activity'}`}
              >
                {active && <Flame className="h-3 w-3" aria-hidden />}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--color-muted-foreground)' }} aria-hidden>{weekdayInitial(d.date)}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const ratio = Math.min(1, value / goal);
  const met = value >= goal;
  return (
    <div className="relative w-[72px] h-[72px] shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={r} fill="none" strokeWidth="8" style={{ stroke: 'var(--chart-empty)' }} />
        <circle
          cx="40" cy="40" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{ stroke: met ? 'var(--color-success)' : 'var(--chart-series)', transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black tabular-nums" style={{ color: 'var(--color-foreground)' }}>
          {Math.round(ratio * 100)}%
        </span>
      </div>
    </div>
  );
}

export function GoalCard({ engagement }: { engagement: EngagementSummary }) {
  const { dailyGoal, answeredToday, goalDaysLast7 } = engagement;
  const met = answeredToday >= dailyGoal;
  const remaining = dailyGoal - answeredToday;

  return (
    <section className="card-base p-5 h-full flex flex-col gap-4" aria-label="Daily goal">
      <div className="flex items-start justify-between gap-3">
        <GoalRing value={answeredToday} goal={dailyGoal} />
        <GoalEditor goal={dailyGoal} />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>Daily goal</p>
        <p className="text-2xl font-black leading-tight tabular-nums" style={{ color: 'var(--color-foreground)' }}>
          {answeredToday}<span className="text-base font-semibold" style={{ color: 'var(--color-muted-foreground)' }}> / {dailyGoal}</span>
        </p>
        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: met ? 'var(--color-success)' : 'var(--color-muted-foreground)' }}>
          {met && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
          {met ? 'Goal met for today' : `${remaining} more question${remaining === 1 ? '' : 's'} to go`}
        </p>
      </div>

      <p className="mt-auto text-xs pt-3 border-t" style={{ color: 'var(--color-muted-foreground)', borderColor: 'var(--color-border)' }}>
        Goal met on <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{goalDaysLast7} of the last 7</span> days
      </p>
    </section>
  );
}

/** Header pill — rendered only when the student has set an exam date in their profile */
export function ExamCountdown({ engagement, tz }: { engagement: EngagementSummary; tz: string }) {
  if (!engagement.examDate) return null;
  const days = daysBetween(engagement.todayKey, toDateKey(engagement.examDate, tz));
  if (days < 0) return null;

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)', color: 'var(--color-foreground)' }}
    >
      <CalendarClock className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} aria-hidden />
      <span className="font-semibold">{days === 0 ? 'Exam day!' : `${days} day${days === 1 ? '' : 's'} to your exam`}</span>
      {engagement.targetScore ? <span style={{ color: 'var(--color-muted-foreground)' }}>· Target {engagement.targetScore}</span> : null}
    </div>
  );
}
