import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Clock, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { getDbUser } from '@/lib/auth';
import { ACT_MOCK_TESTS } from '@/../data/act';

export const metadata: Metadata = { title: 'ACT Practice Exams' };

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default async function ACTExamPage() {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white font-black text-sm"
            style={{ background: '#0891b2' }}
          >
            ACT
          </span>
          <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>
            ACT Practice Exams
          </h1>
        </div>
        <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
          Full-length ACT mock tests — English, Mathematics, Reading, and Science.
          Each test mirrors the real exam structure and timing.
        </p>
      </div>

      {/* What to expect */}
      <div className="card-base p-5 grid sm:grid-cols-3 gap-4">
        {[
          { label: '4 Sections', sub: 'English · Mathematics · Reading · Science' },
          { label: 'Timed Sections', sub: '10 min English · 12 min Math · 10 min Reading & Science' },
          { label: 'Calculator Available', sub: 'Floating calc on Mathematics section' },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#0891b2' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Test cards */}
      <div className="space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>
          Available Tests
        </h2>
        {ACT_MOCK_TESTS.map((test, idx) => (
          <Link
            key={test.id}
            href={`/dashboard/act-exam/${test.id}`}
            className="card-base p-6 flex items-center gap-5 hover:opacity-80 transition-opacity group"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg shrink-0"
              style={{ background: idx === 0 ? '#0891b2' : '#0e7490' }}
            >
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base" style={{ color: 'var(--color-foreground)' }}>{test.title}</h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{test.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  <BookOpen className="h-3.5 w-3.5" />
                  {test.totalQuestions} questions
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(test.totalTimeSeconds)}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#0891b218', color: '#0891b2' }}>
                  {test.sections.length} sections
                </span>
              </div>
            </div>
            <ArrowRight
              className="h-5 w-5 shrink-0 group-hover:translate-x-0.5 transition-transform"
              style={{ color: '#0891b2' }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
