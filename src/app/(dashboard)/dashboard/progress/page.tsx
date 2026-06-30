import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  TrendingUp, CheckCircle, BookOpen, ClipboardList,
  Target, ChevronRight, Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MockTestAttemptsList } from './_components/MockTestAttemptsList';

export const metadata: Metadata = { title: 'My Progress' };

const PROGRAM_COLOR: Record<string, string> = {
  sat: '#7c3aed', 'sat-prep': '#7c3aed',
  act: '#0891b2', 'act-prep': '#0891b2',
  ap: '#b45309', 'ap-exam': '#b45309',
  coding: '#059669', 'high-school': '#be185d',
};

function getProgramColor(slug?: string | null) {
  if (!slug) return '#7c3aed';
  return PROGRAM_COLOR[slug] ?? PROGRAM_COLOR[slug.split('-')[0]] ?? '#7c3aed';
}

export default async function ProgressPage() {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  // ── Fetch all progress data in parallel ────────────────────────
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [enrollments, lessonsCompleted, quizzesPassed, recentActivity] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      include: {
        course: {
          include: {
            program: { select: { name: true, slug: true } },
            modules: {
              where: { isPublished: true },
              include: {
                assets: { where: { isPublished: true }, select: { id: true, assetType: true } },
              },
            },
          },
        },
        courseProgress: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.learningAssetProgress.count({
      where: { enrollment: { userId: user.id }, isCompleted: true },
    }),
    prisma.learningAssetProgress.count({
      where: {
        enrollment: { userId: user.id },
        isCompleted: true,
        asset: { assetType: { in: ['QUIZ', 'QUESTION_SET'] } },
      },
    }),
    prisma.learningAssetProgress.findMany({
      where: {
        enrollment: { userId: user.id },
        isCompleted: true,
        completedAt: { gte: sevenDaysAgo },
      },
      select: { completedAt: true },
    }),
  ]);

  // Mock test count — guarded until prisma generate is run
  let mockTestCount = 0;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockTestCount = await (prisma as any).mockTestAttempt.count({
      where: { userId: user.id, status: 'COMPLETED' },
    });
  } catch { /* pending migration */ }

  // ── Weekly activity (lessons completed per day) ────────────────
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayMap = new Map<string, { label: string; count: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    dayMap.set(key, { label: DAY_LABELS[d.getDay()], count: 0 });
  }
  for (const a of recentActivity) {
    if (a.completedAt) {
      const d = a.completedAt;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const entry = dayMap.get(key);
      if (entry) entry.count++;
    }
  }
  const weeklyData = [...dayMap.values()];
  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);
  const hasActivity = weeklyData.some(d => d.count > 0);

  const hasEnrollments = enrollments.length > 0;
  const browseCta = hasEnrollments ? '/dashboard/courses' : '/courses';

  const summaryStats = [
    { icon: CheckCircle, label: 'Lessons Completed', value: lessonsCompleted, color: '#059669' },
    { icon: Target,      label: 'Quizzes Passed',    value: quizzesPassed,    color: '#7c3aed' },
    { icon: ClipboardList, label: 'Mock Tests Done', value: mockTestCount,    color: '#0891b2' },
    { icon: BookOpen,    label: 'Courses Enrolled',  value: enrollments.length, color: '#d97706' },
  ];

  return (
    <div className="space-y-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-heading-2 mb-1" style={{ color: 'var(--color-foreground)' }}>
          My Progress
        </h1>
        <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
          Track your learning journey across all courses.
        </p>
        {!hasEnrollments && (
          <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: '#f59e0b' }}>
            <span className="font-bold">*</span>
            Enroll in a course to start tracking your real progress.
          </p>
        )}
      </div>

      {/* ── Summary stats ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card-base p-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${color}18`, color }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--color-foreground)' }}>
              {value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Course progress ─────────────────────────────────────── */}
      {hasEnrollments ? (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>
              Course Progress
            </h2>
            <Link href="/dashboard/courses">
              <Button variant="outline" size="sm" className="text-xs h-8">
                View All
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-6">
            {enrollments.map(e => {
              const color = getProgramColor(e.course.program?.slug);
              const pct = Math.round(e.courseProgress?.completionPct ?? 0);
              const totalAssets =
                e.courseProgress?.totalAssets ??
                e.course.modules.flatMap(m => m.assets).length;
              const completedAssets = e.courseProgress?.completedAssets ?? 0;
              const isDone = pct >= 100;

              return (
                <Link
                  key={e.id}
                  href={`/dashboard/courses/${e.course.id}`}
                  className="block group"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold truncate group-hover:underline"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        {e.course.title}
                      </p>
                      {e.course.program?.name && (
                        <p className="text-xs mt-0.5" style={{ color }}>
                          {e.course.program.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className="text-xs font-bold"
                        style={{ color: isDone ? '#059669' : color }}
                      >
                        {isDone ? '✓ Complete' : `${pct}%`}
                      </span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                        {completedAssets}/{totalAssets} lessons
                      </p>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill transition-all"
                      style={{
                        width: `${pct}%`,
                        background: isDone ? '#059669' : color,
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className="card-base p-10 text-center rounded-2xl border-2 border-dashed"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <BookOpen className="h-10 w-10 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>
            No courses enrolled yet
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
            Purchase a course to unlock personalised progress tracking.
          </p>
          <Button size="sm" asChild style={{ background: '#7c3aed', color: '#fff', border: 'none' }}>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      )}

      {/* ── Weekly activity ─────────────────────────────────────── */}
      <div className="card-base p-6">
        <h2 className="font-bold mb-6" style={{ color: 'var(--color-foreground)' }}>
          This Week&apos;s Activity
        </h2>
        {!hasActivity ? (
          <div className="text-center py-8">
            <TrendingUp className="h-8 w-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              No lessons completed this week yet. Start learning to build your streak!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2 h-28">
              {weeklyData.map(({ label, count }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                  {count > 0 && (
                    <span className="text-[10px] font-bold" style={{ color: 'var(--color-muted-foreground)' }}>
                      {count}
                    </span>
                  )}
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${(count / maxCount) * 100}%`,
                      background: 'var(--gradient-primary)',
                      minHeight: count > 0 ? 6 : 2,
                      opacity: count > 0 ? 1 : 0.15,
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              Lessons completed per day
            </p>
          </>
        )}
      </div>

      {/* ── Mock test results ────────────────────────────────────── */}
      <MockTestAttemptsList browseCta={browseCta} />

      {/* ── Unenrolled CTA ───────────────────────────────────────── */}
      {!hasEnrollments && (
        <div
          className="card-base p-8 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: 'linear-gradient(135deg, #7c3aed12, #0891b212)' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: '#7c3aed20' }}>
            <Trophy className="h-7 w-7" style={{ color: '#7c3aed' }} />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-bold mb-1" style={{ color: 'var(--color-foreground)' }}>
              Ready to start your journey?
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Enroll in a course to unlock detailed progress tracking, quiz scores, and personalised insights.
            </p>
          </div>
          <Button asChild className="text-white shrink-0" style={{ background: '#7c3aed' }}>
            <Link href="/courses">Explore Courses</Link>
          </Button>
        </div>
      )}

    </div>
  );
}
