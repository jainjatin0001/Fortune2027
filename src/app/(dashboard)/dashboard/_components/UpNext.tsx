import Link from 'next/link';
import { ArrowRight, ClipboardList, Lock, PlayCircle, Target } from 'lucide-react';
import type { UpNextItem } from '@/lib/progress/queries';
import { SectionCard } from './SectionCard';

type Feature = 'practice' | 'course' | 'mock';

const META: Record<Feature, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  practice: { label: 'Practice your weakest area', icon: Target, color: 'var(--color-danger)' },
  course: { label: 'Continue your course', icon: PlayCircle, color: 'var(--chart-series)' },
  mock: { label: 'Take a full mock test', icon: ClipboardList, color: 'var(--color-sat)' },
};

const LOCKED_COPY: Record<'course' | 'mock', { title: string; body: string }> = {
  course: { title: 'Guided lessons', body: 'Video lessons, notes and chapter quizzes in a structured course.' },
  mock: { title: 'Full-length mock tests', body: 'Timed, exam-style tests with section scores and a detailed report.' },
};

const EMPTY_COPY: Record<Feature, { title: string; body: string }> = {
  practice: { title: 'No quizzes yet', body: 'New quizzes are on the way — check back soon.' },
  course: { title: 'Course complete', body: 'You’ve finished every lesson in your courses. Great work!' },
  mock: { title: 'No mock tests yet', body: 'Your course doesn’t include a mock test yet.' },
};

function featureOf(item: UpNextItem): Feature {
  return item.kind === 'locked' || item.kind === 'empty' ? item.feature : item.kind;
}

function Shell({ feature, locked, children }: { feature: Feature; locked?: boolean; children: React.ReactNode }) {
  const { label, icon: Icon, color } = META[feature];
  return (
    <div
      className="relative rounded-xl border p-4 flex flex-col gap-3 h-full"
      style={{
        borderColor: 'var(--color-border)',
        background: locked ? 'var(--color-muted)' : 'var(--color-card)',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0" style={{ opacity: locked ? 0.55 : 1 }}>
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide truncate" style={{ color: 'var(--color-muted-foreground)' }}>
            {label}
          </span>
        </div>
        {locked && (
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
            aria-label="Locked"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Action({ href, label, variant = 'primary' }: { href: string; label: string; variant?: 'primary' | 'outline' }) {
  return (
    <Link
      href={href}
      className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg px-3 h-9 text-sm font-semibold transition-opacity hover:opacity-90"
      style={variant === 'primary'
        ? { background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }
        : { border: '1px solid var(--color-border-strong)', color: 'var(--color-foreground)', background: 'var(--color-card)' }}
    >
      {label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <p className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: 'var(--color-foreground)' }}>{children}</p>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{children}</p>;
}

function UpNextCard({ item }: { item: UpNextItem }) {
  const feature = featureOf(item);

  switch (item.kind) {
    case 'practice':
      return (
        <Shell feature={feature}>
          <div className="space-y-1">
            {item.subjectName
              ? <Title>{item.subjectName} · {item.accuracy}% accuracy</Title>
              : <Title>Start building your skills</Title>}
            <Sub>Suggested quiz: {item.quizTitle}</Sub>
          </div>
          <Action href={item.href} label="Start quiz" />
        </Shell>
      );
    case 'course':
      return (
        <Shell feature={feature}>
          <div className="space-y-2">
            <Title>{item.courseTitle}</Title>
            {item.nextLesson && <Sub>Next: {item.nextLesson}</Sub>}
            <div className="flex items-center gap-2">
              <div className="progress-track flex-1"><div className="progress-fill" style={{ width: `${item.completionPct}%`, background: 'var(--chart-series)' }} /></div>
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: 'var(--color-foreground)' }}>{item.completionPct}%</span>
            </div>
          </div>
          <Action href={item.href} label="Resume" />
        </Shell>
      );
    case 'mock':
      return (
        <Shell feature={feature}>
          <div className="space-y-1">
            <Title>{item.title}</Title>
            <Sub>
              {item.daysSinceLast === null
                ? 'You haven’t taken a mock test yet — see where you stand.'
                : `Last mock test ${item.daysSinceLast === 0 ? 'today' : `${item.daysSinceLast} day${item.daysSinceLast === 1 ? '' : 's'} ago`}${item.attemptedBefore ? ' · retake to measure progress' : ''}`}
            </Sub>
          </div>
          <Action href={item.href} label="Take test" />
        </Shell>
      );
    case 'locked': {
      const copy = LOCKED_COPY[item.feature];
      return (
        <Shell feature={feature} locked>
          <div className="space-y-1" style={{ opacity: 0.6 }}>
            <Title>{copy.title}</Title>
            <Sub>{copy.body}</Sub>
          </div>
          <Action href="/pricing" label="Unlock with a course" variant="outline" />
        </Shell>
      );
    }
    case 'empty': {
      const copy = EMPTY_COPY[item.feature];
      return (
        <Shell feature={feature}>
          <div className="space-y-1">
            <Title>{copy.title}</Title>
            <Sub>{copy.body}</Sub>
          </div>
        </Shell>
      );
    }
  }
}

export function UpNext({ items }: { items: UpNextItem[] }) {
  return (
    <SectionCard title="Up next for you" description="Personalised from your recent results">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        {items.map(item => <UpNextCard key={featureOf(item)} item={item} />)}
      </div>
    </SectionCard>
  );
}
