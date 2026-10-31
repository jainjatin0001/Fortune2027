import { NextRequest, NextResponse } from 'next/server';
import { getDbUser, unauthorized, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { gradeAnswer, isAnswered, parseNumericAnswer, type StudentAnswer } from '@/lib/grading';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const { id: attemptId } = await params;
    const body = await req.json();
    const { questionId, timeTaken } = body;
    // selectedOptionId (single) is still accepted for older clients
    const selectedOptionIds: string[] = Array.isArray(body.selectedOptionIds)
      ? body.selectedOptionIds.map(String)
      : body.selectedOptionId ? [String(body.selectedOptionId)] : [];
    const textAnswer: string | undefined = typeof body.textAnswer === 'string' ? body.textAnswer.trim() : undefined;
    const answer: StudentAnswer = { selectedOptionIds, textAnswer };

    if (!questionId || !isAnswered(answer)) {
      return badRequest('questionId and an answer (selectedOptionIds or textAnswer) are required');
    }

    const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    if (attempt.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (attempt.status !== 'IN_PROGRESS') return badRequest('Attempt is not in progress');

    const quizQuestion = await prisma.quizQuestion.findUnique({
      where: { quizId_questionId: { quizId: attempt.quizId, questionId } },
    });
    if (!quizQuestion) return badRequest('Question does not belong to this quiz');

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: { select: { id: true, isCorrect: true } } },
    });
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    const optionIds = new Set(question.options.map(o => o.id));
    if (selectedOptionIds.some(id => !optionIds.has(id))) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    const correctOptionIds = question.options.filter(o => o.isCorrect).map(o => o.id);
    const isCorrect = gradeAnswer(
      { questionType: question.questionType, correctOptionIds, acceptedAnswers: question.acceptedAnswers },
      answer,
    ) ?? false;

    const attemptData = {
      selectedOptionIds,
      textAnswer: textAnswer || null,
      numericAnswer: question.questionType === 'NUMERIC' && textAnswer ? parseNumericAnswer(textAnswer) : null,
      isCorrect,
      timeTaken: timeTaken ?? null,
    };

    const existing = await prisma.userQuestionAttempt.findFirst({
      where: { quizAttemptId: attemptId, questionId, userId: user.id },
    });

    if (existing) {
      await prisma.userQuestionAttempt.update({ where: { id: existing.id }, data: attemptData });
    } else {
      await prisma.userQuestionAttempt.create({
        data: { userId: user.id, questionId, quizAttemptId: attemptId, ...attemptData },
      });
    }

    return NextResponse.json({
      isCorrect,
      correctOptionId: correctOptionIds[0],
      correctOptionIds,
      acceptedAnswers: question.acceptedAnswers,
      explanation: question.explanation,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
