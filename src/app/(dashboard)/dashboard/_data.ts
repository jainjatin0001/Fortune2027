import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { getDailyQuestionsFor } from '@/lib/progress/daily-question';
import { getEngagementSummary, getMockTestResults, getQuizSummary, getSubjectStrengths } from '@/lib/progress/queries';
import { getUserTimeZone, toDateKey } from '@/lib/progress/time';

// Request-scoped memoisation: several streamed sections read the same data
export const getTimeZone = cache(getUserTimeZone);
export const getEngagement = cache(async (studentId: string) =>
  getEngagementSummary(studentId, await getTimeZone(studentId)),
);
export const getQuizzes = cache(getQuizSummary);
export const getMockTests = cache(getMockTestResults);
export const getStrengths = cache(getSubjectStrengths);
export const getIsEnrolled = cache(async (studentId: string) =>
  (await prisma.enrollment.count({ where: { userId: studentId, status: 'ACTIVE' } })) > 0,
);
/** Keyed by the student's local date directly, so it doesn't wait for the engagement summary */
export const getDailyQuestions = cache(async (studentId: string) =>
  getDailyQuestionsFor(studentId, toDateKey(new Date(), await getTimeZone(studentId))),
);
