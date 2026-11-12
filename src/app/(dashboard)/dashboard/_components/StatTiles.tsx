import { ArrowDownRight, ArrowUpRight, ClipboardList, Crosshair, ListChecks, Trophy } from 'lucide-react';
import type { EngagementSummary, MockTestResult, QuizSummary } from '@/lib/progress/queries';

function formatDuration(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function Tile({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: React.ReactNode;
  color: string;
}) {
  return (
    <div className="card-base p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>{label}</span>
      </div>
      <div className="text-3xl font-black tabular-nums" style={{ color: 'var(--color-foreground)' }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{sub}</div>
    </div>
  );
}

function AccuracyDelta({ last7, prev7 }: { last7: number | null; prev7: number | null }) {
  if (last7 === null) return <>No answers in the last 7 days</>;
  if (prev7 === null) return <>{last7}% over the last 7 days</>;
  const diff = last7 - prev7;
  if (diff === 0) return <>Same as the week before ({last7}%)</>;
  const up = diff > 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-0.5">
      <Arrow className="h-3.5 w-3.5" style={{ color: up ? 'var(--color-success)' : 'var(--color-danger)' }} aria-hidden />
      <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
        {up ? '+' : '−'}{Math.abs(diff)} pts
      </span>
      &nbsp;this week vs last
    </span>
  );
}

export function StatTiles({ engagement, quizzes, mockTests }: {
  engagement: EngagementSummary;
  quizzes: QuizSummary;
  mockTests: MockTestResult[];
}) {
  const latestMock = mockTests.at(-1);
  const bestMock = mockTests.reduce<number | null>((b, m) => (b === null || m.percentage > b ? m.percentage : b), null);

  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-4 gap-4">
      <Tile
        icon={ListChecks}
        label="Questions answered"
        value={engagement.totals.answered.toLocaleString()}
        sub={`${formatDuration(engagement.studySecondsLast7)} practised in the last 7 days`}
        color="var(--chart-series)"
      />
      <Tile
        icon={Crosshair}
        label="Overall accuracy"
        value={engagement.totals.accuracy === null ? '—' : `${engagement.totals.accuracy}%`}
        sub={<AccuracyDelta last7={engagement.accuracyLast7} prev7={engagement.accuracyPrev7} />}
        color="var(--color-success)"
      />
      <Tile
        icon={Trophy}
        label="Quiz average"
        value={quizzes.avgScore === null ? '—' : `${quizzes.avgScore}%`}
        sub={quizzes.completed === 0
          ? 'No quizzes completed yet'
          : `${quizzes.completed} completed · ${quizzes.passed} passed`}
        color="#eab308"
      />
      <Tile
        icon={ClipboardList}
        label="Latest mock test"
        value={latestMock ? `${latestMock.percentage}%` : '—'}
        sub={latestMock
          ? `Best ${bestMock}% · ${mockTests.length} taken`
          : 'No mock tests taken yet'}
        color="var(--color-sat)"
      />
    </div>
  );
}
