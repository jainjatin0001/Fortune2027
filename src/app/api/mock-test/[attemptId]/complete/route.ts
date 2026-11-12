import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser, unauthorized, badRequest, notFound } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { gradeAnswer } from '@/lib/grading';
import { recordDailyActivity } from '@/lib/progress/activity';
import { getUserTimeZone } from '@/lib/progress/time';

// Body shape: {
//   totalTimeTaken: number,  // seconds
//   sections: [{
//     sectionId: string,
//     timeTaken: number,
//     questions: [{
//       questionId: string,
//       selectedOptionIds: string[],
//       textAnswer?: string,     // NUMERIC / TEXT questions
//       timeTaken: number,
//       isSkipped: boolean
//     }]
//   }]
// }

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    return unauthorized();
  }

  try {
    const { attemptId } = await params;
    const body = await req.json();
    const { totalTimeTaken, sections } = body;

    if (!sections || !Array.isArray(sections)) return badRequest('sections is required');

    const attempt = await prisma.mockTestAttempt.findUnique({
      where: { id: attemptId, userId: user.id },
      include: {
        mockTest: {
          include: {
            sections: {
              include: {
                questions: {
                  include: {
                    question: {
                      include: { options: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!attempt) return notFound('Attempt not found');
    if (attempt.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Attempt already completed' }, { status: 409 });
    }

    const mockTestSections = attempt.mockTest.sections;

    let totalEarnedScore = 0;
    const now = new Date();

    // Build section attempts
    const sectionAttemptData = sections.map((submittedSection: {
      sectionId: string;
      timeTaken: number;
      questions: { questionId: string; selectedOptionIds: string[]; textAnswer?: string; timeTaken: number; isSkipped: boolean }[];
    }) => {
      const dbSection = mockTestSections.find(s => s.id === submittedSection.sectionId);
      if (!dbSection) return null;

      let sectionEarned = 0;
      // Out of every question in the section — questions the client didn't send count as skipped
      const sectionTotal = dbSection.questions.reduce((sum, q) => sum + q.points, 0);
      let correctCount = 0;
      let incorrectCount = 0;

      const questionAttempts = submittedSection.questions.map((qa: {
        questionId: string;
        selectedOptionIds: string[];
        textAnswer?: string;
        timeTaken: number;
        isSkipped: boolean;
      }) => {
        const sectionQ = dbSection.questions.find(q => q.questionId === qa.questionId);
        if (!sectionQ) return null;

        const points = sectionQ.points;

        const answer = {
          selectedOptionIds: Array.isArray(qa.selectedOptionIds) ? qa.selectedOptionIds : [],
          textAnswer: typeof qa.textAnswer === 'string' ? qa.textAnswer.trim() : undefined,
        };
        const isCorrect = qa.isSkipped ? null : gradeAnswer({
          questionType: sectionQ.question.questionType,
          correctOptionIds: sectionQ.question.options.filter(o => o.isCorrect).map(o => o.id),
          acceptedAnswers: sectionQ.question.acceptedAnswers,
        }, answer);

        if (isCorrect) {
          sectionEarned += points;
          correctCount++;
        } else if (isCorrect === false) {
          incorrectCount++;
        }

        return {
          questionId: qa.questionId,
          selectedOptionIds: answer.selectedOptionIds,
          textAnswer: answer.textAnswer || null,
          isCorrect,
          isSkipped: isCorrect === null,
          timeTaken: qa.timeTaken ?? null,
          attemptedAt: now,
        };
      }).filter(Boolean);

      totalEarnedScore += sectionEarned;

      return {
        sectionId: submittedSection.sectionId,
        timeTaken: submittedSection.timeTaken ?? 0,
        submittedAt: now,
        earnedScore: sectionEarned,
        totalScore: sectionTotal,
        correctCount,
        incorrectCount,
        skippedCount: dbSection.questions.length - correctCount - incorrectCount,
        questionAttempts,
      };
    }).filter(Boolean);

    // Denominator is the whole test, so skipping a section can't inflate the percentage
    const totalPossibleScore = mockTestSections.reduce(
      (sum, s) => sum + s.questions.reduce((qs, q) => qs + q.points, 0), 0,
    );
    const answeredCount = sectionAttemptData.reduce((n, sa) => n + (sa ? sa.correctCount + sa.incorrectCount : 0), 0);
    const correctTotal = sectionAttemptData.reduce((n, sa) => n + (sa?.correctCount ?? 0), 0);
    const tz = await getUserTimeZone(user.id);

    const percentage = totalPossibleScore > 0 ? (totalEarnedScore / totalPossibleScore) * 100 : 0;

    // Persist everything in a transaction. Claiming the attempt first (conditional
    // update) makes a double submit fail cleanly instead of writing sections twice.
    const claimed = await prisma.$transaction(async (tx) => {
      const { count } = await tx.mockTestAttempt.updateMany({
        where: { id: attemptId, userId: user.id, status: 'IN_PROGRESS' },
        data: {
          status: 'COMPLETED',
          completedAt: now,
          timeTaken: totalTimeTaken ?? null,
          totalScore: totalPossibleScore,
          earnedScore: totalEarnedScore,
        },
      });
      if (count === 0) return false;

      for (const sa of sectionAttemptData) {
        if (!sa) continue;
        const sectionAttempt = await tx.mockTestSectionAttempt.create({
          data: {
            attemptId,
            sectionId: sa.sectionId,
            timeTaken: sa.timeTaken,
            submittedAt: sa.submittedAt,
            earnedScore: sa.earnedScore,
            totalScore: sa.totalScore,
            correctCount: sa.correctCount,
            incorrectCount: sa.incorrectCount,
            skippedCount: sa.skippedCount,
          },
        });

        await tx.mockTestQuestionAttempt.createMany({
          data: sa.questionAttempts.filter(qa => qa !== null).map(qa => ({
            sectionAttemptId: sectionAttempt.id,
            questionId: qa.questionId,
            selectedOptionIds: qa.selectedOptionIds,
            textAnswer: qa.textAnswer,
            isCorrect: qa.isCorrect,
            isSkipped: qa.isSkipped,
            timeTaken: qa.timeTaken,
            attemptedAt: qa.attemptedAt,
          })),
        });
      }

      await recordDailyActivity(tx, {
        userId: user.id,
        tz,
        at: now,
        questionsAnswered: answeredCount,
        correctAnswers: correctTotal,
        studySeconds: Number(totalTimeTaken) || 0,
      });
      return true;
    }, { timeout: 20_000 });

    if (!claimed) {
      return NextResponse.json({ error: 'Attempt already completed' }, { status: 409 });
    }

    return NextResponse.json({
      attemptId,
      percentage: Math.round(percentage),
      earnedScore: totalEarnedScore,
      totalScore: totalPossibleScore,
      passed: percentage >= attempt.mockTest.passingScore,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
