'use client';

import Link from 'next/link';
import { CheckCircle2, ChevronRight, ClipboardList, XCircle } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState, SectionCard } from './SectionCard';

export interface MockTestPoint {
  id: string;
  title: string;
  completedAt: string;
  percentage: number;
  passed: boolean;
  sections: { name: string; percentage: number }[];
}

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
      <p>{fmtDate(p.completedAt)} · <span className="font-bold">{p.percentage}%</span> · {p.passed ? 'Passed' : 'Below passing'}</p>
    </div>
  );
}

export function MockTestTrend({ results }: { results: MockTestPoint[] }) {
  const data = results.map((r, i) => ({ ...r, n: i + 1 }));
  const newestFirst = [...results].reverse();

  return (
    <SectionCard
      className="h-full"
      title="Mock test scores"
      description={results.length > 0 ? `${results.length} test${results.length === 1 ? '' : 's'} taken · section breakdown below` : undefined}
    >
      {results.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No mock tests yet"
          body="Take a full-length mock test from your course to see how exam-ready you are."
          cta={{ label: 'Go to my courses', href: '/dashboard/courses' }}
        />
      ) : (
        <div className="flex flex-col gap-3 h-full">
          {results.length > 1 && (
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
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={MockTooltip} cursor={{ stroke: 'var(--color-border-strong)' }} />
                  <Line
                    type="linear"
                    dataKey="percentage"
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
                      <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: 'var(--color-foreground)' }}>{r.percentage}%</span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{fmtDate(r.completedAt)}</p>
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
