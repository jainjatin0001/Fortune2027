import { NextRequest, NextResponse } from 'next/server';
import { getDbUser, unauthorized, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('subjectId');
  const published = searchParams.get('published') !== 'false';

  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const canAccessAllQuizzes = ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'].includes(user.role);

    const quizzes = await prisma.quiz.findMany({
      where: {
        ...(!canAccessAllQuizzes && published && { isPublished: true }),
        ...(subjectId && { subjectId }),
      },
      include: {
        subject: { select: { name: true, slug: true } },
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ quizzes });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();
    const canAccessAllQuizzes = ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'].includes(user.role);

    const body = await req.json();
    const { quizId } = body;
    if (!quizId) return badRequest('quizId is required');

    // The quiz page already renders the questions; starting only needs to create the attempt.
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true, title: true, timeLimit: true, isPublished: true },
    });

    if (!quiz || (!canAccessAllQuizzes && !quiz.isPublished)) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // The player always starts from a blank sheet, so an earlier unfinished
    // attempt can never be resumed — close it instead of leaving it IN_PROGRESS forever.
    const [, attempt] = await prisma.$transaction([
      prisma.quizAttempt.updateMany({
        where: { userId: user.id, quizId, status: 'IN_PROGRESS' },
        data: { status: 'ABANDONED' },
      }),
      prisma.quizAttempt.create({
        data: {
          userId: user.id,
          quizId,
          status: 'IN_PROGRESS',
        },
        select: { id: true },
      }),
    ]);

    return NextResponse.json({
      attemptId: attempt.id,
      quizId: quiz.id,
      title: quiz.title,
      timeLimit: quiz.timeLimit,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
