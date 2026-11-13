import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewDetailedReport } from '@/lib/mock-test/access';
import { EXAM_KIND_META, examKindOf } from '@/lib/mock-test/exam-kind';
import { scaleScore } from '@/lib/mock-test/scoring';
import { MOCK_TESTS_PATH } from '@/lib/mock-test/paths';
import { ReportView, type ReportData, type ReportQuestion } from './_components/ReportView';

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
      user: { select: { firstName: true, lastName: true } },
      mockTest: {
        select: {
          id: true, title: true, passingScore: true, isDemo: true,
          program: { select: { slug: true, name: true } },
        },
      },
      sectionAttempts: {
        include: {
          section: {
            select: {
              name: true, shortName: true, sortOrder: true, timeLimit: true,
              questions: { select: { questionId: true, sortOrder: true } },
            },
          },
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
  const isStaff = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'INSTRUCTOR';
  if (attempt.userId !== user.id && !isStaff) {
    redirect('/dashboard');
  }
  if (attempt.status !== 'COMPLETED') redirect('/dashboard');

  const detailed = await canViewDetailedReport(user);
  const examKind = examKindOf(attempt.mockTest.program);

  // ── Sections ────────────────────────────────────────────────
  const questions: ReportQuestion[] = [];

  const sections = attempt.sectionAttempts.map((sa) => {
    if (detailed) {
      // Questions in the order the student saw them
      const order = new Map(sa.section.questions.map(q => [q.questionId, q.sortOrder]));
      const ordered = [...sa.questionAttempts].sort(
        (a, b) => (order.get(a.questionId) ?? 0) - (order.get(b.questionId) ?? 0),
      );
      ordered.forEach((qa, i) => {
        questions.push({
          key: `${sa.sectionId}-${qa.questionId}`,
          sectionId: sa.sectionId,
          sectionShort: sa.section.shortName,
          number: i + 1,
          statement: qa.question.statement,
          passage: qa.question.passage,
          difficulty: qa.question.difficulty,
          subject: qa.question.subject.name,
          topic: qa.question.topic?.name ?? null,
          questionType: qa.question.questionType,
          options: qa.question.options.map(o => ({ id: o.id, content: o.content, isCorrect: o.isCorrect })),
          selectedOptionIds: qa.selectedOptionIds,
          textAnswer: qa.textAnswer,
          acceptedAnswers: qa.question.acceptedAnswers,
          isCorrect: qa.isCorrect,
          isSkipped: qa.isSkipped,
          timeTaken: qa.timeTaken ?? 0,
          explanation: qa.question.explanation,
        });
      });
    }

    const answered = sa.correctCount + sa.incorrectCount;
    return {
      id: sa.sectionId,
      name: sa.section.name,
      shortName: sa.section.shortName,
      timeLimit: sa.section.timeLimit,
      timeTaken: sa.timeTaken,
      earned: sa.earnedScore,
      total: sa.totalScore,
      correct: sa.correctCount,
      incorrect: sa.incorrectCount,
      skipped: sa.skippedCount,
      questionCount: answered + sa.skippedCount,
      accuracy: answered > 0 ? Math.round((sa.correctCount / answered) * 100) : 0,
      scorePct: sa.totalScore > 0 ? Math.round((sa.earnedScore / sa.totalScore) * 100) : 0,
    };
  });

  const totalCorrect = sections.reduce((n, s) => n + s.correct, 0);
  const totalIncorrect = sections.reduce((n, s) => n + s.incorrect, 0);
  const totalSkipped = sections.reduce((n, s) => n + s.skipped, 0);
  const totalScore = attempt.totalScore ?? 0;
  const earnedScore = attempt.earnedScore ?? 0;
  const percentage = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;
  const answered = totalCorrect + totalIncorrect;
  const accuracy = answered > 0 ? Math.round((totalCorrect / answered) * 100) : 0;

  const scaled = scaleScore(examKind, attempt.sectionAttempts.map(sa => ({
    name: sa.section.name,
    shortName: sa.section.shortName,
    earned: sa.earnedScore,
    total: sa.totalScore,
  })));

  // ── Insights (section-level ones are free; question-level ones need the detailed report) ──
  const insights: string[] = [];
  if (accuracy >= 80) insights.push('Excellent accuracy on the questions you answered — you have a strong command of the material.');
  else if (accuracy >= 60) insights.push('Solid accuracy overall. Focus on your weaker sections to push your score higher.');
  else insights.push('Accuracy is the main lever right now. Review every incorrect answer and its explanation before your next test.');
  if (totalSkipped > 0) {
    insights.push(`You left ${totalSkipped} question${totalSkipped > 1 ? 's' : ''} blank. There's no penalty for guessing — always answer every question.`);
  }
  const weakSection = sections.slice().sort((a, b) => a.scorePct - b.scorePct)[0];
  if (sections.length > 1 && weakSection && weakSection.scorePct < 70) {
    insights.push(`Your lowest section was ${weakSection.name} (${weakSection.scorePct}%). Extra practice here will move your score the most.`);
  }
  const rushed = sections.find(s => s.timeLimit > 0 && s.timeTaken / s.timeLimit >= 0.95 && s.skipped > 0);
  if (rushed) {
    insights.push(`You ran out of time in ${rushed.name} with questions left blank — work on pacing so you reach every question.`);
  }

  const report: ReportData = {
    attemptId: attempt.id,
    title: attempt.mockTest.title.trim(),
    programName: attempt.mockTest.program?.name ?? null,
    examKind,
    color: examKind ? EXAM_KIND_META[examKind].color : '#4f46e5',
    studentName: `${attempt.user.firstName} ${attempt.user.lastName}`.trim(),
    isOwnReport: attempt.userId === user.id,
    completedAt: attempt.completedAt?.toISOString() ?? attempt.startedAt.toISOString(),
    totalTimeTaken: attempt.timeTaken ?? sections.reduce((n, s) => n + s.timeTaken, 0),
    totalTimeLimit: sections.reduce((n, s) => n + s.timeLimit, 0),
    earnedScore,
    totalScore,
    percentage,
    accuracy,
    passingScore: attempt.mockTest.passingScore,
    passed: percentage >= attempt.mockTest.passingScore,
    correct: totalCorrect,
    incorrect: totalIncorrect,
    skipped: totalSkipped,
    scaled,
    sections,
    insights,
    detailed,
    questions: detailed ? questions : [],
    backHref: attempt.mockTest.isDemo ? MOCK_TESTS_PATH : null,
  };

  return (
    <div className="px-1 py-2 md:px-2 print:p-0">
      <ReportView report={report} />
    </div>
  );
}
