import { NextResponse } from 'next/server';
import { getDbUser, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const [enrollments, quizAttempts, bookmarkCount] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: user.id, status: 'ACTIVE' },
        include: {
          course: { select: { id: true, title: true, category: true, thumbnailUrl: true, totalLessons: true } },
          lessonProgress: { select: { isCompleted: true } },
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
            quizAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / quizAttempts.length
          )
        : 0;

    const completedCourses = enrollments.filter((e) => e.status === 'COMPLETED').length;

    const coursesWithProgress = enrollments.map((e) => ({
      courseId: e.courseId,
      title: e.course.title,
      category: e.course.category,
      thumbnailUrl: e.course.thumbnailUrl,
      progress: e.progress,
      completedLessons: e.lessonProgress.filter((lp) => lp.isCompleted).length,
      totalLessons: e.course.totalLessons,
    }));

    return NextResponse.json({
      enrolledCourses: enrollments.length,
      completedCourses,
      avgScore,
      bookmarkCount,
      courses: coursesWithProgress,
      recentAttempts: quizAttempts.map((a) => ({
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
