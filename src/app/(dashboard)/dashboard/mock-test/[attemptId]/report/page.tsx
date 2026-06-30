import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ReportView } from './_components/ReportView';

export const metadata: Metadata = { title: 'Mock Test Report' };

export default async function MockTestReportPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { attemptId } = await params;

  const attempt = await prisma.mockTestAttempt.findUnique({
    where: { id: attemptId },
    include: {
      mockTest: {
        select: { id: true, title: true, passingScore: true },
      },
      sectionAttempts: {
        include: {
          section: { select: { name: true, shortName: true, sortOrder: true, timeLimit: true } },
          questionAttempts: {
            include: {
              question: {
                include: {
                  options: { orderBy: { sortOrder: 'asc' } },
                  subject: { select: { name: true } },
                  topic: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { section: { sortOrder: 'asc' } },
      },
    },
  });

  if (!attempt) notFound();
  if (attempt.userId !== user.id && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  if (attempt.status !== 'COMPLETED') redirect('/dashboard');

  // ── Compute report ────────────────────────────────────────────
  let totalCorrect = 0, totalIncorrect = 0, totalSkipped = 0;

  const sections = attempt.sectionAttempts.map((sa) => {
    const questions = sa.questionAttempts.map((qa) => {
      const correctOptionIds = qa.question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);

      return {
        questionId: qa.questionId,
        statement: qa.question.statement,
        difficulty: qa.question.difficulty,
        subject: qa.question.subject.name,
        topic: qa.question.topic?.name ?? null,
        selectedOptionIds: qa.selectedOptionIds,
        correctOptionIds,
        isCorrect: qa.isCorrect,
        isSkipped: qa.isSkipped,
        timeTaken: qa.timeTaken,
        explanation: qa.question.explanation,
        options: qa.question.options.map((o) => ({
          id: o.id,
          content: o.content,
          isCorrect: o.isCorrect,
        })),
      };
    });

    totalCorrect += sa.correctCount;
    totalIncorrect += sa.incorrectCount;
    totalSkipped += sa.skippedCount;

    return {
      sectionId: sa.sectionId,
      name: sa.section.name,
      shortName: sa.section.shortName,
      sortOrder: sa.section.sortOrder,
      timeLimit: sa.section.timeLimit,
      timeTaken: sa.timeTaken,
      earnedScore: sa.earnedScore,
      totalScore: sa.totalScore,
      correctCount: sa.correctCount,
      incorrectCount: sa.incorrectCount,
      skippedCount: sa.skippedCount,
      accuracy: sa.totalScore > 0
        ? Math.round((sa.earnedScore / sa.totalScore) * 100)
        : sa.correctCount + sa.incorrectCount > 0
          ? Math.round((sa.correctCount / (sa.correctCount + sa.incorrectCount)) * 100)
          : 0,
      questions,
    };
  });

  // Topic analysis
  const topicMap = new Map<string, { subject: string; topic: string | null; total: number; correct: number }>();
  for (const sec of sections) {
    for (const q of sec.questions) {
      if (q.isSkipped) continue;
      const key = `${q.subject}||${q.topic ?? ''}`;
      const entry = topicMap.get(key) ?? { subject: q.subject, topic: q.topic, total: 0, correct: 0 };
      entry.total++;
      if (q.isCorrect) entry.correct++;
      topicMap.set(key, entry);
    }
  }
  const topicAnalysis = [...topicMap.values()]
    .map((t) => ({ ...t, accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0 }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const totalScore = attempt.totalScore ?? 0;
  const earnedScore = attempt.earnedScore ?? 0;
  const accuracy = totalCorrect + totalIncorrect > 0
    ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
    : 0;
  const passed = attempt.mockTest
    ? accuracy >= attempt.mockTest.passingScore
    : false;

  // Auto-generated insights
  const insights: string[] = [];
  if (accuracy >= 80) insights.push('Excellent overall accuracy — you have a strong command of the material.');
  else if (accuracy >= 60) insights.push('Good accuracy overall. Focus on the weaker topics to push your score higher.');
  else insights.push('Your accuracy needs improvement. Review the explanations for each incorrect answer carefully.');

  if (totalSkipped > 0) {
    insights.push(`You skipped ${totalSkipped} question${totalSkipped > 1 ? 's' : ''}. On most exams, an educated guess is better than leaving blank.`);
  }

  const weakTopics = topicAnalysis.filter((t) => t.accuracy < 50 && t.total >= 2);
  if (weakTopics.length > 0) {
    insights.push(`Weakest areas: ${weakTopics.slice(0, 3).map((t) => t.topic ?? t.subject).join(', ')}. Prioritise these in your revision.`);
  }

  const strongTopics = topicAnalysis.filter((t) => t.accuracy >= 80 && t.total >= 2);
  if (strongTopics.length > 0) {
    insights.push(`Strong areas: ${strongTopics.slice(0, 3).map((t) => t.topic ?? t.subject).join(', ')}. Keep these sharp.`);
  }

  const weakSection = sections.slice().sort((a, b) => a.accuracy - b.accuracy)[0];
  if (weakSection && weakSection.accuracy < 70) {
    insights.push(`Your lowest section was ${weakSection.name} (${weakSection.accuracy}% accuracy). Extra practice here will have the biggest impact.`);
  }

  const slowSection = sections
    .filter((s) => s.timeTaken / s.timeLimit > 0.92)
    .sort((a, b) => b.timeTaken / b.timeLimit - a.timeTaken / a.timeLimit)[0];
  if (slowSection) {
    insights.push(`You used almost all available time in ${slowSection.shortName}. Work on pacing to leave time for review.`);
  }

  const report = {
    attemptId: attempt.id,
    mockTestId: attempt.mockTestId,
    title: attempt.mockTest?.title ?? 'Mock Test',
    passingScore: attempt.mockTest?.passingScore ?? 70,
    status: attempt.status,
    startedAt: attempt.startedAt.toISOString(),
    completedAt: attempt.completedAt?.toISOString() ?? null,
    totalTimeTaken: attempt.timeTaken,
    totalScore,
    earnedScore,
    scaledScore: attempt.scaledScore,
    accuracy,
    correctCount: totalCorrect,
    incorrectCount: totalIncorrect,
    skippedCount: totalSkipped,
    passed,
    sections,
    topicAnalysis,
    insights,
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <ReportView report={report} />
    </div>
  );
}
