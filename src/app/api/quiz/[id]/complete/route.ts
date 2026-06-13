import { NextRequest, NextResponse } from 'next/server';
import { getDbUser, unauthorized } from '@/lib/auth';
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
    const { totalTimeTaken } = body;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          include: {
            question: { select: { points: true } },
          },
        },
        quiz: { select: { passingScore: true, questions: { select: { question: { select: { points: true } } } } } },
      },
    });

    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    if (attempt.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (attempt.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Attempt already completed' }, { status: 400 });
    }

    const totalPoints = attempt.quiz.questions.reduce((sum: number, qq: { question: { points: number } }) => sum + qq.question.points, 0);
    const earnedPoints = attempt.answers
      .filter((a: { isCorrect: boolean | null; question: { points: number } }) => a.isCorrect)
      .reduce((sum: number, a: { isCorrect: boolean | null; question: { points: number } }) => sum + a.question.points, 0);

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= attempt.quiz.passingScore;

    const completed = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        score,
        earnedPoints,
        totalPoints,
        timeTaken: totalTimeTaken ?? 0,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      score,
      passed,
      earnedPoints,
      totalPoints,
      correctAnswers: attempt.answers.filter((a: { isCorrect: boolean | null; question: { points: number } }) => a.isCorrect).length,
      totalQuestions: attempt.quiz.questions.length,
      timeTaken: completed.timeTaken,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
