'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, ClipboardList, XCircle } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState, SectionCard } from './SectionCard';

export interface MockTestPoint {
  id: string;
  title: string;
  completedAt: string;
  percentage: number;
  passed: boolean;
  sections: { name: string; percentage: number }[];
  program: { id: string; name: string } | null;
  /** Estimated exam-scale score (SAT 400–1600, ACT 1–36) */
  scaled: { score: number; min: number; max: number; label: string; kind: 'SAT' | 'ACT' } | null;
}

const ALL = 'all';
const NO_PROGRAM = 'none';

function SectionBars({ sections }: { sections: MockTestPoint['sections'] }) {
  if (sections.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2" aria-label="Section scores">
      {sections.map((sec, i) => (
        <li key={`${sec.name}-${i}`} className="min-w-0">
          <div className="flex items-baseline justify-between gap-2 text-[11px]">
            <span className="truncate capitalize" style={{ color: 'var(--color-muted-foreground)' }}>{sec.name}</span>
            <span className="font-semibold tabular-nums" style={{ color: 'var(--color-foreground)' }}>{sec.percentage}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mt-0.5" style={{ background: 'var(--chart-empty)' }}>
            <div className="h-full rounded-full" style={{ width: `${sec.percentage}%`, background: 'var(--chart-series)' }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// Structural props: recharts passes the hovered datum as payload[0].payload
function MockTooltip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }> }) {
  const p = payload?.[0]?.payload as (MockTestPoint & { n: number }) | undefined;
  if (!active || !p) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-md max-w-[220px]"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
    >
      <p className="font-semibold truncate">{p.title}</p>
      <p>
        {fmtDate(p.completedAt)} ·{' '}
        <span className="font-bold">{p.scaled ? `${p.scaled.kind} ${p.scaled.score}` : `${p.percentage}%`}</span>
        {p.scaled && ` (${p.percentage}%)`} · {p.passed ? 'Passed' : 'Below passing'}
      </p>
    </div>
  );
}

export function MockTestTrend({ results }: { results: MockTestPoint[] }) {
  const [programId, setProgramId] = useState<string>(ALL);

  // Programs the student has actually tested in, in first-taken order
  const programs = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of results) m.set(r.program?.id ?? NO_PROGRAM, r.program?.name ?? 'Other');
    return [...m.entries()].map(([id, name]) => ({ id, name }));
  }, [results]);

  const filtered = programId === ALL ? results : results.filter(r => (r.program?.id ?? NO_PROGRAM) === programId);
  // One program on one exam scale → chart the real score; mixed programs → percentage
  const scale = programId !== ALL && filtered.length > 0 && filtered.every(r => r.scaled && r.scaled.kind === filtered[0].scaled?.kind)
    ? filtered[0].scaled
    : null;
  const data = filtered.map((r, i) => ({ ...r, n: i + 1, value: scale ? r.scaled!.score : r.percentage }));
  const newestFirst = [...filtered].reverse();
  const yTicks = scale ? [scale.min, Math.round((scale.min + scale.max) / 2), scale.max] : [0, 50, 100];

  return (
    <SectionCard
      className="h-full"
      title="Mock test scores"
      description={results.length > 0
        ? `${filtered.length} test${filtered.length === 1 ? '' : 's'} taken${scale ? ` · ${scale.kind} scale (${scale.min}–${scale.max})` : ' · section breakdown below'}`
        : undefined}
      toolbar={programs.length > 1 ? (
        <Select value={programId} onValueChange={setProgramId}>
          <SelectTrigger className="h-8 w-[180px] text-xs" aria-label="Program">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All programs</SelectItem>
            {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : undefined}
    >
      {results.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No mock tests yet"
          body="Take a free full-length mock test to see how exam-ready you are."
          cta={{ label: 'Browse mock tests', href: '/dashboard/mock-tests' }}
        />
      ) : (
        <div className="flex flex-col gap-3 h-full">
          {filtered.length > 1 && (
            <div className="h-36 -ml-2 shrink-0" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                  <XAxis
                    dataKey="n"
                    tickFormatter={(n: number) => `#${n}`}
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[yTicks[0], yTicks[2]]}
                    ticks={yTicks}
                    tickFormatter={(v: number) => (scale ? String(v) : `${v}%`)}
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={MockTooltip} cursor={{ stroke: 'var(--color-border-strong)' }} />
                  <Line
                    type="linear"
                    dataKey="value"
                    stroke="var(--chart-series)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--chart-series)', stroke: 'var(--color-card)', strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Every attempt, newest first — scrolls inside the card */}
          <ul className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2 divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {newestFirst.map(r => (
              <li key={r.id}>
                <Link
                  href={`/dashboard/mock-test/${r.id}/report`}
                  className="flex items-start gap-3 py-3 group"
                >
                  {r.passed
                    ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--color-success)' }} aria-label="Passed" />
                    : <XCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--color-danger)' }} aria-label="Below passing score" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium truncate group-hover:underline capitalize" style={{ color: 'var(--color-foreground)' }}>{r.title}</p>
                      <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: 'var(--color-foreground)' }}>
                        {r.scaled ? <>{r.scaled.score}<span className="text-[11px] font-medium" style={{ color: 'var(--color-muted-foreground)' }}> /{r.scaled.max} · {r.percentage}%</span></> : `${r.percentage}%`}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
                      {fmtDate(r.completedAt)}{r.program && programId === ALL ? ` · ${r.program.name}` : ''}
                    </p>
                    <SectionBars sections={r.sections} />
                  </div>
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--color-muted-foreground)' }} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}
