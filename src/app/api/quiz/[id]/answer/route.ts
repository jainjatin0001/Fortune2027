import { NextRequest, NextResponse } from 'next/server';
import { getDbUser, unauthorized, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const { id: attemptId } = await params;
    const body = await req.json();
    const { questionId, selectedOptionId, timeTaken } = body;

    if (!questionId || !selectedOptionId) {
      return badRequest('questionId and selectedOptionId are required');
    }

    const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    if (attempt.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (attempt.status !== 'IN_PROGRESS') return badRequest('Attempt is not in progress');

    const quizQuestion = await prisma.quizQuestion.findUnique({
      where: { quizId_questionId: { quizId: attempt.quizId, questionId } },
    });
    if (!quizQuestion) return badRequest('Question does not belong to this quiz');

    const option = await prisma.questionOption.findFirst({
      where: { id: selectedOptionId, questionId },
      include: { question: { include: { options: { where: { isCorrect: true } } } } },
    });

    if (!option) return NextResponse.json({ error: 'Option not found' }, { status: 404 });

    const isCorrect = option.isCorrect;
    const correctOption = option.question.options[0];

    const existing = await prisma.userQuestionAttempt.findFirst({
      where: { quizAttemptId: attemptId, questionId, userId: user.id },
    });

    if (existing) {
      await prisma.userQuestionAttempt.update({
        where: { id: existing.id },
        data: { selectedOptionIds: [selectedOptionId], isCorrect, timeTaken: timeTaken ?? null },
      });
    } else {
      await prisma.userQuestionAttempt.create({
        data: {
          userId: user.id,
          questionId,
          quizAttemptId: attemptId,
          selectedOptionIds: [selectedOptionId],
          isCorrect,
          timeTaken: timeTaken ?? null,
        },
      });
    }

    return NextResponse.json({
      isCorrect,
      correctOptionId: correctOption?.id,
      explanation: option.question.explanation,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
