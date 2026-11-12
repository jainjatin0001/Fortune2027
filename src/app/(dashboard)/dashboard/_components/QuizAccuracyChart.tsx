'use client';

import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { DailyAccuracyPoint, SubjectOption } from '@/lib/progress/queries';

const ALL = 'all';
type Grain = 'day' | 'week' | 'month';

// Ranges follow the SAT cadence: a sprint (4 weeks), the gap between test dates (3 months), the full journey
const RANGES = [
  { id: '4w', label: '4 weeks', days: 28 },
  { id: '3m', label: '3 months', days: 91 },
  { id: 'all', label: 'All time', days: null },
] as const;
type RangeId = (typeof RANGES)[number]['id'];

/** All time switches from weekly to monthly points beyond this many days of history */
const MONTHLY_AFTER_DAYS = 182;

interface ChartPoint {
  bucket: string;
  accuracy: number | null;
  answered: number;
}

// ── Date-key helpers (UTC-anchored YYYY-MM-DD strings, so no host time zone leaks in) ──
const toDate = (key: string) => new Date(`${key}T00:00:00Z`);
const keyOf = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (key: string, n: number) => { const d = toDate(key); d.setUTCDate(d.getUTCDate() + n); return keyOf(d); };
const mondayOf = (key: string) => addDays(key, -((toDate(key).getUTCDay() + 6) % 7));
const monthOf = (key: string) => `${key.slice(0, 7)}-01`;
const bucketOf = (key: string, grain: Grain) => (grain === 'day' ? key : grain === 'week' ? mondayOf(key) : monthOf(key));
const nextBucket = (key: string, grain: Grain) => {
  if (grain === 'day') return addDays(key, 1);
  if (grain === 'week') return addDays(key, 7);
  const d = toDate(key); d.setUTCMonth(d.getUTCMonth() + 1); return keyOf(d);
};

const fmt = (key: string, opts: Intl.DateTimeFormatOptions) => toDate(key).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });
const tickLabel = (key: string, grain: Grain) =>
  grain === 'month' ? fmt(key, { month: 'short', year: '2-digit' }) : fmt(key, { month: 'short', day: 'numeric' });
const tooltipLabel = (key: string, grain: Grain) =>
  grain === 'day' ? fmt(key, { weekday: 'short', month: 'short', day: 'numeric' })
    : grain === 'week' ? `Week of ${fmt(key, { month: 'short', day: 'numeric' })}`
      : fmt(key, { month: 'long', year: 'numeric' });

// Structural props: recharts passes the hovered datum as payload[0].payload
function ChartTooltip({ active, payload, grain }: { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }>; grain: Grain }) {
  const p = payload?.[0]?.payload as ChartPoint | undefined;
  if (!active || !p || p.accuracy === null) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-md"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
    >
      <p className="font-semibold mb-0.5">{tooltipLabel(p.bucket, grain)}</p>
      <p><span className="font-bold">{p.accuracy}%</span> accuracy · {p.answered} answered</p>
    </div>
  );
}

export function QuizAccuracyChart({ points, subjects, todayKey }: {
  points: DailyAccuracyPoint[];
  subjects: SubjectOption[];
  /** Student's local date from the server — keeps server and client renders identical */
  todayKey: string;
}) {
  const [subjectId, setSubjectId] = useState<string>(ALL);
  const [range, setRange] = useState<RangeId>('3m');

  const answeredBySubject = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of points) m.set(p.subjectId, (m.get(p.subjectId) ?? 0) + p.answered);
    return m;
  }, [points]);

  const subjectGroups = useMemo(() => {
    const groups = new Map<string, SubjectOption[]>();
    for (const s of subjects) groups.set(s.programName, [...(groups.get(s.programName) ?? []), s]);
    return [...groups.entries()];
  }, [subjects]);

  const { series, grain, answered, correct, previous } = useMemo(() => {
    const selected = points.filter(p => subjectId === ALL || p.subjectId === subjectId);
    const rangeDays = RANGES.find(r => r.id === range)!.days;
    const firstDay = selected.reduce<string | null>((min, p) => (min === null || p.day < min ? p.day : min), null);

    const start = rangeDays !== null ? addDays(todayKey, -(rangeDays - 1)) : firstDay ?? todayKey;
    const historyDays = firstDay ? (toDate(todayKey).getTime() - toDate(firstDay).getTime()) / 86_400_000 : 0;
    const g: Grain = range === '4w' ? 'day' : range === 'all' && historyDays > MONTHLY_AFTER_DAYS ? 'month' : 'week';

    // Same-length window just before this one, for the "vs previous period" delta
    const prevStart = rangeDays !== null ? addDays(start, -rangeDays) : null;
    const byBucket = new Map<string, { answered: number; correct: number }>();
    let totalAnswered = 0, totalCorrect = 0, prevAnswered = 0, prevCorrect = 0;

    for (const p of selected) {
      if (p.day > todayKey) continue;
      if (p.day < start) {
        if (prevStart && p.day >= prevStart) { prevAnswered += p.answered; prevCorrect += p.correct; }
        continue;
      }
      const b = bucketOf(p.day, g);
      const agg = byBucket.get(b) ?? { answered: 0, correct: 0 };
      agg.answered += p.answered;
      agg.correct += p.correct;
      byBucket.set(b, agg);
      totalAnswered += p.answered;
      totalCorrect += p.correct;
    }

    // One point per bucket across the range; empty buckets are null so only real data gets a dot
    const out: ChartPoint[] = [];
    for (let b = bucketOf(start, g); b <= todayKey; b = nextBucket(b, g)) {
      const agg = byBucket.get(b);
      out.push({ bucket: b, answered: agg?.answered ?? 0, accuracy: agg && agg.answered > 0 ? Math.round((agg.correct / agg.answered) * 100) : null });
    }

    return {
      series: out,
      grain: g,
      answered: totalAnswered,
      correct: totalCorrect,
      previous: prevAnswered > 0 ? Math.round((prevCorrect / prevAnswered) * 100) : null,
    };
  }, [points, subjectId, range, todayKey]);

  const selectedName = subjectId === ALL ? 'All subjects' : subjects.find(s => s.id === subjectId)?.name ?? 'Subject';
  const rangeMeta = RANGES.find(r => r.id === range)!;
  const periodLabel = rangeMeta.days === null ? 'all time' : `last ${rangeMeta.label}`;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : null;
  const delta = accuracy !== null && previous !== null ? accuracy - previous : null;

  return (
    <section className="card-base p-5 sm:p-6 flex flex-col gap-5 h-full" aria-label="Quiz accuracy over time">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Quiz accuracy</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
            Share of answered quiz questions you got right
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={subjectId} onValueChange={setSubjectId}>
            <SelectTrigger className="h-8 w-[230px] text-xs" aria-label="Subject">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All subjects</SelectItem>
              {subjectGroups.map(([program, list]) => (
                <SelectGroup key={program}>
                  <SelectLabel>{program}</SelectLabel>
                  {list.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                      {!answeredBySubject.has(s.id) && <span className="opacity-60"> · no data</span>}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <div className="inline-flex rounded-lg p-0.5" style={{ background: 'var(--color-muted)' }} role="group" aria-label="Time range">
            {RANGES.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                aria-pressed={range === r.id}
                className="px-3 h-7 text-xs rounded-md font-medium transition-colors"
                style={range === r.id
                  ? { background: 'var(--color-card)', color: 'var(--color-foreground)', boxShadow: '0 1px 2px rgb(0 0 0 / 0.08)' }
                  : { color: 'var(--color-muted-foreground)' }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {accuracy !== null ? (
        <>
          <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
            <div>
              <p className="text-3xl font-black tabular-nums leading-none" style={{ color: 'var(--color-foreground)' }}>{accuracy}%</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{selectedName} · {periodLabel}</p>
            </div>
            <div>
              <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--color-foreground)' }}>{answered.toLocaleString()}</p>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>questions answered</p>
            </div>
            {delta !== null && (
              <div>
                <p className="text-sm font-semibold tabular-nums" style={{ color: delta > 0 ? 'var(--color-success)' : delta < 0 ? 'var(--color-danger)' : 'var(--color-foreground)' }}>
                  {delta > 0 ? '▲' : delta < 0 ? '▼' : '–'} {Math.abs(delta)} pts
                </p>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>vs previous {rangeMeta.label}</p>
              </div>
            )}
          </div>

          <div className="h-64 -ml-2" aria-hidden>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="bucket"
                  tickFormatter={(k: string) => tickLabel(k, grain)}
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={28}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <ReferenceLine
                  y={accuracy}
                  stroke="var(--color-muted-foreground)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{ value: `Avg ${accuracy}%`, position: 'insideTopRight', fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                />
                <Tooltip content={(props) => <ChartTooltip {...props} grain={grain} />} cursor={{ stroke: 'var(--color-border-strong)' }} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--chart-series)"
                  strokeWidth={2}
                  // Connect practice sessions; dots mark where real data exists
                  connectNulls
                  dot={{ r: 3.5, fill: 'var(--chart-series)', stroke: 'var(--color-card)', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: 'var(--chart-series)', stroke: 'var(--color-card)', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>{selectedName} quiz accuracy, {periodLabel}</caption>
            <thead><tr><th>Period</th><th>Accuracy</th><th>Answered</th></tr></thead>
            <tbody>
              {series.filter(p => p.accuracy !== null).map(p => (
                <tr key={p.bucket}><td>{tooltipLabel(p.bucket, grain)}</td><td>{p.accuracy}%</td><td>{p.answered}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="flex-1 min-h-64 flex flex-col items-center justify-center text-center rounded-xl px-4" style={{ background: 'var(--color-muted)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
            No quiz answers for {selectedName} — {periodLabel}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            {answeredBySubject.size > 0 ? 'Try a longer time range, or complete a quiz.' : 'Complete a quiz and your accuracy trend appears here.'}
          </p>
        </div>
      )}
    </section>
  );
}
