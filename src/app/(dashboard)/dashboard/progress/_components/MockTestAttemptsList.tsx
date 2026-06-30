'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, ChevronRight, Trophy, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Attempt {
  id: string;
  completedAt: string | null;
  timeTaken: number | null;
  totalScore: number | null;
  earnedScore: number | null;
  mockTest: { title: string; passingScore: number } | null;
}

function fmtTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function MockTestAttemptsList({ browseCta = '/courses' }: { browseCta?: string }) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mock-test/attempts')
      .then(r => r.json())
      .then(d => setAttempts(d.attempts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card-base p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="h-5 w-5" style={{ color: '#7c3aed' }} />
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Mock Test Results</h2>
        </div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--color-muted)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-base p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#7c3aed15' }}>
            <ClipboardList className="h-5 w-5" style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Mock Test Results</h2>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              {attempts.length} completed attempt{attempts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {attempts.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed p-8 text-center"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Trophy className="h-10 w-10 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>
            No mock tests taken yet
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
            Full-length mock exams will appear here once completed.
          </p>
          <Button size="sm" asChild style={{ background: '#7c3aed', color: '#fff', border: 'none' }}>
            <Link href={browseCta}>{browseCta.startsWith('/dashboard') ? 'My Courses' : 'Browse Courses'}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {attempts.map((attempt) => {
            const accuracy = attempt.totalScore && attempt.earnedScore
              ? Math.round((attempt.earnedScore / attempt.totalScore) * 100)
              : null;
            const passed = accuracy !== null && attempt.mockTest
              ? accuracy >= attempt.mockTest.passingScore
              : null;

            return (
              <Link
                key={attempt.id}
                href={`/dashboard/mock-test/${attempt.id}/report`}
                className="flex items-center gap-4 p-4 rounded-xl border transition-colors hover:border-purple-300 hover:bg-purple-50/30 group"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: passed ? '#dcfce7' : passed === false ? '#fee2e2' : '#f3f4f6' }}
                >
                  {passed === true
                    ? <CheckCircle className="h-5 w-5" style={{ color: '#16a34a' }} />
                    : passed === false
                      ? <XCircle className="h-5 w-5" style={{ color: '#dc2626' }} />
                      : <Trophy className="h-5 w-5" style={{ color: '#6b7280' }} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-foreground)' }}>
                    {attempt.mockTest?.title ?? 'Mock Test'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                    {attempt.completedAt ? fmtDate(attempt.completedAt) : '—'}
                    {attempt.timeTaken ? ` · ${fmtTime(attempt.timeTaken)}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {accuracy !== null && (
                    <div className="text-right">
                      <div className="text-sm font-black" style={{ color: passed ? '#16a34a' : '#dc2626' }}>
                        {accuracy}%
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>accuracy</div>
                    </div>
                  )}
                  {attempt.timeTaken && (
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold flex items-center gap-1" style={{ color: 'var(--color-foreground)' }}>
                        <Clock className="h-3.5 w-3.5" />
                        {fmtTime(attempt.timeTaken)}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>time taken</div>
                    </div>
                  )}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--color-muted-foreground)' }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
