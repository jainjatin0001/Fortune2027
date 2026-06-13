import { NextRequest, NextResponse } from 'next/server';
import { getDbUser, unauthorized, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('subjectId');
  const published = searchParams.get('published') !== 'false';

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        ...(published && { isPublished: true }),
        ...(subjectId && { subjectId }),
      },
      include: {
        subject: { select: { name: true, slug: true, category: true } },
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

    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId,
        status: 'IN_PROGRESS',
      },
    });

    const questions = quiz.questions.map((qq) => ({
      id: qq.question.id,
      content: qq.question.content,
      difficulty: qq.question.difficulty,
      points: qq.question.points,
      options: qq.question.options.map((o) => ({
        id: o.id,
        content: o.content,
        sortOrder: o.sortOrder,
        // Don't send isCorrect to client
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
