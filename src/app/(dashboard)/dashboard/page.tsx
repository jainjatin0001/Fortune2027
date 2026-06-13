import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  BookOpen, Clock, Trophy, TrendingUp, Flame, Target, ArrowRight,
  Lock, Play, FileText, BarChart2, Sparkles,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDemoQuestions } from '@/../data/demo';

export const metadata: Metadata = { title: 'Dashboard' };

async function getDashboardData(userId: string) {
  const [enrollments, quizAttempts, bookmarkCount] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        course: { select: { id: true, title: true, category: true, thumbnailUrl: true, totalLessons: true } },
        lessonProgress: { select: { isCompleted: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.quizAttempt.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 3,
      include: { quiz: { select: { title: true } } },
    }),
    prisma.bookmark.count({ where: { userId } }),
  ]);

  return { enrollments, quizAttempts, bookmarkCount };
}

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
type EnrollmentItem = DashboardData['enrollments'][number];
type QuizAttemptItem = DashboardData['quizAttempts'][number];

const CATEGORY_COLOR: Record<string, string> = {
  SAT_PREP: 'var(--color-sat)',
  ACT_PREP: 'var(--color-act)',
  AP_EXAM: 'var(--color-ap)',
  CODING: 'var(--color-coding)',
  HIGH_SCHOOL: 'var(--color-highschool)',
  OTHER: 'var(--color-primary)',
};

function LockedCard({ title, description, icon: Icon }: { title: string; description: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div
      className="relative p-5 rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-muted)' }}
    >
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-background)', border: '2px solid var(--color-border)' }}
          >
            <Lock className="h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: 'var(--color-muted-foreground)' }}>
            Unlock with a course
          </span>
        </div>
      </div>
      <div className="opacity-20 pointer-events-none select-none">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-5 w-5" />
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <p className="text-xs">{description}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { enrollments, quizAttempts, bookmarkCount } = await getDashboardData(user.id);
  const isPremium = enrollments.length > 0;
  const demoQuestions = getDemoQuestions();
  const avgScore =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((s: number, a: QuizAttemptItem) => s + (a.score ?? 0), 0) / quizAttempts.length)
      : 0;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            {isPremium
              ? `You have ${enrollments.length} active course${enrollments.length !== 1 ? 's' : ''}. Keep learning!`
              : 'Start with free demo questions, or purchase a course to unlock everything.'}
          </p>
        </div>
        {!isPremium && (
          <Link href="/pricing">
            <Button className="text-white shrink-0" style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles className="h-4 w-4 mr-2" /> Upgrade
            </Button>
          </Link>
        )}
      </div>

      {/* Free tier demo banner */}
      {!isPremium && (
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #1e3a8a12 0%, #2563eb08 100%)', border: '1px solid var(--color-primary)', borderRadius: '1rem' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary)', color: '#fff' }}>
              <Play className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>
                You have access to {demoQuestions.length} free demo questions
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                Try the demo quiz and sample exam — no purchase required
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/dashboard/demo/quiz">
              <Button size="sm" variant="outline">Demo Quiz</Button>
            </Link>
            <Link href="/dashboard/demo/exam">
              <Button size="sm" className="text-white" style={{ background: 'var(--color-primary)' }}>Demo Exam</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Day Streak', value: isPremium ? '—' : '—', color: '#f97316', sub: 'Start studying!' },
          { icon: Trophy, label: 'Quiz Avg', value: quizAttempts.length > 0 ? `${avgScore}%` : '—', color: '#eab308', sub: quizAttempts.length > 0 ? `${quizAttempts.length} attempts` : 'No attempts yet' },
          { icon: Clock, label: 'Study Hours', value: isPremium ? '—' : '—', color: '#0891b2', sub: 'This month' },
          { icon: BookOpen, label: 'Bookmarks', value: String(bookmarkCount), color: 'var(--color-primary)', sub: 'Saved courses' },
        ].map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} className="card-base p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15`, color }}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black mb-0.5" style={{ color: 'var(--color-foreground)' }}>{value}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Learning or Demo */}
        <div className="lg:col-span-2 card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>
              {isPremium ? 'Continue Learning' : 'Demo Questions'}
            </h2>
            <Link
              href={isPremium ? '/dashboard/courses' : '/dashboard/demo'}
              className="text-sm flex items-center gap-1 hover:underline"
              style={{ color: 'var(--color-accent)' }}
            >
              {isPremium ? 'All courses' : 'All demo questions'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isPremium ? (
            <div className="space-y-5">
              {enrollments.map((e) => {
                const color = CATEGORY_COLOR[e.course.category] ?? 'var(--color-primary)';
                const completedLessons = e.lessonProgress.filter((lp) => lp.isCompleted).length;
                return (
                  <div key={e.id}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: color }}>
                        {e.course.category.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold truncate" style={{ color: 'var(--color-foreground)' }}>{e.course.title}</span>
                          <span className="text-xs font-bold shrink-0" style={{ color }}>{Math.round(e.progress)}%</span>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                          {completedLessons}/{e.course.totalLessons} lessons
                        </span>
                      </div>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${e.progress}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {demoQuestions.slice(0, 4).map((q) => (
                <Link
                  key={q.id}
                  href="/dashboard/demo"
                  className="flex items-start gap-3 p-3 rounded-xl hover:opacity-80 transition-opacity"
                  style={{ background: 'var(--color-muted)' }}
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: CATEGORY_COLOR[q.category] ?? 'var(--color-primary)' }}
                  >
                    {q.category.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>{q.question}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{q.category} · {q.difficulty}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--color-muted-foreground)' }} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — locked for free, tasks for premium */}
        <div className="card-base p-6">
          <h2 className="font-bold mb-5" style={{ color: 'var(--color-foreground)' }}>
            {isPremium ? 'Upcoming Tasks' : 'Premium Features'}
          </h2>

          {isPremium ? (
            <div className="space-y-3">
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No upcoming tasks. Check your courses!</p>
              <Link href="/courses">
                <Button className="w-full mt-4 text-white" style={{ background: 'var(--gradient-primary)' }} size="sm">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <LockedCard icon={BarChart2} title="Progress Analytics" description="Track detailed performance across subjects over time" />
              <LockedCard icon={Target} title="SAT Score Predictor" description="AI-powered score prediction based on practice results" />
              <LockedCard icon={TrendingUp} title="Study Streak" description="Daily streak tracking and milestone rewards" />
              <Link href="/pricing">
                <Button className="w-full mt-4 text-white" style={{ background: 'var(--gradient-primary)' }} size="sm">
                  View Plans
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Quizzes or Locked */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Recent Quiz Results</h2>
          {isPremium && (
            <Link href="/dashboard/quizzes" className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-accent)' }}>
              All quizzes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {quizAttempts.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {quizAttempts.map((attempt) => (
              <div key={attempt.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : '—'}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: (attempt.score ?? 0) >= 80
                        ? 'var(--color-success)'
                        : (attempt.score ?? 0) >= 60
                        ? 'var(--color-warning)'
                        : 'var(--color-danger)',
                    }}
                  >
                    {Math.round(attempt.score ?? 0)}%
                  </span>
                </div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{attempt.quiz.title}</h3>
                <Progress value={attempt.score ?? 0} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-muted-foreground)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>No quiz attempts yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
              {isPremium ? 'Start a quiz from your courses' : 'Try the demo quiz to get started'}
            </p>
            <Link href={isPremium ? '/dashboard/courses' : '/dashboard/demo/quiz'}>
              <Button size="sm" className="mt-4 text-white" style={{ background: 'var(--color-primary)' }}>
                {isPremium ? 'Start Learning' : 'Try Demo Quiz'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
