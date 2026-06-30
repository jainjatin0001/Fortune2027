import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser, unauthorized, badRequest, notFound } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Body shape: {
//   totalTimeTaken: number,  // seconds
//   sections: [{
//     sectionId: string,
//     timeTaken: number,
//     questions: [{
//       questionId: string,
//       selectedOptionIds: string[],
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
    if (attempt.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Attempt already completed' }, { status: 409 });
    }

    const mockTestSections = attempt.mockTest.sections;

    let totalEarnedScore = 0;
    let totalPossibleScore = 0;
    const now = new Date();

    // Build section attempts
    const sectionAttemptData = sections.map((submittedSection: {
      sectionId: string;
      timeTaken: number;
      questions: { questionId: string; selectedOptionIds: string[]; timeTaken: number; isSkipped: boolean }[];
    }) => {
      const dbSection = mockTestSections.find(s => s.id === submittedSection.sectionId);
      if (!dbSection) return null;

      let sectionEarned = 0;
      let sectionTotal = 0;
      let correctCount = 0;
      let incorrectCount = 0;
      let skippedCount = 0;

      const questionAttempts = submittedSection.questions.map((qa: {
        questionId: string;
        selectedOptionIds: string[];
        timeTaken: number;
        isSkipped: boolean;
      }) => {
        const sectionQ = dbSection.questions.find(q => q.questionId === qa.questionId);
        if (!sectionQ) return null;

        const points = sectionQ.points;
        sectionTotal += points;

        let isCorrect: boolean | null = null;
        if (qa.isSkipped) {
          skippedCount++;
        } else if (qa.selectedOptionIds.length > 0) {
          const correctOptions = sectionQ.question.options
            .filter(o => o.isCorrect)
            .map(o => o.id)
            .sort();
          const selectedSorted = [...qa.selectedOptionIds].sort();
          isCorrect = JSON.stringify(correctOptions) === JSON.stringify(selectedSorted);
          if (isCorrect) {
            sectionEarned += points;
            correctCount++;
          } else {
            incorrectCount++;
          }
        } else {
          skippedCount++;
        }

        return {
          questionId: qa.questionId,
          selectedOptionIds: qa.selectedOptionIds,
          isCorrect,
          isSkipped: qa.isSkipped || qa.selectedOptionIds.length === 0,
          timeTaken: qa.timeTaken ?? null,
          attemptedAt: now,
        };
      }).filter(Boolean);

      totalEarnedScore += sectionEarned;
      totalPossibleScore += sectionTotal;

      return {
        sectionId: submittedSection.sectionId,
        timeTaken: submittedSection.timeTaken ?? 0,
        submittedAt: now,
        earnedScore: sectionEarned,
        totalScore: sectionTotal,
        correctCount,
        incorrectCount,
        skippedCount,
        questionAttempts,
      };
    }).filter(Boolean);

    const percentage = totalPossibleScore > 0 ? (totalEarnedScore / totalPossibleScore) * 100 : 0;

    // Persist everything in a transaction
    await prisma.$transaction(async (tx) => {
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

        for (const qa of sa.questionAttempts) {
          if (!qa) continue;
          await tx.mockTestQuestionAttempt.create({
            data: {
              sectionAttemptId: sectionAttempt.id,
              questionId: qa.questionId,
              selectedOptionIds: qa.selectedOptionIds,
              isCorrect: qa.isCorrect,
              isSkipped: qa.isSkipped,
              timeTaken: qa.timeTaken,
              attemptedAt: qa.attemptedAt,
            },
          });
        }
      }

      await tx.mockTestAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'COMPLETED',
          completedAt: now,
          timeTaken: totalTimeTaken ?? null,
          totalScore: totalPossibleScore,
          earnedScore: totalEarnedScore,
        },
      });
    });

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
