import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getDbUser } from '@/lib/auth';
import {
  getDifficultyBreakdown, getMistakes, getPacing, getQuizAccuracyByDay, getUpNext,
} from '@/lib/progress/queries';
import { GuestDashboardLock } from './_components/GuestDashboardLock';
import { SectionSkeleton } from './_components/SectionCard';
import { ExamCountdown, GoalCard, StreakCard } from './_components/TodayCard';
import { DailyQuestionCard } from './_components/DailyQuestionCard';
import { StatTiles } from './_components/StatTiles';
import { QuizAccuracyChart } from './_components/QuizAccuracyChart';
import { SubjectStrengths } from './_components/SubjectStrengths';
import { ActivityHeatmap } from './_components/ActivityHeatmap';
import { MockTestTrend } from './_components/MockTestTrend';
import { RecentQuizzes } from './_components/RecentQuizzes';
import { UpNext } from './_components/UpNext';
import { DifficultyCard, PacingCard } from './_components/SkillCards';
import { MistakesCard } from './_components/MistakesCard';
import { getDailyQuestions, getEngagement, getIsEnrolled, getMockTests, getQuizzes, getStrengths, getTimeZone } from './_data';

export const metadata: Metadata = { title: 'Dashboard' };

// ── Streamed sections ─────────────────────────────────────────────────────────
// Each section fetches its own data inside a Suspense boundary, so a slow query
// only delays its own card. Shared reads are memoised per request in _data.ts.

async function TodaySection({ userId }: { userId: string }) {
  // Independent reads — fetched in parallel, not one after the other
  const [engagement, dailyQuestions] = await Promise.all([getEngagement(userId), getDailyQuestions(userId)]);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <StreakCard engagement={engagement} />
      <GoalCard engagement={engagement} />
      {dailyQuestions.map(dq => <DailyQuestionCard key={dq.dailyQuestionId} data={dq} />)}
    </div>
  );
}

async function ExamCountdownSlot({ userId }: { userId: string }) {
  const [tz, engagement] = await Promise.all([getTimeZone(userId), getEngagement(userId)]);
  return <ExamCountdown engagement={engagement} tz={tz} />;
}

async function UpNextSection({ userId }: { userId: string }) {
  const [tz, strengths, isEnrolled] = await Promise.all([getTimeZone(userId), getStrengths(userId), getIsEnrolled(userId)]);
  const items = await getUpNext(userId, tz, strengths, isEnrolled);
  return <UpNext items={items} />;
}

async function StatsSection({ userId }: { userId: string }) {
  const [engagement, quizzes, mockTests] = await Promise.all([
    getEngagement(userId),
    getQuizzes(userId),
    getMockTests(userId),
  ]);
  return <StatTiles engagement={engagement} quizzes={quizzes} mockTests={mockTests} />;
}

async function PerformanceSection({ userId }: { userId: string }) {
  const tz = await getTimeZone(userId);
  const [accuracy, strengths, engagement] = await Promise.all([
    getQuizAccuracyByDay(userId, tz),
    getStrengths(userId),
    getEngagement(userId),
  ]);
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 min-w-0">
        <QuizAccuracyChart points={accuracy.points} subjects={accuracy.subjects} todayKey={engagement.todayKey} />
      </div>
      {/* Out of flow on desktop: the chart alone sets the row height, strengths scroll to match */}
      <div className="relative min-w-0">
        <div className="lg:absolute lg:inset-0">
          <SubjectStrengths subjects={strengths} />
        </div>
      </div>
    </div>
  );
}

async function SkillsSection({ userId }: { userId: string }) {
  const [difficulty, pacing, mistakes] = await Promise.all([
    getDifficultyBreakdown(userId),
    getPacing(userId),
    getMistakes(userId),
  ]);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DifficultyCard rows={difficulty} />
      <PacingCard rows={pacing} />
      <div className="md:col-span-2 xl:col-span-1 min-w-0">
        <MistakesCard total={mistakes.total} items={mistakes.items} />
      </div>
    </div>
  );
}

/** Mock tests and quizzes side by side. The fixed height is on each wrapper (an auto grid row
 *  would grow to fit content); long lists scroll inside each card. */
async function ResultsSection({ userId }: { userId: string }) {
  const [tz, mockTests, quizzes] = await Promise.all([getTimeZone(userId), getMockTests(userId), getQuizzes(userId)]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="min-w-0 h-[480px]">
        <MockTestTrend
          results={mockTests.map(m => ({
            id: m.id,
            title: m.title,
            completedAt: m.completedAt.toISOString(),
            percentage: m.percentage,
            passed: m.passed,
            sections: m.sections,
            program: m.program,
            scaled: m.scaled,
          }))}
        />
      </div>
      <div className="min-w-0 h-[480px]">
        <RecentQuizzes quizzes={quizzes} tz={tz} />
      </div>
    </div>
  );
}

async function ActivitySection({ userId }: { userId: string }) {
  const engagement = await getEngagement(userId);
  return (
    <ActivityHeatmap
      cells={engagement.heatmap}
      dailyGoal={engagement.dailyGoal}
      todayKey={engagement.todayKey}
      longestStreak={engagement.streak.longest}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

/** The full dashboard for one student. Used for signed-in users and (with an empty account) the guest preview. */
function DashboardContent({ userId, firstName }: { userId: string; firstName?: string | null }) {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <header>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>
          {firstName ? `Welcome back, ${firstName}!` : 'Welcome!'}
        </h1>
        <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          Your progress across quizzes, mock tests and daily practice.
        </p>
        <div className="mt-3 empty:hidden">
          <Suspense fallback={null}>
            <ExamCountdownSlot userId={userId} />
          </Suspense>
        </div>
      </header>

      <Suspense fallback={<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map(i => <SectionSkeleton key={i} height={236} />)}</div>}>
        <TodaySection userId={userId} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={230} />}>
        <UpNextSection userId={userId} />
      </Suspense>

      <Suspense fallback={<div className="grid gap-4 grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map(i => <SectionSkeleton key={i} height={128} />)}</div>}>
        <StatsSection userId={userId} />
      </Suspense>

      <Suspense fallback={<div className="grid gap-4 lg:grid-cols-3"><SectionSkeleton className="lg:col-span-2" height={438} /><SectionSkeleton height={438} /></div>}>
        <PerformanceSection userId={userId} />
      </Suspense>

      <Suspense fallback={<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map(i => <SectionSkeleton key={i} height={340} />)}</div>}>
        <SkillsSection userId={userId} />
      </Suspense>

      <Suspense fallback={<div className="grid gap-4 lg:grid-cols-2"><SectionSkeleton height={480} /><SectionSkeleton height={480} /></div>}>
        <ResultsSection userId={userId} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={330} />}>
        <ActivitySection userId={userId} />
      </Suspense>
    </div>
  );
}

// No student has this ID, so every section renders exactly what a brand-new account sees
const GUEST_PREVIEW_ID = '00000000-0000-0000-0000-000000000000';

export default async function DashboardPage() {
  const user = await getDbUser();
  if (!user) {
    return (
      <GuestDashboardLock>
        <DashboardContent userId={GUEST_PREVIEW_ID} />
      </GuestDashboardLock>
    );
  }

  return <DashboardContent userId={user.id} firstName={user.firstName} />;
}
