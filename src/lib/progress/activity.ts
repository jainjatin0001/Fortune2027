// Daily activity rollup + streak math. Every place that finalises answers
// (quiz complete, mock test complete, daily question) calls recordDailyActivity
// inside its transaction, so the rollup can never drift from the answers.

import type { Prisma } from '@prisma/client';
import { addDays, dateKeyToDb, daysBetween, toDateKey } from './time';

type Tx = Prisma.TransactionClient;

export interface ActivityDelta {
  userId: string;
  tz: string;
  at?: Date;
  questionsAnswered: number;
  correctAnswers: number;
  studySeconds?: number;
}

export async function recordDailyActivity(tx: Tx, delta: ActivityDelta) {
  if (delta.questionsAnswered <= 0 && !delta.studySeconds) return;

  const date = dateKeyToDb(toDateKey(delta.at ?? new Date(), delta.tz));
  const studySeconds = Math.max(0, Math.round(delta.studySeconds ?? 0));

  await tx.userDailyActivity.upsert({
    where: { userId_date: { userId: delta.userId, date } },
    create: {
      userId: delta.userId,
      date,
      questionsAnswered: delta.questionsAnswered,
      correctAnswers: delta.correctAnswers,
      studySeconds,
    },
    update: {
      questionsAnswered: { increment: delta.questionsAnswered },
      correctAnswers: { increment: delta.correctAnswers },
      studySeconds: { increment: studySeconds },
    },
  });
}

export interface StreakSummary {
  current: number;
  longest: number;
  /** True when today already counts — otherwise the streak is at risk until midnight */
  activeToday: boolean;
}

/**
 * A day counts when at least one question was answered. The current streak
 * survives until the end of today, so a streak ending yesterday is still alive.
 */
export function computeStreak(activeDateKeys: string[], todayKey: string): StreakSummary {
  const days = [...new Set(activeDateKeys)].sort();
  let longest = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && daysBetween(days[i - 1], days[i]) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const last = days.at(-1);
  const activeToday = last === todayKey;
  const alive = activeToday || last === addDays(todayKey, -1);
  return { current: alive ? run : 0, longest, activeToday };
}
