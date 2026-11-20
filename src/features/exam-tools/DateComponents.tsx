import { CalendarCheck, ChevronDown, ExternalLink } from 'lucide-react';
import {
  type DateStatus,
  type ExamSchedule,
  type ExamTestDate,
  type StudyPlanContent,
  RECOMMENDED_PREP_WEEKS,
  buildStudyPlan,
  daysBetween,
  formatDate,
  formatTestDate,
  getDateStatus,
  relativeDays,
  todayIn,
} from '@/lib/exams/dates';
import { TOOL_THEME } from './theme';

const STATUS_STYLES: Record<DateStatus, { label: string; bg: string; color: string }> = {
  open: { label: 'Registration open', bg: '#dcfce7', color: '#166534' },
  late: { label: 'Late registration', bg: '#fef3c7', color: '#92400e' },
  closed: { label: 'Registration closed', bg: '#e2e8f0', color: '#334155' },
  past: { label: 'Test taken', bg: '#f1f5f9', color: '#475569' },
};

export function StatusBadge({ status, lateFee }: { status: DateStatus; lateFee?: number }) {
  const s = STATUS_STYLES[status];
  const label = status === 'late' && lateFee ? `${s.label} (+$${lateFee})` : s.label;
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {label}
    </span>
  );
}

/**
 * Highlight card for the next upcoming test date of one schedule.
 * - `wide` (default): one full-width row, for exams with a single schedule (SAT).
 * - `compact`: stacked card for side-by-side use, e.g. ACT US + Canada.
 */
export function NextTestCard({
  examName,
  schedule,
  date,
  showRegion = false,
  layout = 'wide',
}: {
  examName: string;
  schedule: ExamSchedule;
  date: ExamTestDate;
  /** Add the region to the label, for exams with more than one schedule. */
  showRegion?: boolean;
  layout?: 'wide' | 'compact';
}) {
  const today = todayIn(schedule.timeZone);
  const status = getDateStatus(date, today);
  const deadline = status === 'open' ? date.registrationDeadline : date.lateDeadline;
  const daysToDeadline = daysBetween(today, deadline);
  const compact = layout === 'compact';

  const icon = (
    <div
      className={`${compact ? 'w-11 h-11 rounded-xl' : 'w-14 h-14 rounded-2xl'} flex items-center justify-center shrink-0`}
      style={{ background: TOOL_THEME.tint }}
    >
      <CalendarCheck className={compact ? 'h-5 w-5' : 'h-7 w-7'} style={{ color: TOOL_THEME.color }} aria-hidden />
    </div>
  );

  const label = (
    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: TOOL_THEME.color }}>
      Next {examName}
      {showRegion && ` · ${schedule.shortRegion}`}
    </p>
  );

  const details = (
    <div className="space-y-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <StatusBadge status={status} lateFee={schedule.lateFee} />
        <span>Test day is {relativeDays(daysBetween(today, date.testDate))}.</span>
      </div>
      {(status === 'open' || status === 'late') && (
        <p>
          {status === 'open' ? 'Registration' : 'Late registration'} closes{' '}
          <strong style={{ color: 'var(--color-foreground)' }}>
            {daysToDeadline === 0 ? 'today' : formatDate(deadline, 'short')}
          </strong>
          {schedule.deadlineTime ? ` at ${schedule.deadlineTime}` : ''}.
        </p>
      )}
    </div>
  );

  const button = (
    <a
      href={schedule.registerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shrink-0 transition-opacity hover:opacity-90"
      style={{ background: TOOL_THEME.button }}
    >
      {schedule.registerLabel} <ExternalLink className="h-4 w-4" aria-hidden />
    </a>
  );

  if (compact) {
    return (
      <div className="card-base p-6 h-full flex flex-col" style={{ borderTop: `3px solid ${TOOL_THEME.color}` }}>
        <div className="flex items-center gap-3 mb-4">
          {icon}
          {label}
        </div>
        <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--color-foreground)' }}>
          {formatTestDate(date)}
        </h2>
        <div className="flex-1 mb-6">{details}</div>
        {button}
      </div>
    );
  }

  return (
    <div className="card-base p-6 sm:p-8" style={{ borderTop: `3px solid ${TOOL_THEME.color}` }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="mb-1">{label}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--color-foreground)' }}>
            {formatTestDate(date)}
          </h2>
          {details}
        </div>
        {button}
      </div>
    </div>
  );
}

const TH = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider';
const TD = 'px-4 py-3 align-top';

/** Full date table for one schedule. The score release column appears only when the source publishes it. */
export function DatesTable({ examName, schedule }: { examName: string; schedule: ExamSchedule }) {
  const today = todayIn(schedule.timeZone);
  const hasScores = schedule.dates.some((d) => d.scoreRelease);

  return (
    <div className="card-base overflow-x-auto p-0">
      <table className="w-full min-w-180 text-sm">
        <caption className="sr-only">
          {examName} test dates and registration deadlines: {schedule.region}
        </caption>
        <thead style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)' }}>
          <tr>
            <th scope="col" className={TH}>Test date</th>
            <th scope="col" className={TH}>Registration deadline</th>
            <th scope="col" className={TH}>Late registration</th>
            {hasScores && <th scope="col" className={TH}>Scores released</th>}
            <th scope="col" className={TH}>Status</th>
          </tr>
        </thead>
        <tbody>
          {schedule.dates.map((d) => {
            const status = getDateStatus(d, today);
            const past = status === 'past';
            return (
              <tr
                key={d.testDate}
                className="border-t"
                style={{
                  borderColor: 'var(--color-border)',
                  color: past ? 'var(--color-muted-foreground)' : 'var(--color-foreground)',
                }}
              >
                <th scope="row" className={`${TD} text-left whitespace-nowrap ${past ? 'font-medium' : 'font-semibold'}`}>
                  {formatTestDate(d)}
                </th>
                <td className={`${TD} whitespace-nowrap`}>{formatDate(d.registrationDeadline, 'short')}</td>
                <td className={`${TD} whitespace-nowrap`}>{formatDate(d.lateDeadline, 'short')}</td>
                {hasScores && (
                  <td className={`${TD} whitespace-nowrap`}>{d.scoreRelease ? formatDate(d.scoreRelease, 'short') : '—'}</td>
                )}
                <td className={TD}><StatusBadge status={status} lateFee={schedule.lateFee} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Expandable week-by-week plan for one test date. */
export function StudyPlan({
  examName,
  date,
  today,
  content,
  defaultOpen,
}: {
  examName: string;
  date: ExamTestDate;
  today: string;
  content: StudyPlanContent;
  defaultOpen?: boolean;
}) {
  const phases = buildStudyPlan(date.testDate, content);
  const startBy = phases[0].start;
  const weeksLeft = Math.floor(daysBetween(today, date.testDate) / 7);
  const isLate = today > startBy;

  return (
    // Rows sit inside StudyPlanList's single card, separated by dividers.
    <details className="group" open={defaultOpen}>
      {/* The section heading already says "study plan", so each row only names its date. */}
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-1 transition-colors hover:bg-[var(--color-background-alt)]">
        <span className="font-semibold text-base flex-1 min-w-40" style={{ color: 'var(--color-foreground)' }}>
          {formatTestDate(date)}
          <span className="sr-only"> {examName} study plan</span>
        </span>
        <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          {isLate ? `${weeksLeft} weeks left` : `Start by ${formatDate(startBy, 'short')}`}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: TOOL_THEME.color }}>
          <span className="group-open:hidden">Show plan</span>
          <span className="hidden group-open:inline">Hide plan</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
        </span>
      </summary>

      <div className="px-5 pb-5 pt-1">
        {date.bestFor && (
          <p className="text-sm mb-5" style={{ color: 'var(--color-muted-foreground)' }}>
            <strong style={{ color: 'var(--color-foreground)' }}>Best for:</strong> {date.bestFor}
          </p>
        )}

        {isLate && (
          <p className="text-sm mb-5 rounded-lg px-4 py-3" style={{ background: '#fef3c7', color: '#92400e' }}>
            Fewer than {RECOMMENDED_PREP_WEEKS} weeks left? Take a diagnostic test this week, focus on your
            2–3 weakest skills, and fit in at least two full timed practice tests before test day.
          </p>
        )}

        <ol className="grid gap-4 sm:grid-cols-2">
          {phases.map((phase) => (
            <li key={phase.title} className="rounded-xl p-4" style={{ background: 'var(--color-background-alt)' }}>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>
                {phase.title}
              </p>
              <p className="text-xs mb-3" style={{ color: TOOL_THEME.color }}>
                {formatDate(phase.start, 'short')} – {formatDate(phase.end, 'short')}
              </p>
              <ul className="space-y-1.5 text-sm list-disc pl-4" style={{ color: 'var(--color-foreground)' }}>
                {phase.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

/** Study plans for every upcoming date of a schedule. The first plan opens by default. */
export function StudyPlanList({
  examName,
  schedule,
  content,
  openFirst = true,
  showRegionLabel = false,
}: {
  examName: string;
  schedule: ExamSchedule;
  content: StudyPlanContent;
  openFirst?: boolean;
  /** Small group label (e.g. "US dates") for exams with more than one schedule. */
  showRegionLabel?: boolean;
}) {
  const today = todayIn(schedule.timeZone);
  const upcoming = schedule.dates.filter((d) => d.testDate > today);
  if (!upcoming.length) return null;
  return (
    <div>
      {showRegionLabel && (
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: TOOL_THEME.color }}>
          {schedule.shortRegion} test dates
        </h3>
      )}
      <div className="card-base p-0 overflow-hidden divide-y divide-(--color-border)">
      {upcoming.map((d, i) => (
        <StudyPlan
          key={d.testDate}
          examName={examName}
          date={d}
          today={today}
          content={content}
          defaultOpen={openFirst && i === 0}
        />
      ))}
      </div>
    </div>
  );
}
