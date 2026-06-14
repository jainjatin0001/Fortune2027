import { NextResponse } from 'next/server';
import { getDbUser, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type ProgressAttempt = {
  id: string;
  score: number | null;
  timeTaken: number | null;
  completedAt: Date | null;
  quiz: { id: string; title: string };
};

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const [enrollments, quizAttempts, bookmarkCount] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: user.id, status: 'ACTIVE' },
        include: {
          course: { select: { id: true, title: true, thumbnailUrl: true, program: { select: { name: true, slug: true } } } },
          courseProgress: true,
        },
      }),
      prisma.quizAttempt.findMany({
        where: { userId: user.id, status: 'COMPLETED' },
        orderBy: { completedAt: 'desc' },
        take: 10,
        include: {
          quiz: { select: { id: true, title: true } },
        },
      }),
      prisma.bookmark.count({ where: { userId: user.id } }),
    ]);

    const avgScore =
      quizAttempts.length > 0
        ? Math.round(
            (quizAttempts as ProgressAttempt[]).reduce((sum: number, a: ProgressAttempt) => sum + (a.score ?? 0), 0) / quizAttempts.length
          )
        : 0;

    const completedCourses = enrollments.filter((e) => e.status === 'COMPLETED').length;

    const coursesWithProgress = enrollments.map((e) => ({
      courseId: e.courseId,
      title: e.course.title,
      programName: e.course.program?.name ?? '',
      thumbnailUrl: e.course.thumbnailUrl,
      completionPct: e.courseProgress?.completionPct ?? 0,
      completedAssets: e.courseProgress?.completedAssets ?? 0,
      totalAssets: e.courseProgress?.totalAssets ?? 0,
    }));

    return NextResponse.json({
      enrolledCourses: enrollments.length,
      completedCourses,
      avgScore,
      bookmarkCount,
      courses: coursesWithProgress,
      recentAttempts: (quizAttempts as ProgressAttempt[]).map((a: ProgressAttempt) => ({
        id: a.id,
        quizTitle: a.quiz.title,
        score: a.score,
        timeTaken: a.timeTaken,
        completedAt: a.completedAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
