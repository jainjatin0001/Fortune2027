import { CheckCircle2, Gauge, Layers, AlertTriangle } from 'lucide-react';
import type { DifficultyAccuracy, PacingRow } from '@/lib/progress/queries';
import { EmptyState, SectionCard } from './SectionCard';
import { difficultyLabel } from '@/lib/progress/format';

function Meter({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  return (
    <div
      className="h-2 rounded-full overflow-hidden"
      style={{ background: 'var(--chart-empty)' }}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
    >
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: 'var(--chart-series)' }} />
    </div>
  );
}

// ── Accuracy by difficulty ────────────────────────────────────────────────────

export function DifficultyCard({ rows }: { rows: DifficultyAccuracy[] }) {
  const hard = rows.find(r => r.difficulty === 'HARD');
  return (
    <SectionCard title="Accuracy by difficulty" description="Quizzes and mock tests combined">
      {rows.length === 0 ? (
        <EmptyState icon={Layers} title="No answers yet" body="Complete a quiz to see how you handle easy, medium and hard questions." />
      ) : (
        <div className="flex flex-col h-full gap-4">
          <ul className="space-y-4">
            {rows.map(r => (
              <li key={r.difficulty}>
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{difficultyLabel(r.difficulty)}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-foreground)' }}>{r.accuracy}%</span>
                </div>
                <Meter value={r.accuracy} label={`${difficultyLabel(r.difficulty)} accuracy`} />
                <p className="text-[11px] mt-1 tabular-nums" style={{ color: 'var(--color-muted-foreground)' }}>{r.correct}/{r.answered} correct</p>
              </li>
            ))}
          </ul>
          <p className="mt-auto text-xs rounded-lg p-2.5" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
            {hard && hard.answered > 0
              ? <>Strong hard-question accuracy unlocks the harder second module on the Digital SAT — where top scores come from.</>
              : <>Try some hard questions — they decide whether you reach the harder second module on the Digital SAT.</>}
          </p>
        </div>
      )}
    </SectionCard>
  );
}

// ── Pacing ────────────────────────────────────────────────────────────────────

/** Within this share of the target counts as on pace */
const PACE_TOLERANCE = 0.1;

export function PacingCard({ rows }: { rows: PacingRow[] }) {
  return (
    <SectionCard title="Pacing" description="Average seconds per question vs official SAT pace">
      {rows.length === 0 ? (
        <EmptyState icon={Gauge} title="No timing data yet" body="Finish a timed quiz or mock test to see your pace per section." />
      ) : (
        <div className="flex flex-col h-full gap-5">
          <ul className="space-y-5">
            {rows.map(r => {
              const scaleMax = Math.max(r.targetSeconds * 1.6, r.avgSeconds * 1.1);
              const diff = r.avgSeconds - r.targetSeconds;
              const slow = diff > r.targetSeconds * PACE_TOLERANCE;
              const targetPos = (r.targetSeconds / scaleMax) * 100;
              return (
                <li key={r.slug}>
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{r.name.replace(/^SAT\s+/i, '')}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-foreground)' }}>{r.avgSeconds}s</span>
                  </div>
                  <div className="relative">
                    <Meter value={r.avgSeconds} max={scaleMax} label={`${r.name} seconds per question`} />
                    {/* Target marker */}
                    <span
                      className="absolute -top-1 h-4 w-0.5 rounded"
                      style={{ left: `${targetPos}%`, background: 'var(--color-foreground)' }}
                      aria-hidden
                    />
                  </div>
                  <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                    {slow
                      ? <AlertTriangle className="h-3 w-3" style={{ color: 'var(--color-warning)' }} aria-hidden />
                      : <CheckCircle2 className="h-3 w-3" style={{ color: 'var(--color-success)' }} aria-hidden />}
                    {slow ? `${diff}s slower than` : 'On pace with'} the {r.targetSeconds}s target · {r.answered} questions
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="mt-auto text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
            <span className="inline-block w-0.5 h-3 align-middle mr-1 rounded" style={{ background: 'var(--color-foreground)' }} aria-hidden />
            marks the official pace. Quiz timing is averaged across each quiz.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
