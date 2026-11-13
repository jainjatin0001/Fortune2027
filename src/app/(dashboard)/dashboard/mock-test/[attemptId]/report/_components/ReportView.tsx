'use client';

import { Fragment, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2, XCircle, MinusCircle, Clock, Target, TrendingUp, ChevronDown, ChevronRight,
  Printer, Download, ArrowLeft, Lock, Gauge, Timer, Layers, Sparkles, Hourglass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichContent } from '@/components/shared/RichContent';
import { FeedbackCard } from '@/components/shared/FeedbackCard';
import { cn } from '@/lib/utils';
import type { ScaledScore } from '@/lib/mock-test/scoring';

export interface ReportQuestion {
  key: string;
  sectionId: string;
  sectionShort: string;
  /** Number within its section, as shown during the test */
  number: number;
  statement: string;
  passage: string | null;
  difficulty: string;
  subject: string;
  topic: string | null;
  questionType: string;
  options: { id: string; content: string; isCorrect: boolean }[];
  selectedOptionIds: string[];
  textAnswer: string | null;
  acceptedAnswers: string[];
  isCorrect: boolean | null;
  isSkipped: boolean;
  timeTaken: number;
  explanation: string | null;
}

export interface ReportSection {
  id: string;
  name: string;
  shortName: string;
  timeLimit: number;
  timeTaken: number;
  earned: number;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  questionCount: number;
  accuracy: number;
  scorePct: number;
}

export interface ReportData {
  attemptId: string;
  title: string;
  programName: string | null;
  examKind: 'SAT' | 'ACT' | null;
  color: string;
  studentName: string;
  isOwnReport: boolean;
  completedAt: string;
  totalTimeTaken: number;
  totalTimeLimit: number;
  earnedScore: number;
  totalScore: number;
  percentage: number;
  accuracy: number;
  passingScore: number;
  passed: boolean;
  correct: number;
  incorrect: number;
  skipped: number;
  scaled: ScaledScore | null;
  sections: ReportSection[];
  insights: string[];
  /** Enrolled students & staff get question-level analysis */
  detailed: boolean;
  questions: ReportQuestion[];
  backHref: string | null;
}

type Result = 'correct' | 'incorrect' | 'skipped';
type Filter = 'all' | Result | 'slow';

const DIFFICULTY_ORDER = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const RESULT_META: Record<Result, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  correct: { label: 'Correct', color: 'var(--color-success)', icon: CheckCircle2 },
  incorrect: { label: 'Incorrect', color: 'var(--color-danger)', icon: XCircle },
  skipped: { label: 'Skipped', color: 'var(--color-warning)', icon: MinusCircle },
};

const resultOf = (q: ReportQuestion): Result => (q.isSkipped ? 'skipped' : q.isCorrect ? 'correct' : 'incorrect');

function fmtTime(secs: number) {
  const s = Math.max(0, Math.round(secs));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

/** Letter shown for an option during the test — ACT alternates A–D / F–J by question number */
function letterFor(index: number, number: number, kind: ReportData['examKind']) {
  return (kind === 'ACT' && number % 2 === 0 ? 'FGHJK' : 'ABCDE')[index] ?? String(index + 1);
}

function answerText(q: ReportQuestion, kind: ReportData['examKind'], which: 'given' | 'correct') {
  if (q.questionType === 'NUMERIC' || q.questionType === 'TEXT') {
    return which === 'given' ? (q.textAnswer || '—') : (q.acceptedAnswers[0] ?? '—');
  }
  const letters = q.options
    .map((o, i) => ({ o, l: letterFor(i, q.number, kind) }))
    .filter(({ o }) => (which === 'given' ? q.selectedOptionIds.includes(o.id) : o.isCorrect))
    .map(({ l }) => l);
  return letters.length ? letters.join(', ') : '—';
}

// ── Small building blocks ─────────────────────────────────────────────

function Card({ title, subtitle, icon: Icon, children, className, action }: {
  title?: string; subtitle?: string; icon?: typeof Target; children: React.ReactNode; className?: string; action?: React.ReactNode;
}) {
  return (
    <section className={cn('card-base p-5 sm:p-6 break-inside-avoid', className)}>
      {title && (
        <header className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--color-foreground)' }}>
              {Icon && <Icon className="h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />}
              {title}
            </h2>
            {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

function Meter({ value, max = 100, color = 'var(--chart-series)', label }: { value: number; max?: number; color?: string; label?: string }) {
  const w = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--chart-empty)' }}>
        <div className="h-full rounded-full" style={{ width: `${w}%`, background: color }} />
      </div>
      {label !== undefined && (
        <span className="text-xs font-semibold tabular-nums w-10 text-right" style={{ color: 'var(--color-foreground)' }}>{label}</span>
      )}
    </div>
  );
}

/** Score on its official range with a marker, e.g. 1240 on 400–1600 */
function RangeBar({ score, min, max, color }: { score: number; min: number; max: number; color: string }) {
  const at = max > min ? ((score - min) / (max - min)) * 100 : 0;
  return (
    <div>
      <div className="relative h-2.5 rounded-full" style={{ background: 'var(--chart-empty)' }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${at}%`, background: color }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2"
          style={{ left: `${at}%`, background: 'var(--color-card)', borderColor: color }}
        />
      </div>
      <div className="flex justify-between text-[11px] mt-1 tabular-nums" style={{ color: 'var(--color-muted-foreground)' }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub }: { icon: typeof Target; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="text-xl font-bold tabular-nums mt-1" style={{ color: 'var(--color-foreground)' }}>{value}</div>
      {sub && <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{sub}</div>}
    </div>
  );
}

function ResultBadge({ result }: { result: Result }) {
  const m = RESULT_META[result];
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap" style={{ color: m.color }}>
      <Icon className="h-3.5 w-3.5" /> {m.label}
    </span>
  );
}

const th = 'text-left text-[11px] font-semibold uppercase tracking-wide py-2 px-2';
const td = 'py-2.5 px-2 text-sm align-middle';

// ── Main view ─────────────────────────────────────────────────────────

export function ReportView({ report }: { report: ReportData }) {
  const router = useRouter();
  const { color, examKind, scaled } = report;
  const answered = report.correct + report.incorrect;
  const totalQs = answered + report.skipped;
  const dateLabel = new Date(report.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const printReport = () => {
    // The browser uses the page title as the PDF's file name
    const prev = document.title;
    document.title = `${report.title} — Score Report — ${report.studentName}`;
    window.print();
    document.title = prev;
  };

  return (
    <div className="space-y-5 pb-16 max-w-6xl mx-auto print:max-w-none print:space-y-4">
      {!report.detailed && (
        <div className="hidden print:block text-center py-16">
          <p className="text-lg font-bold">Printing and PDF download are available with a course plan.</p>
          <p className="text-sm mt-1">Visit the Pricing page to unlock your full score report.</p>
        </div>
      )}
      <div className={cn('space-y-5 print:space-y-4', !report.detailed && 'print:hidden')}>
      {/* Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
        {report.backHref ? (
          <Link href={report.backHref} className="flex items-center gap-1.5 text-sm font-medium hover:underline" style={{ color: 'var(--color-muted-foreground)' }}>
            <ArrowLeft className="h-4 w-4" /> Mock tests
          </Link>
        ) : (
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-medium hover:underline" style={{ color: 'var(--color-muted-foreground)' }}>
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        {report.detailed ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={printReport} className="gap-1.5">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button size="sm" onClick={printReport} className="gap-1.5 text-white" style={{ background: color, border: 'none' }} title="Choose “Save as PDF” in the print dialog">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        ) : (
          // Printing and PDF download come with a course plan
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5" title="Available with a course plan">
              <Link href="/pricing"><Lock className="h-3.5 w-3.5" /> Print</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5" title="Available with a course plan">
              <Link href="/pricing"><Lock className="h-3.5 w-3.5" /> Download PDF</Link>
            </Button>
          </div>
        )}
      </div>

      {/* ── Score hero ── */}
      <section className="card-base overflow-hidden break-inside-avoid">
        <div className="h-1.5" style={{ background: color }} />
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0" style={{ background: color }}>
                {examKind ?? 'TEST'}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>Score Report</p>
                <h1 className="text-xl sm:text-2xl font-bold capitalize truncate" style={{ color: 'var(--color-foreground)' }}>{report.title}</h1>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                  {report.studentName}{report.programName ? ` · ${report.programName}` : ''} · {dateLabel}
                </p>
              </div>
            </div>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={report.passed
                ? { background: 'var(--color-success-light)', color: 'var(--color-success)' }
                : { background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}
            >
              {report.passed ? 'Above passing score' : `Below passing (${report.passingScore}%)`}
            </span>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-10 items-center">
            {/* Total */}
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-muted-foreground)' }}>
                {scaled ? `Your ${examKind} ${scaled.total.label}` : 'Your Score'}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-6xl font-black tabular-nums leading-none" style={{ color: 'var(--color-foreground)' }}>
                  {scaled ? scaled.total.score : `${report.percentage}%`}
                </span>
                {scaled && (
                  <span className="text-lg font-semibold tabular-nums" style={{ color: 'var(--color-muted-foreground)' }}>
                    / {scaled.total.max}
                  </span>
                )}
              </div>
              <div className="mt-4 max-w-sm">
                {scaled
                  ? <RangeBar score={scaled.total.score} min={scaled.total.min} max={scaled.total.max} color={color} />
                  : <RangeBar score={report.percentage} min={0} max={100} color={color} />}
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                {report.earnedScore}/{report.totalScore} points · {report.percentage}% raw
                {scaled && ' · estimated from your raw score'}
              </p>
            </div>

            {/* Section / area scores */}
            <div className="grid sm:grid-cols-2 gap-3">
              {(scaled ? scaled.parts : report.sections.map(s => ({
                label: s.name, score: s.scorePct, min: 0, max: 100, earned: s.earned, total: s.total,
              }))).map(part => (
                <div key={part.label} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-muted-foreground)' }}>{part.label}</p>
                  <div className="flex items-baseline gap-1.5 mt-1 mb-3">
                    <span className="text-3xl font-bold tabular-nums" style={{ color: 'var(--color-foreground)' }}>
                      {scaled ? part.score : `${part.score}%`}
                    </span>
                    {scaled && <span className="text-sm tabular-nums" style={{ color: 'var(--color-muted-foreground)' }}>/ {part.max}</span>}
                  </div>
                  <RangeBar score={part.score} min={part.min} max={part.max} color={color} />
                  <p className="text-[11px] mt-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                    {part.earned}/{part.total} points
                  </p>
                </div>
              ))}
              {scaled?.note && (
                <p className="sm:col-span-2 text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{scaled.note}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 break-inside-avoid">
        <Kpi icon={Target} label="Accuracy" value={`${report.accuracy}%`} sub={`${report.correct} of ${answered} answered`} />
        <Kpi icon={CheckCircle2} label="Correct" value={String(report.correct)} sub={`of ${totalQs} questions`} />
        <Kpi icon={XCircle} label="Incorrect" value={String(report.incorrect)} />
        <Kpi icon={MinusCircle} label="Skipped" value={String(report.skipped)} />
        <Kpi icon={Clock} label="Time used" value={fmtTime(report.totalTimeTaken)} sub={`of ${fmtTime(report.totalTimeLimit)}`} />
        <Kpi icon={Timer} label="Avg / question" value={totalQs ? fmtTime(report.totalTimeTaken / totalQs) : '—'} />
      </div>

      {/* ── Sections ── */}
      <Card title="Section performance" icon={Layers}>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[640px]">
            <thead style={{ color: 'var(--color-muted-foreground)' }}>
              <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <th className={th}>Section</th>
                <th className={th}>Score</th>
                <th className={cn(th, 'text-center')}>Correct</th>
                <th className={cn(th, 'text-center')}>Incorrect</th>
                <th className={cn(th, 'text-center')}>Skipped</th>
                <th className={th}>Accuracy</th>
                <th className={th}>Time used</th>
                <th className={th}>Avg / Q</th>
              </tr>
            </thead>
            <tbody>
              {report.sections.map(s => (
                <tr key={s.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                  <td className={td}>
                    <div className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{s.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{s.questionCount} questions</div>
                  </td>
                  <td className={cn(td, 'tabular-nums font-semibold')}>{s.earned}/{s.total}</td>
                  <td className={cn(td, 'text-center tabular-nums')}>{s.correct}</td>
                  <td className={cn(td, 'text-center tabular-nums')}>{s.incorrect}</td>
                  <td className={cn(td, 'text-center tabular-nums')}>{s.skipped}</td>
                  <td className={td}><Meter value={s.accuracy} label={`${s.accuracy}%`} /></td>
                  <td className={cn(td, 'tabular-nums text-xs')}>
                    {fmtTime(s.timeTaken)} <span style={{ color: 'var(--color-muted-foreground)' }}>/ {fmtTime(s.timeLimit)}</span>
                  </td>
                  <td className={cn(td, 'tabular-nums text-xs')}>{s.questionCount ? fmtTime(s.timeTaken / s.questionCount) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {report.insights.length > 0 && (
        <Card title="Key takeaways" icon={Sparkles}>
          <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2.5">
            {report.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-foreground)' }}>
                <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" style={{ color }} />
                {insight}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {report.detailed ? <DetailedAnalysis report={report} /> : <LockedDetails color={color} />}

      <FeedbackCard subject={`Mock test feedback: ${report.title}`} className="break-inside-avoid" />
      </div>
    </div>
  );
}

// ── Locked (signed-up, not enrolled) ──────────────────────────────────

function LockedDetails({ color }: { color: string }) {
  const features = [
    'Every question with your answer, the correct answer and a full explanation',
    'Time spent on each question and where you lost time',
    'Accuracy by difficulty — Easy, Medium, Hard',
    'Topic-by-topic strengths and weak spots',
  ];
  return (
    <section className="card-base relative overflow-hidden print:hidden" aria-label="Detailed report (locked)">
      {/* Decorative preview of the locked analysis — fills the card behind the call to action */}
      <div className="absolute inset-0 p-6 space-y-4 select-none blur-[5px] opacity-50 pointer-events-none" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-8 rounded" style={{ background: 'var(--chart-empty)' }} />
            <div className="h-4 flex-1 rounded" style={{ background: 'var(--chart-empty)' }} />
            <div className="h-4 w-20 rounded" style={{ background: i % 3 === 1 ? 'var(--color-danger-light)' : 'var(--color-success-light)' }} />
            <div className="h-4 w-14 rounded" style={{ background: 'var(--chart-empty)' }} />
          </div>
        ))}
      </div>

      {/* In normal flow, so the section always grows to fit the whole card */}
      <div className="relative flex justify-center px-4 py-10 sm:py-12" style={{ background: 'color-mix(in srgb, var(--color-card) 45%, transparent)' }}>
        <div className="max-w-md w-full rounded-2xl border p-6 sm:p-7 text-center shadow-xl" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <span className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
            <Lock className="h-5 w-5" style={{ color }} />
          </span>
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>Unlock your detailed report</h2>
          <p className="text-sm mt-1 mb-5" style={{ color: 'var(--color-muted-foreground)' }}>
            See exactly where you&apos;re losing points — available with any course plan.
          </p>
          <ul className="text-left space-y-2 mb-6">
            {features.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-foreground)' }}>
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--color-success)' }} /> {f}
              </li>
            ))}
          </ul>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: color }}
          >
            <Lock className="h-4 w-4" /> View plans &amp; unlock
          </Link>
          <p className="text-xs mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
            Your scores above stay free — this unlocks the question-level analysis.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Detailed analysis (enrolled students & staff) ──────────────────────

function DetailedAnalysis({ report }: { report: ReportData }) {
  const { questions, examKind } = report;
  const [filter, setFilter] = useState<Filter>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<ReportQuestion | null>(null);

  // Average time per question in each section — the yardstick for "slow"
  const sectionAvg = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of report.sections) {
      const qs = questions.filter(q => q.sectionId === s.id);
      m.set(s.id, qs.length ? qs.reduce((n, q) => n + q.timeTaken, 0) / qs.length : 0);
    }
    return m;
  }, [questions, report.sections]);
  const isSlow = (q: ReportQuestion) => q.timeTaken >= 30 && q.timeTaken > 1.5 * (sectionAvg.get(q.sectionId) ?? 0);

  const byDifficulty = useMemo(() => DIFFICULTY_ORDER.flatMap(d => {
    const qs = questions.filter(q => q.difficulty === d);
    if (!qs.length) return [];
    const correct = qs.filter(q => resultOf(q) === 'correct').length;
    const incorrect = qs.filter(q => resultOf(q) === 'incorrect').length;
    return [{
      difficulty: d, total: qs.length, correct, incorrect, skipped: qs.length - correct - incorrect,
      accuracy: pct(correct, qs.length), avgTime: qs.reduce((n, q) => n + q.timeTaken, 0) / qs.length,
    }];
  }), [questions]);

  const byTopic = useMemo(() => {
    const m = new Map<string, { topic: string; subject: string; qs: ReportQuestion[] }>();
    for (const q of questions) {
      const key = `${q.subject}||${q.topic ?? ''}`;
      const e = m.get(key) ?? { topic: q.topic ?? q.subject, subject: q.subject, qs: [] };
      e.qs.push(q);
      m.set(key, e);
    }
    return [...m.values()].map(e => {
      const correct = e.qs.filter(q => resultOf(q) === 'correct').length;
      const incorrect = e.qs.filter(q => resultOf(q) === 'incorrect').length;
      return {
        ...e, total: e.qs.length, correct, incorrect, skipped: e.qs.length - correct - incorrect,
        accuracy: pct(correct, e.qs.length), avgTime: e.qs.reduce((n, q) => n + q.timeTaken, 0) / e.qs.length,
      };
    }).sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
  }, [questions]);

  const counts = {
    all: questions.length,
    correct: questions.filter(q => resultOf(q) === 'correct').length,
    incorrect: questions.filter(q => resultOf(q) === 'incorrect').length,
    skipped: questions.filter(q => resultOf(q) === 'skipped').length,
    slow: questions.filter(isSlow).length,
  };

  const visible = questions.filter(q =>
    (filter === 'all' || (filter === 'slow' ? isSlow(q) : resultOf(q) === filter))
    && (sectionFilter === 'all' || q.sectionId === sectionFilter)
    && (difficultyFilter === 'all' || q.difficulty === difficultyFilter));

  const maxTime = Math.max(1, ...questions.map(q => q.timeTaken));
  const toggle = (key: string) => setOpen(prev => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  const selectCls = 'h-8 rounded-lg border px-2 text-xs bg-transparent';

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Difficulty */}
        <Card title="Accuracy by difficulty" subtitle="How you handled easy versus hard questions" icon={Gauge}>
          <table className="w-full">
            <thead style={{ color: 'var(--color-muted-foreground)' }}>
              <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <th className={th}>Difficulty</th>
                <th className={cn(th, 'text-center')}>Qs</th>
                <th className={cn(th, 'text-center')}>✓ / ✗ / –</th>
                <th className={th}>Accuracy</th>
                <th className={th}>Avg time</th>
              </tr>
            </thead>
            <tbody>
              {byDifficulty.map(d => (
                <tr key={d.difficulty} className="border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                  <td className={cn(td, 'font-semibold')}>{titleCase(d.difficulty)}</td>
                  <td className={cn(td, 'text-center tabular-nums')}>{d.total}</td>
                  <td className={cn(td, 'text-center tabular-nums text-xs')}>{d.correct} / {d.incorrect} / {d.skipped}</td>
                  <td className={td}><Meter value={d.accuracy} label={`${d.accuracy}%`} /></td>
                  <td className={cn(td, 'tabular-nums text-xs')}>{fmtTime(d.avgTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Pacing */}
        <Card title="Time per question" subtitle="Bar height = time spent · colour = result" icon={Hourglass}>
          <div className="space-y-4">
            {report.sections.map(s => {
              const qs = questions.filter(q => q.sectionId === s.id);
              if (!qs.length) return null;
              return (
                <div key={s.id}>
                  <div className="flex items-baseline justify-between text-xs mb-1">
                    <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{s.shortName}</span>
                    <span className="tabular-nums" style={{ color: 'var(--color-muted-foreground)' }}>avg {fmtTime(sectionAvg.get(s.id) ?? 0)}</span>
                  </div>
                  <div className="flex items-end gap-[2px] h-14" onMouseLeave={() => setHovered(null)}>
                    {qs.map(q => (
                      <button
                        key={q.key}
                        type="button"
                        onMouseEnter={() => setHovered(q)}
                        onFocus={() => setHovered(q)}
                        onClick={() => { setFilter('all'); setSectionFilter('all'); setDifficultyFilter('all'); setOpen(new Set([q.key])); document.getElementById(`q-${q.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                        aria-label={`${s.shortName} question ${q.number}: ${RESULT_META[resultOf(q)].label}, ${fmtTime(q.timeTaken)}`}
                        className="flex-1 min-w-[3px] h-full flex items-end"
                      >
                        <span
                          className="w-full rounded-t-[3px]"
                          style={{
                            height: `${Math.max(6, (q.timeTaken / maxTime) * 100)}%`,
                            background: RESULT_META[resultOf(q)].color,
                            opacity: hovered && hovered.key !== q.key ? 0.45 : 1,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              <div className="flex gap-3">
                {(Object.keys(RESULT_META) as Result[]).map(r => (
                  <span key={r} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: RESULT_META[r].color }} /> {RESULT_META[r].label}
                  </span>
                ))}
              </div>
              <span className="tabular-nums min-h-4" style={{ color: 'var(--color-foreground)' }}>
                {hovered
                  ? `${hovered.sectionShort} Q${hovered.number} · ${titleCase(hovered.difficulty)} · ${fmtTime(hovered.timeTaken)} · ${RESULT_META[resultOf(hovered)].label}`
                  : 'Hover a bar for details'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Topics */}
      <Card title="Topic analysis" subtitle="Weakest topics first — where focused practice pays off most" icon={Target}>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[600px]">
            <thead style={{ color: 'var(--color-muted-foreground)' }}>
              <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <th className={th}>Topic</th>
                <th className={cn(th, 'text-center')}>Qs</th>
                <th className={cn(th, 'text-center')}>Correct</th>
                <th className={cn(th, 'text-center')}>Incorrect</th>
                <th className={cn(th, 'text-center')}>Skipped</th>
                <th className={th}>Accuracy</th>
                <th className={th}>Avg time</th>
              </tr>
            </thead>
            <tbody>
              {byTopic.map(t => (
                <tr key={`${t.subject}-${t.topic}`} className="border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                  <td className={td}>
                    <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>{t.topic}</div>
                    {t.topic !== t.subject && <div className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{t.subject}</div>}
                  </td>
                  <td className={cn(td, 'text-center tabular-nums')}>{t.total}</td>
                  <td className={cn(td, 'text-center tabular-nums')}>{t.correct}</td>
                  <td className={cn(td, 'text-center tabular-nums')}>{t.incorrect}</td>
                  <td className={cn(td, 'text-center tabular-nums')}>{t.skipped}</td>
                  <td className={td}><Meter value={t.accuracy} label={`${t.accuracy}%`} /></td>
                  <td className={cn(td, 'tabular-nums text-xs')}>{fmtTime(t.avgTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Question by question */}
      <Card
        title="Question-by-question review"
        subtitle="Click a row to see the question, every choice and the explanation"
        icon={Layers}
        className="print:break-inside-auto"
      >
        <div className="flex flex-wrap items-center gap-2 mb-4 print:hidden">
          <div className="inline-flex flex-wrap rounded-lg p-0.5 gap-0.5" style={{ background: 'var(--color-muted)' }} role="group" aria-label="Filter by result">
            {([
              ['all', 'All'], ['incorrect', 'Incorrect'], ['skipped', 'Skipped'], ['correct', 'Correct'], ['slow', 'Slow'],
            ] as [Filter, string][]).map(([f, label]) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
                style={filter === f
                  ? { background: 'var(--color-card)', color: 'var(--color-foreground)', boxShadow: '0 1px 2px rgb(0 0 0 / 0.08)' }
                  : { color: 'var(--color-muted-foreground)' }}
              >
                {label} <span className="tabular-nums opacity-70">{counts[f]}</span>
              </button>
            ))}
          </div>
          <select className={selectCls} style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }} value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} aria-label="Section">
            <option value="all">All sections</option>
            {report.sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className={selectCls} style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }} value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)} aria-label="Difficulty">
            <option value="all">All difficulties</option>
            {DIFFICULTY_ORDER.filter(d => questions.some(q => q.difficulty === d)).map(d => <option key={d} value={d}>{titleCase(d)}</option>)}
          </select>
          <button
            className="ml-auto text-xs font-semibold underline"
            style={{ color: 'var(--color-muted-foreground)' }}
            onClick={() => setOpen(open.size ? new Set() : new Set(visible.map(q => q.key)))}
          >
            {open.size ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[760px]">
            <thead style={{ color: 'var(--color-muted-foreground)' }}>
              <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <th className={th}>Q</th>
                <th className={th}>Topic</th>
                <th className={th}>Difficulty</th>
                <th className={th}>Result</th>
                <th className={cn(th, 'text-center')}>Your answer</th>
                <th className={cn(th, 'text-center')}>Correct</th>
                <th className={th}>Time</th>
                <th className="w-6 print:hidden" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No questions match these filters.</td></tr>
              )}
              {visible.map(q => {
                const isOpen = open.has(q.key);
                const result = resultOf(q);
                const slow = isSlow(q);
                return (
                  <Fragment key={q.key}>
                    <tr
                      id={`q-${q.key}`}
                      onClick={() => toggle(q.key)}
                      className="border-b cursor-pointer transition-colors hover:bg-(--color-muted) break-inside-avoid"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <td className={cn(td, 'whitespace-nowrap')}>
                        <span className="font-semibold tabular-nums" style={{ color: 'var(--color-foreground)' }}>{q.number}</span>
                        <span className="text-[11px] ml-1" style={{ color: 'var(--color-muted-foreground)' }}>{q.sectionShort}</span>
                      </td>
                      <td className={td}>
                        <div className="text-sm truncate max-w-[260px]" style={{ color: 'var(--color-foreground)' }}>{q.topic ?? q.subject}</div>
                        {q.topic && <div className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{q.subject}</div>}
                      </td>
                      <td className={cn(td, 'text-xs')}>{titleCase(q.difficulty)}</td>
                      <td className={td}><ResultBadge result={result} /></td>
                      <td className={cn(td, 'text-center font-semibold tabular-nums')}>{answerText(q, examKind, 'given')}</td>
                      <td className={cn(td, 'text-center font-semibold tabular-nums')}>{answerText(q, examKind, 'correct')}</td>
                      <td className={cn(td, 'whitespace-nowrap')}>
                        <span className="tabular-nums text-xs">{fmtTime(q.timeTaken)}</span>
                        {slow && (
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
                            SLOW
                          </span>
                        )}
                      </td>
                      <td className="pr-2 print:hidden">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <td colSpan={8} className="px-2 py-4" style={{ background: 'var(--color-muted)' }}>
                          <QuestionDetail q={q} kind={examKind} avg={sectionAvg.get(q.sectionId) ?? 0} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function QuestionDetail({ q, kind, avg }: { q: ReportQuestion; kind: ReportData['examKind']; avg: number }) {
  const typed = q.questionType === 'NUMERIC' || q.questionType === 'TEXT';
  return (
    <div className={cn('grid gap-4', q.passage ? 'lg:grid-cols-2' : 'max-w-3xl')}>
      {q.passage && (
        <RichContent
          html={q.passage}
          className="text-sm leading-relaxed p-4 rounded-lg border max-h-80 overflow-y-auto print:max-h-none"
          style={{ color: 'var(--color-foreground)', background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        />
      )}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
          <span>{q.sectionShort} · Question {q.number}</span>
          <span>{titleCase(q.difficulty)}</span>
          <span>{fmtTime(q.timeTaken)} spent{avg > 0 ? ` (section avg ${fmtTime(avg)})` : ''}</span>
        </div>
        <RichContent html={q.statement} className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }} />
        {typed ? (
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <div
              className="p-2.5 rounded-lg border"
              style={q.isSkipped
                ? { borderColor: 'var(--color-border)', background: 'var(--color-card)' }
                : q.isCorrect
                  ? { background: 'var(--color-success-light)', borderColor: 'var(--color-success)' }
                  : { background: 'var(--color-danger-light)', borderColor: 'var(--color-danger)' }}
            >
              Your answer: <strong>{q.textAnswer || '—'}</strong>
            </div>
            <div className="p-2.5 rounded-lg border" style={{ background: 'var(--color-success-light)', borderColor: 'var(--color-success)' }}>
              Accepted: <strong>{q.acceptedAnswers.join(', ') || '—'}</strong>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {q.options.map((opt, i) => {
              const picked = q.selectedOptionIds.includes(opt.id);
              const style = opt.isCorrect
                ? { background: 'var(--color-success-light)', borderColor: 'var(--color-success)' }
                : picked
                  ? { background: 'var(--color-danger-light)', borderColor: 'var(--color-danger)' }
                  : { background: 'var(--color-card)', borderColor: 'var(--color-border)' };
              return (
                <div key={opt.id} className="flex items-start gap-2.5 p-2.5 rounded-lg border text-sm" style={style}>
                  <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0" style={{ borderColor: 'currentColor' }}>
                    {letterFor(i, q.number, kind)}
                  </span>
                  <RichContent as="span" html={opt.content} className="flex-1 pt-0.5" style={{ color: 'var(--color-foreground)' }} />
                  {opt.isCorrect && <span className="text-[11px] font-bold shrink-0 pt-1" style={{ color: 'var(--color-success)' }}>CORRECT</span>}
                  {picked && !opt.isCorrect && <span className="text-[11px] font-bold shrink-0 pt-1" style={{ color: 'var(--color-danger)' }}>YOUR ANSWER</span>}
                  {picked && opt.isCorrect && <span className="sr-only">Your answer</span>}
                </div>
              );
            })}
          </div>
        )}
        {q.explanation && (
          <div className="p-3 rounded-lg border-l-4" style={{ background: 'var(--color-card)', borderColor: 'var(--chart-series)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>Explanation</p>
            <RichContent html={q.explanation} className="text-sm" style={{ color: 'var(--color-foreground)' }} />
          </div>
        )}
      </div>
    </div>
  );
}
