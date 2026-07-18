import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { QuizLibrary } from './QuizLibrary';

export const metadata: Metadata = { title: 'Quizzes' };

export default async function QuizzesPage() {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const isStaff = ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'].includes(user.role);
  if (!isStaff) {
    const hasEnrollment = await prisma.enrollment.count({
      where: { userId: user.id, status: 'ACTIVE' },
    });
    if (!hasEnrollment) redirect('/dashboard/courses');
  }

  const quizWhere = isStaff ? {} : { isPublished: true };
  const [quizzes, subjects] = await Promise.all([
    prisma.quiz.findMany({
      where: quizWhere,
      include: {
        subject: { select: { id: true, name: true, color: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subject.findMany({
      where: { quizzes: { some: quizWhere } },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId: user.id,
      status: 'COMPLETED',
      quizId: { in: quizzes.map((quiz) => quiz.id) },
    },
    select: { quizId: true, score: true, completedAt: true },
    orderBy: { completedAt: 'desc' },
  });

  const attemptStatus = new Map<string, { hasPassed: boolean; lastScore: number | null }>();
  for (const quiz of quizzes) {
    const quizAttempts = attempts.filter((attempt) => attempt.quizId === quiz.id);
    if (!quizAttempts.length) continue;
    attemptStatus.set(quiz.id, {
      hasPassed: quizAttempts.some((attempt) => (attempt.score ?? 0) >= quiz.passingScore),
      lastScore: quizAttempts[0].score,
    });
  }

  const quizzesWithAttempts = quizzes.map((quiz) => ({
    ...quiz,
    attempt: attemptStatus.get(quiz.id) ?? null,
  }));

  return <QuizLibrary quizzes={quizzesWithAttempts} subjects={subjects} showDrafts={isStaff} />;
}
