import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser, unauthorized, notFound } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { MockTestReport, MockTestReportSection, MockTestReportQuestion, MockTestTopicAnalysis } from '@/types';

export async function GET(
  _req: NextRequest,
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
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

    const attempt = await prisma.mockTestAttempt.findUnique({
      where: {
        id: attemptId,
        ...(!isAdmin && { userId: user.id }),
      },
      include: {
        mockTest: {
          include: {
            program: { select: { name: true, slug: true } },
            sections: { orderBy: { sortOrder: 'asc' } },
          },
        },
        sectionAttempts: {
          include: {
            section: true,
            questionAttempts: {
              include: {
                question: {
                  include: {
                    subject: { select: { name: true } },
                    topic: { select: { name: true } },
                    options: { orderBy: { sortOrder: 'asc' } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!attempt) return notFound('Attempt not found');
    if (attempt.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Attempt not yet completed' }, { status: 400 });
    }

    const mockTest = attempt.mockTest;
    const sectionAttempts = attempt.sectionAttempts;

    // ── Overall stats ─────────────────────────────────────────────
    const totalQuestions = sectionAttempts.reduce((acc, sa) => acc + sa.questionAttempts.length, 0);
    const correctCount = sectionAttempts.reduce((acc, sa) => acc + sa.correctCount, 0);
    const incorrectCount = sectionAttempts.reduce((acc, sa) => acc + sa.incorrectCount, 0);
    const skippedCount = sectionAttempts.reduce((acc, sa) => acc + sa.skippedCount, 0);
    const earnedScore = attempt.earnedScore ?? 0;
    const totalScore = attempt.totalScore ?? 0;
    const percentage = totalScore > 0 ? (earnedScore / totalScore) * 100 : 0;
    const timeTaken = attempt.timeTaken ?? 0;

    // ── Section stats ─────────────────────────────────────────────
    const sections: MockTestReportSection[] = sectionAttempts
      .sort((a, b) => a.section.sortOrder - b.section.sortOrder)
      .map(sa => {
        const totalQ = sa.questionAttempts.length;
        const sectionPct = sa.totalScore > 0 ? (sa.earnedScore / sa.totalScore) * 100 : 0;
        const answered = sa.correctCount + sa.incorrectCount;
        const accuracy = answered > 0 ? (sa.correctCount / answered) * 100 : 0;
        const avgTime = totalQ > 0 ? sa.timeTaken / totalQ : 0;
        const strength: 'strong' | 'average' | 'weak' =
          sectionPct >= 75 ? 'strong' : sectionPct >= 50 ? 'average' : 'weak';

        return {
          sectionId: sa.sectionId,
          sectionName: sa.section.name,
          shortName: sa.section.shortName,
          earnedScore: sa.earnedScore,
          totalScore: sa.totalScore,
          percentage: Math.round(sectionPct * 10) / 10,
          accuracy: Math.round(accuracy * 10) / 10,
          timeTaken: sa.timeTaken,
          avgTimePerQuestion: Math.round(avgTime),
          correctCount: sa.correctCount,
          incorrectCount: sa.incorrectCount,
          skippedCount: sa.skippedCount,
          totalQuestions: totalQ,
          strength,
        };
      });

    // ── Question-level detail ─────────────────────────────────────
    let globalQNum = 0;
    const questionDetails: MockTestReportQuestion[] = [];

    for (const sa of sectionAttempts.sort((a, b) => a.section.sortOrder - b.section.sortOrder)) {
      for (const qa of sa.questionAttempts) {
        globalQNum++;
        const q = qa.question;
        const correctOptionId = q.options.find(o => o.isCorrect)?.id ?? '';

        questionDetails.push({
          questionId: q.id,
          sectionName: sa.section.name,
          questionNumber: globalQNum,
          statement: q.statement,
          correctOptionId,
          selectedOptionIds: qa.selectedOptionIds,
          isCorrect: qa.isCorrect ?? false,
          isSkipped: qa.isSkipped,
          timeTaken: qa.timeTaken ?? 0,
          difficulty: q.difficulty,
          topic: q.topic?.name,
          subject: q.subject.name,
          explanation: q.explanation ?? undefined,
          options: q.options.map(o => ({ id: o.id, content: o.content, isCorrect: o.isCorrect })),
        });
      }
    }

    // ── Topic analysis ────────────────────────────────────────────
    const topicMap = new Map<string, { subject: string; total: number; correct: number; totalTime: number }>();

    for (const qd of questionDetails) {
      const key = qd.topic ?? qd.subject;
      const entry = topicMap.get(key) ?? { subject: qd.subject, total: 0, correct: 0, totalTime: 0 };
      entry.total++;
      if (qd.isCorrect) entry.correct++;
      entry.totalTime += qd.timeTaken;
      topicMap.set(key, entry);
    }

    const topicAnalysis: MockTestTopicAnalysis[] = Array.from(topicMap.entries()).map(([topicName, data]) => ({
      topicName,
      subjectName: data.subject,
      totalQuestions: data.total,
      correctCount: data.correct,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 1000) / 10 : 0,
      avgTimeTaken: data.total > 0 ? Math.round(data.totalTime / data.total) : 0,
    })).sort((a, b) => b.totalQuestions - a.totalQuestions);

    // ── Time analysis ─────────────────────────────────────────────
    const answeredQs = questionDetails.filter(q => !q.isSkipped && q.timeTaken > 0);
    const fastestQ = answeredQs.length
      ? answeredQs.reduce((min, q) => q.timeTaken < min.timeTaken ? q : min, answeredQs[0])
      : null;
    const slowestQ = answeredQs.length
      ? answeredQs.reduce((max, q) => q.timeTaken > max.timeTaken ? q : max, answeredQs[0])
      : null;

    // ── Auto-generated insights ───────────────────────────────────
    const insights: string[] = [];
    const totalAnswered = correctCount + incorrectCount;
    const overallAccuracy = totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0;
    const avgTimePerQuestion = totalQuestions > 0 ? timeTaken / totalQuestions : 0;

    if (overallAccuracy >= 80) {
      insights.push('Excellent accuracy! You answered most questions correctly — focus on speed to maximize your score.');
    } else if (overallAccuracy >= 60) {
      insights.push('Good accuracy overall. Review the questions you got wrong to identify patterns in your mistakes.');
    } else {
      insights.push('There is significant room to improve accuracy. Consider revisiting core concepts for weak topics before the next attempt.');
    }

    if (skippedCount > totalQuestions * 0.15) {
      insights.push(`You skipped ${skippedCount} questions (${Math.round((skippedCount / totalQuestions) * 100)}%). On most standardized tests, a guess is better than leaving a question blank — every question counts!`);
    }

    if (avgTimePerQuestion < 40) {
      insights.push('You completed questions quickly. Make sure accuracy is not being sacrificed for speed — double-check your answers if time allows.');
    } else if (avgTimePerQuestion > 90) {
      insights.push('You spent a lot of time per question. Practice time management: if stuck, make your best guess and move on to avoid running out of time.');
    }

    const weakSections = sections.filter(s => s.strength === 'weak');
    if (weakSections.length > 0) {
      insights.push(`Focus extra practice on: ${weakSections.map(s => s.sectionName).join(', ')}. These sections pulled down your overall score the most.`);
    }

    const strongSections = sections.filter(s => s.strength === 'strong');
    if (strongSections.length > 0) {
      insights.push(`Strong performance in: ${strongSections.map(s => s.sectionName).join(', ')}. Keep up the good work in these areas!`);
    }

    const weakTopics = topicAnalysis.filter(t => t.accuracy < 50 && t.totalQuestions >= 2);
    if (weakTopics.length > 0) {
      insights.push(`Weakest topics by accuracy: ${weakTopics.slice(0, 3).map(t => t.topicName).join(', ')}. Targeted practice on these will yield the highest score gains.`);
    }

    const report: MockTestReport = {
      attempt: {
        id: attempt.id,
        userId: attempt.userId,
        mockTestId: attempt.mockTestId,
        assetId: attempt.assetId ?? undefined,
        enrollmentId: attempt.enrollmentId ?? undefined,
        status: attempt.status,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt ?? undefined,
        timeTaken: attempt.timeTaken ?? undefined,
        totalScore: attempt.totalScore ?? undefined,
        earnedScore: attempt.earnedScore ?? undefined,
        scaledScore: attempt.scaledScore ?? undefined,
      },
      mockTest: {
        id: mockTest.id,
        programId: mockTest.programId ?? undefined,
        title: mockTest.title,
        description: mockTest.description ?? undefined,
        instructions: mockTest.instructions ?? undefined,
        passingScore: mockTest.passingScore,
        isPublished: mockTest.isPublished,
        createdAt: mockTest.createdAt,
        updatedAt: mockTest.updatedAt,
      },
      overall: {
        totalQuestions,
        correctCount,
        incorrectCount,
        skippedCount,
        accuracy: Math.round(overallAccuracy * 10) / 10,
        earnedScore,
        totalScore,
        percentage: Math.round(percentage * 10) / 10,
        scaledScore: attempt.scaledScore ?? undefined,
        passed: percentage >= mockTest.passingScore,
        timeTaken,
      },
      sections,
      questionDetails,
      topicAnalysis,
      timeAnalysis: {
        totalTime: timeTaken,
        avgTimePerQuestion: Math.round(avgTimePerQuestion),
        fastestQuestion: fastestQ
          ? { questionId: fastestQ.questionId, timeTaken: fastestQ.timeTaken }
          : null,
        slowestQuestion: slowestQ
          ? { questionId: slowestQ.questionId, timeTaken: slowestQ.timeTaken }
          : null,
        timeBySection: sectionAttempts
          .sort((a, b) => a.section.sortOrder - b.section.sortOrder)
          .map(sa => ({ sectionName: sa.section.name, timeTaken: sa.timeTaken })),
      },
      insights,
    };

    return NextResponse.json({ report });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
