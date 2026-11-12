'use server';

import { Prisma } from '@prisma/client';
import { refresh } from 'next/cache';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { gradeAnswer, isAnswered, type StudentAnswer } from '@/lib/grading';
import { recordDailyActivity } from '@/lib/progress/activity';
import { DAILY_GOAL_MAX, DAILY_GOAL_MIN } from '@/lib/progress/constants';
import { getDailyQuestionReveal, type DailyQuestionReveal } from '@/lib/progress/daily-question';
import { hasMistakeOn } from '@/lib/progress/queries';
import { dbToDateKey, getUserTimeZone, toDateKey } from '@/lib/progress/time';

export type AnswerDailyQuestionResult =
  | { ok: true; reveal: DailyQuestionReveal }
  | { ok: false; error: string };

export async function answerDailyQuestion(
  dailyQuestionId: string,
  answer: StudentAnswer,
): Promise<AnswerDailyQuestionResult> {
  const user = await getDbUser();
  if (!user) return { ok: false, error: 'Please sign in to answer.' };

  const studentAnswer: StudentAnswer = {
    selectedOptionIds: Array.isArray(answer?.selectedOptionIds) ? answer.selectedOptionIds.map(String) : [],
    textAnswer: typeof answer?.textAnswer === 'string' ? answer.textAnswer.trim() : undefined,
  };
  if (!isAnswered(studentAnswer)) return { ok: false, error: 'Choose an answer first.' };

  const dq = await prisma.dailyQuestion.findUnique({
    where: { id: dailyQuestionId },
    select: {
      date: true,
      question: {
        select: {
          questionType: true,
          acceptedAnswers: true,
          options: { select: { id: true, isCorrect: true } },
        },
      },
    },
  });
  if (!dq) return { ok: false, error: 'This question is no longer available.' };

  // Only today's question counts — answering old ones would let streaks be back-filled
  const tz = await getUserTimeZone(user.id);
  if (dbToDateKey(dq.date) !== toDateKey(new Date(), tz)) {
    return { ok: false, error: 'This question has expired. Refresh for today’s question.' };
  }

  const optionIds = new Set(dq.question.options.map(o => o.id));
  if (studentAnswer.selectedOptionIds.some(id => !optionIds.has(id))) {
    return { ok: false, error: 'That option is not part of this question.' };
  }

  const isCorrect = gradeAnswer({
    questionType: dq.question.questionType,
    correctOptionIds: dq.question.options.filter(o => o.isCorrect).map(o => o.id),
    acceptedAnswers: dq.question.acceptedAnswers,
  }, studentAnswer) === true;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.dailyQuestionAttempt.create({
        data: {
          userId: user.id,
          dailyQuestionId,
          selectedOptionIds: studentAnswer.selectedOptionIds,
          textAnswer: studentAnswer.textAnswer || null,
          isCorrect,
        },
      });
      await recordDailyActivity(tx, {
        userId: user.id,
        tz,
        questionsAnswered: 1,
        correctAnswers: isCorrect ? 1 : 0,
      });
    });
  } catch (e) {
    // Already answered (double click / second tab) — fall through and show the stored result
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')) throw e;
  }

  const reveal = await getDailyQuestionReveal(dailyQuestionId, user.id);
  if (!reveal) return { ok: false, error: 'Could not load the result. Please refresh.' };

  // Streak, goal ring and heatmap all change with this answer
  refresh();
  return { ok: true, reveal };
}

export async function setDailyGoal(goal: number): Promise<{ ok: boolean; error?: string }> {
  const user = await getDbUser();
  if (!user) return { ok: false, error: 'Please sign in.' };

  const dailyGoal = Math.round(Number(goal));
  if (!Number.isFinite(dailyGoal) || dailyGoal < DAILY_GOAL_MIN || dailyGoal > DAILY_GOAL_MAX) {
    return { ok: false, error: `Pick a goal between ${DAILY_GOAL_MIN} and ${DAILY_GOAL_MAX}.` };
  }

  await prisma.profile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, dailyGoal },
    update: { dailyGoal },
  });
  refresh();
  return { ok: true };
}

export type PracticeReveal = Omit<DailyQuestionReveal, 'totalAnswers' | 'correctPct'>;

/**
 * Practice retry of a question the student previously got wrong. Graded on the
 * server but never stored — retries must not move accuracy, streaks or goals.
 */
export async function retryMistake(
  questionId: string,
  answer: StudentAnswer,
): Promise<{ ok: true; reveal: PracticeReveal } | { ok: false; error: string }> {
  const user = await getDbUser();
  if (!user) return { ok: false, error: 'Please sign in.' };

  const studentAnswer: StudentAnswer = {
    selectedOptionIds: Array.isArray(answer?.selectedOptionIds) ? answer.selectedOptionIds.map(String) : [],
    textAnswer: typeof answer?.textAnswer === 'string' ? answer.textAnswer.trim() : undefined,
  };
  if (!isAnswered(studentAnswer)) return { ok: false, error: 'Choose an answer first.' };

  // Only questions this student already answered wrongly — otherwise this would be an answer-key lookup
  if (!(await hasMistakeOn(user.id, questionId))) return { ok: false, error: 'This question is not in your review list.' };

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: {
      questionType: true,
      acceptedAnswers: true,
      explanation: true,
      options: { select: { id: true, isCorrect: true } },
    },
  });
  if (!question) return { ok: false, error: 'This question is no longer available.' };

  const correctOptionIds = question.options.filter(o => o.isCorrect).map(o => o.id);
  return {
    ok: true,
    reveal: {
      isCorrect: gradeAnswer({ questionType: question.questionType, correctOptionIds, acceptedAnswers: question.acceptedAnswers }, studentAnswer) === true,
      selectedOptionIds: studentAnswer.selectedOptionIds,
      textAnswer: studentAnswer.textAnswer || null,
      correctOptionIds,
      acceptedAnswers: question.acceptedAnswers,
      explanation: question.explanation,
    },
  };
}
