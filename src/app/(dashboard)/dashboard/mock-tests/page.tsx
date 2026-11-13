import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight, BookOpen, CheckCircle, ClipboardList, Clock, FileText, Layers, MonitorCheck, RotateCcw, BarChart3,
} from 'lucide-react';
import { getDbUser } from '@/lib/auth';
import { htmlToText } from '@/components/admin/RichEditor/utils/htmlToText';
import { getDemoMockTests, type DemoMockTestSummary } from '@/lib/mock-test/demo';
import { EXAM_KIND_META } from '@/lib/mock-test/exam-kind';
import { MOCK_TESTS_PATH, mockTestPlayHref } from '@/lib/mock-test/paths';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Mock Tests' };

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const colorOf = (t: DemoMockTestSummary) => (t.kind ? EXAM_KIND_META[t.kind].color : 'var(--color-primary)');

export default async function MockTestsPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const [{ program: programParam }, tests] = await Promise.all([searchParams, getDemoMockTests(user.id)]);

  // Programs that have free tests, in the order tests are listed
  const programs = [...new Map(tests.map(t => [t.program.slug, t.program])).values()];
  const selected = programs.find(p => p.slug === programParam) ?? null;
  const visible = selected ? tests.filter(t => t.program.slug === selected.slug) : tests;
  const groups = programs
    .filter(p => !selected || p.slug === selected.slug)
    .map(p => ({ program: p, tests: visible.filter(t => t.program.slug === p.slug) }));

  const chip = (active: boolean) => cn(
    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
    active ? 'text-white border-transparent' : 'hover:bg-(--color-muted)',
  );

  return (
    <div className="space-y-7 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            <ClipboardList className="h-5 w-5" />
          </span>
          <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Mock Tests</h1>
        </div>
        <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
          Free full-length mock tests in an interface that works like the real exam. Every attempt is scored,
          saved to your dashboard and comes with a score report.
        </p>
      </div>

      {/* What to expect */}
      <div className="card-base p-5 grid sm:grid-cols-3 gap-4">
        {[
          { icon: MonitorCheck, label: 'Real Test-Day Interface', sub: 'Timed sections, mark for review, answer eliminator and review page' },
          { icon: BarChart3, label: 'Scaled Scores', sub: 'SAT 400–1600 and ACT 1–36, with section scores' },
          { icon: CheckCircle, label: 'Tracked Progress', sub: 'Scores feed your dashboard so you can see your trend' },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <item.icon className="h-5 w-5 mt-0.5 shrink-0" style={{ color: 'var(--color-primary)' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 ? (
        <div className="card-base p-10 text-center">
          <FileText className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-muted-foreground)' }} />
          <p className="font-semibold" style={{ color: 'var(--color-foreground)' }}>No mock tests yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            New full-length tests are added regularly — check back soon.
          </p>
        </div>
      ) : (
        <>
          {/* Program filter */}
          <nav aria-label="Filter by program" className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider mr-1" style={{ color: 'var(--color-muted-foreground)' }}>
              Program
            </span>
            <Link
              href={MOCK_TESTS_PATH}
              aria-current={!selected ? 'page' : undefined}
              className={chip(!selected)}
              style={!selected
                ? { background: 'var(--color-foreground)', color: 'var(--color-background)' }
                : { borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
            >
              All <span className="tabular-nums opacity-70">{tests.length}</span>
            </Link>
            {programs.map(p => {
              const active = selected?.slug === p.slug;
              const sample = tests.find(t => t.program.slug === p.slug)!;
              const count = tests.filter(t => t.program.slug === p.slug).length;
              return (
                <Link
                  key={p.slug}
                  href={`${MOCK_TESTS_PATH}?program=${encodeURIComponent(p.slug)}`}
                  aria-current={active ? 'page' : undefined}
                  className={chip(active)}
                  style={active ? { background: colorOf(sample) } : { borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
                >
                  {!active && <span className="w-2 h-2 rounded-full" style={{ background: colorOf(sample) }} />}
                  {p.name} <span className="tabular-nums opacity-70">{count}</span>
                </Link>
              );
            })}
          </nav>

          {groups.map(({ program, tests: list }) => (
            <section key={program.slug} className="space-y-3">
              <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>
                {program.name}
              </h2>
              {list.map((test, idx) => <TestCard key={test.id} test={test} index={idx + 1} />)}
            </section>
          ))}
        </>
      )}
    </div>
  );
}

function TestCard({ test, index }: { test: DemoMockTestSummary; index: number }) {
  const color = colorOf(test);
  const description = test.description ? htmlToText(test.description, 160) : '';
  const last = test.lastAttempt;
  const lastScore = last
    ? last.scaledScore !== null && test.kind
      ? `${test.kind} ${last.scaledScore}`
      : `${last.percentage}%`
    : null;

  return (
    <div className="card-base p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
      <div
        className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-white shrink-0 leading-none"
        style={{ background: color }}
      >
        {test.kind && <span className="text-[10px] font-bold opacity-80 mb-0.5">{test.kind}</span>}
        <span className="text-lg">{index}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base capitalize" style={{ color: 'var(--color-foreground)' }}>{test.title}</h3>
        {description && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{description}</p>
        )}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mt-2">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            <BookOpen className="h-3.5 w-3.5" /> {test.totalQuestions} questions
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            <Clock className="h-3.5 w-3.5" /> {formatTime(test.totalTimeSeconds)}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            <Layers className="h-3.5 w-3.5" /> {test.sectionCount} sections
          </span>
          {lastScore && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)' }}>
              Last score {lastScore} · {test.attemptCount} attempt{test.attemptCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {last && (
          <Link
            href={`/dashboard/mock-test/${last.id}/report`}
            className="text-sm font-semibold px-3 py-2 rounded-lg border transition-opacity hover:opacity-80"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
          >
            Report
          </Link>
        )}
        <Link
          href={mockTestPlayHref(test.id)}
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 group"
          style={{ background: color }}
        >
          {last ? <><RotateCcw className="h-4 w-4" /> Retake</> : <>Start</>}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
