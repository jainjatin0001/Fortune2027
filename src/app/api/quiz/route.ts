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
    if (!canAccessAllQuizzes) {
      const hasEnrollment = await prisma.enrollment.count({
        where: { userId: user.id, status: 'ACTIVE' },
      });
      if (!hasEnrollment) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
    if (!canAccessAllQuizzes) {
      const hasEnrollment = await prisma.enrollment.count({
        where: { userId: user.id, status: 'ACTIVE' },
      });
      if (!hasEnrollment) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { quizId } = body;
    if (!quizId) return badRequest('quizId is required');

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            question: {
              include: { options: { orderBy: { sortOrder: 'asc' } } },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!quiz || (!canAccessAllQuizzes && !quiz.isPublished)) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId,
        status: 'IN_PROGRESS',
      },
    });

    const questions = quiz.questions.map((qq) => ({
      id: qq.question.id,
      statement: qq.question.statement,
      difficulty: qq.question.difficulty,
      points: qq.question.points,
      options: qq.question.options.map((o) => ({
        id: o.id,
        content: o.content,
        sortOrder: o.sortOrder,
      })),
    }));

    return NextResponse.json({
      attemptId: attempt.id,
      quizId: quiz.id,
      title: quiz.title,
      timeLimit: quiz.timeLimit,
      questions,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
