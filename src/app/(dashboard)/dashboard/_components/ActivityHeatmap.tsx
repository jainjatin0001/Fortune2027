import { ScrollToEnd } from '@/components/shared/ScrollToEnd';
import type { HeatmapCell } from '@/lib/progress/queries';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
// Sequential ramp: one hue, stepped by mix strength (empty → light → dark)
const MIX = ['', '30%', '55%', '80%', '100%'];

/** Shade relative to the student's own daily goal, so "full" means goal met */
function level(answered: number, goal: number) {
  if (answered === 0) return 0;
  const r = answered / goal;
  return r >= 1 ? 4 : r >= 0.6 ? 3 : r >= 0.3 ? 2 : 1;
}

const fill = (lvl: number) =>
  lvl === 0 ? 'var(--chart-empty)' : `color-mix(in srgb, var(--chart-series) ${MIX[lvl]}, var(--chart-empty))`;

const fmt = (key: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <p className="text-lg font-black tabular-nums leading-tight" style={{ color: 'var(--color-foreground)' }}>{value}</p>
      <p className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
    </div>
  );
}

export function ActivityHeatmap({ cells, dailyGoal, todayKey, longestStreak }: {
  cells: HeatmapCell[];
  dailyGoal: number;
  todayKey: string;
  longestStreak: number;
}) {
  const weeks = Math.ceil(cells.length / 7);
  const totalAnswered = cells.reduce((s, c) => s + c.answered, 0);
  const activeDays = cells.filter(c => c.answered > 0).length;
  const goalDays = cells.filter(c => c.answered >= dailyGoal).length;

  // A month label sits above the first week column that starts in that month
  const monthLabels: { week: number; label: string }[] = [];
  for (let w = 0; w < weeks; w++) {
    const first = cells[w * 7];
    const month = fmt(first.date, { month: 'short' });
    const prev = w > 0 ? fmt(cells[(w - 1) * 7].date, { month: 'short' }) : null;
    if (month !== prev) monthLabels.push({ week: w, label: month });
  }
  // Drop a label squeezed against the next one at the left edge
  if (monthLabels.length > 1 && monthLabels[1].week - monthLabels[0].week < 3) monthLabels.shift();

  return (
    <section className="card-base p-5 sm:p-6" aria-label="Study activity">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Study activity</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
            {totalAnswered.toLocaleString()} questions answered in the last year
          </p>
        </div>
        <div className="flex gap-6">
          <Stat value={activeDays} label="active days" />
          <Stat value={goalDays} label="goal days" />
          <Stat value={longestStreak} label="longest streak" />
        </div>
      </header>

      <ScrollToEnd className="-mx-1 px-1 pb-1">
        <div
          className="grid gap-[3px] min-w-[720px]"
          style={{ gridTemplateColumns: `28px repeat(${weeks}, minmax(0, 1fr))`, gridTemplateRows: 'auto repeat(7, auto)' }}
        >
          {monthLabels.map(m => (
            <span
              key={`${m.week}-${m.label}`}
              className="text-[10px] whitespace-nowrap pb-1"
              style={{ gridColumn: `${m.week + 2} / span 4`, gridRow: 1, color: 'var(--color-muted-foreground)' }}
              aria-hidden
            >
              {m.label}
            </span>
          ))}
          {DAY_LABELS.map((d, i) => (
            <span
              key={i}
              className="text-[10px] leading-none self-center"
              style={{ gridColumn: 1, gridRow: i + 2, color: 'var(--color-muted-foreground)' }}
              aria-hidden
            >
              {d}
            </span>
          ))}
          {cells.map((c, i) => {
            const label = `${fmt(c.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}: ${c.answered} question${c.answered === 1 ? '' : 's'}${c.answered >= dailyGoal ? ' · goal met' : ''}`;
            return (
              <div
                key={c.date}
                title={label}
                aria-label={label}
                role="img"
                className="aspect-square rounded-[2px]"
                style={{
                  gridColumn: Math.floor(i / 7) + 2,
                  gridRow: (i % 7) + 2,
                  background: fill(level(c.answered, dailyGoal)),
                  outline: c.date === todayKey ? '1.5px solid var(--color-foreground)' : undefined,
                  outlineOffset: 1,
                }}
              />
            );
          })}
        </div>
      </ScrollToEnd>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
        <span>Darkest = daily goal of {dailyGoal} met</span>
        <span className="flex items-center gap-1" aria-hidden>
          Less
          {[0, 1, 2, 3, 4].map(l => <span key={l} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: fill(l) }} />)}
          More
        </span>
      </div>
    </section>
  );
}
