import { NextRequest, NextResponse } from 'next/server';
import { getDbUser, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { recordDailyActivity } from '@/lib/progress/activity';
import { getUserTimeZone } from '@/lib/progress/time';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const { id: attemptId } = await params;
    const body = await req.json();
    const totalTimeTaken = Number.isFinite(body.totalTimeTaken) ? Math.max(0, Math.round(body.totalTimeTaken)) : 0;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        questionAttempts: {
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

    const totalPoints = attempt.quiz.questions.reduce((sum, qq) => sum + qq.question.points, 0);
    const correctAttempts = attempt.questionAttempts.filter(a => a.isCorrect);
    const earnedPoints = correctAttempts.reduce((sum, a) => sum + a.question.points, 0);

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= attempt.quiz.passingScore;
    const tz = await getUserTimeZone(user.id);
    const completedAt = new Date();

    const claimed = await prisma.$transaction(async (tx) => {
      // Conditional update = the status check and the write are one statement,
      // so a double submit can't complete (and count) the attempt twice.
      const { count } = await tx.quizAttempt.updateMany({
        where: { id: attemptId, status: 'IN_PROGRESS' },
        data: {
          status: 'COMPLETED',
          score,
          earnedPoints,
          totalPoints,
          timeTaken: totalTimeTaken,
          completedAt,
        },
      });
      if (count === 0) return false;

      await recordDailyActivity(tx, {
        userId: user.id,
        tz,
        at: completedAt,
        questionsAnswered: attempt.questionAttempts.length,
        correctAnswers: correctAttempts.length,
        studySeconds: totalTimeTaken,
      });
      return true;
    });

    if (!claimed) {
      return NextResponse.json({ error: 'Attempt already completed' }, { status: 400 });
    }

    return NextResponse.json({
      score,
      passed,
      earnedPoints,
      totalPoints,
      correctAnswers: correctAttempts.length,
      totalQuestions: attempt.quiz.questions.length,
      timeTaken: totalTimeTaken,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
