import Link from 'next/link';
import { ArrowRight, CalendarCheck, CheckCircle2, Zap, type LucideIcon } from 'lucide-react';
import { EXAM_TOOL_LINKS } from '@/constants';
import { EXAMS, type ExamKey } from '@/lib/exams';
import { formatTestDate, getNextDate, registrationLine, todayIn } from '@/lib/exams/dates';
import { SCORING, totalRange } from '@/lib/exams/scoring';
import { TOOL_ICONS } from './ExamToolsSection';
import { TOOL_THEME } from './theme';

/** Short, factual subtitle under each exam's panel title. */
const EXAM_SUBTITLE: Record<ExamKey, string> = {
  sat: 'Digital SAT · Reading & Writing and Math',
  act: 'English, Math and Reading · Science optional',
};

const TRUST_POINTS: { icon: LucideIcon; label: string }[] = [
  { icon: CalendarCheck, label: 'Official College Board & ACT dates' },
  { icon: Zap, label: 'Instant score estimates' },
  { icon: CheckCircle2, label: 'Free, no sign-up needed' },
];

/** Live, data-driven second line for each tool row. */
function toolMeta(exam: ExamKey, kind: 'dates' | 'calculator'): string {
  if (kind === 'calculator') {
    const scoring = SCORING[exam];
    const estimate = scoring.totalMethod === 'average' ? 'composite' : 'score';
    return `Superscore + ${estimate} estimate · ${totalRange(scoring)} scale`;
  }
  const { schedules } = EXAMS[exam];
  const schedule = schedules[0];
  // Name the region when an exam has several schedules (ACT: US vs Canada & international).
  const region = schedules.length > 1 ? `${schedule.shortRegion} ` : '';
  const today = todayIn(schedule.timeZone);
  const next = getNextDate(schedule, today);
  if (!next) return 'Registration deadlines and score release dates';
  return `Next ${region}test ${formatTestDate(next, 'short')} · ${registrationLine(next, today)}`;
}

function ExamPanel({ exam }: { exam: ExamKey }) {
  const info = EXAMS[exam];

  return (
    <div className="card-base p-0 overflow-hidden flex flex-col">
      {/* Navy header in the logo colour, with a gold exam pill. */}
      <div
        className="px-5 py-5 sm:px-6 flex items-center gap-4"
        style={{ background: TOOL_THEME.hubHeader }}
      >
        <span
          className="shrink-0 rounded-lg px-2.5 py-1 text-sm font-extrabold tracking-wide"
          style={{ background: TOOL_THEME.hubGold, color: TOOL_THEME.brandNavy }}
        >
          {info.name}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{info.name} Prep Tools</h3>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(239,246,255,0.92)' }}>
            {EXAM_SUBTITLE[exam]}
          </p>
        </div>
        <Link
          href={info.prepPath}
          className="hidden sm:inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-white/85 hover:text-white transition-colors"
        >
          {info.prepLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      {/* One compact row per tool: whole row is the link. */}
      <ul className="divide-y divide-(--color-border)">
        {EXAM_TOOL_LINKS[exam].map((tool) => {
          const Icon = TOOL_ICONS[tool.kind];
          return (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="group flex items-center gap-4 px-5 py-5 sm:px-6 transition-colors hover:bg-(--color-background-alt)"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: TOOL_THEME.tint }}
                >
                  <Icon className="h-5 w-5" style={{ color: TOOL_THEME.color }} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-sm sm:text-base" style={{ color: 'var(--color-foreground)' }}>
                    {tool.label}
                  </span>
                  <span className="block text-xs sm:text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                    {toolMeta(exam, tool.kind)}
                  </span>
                </span>
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ background: TOOL_THEME.tint }}
                  aria-hidden
                >
                  <ArrowRight className="h-4 w-4" style={{ color: TOOL_THEME.color }} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Compact "exam hub" for the home page: one panel per exam with its tools as
 * rows, on a warm beige band. Prep and tool pages keep the card grid
 * (ExamToolsSection); this layout is for showing several exams at once.
 */
export function ExamToolsHub({ exams }: { exams: ExamKey[] }) {
  const names = exams.map((e) => EXAMS[e].name).join(' & ');

  return (
    <section className="section-padding-sm" style={{ background: TOOL_THEME.hubBackground }}>
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span
            className="inline-block rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ borderColor: TOOL_THEME.hubGold, borderWidth: 1.5, color: 'var(--color-foreground)' }}
          >
            Free {names} Tools
          </span>
          <h2 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>
            Plan Your {names} with Confidence
          </h2>
          <div className="mx-auto mt-3 mb-4 h-1 w-16 rounded-full" style={{ background: TOOL_THEME.hubGold }} aria-hidden />
          <p className="text-sm sm:text-base" style={{ color: 'var(--color-muted-foreground)' }}>
            Official test dates, registration deadlines and score calculators, all in one place.
          </p>
        </div>

        <div className={`grid gap-6 mx-auto max-w-6xl ${exams.length > 1 ? 'lg:grid-cols-2' : 'max-w-2xl'}`}>
          {exams.map((exam) => (
            <ExamPanel key={exam} exam={exam} />
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm" style={{ color: 'var(--color-foreground)' }}>
          {TRUST_POINTS.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2 font-medium">
              <Icon className="h-4 w-4 shrink-0" style={{ color: TOOL_THEME.color }} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
