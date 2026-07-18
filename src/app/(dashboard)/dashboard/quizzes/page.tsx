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

  return <QuizLibrary quizzes={quizzes} subjects={subjects} showDrafts={isStaff} />;
}
