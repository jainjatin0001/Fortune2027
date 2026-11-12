import { Prisma, type QuestionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { dateKeyToDb } from './time';

// Question types the daily card can render and grade
const DAILY_QUESTION_TYPES: QuestionType[] = ['SINGLE_CORRECT', 'NUMERIC'];

/**
 * Pick a question for (track, date) without storing it. The order is a hash of
 * question id + date, so concurrent requests for the same day agree on the pick.
 * Questions already used by the track are skipped until the pool runs out.
 */
async function pickQuestionId(trackId: string, dateKey: string): Promise<string | null> {
  const pick = (excludeUsed: boolean) => prisma.$queryRaw<{ id: string }[]>`
    SELECT q."id"
    FROM "questions" q
    JOIN "daily_question_track_subjects" ts ON ts."subjectId" = q."subjectId" AND ts."trackId" = ${trackId}
    WHERE q."isActive"
      AND q."questionType"::text IN (${Prisma.join(DAILY_QUESTION_TYPES)})
      AND (q."questionType" <> 'SINGLE_CORRECT'
           OR EXISTS (SELECT 1 FROM "question_options" o WHERE o."questionId" = q."id" AND o."isCorrect"))
      AND (q."questionType" <> 'NUMERIC' OR cardinality(q."acceptedAnswers") > 0)
      ${excludeUsed
        ? Prisma.sql`AND NOT EXISTS (SELECT 1 FROM "daily_questions" d WHERE d."trackId" = ${trackId} AND d."questionId" = q."id")`
        : Prisma.empty}
    ORDER BY md5(q."id" || ${dateKey})
    LIMIT 1`;

  const [fresh] = await pick(true);
  if (fresh) return fresh.id;
  const [reused] = await pick(false);
  return reused?.id ?? null;
}

/** The daily question row for (track, date), creating it on first request. */
export async function ensureDailyQuestion(trackId: string, dateKey: string) {
  const date = dateKeyToDb(dateKey);
  const existing = await prisma.dailyQuestion.findUnique({ where: { trackId_date: { trackId, date } } });
  if (existing) return existing;

  const questionId = await pickQuestionId(trackId, dateKey);
  if (!questionId) return null;

  try {
    return await prisma.dailyQuestion.create({ data: { trackId, date, questionId } });
  } catch (e) {
    // Another request created it first — use theirs
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return prisma.dailyQuestion.findUnique({ where: { trackId_date: { trackId, date } } });
    }
    throw e;
  }
}

const CARD_QUESTION_SELECT = {
  statement: true,
  imageUrl: true,
  questionType: true,
  difficulty: true,
  explanation: true,
  acceptedAnswers: true,
  subject: { select: { name: true } },
  options: { orderBy: { sortOrder: 'asc' }, select: { id: true, content: true, imageUrl: true, isCorrect: true } },
} satisfies Prisma.QuestionSelect;

export interface DailyQuestionReveal {
  isCorrect: boolean;
  selectedOptionIds: string[];
  textAnswer: string | null;
  correctOptionIds: string[];
  acceptedAnswers: string[];
  explanation: string | null;
  totalAnswers: number;
  correctPct: number;
}

export interface DailyQuestionCardData {
  dailyQuestionId: string;
  trackName: string;
  question: {
    statement: string;
    imageUrl: string | null;
    questionType: QuestionType;
    difficulty: string;
    subjectName: string;
    options: { id: string; content: string; imageUrl: string | null }[];
  };
  /** Present only once the student has answered — the answer key never ships before */
  reveal: DailyQuestionReveal | null;
}

export async function getDailyQuestionReveal(dailyQuestionId: string, userId: string): Promise<DailyQuestionReveal | null> {
  const [attempt, dq, totals] = await Promise.all([
    prisma.dailyQuestionAttempt.findUnique({ where: { userId_dailyQuestionId: { userId, dailyQuestionId } } }),
    prisma.dailyQuestion.findUnique({
      where: { id: dailyQuestionId },
      select: {
        question: {
          select: {
            explanation: true,
            acceptedAnswers: true,
            options: { where: { isCorrect: true }, select: { id: true } },
          },
        },
      },
    }),
    prisma.dailyQuestionAttempt.groupBy({
      by: ['isCorrect'],
      where: { dailyQuestionId },
      _count: { _all: true },
    }),
  ]);
  if (!attempt || !dq) return null;

  const totalAnswers = totals.reduce((s, t) => s + t._count._all, 0);
  const correct = totals.find(t => t.isCorrect)?._count._all ?? 0;
  return {
    isCorrect: attempt.isCorrect,
    selectedOptionIds: attempt.selectedOptionIds,
    textAnswer: attempt.textAnswer,
    correctOptionIds: dq.question.options.map(o => o.id),
    acceptedAnswers: dq.question.acceptedAnswers,
    explanation: dq.question.explanation,
    totalAnswers,
    correctPct: totalAnswers > 0 ? Math.round((correct / totalAnswers) * 100) : 0,
  };
}

/** Today's question for every active track, with the student's result if answered. */
export async function getDailyQuestionsFor(userId: string, dateKey: string): Promise<DailyQuestionCardData[]> {
  // Round trip 1: every active track with today's question (if already picked) and its answer key.
  // The key stays on the server — it is only copied into `reveal` once the student has answered.
  const tracks = await prisma.dailyQuestionTrack.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      dailyQuestions: { where: { date: dateKeyToDb(dateKey) }, select: { id: true, question: { select: CARD_QUESTION_SELECT } } },
    },
  });

  // Only the day's first visitor pays for picking: create any missing rows
  const rows = await Promise.all(tracks.map(async (track) => {
    const existing = track.dailyQuestions[0];
    if (existing) return { track, dq: existing };
    const created = await ensureDailyQuestion(track.id, dateKey);
    if (!created) return null;
    const question = await prisma.question.findUnique({ where: { id: created.questionId }, select: CARD_QUESTION_SELECT });
    return question ? { track, dq: { id: created.id, question } } : null;
  }));
  const present = rows.filter(r => r !== null);
  const ids = present.map(r => r.dq.id);

  // Round trip 2: this student's answers + community totals for all tracks at once
  const [attempts, totals] = await Promise.all([
    prisma.dailyQuestionAttempt.findMany({ where: { userId, dailyQuestionId: { in: ids } } }),
    prisma.dailyQuestionAttempt.groupBy({
      by: ['dailyQuestionId', 'isCorrect'],
      where: { dailyQuestionId: { in: ids } },
      _count: { _all: true },
    }),
  ]);

  return present.map(({ track, dq }) => {
    const q = dq.question;
    const attempt = attempts.find(a => a.dailyQuestionId === dq.id);
    const counts = totals.filter(t => t.dailyQuestionId === dq.id);
    const totalAnswers = counts.reduce((sum, t) => sum + t._count._all, 0);
    const correct = counts.find(t => t.isCorrect)?._count._all ?? 0;

    return {
      dailyQuestionId: dq.id,
      trackName: track.name,
      question: {
        statement: q.statement,
        imageUrl: q.imageUrl,
        questionType: q.questionType,
        difficulty: q.difficulty,
        subjectName: q.subject.name,
        options: q.options.map(({ id, content, imageUrl }) => ({ id, content, imageUrl })),
      },
      reveal: attempt
        ? {
            isCorrect: attempt.isCorrect,
            selectedOptionIds: attempt.selectedOptionIds,
            textAnswer: attempt.textAnswer,
            correctOptionIds: q.options.filter(o => o.isCorrect).map(o => o.id),
            acceptedAnswers: q.acceptedAnswers,
            explanation: q.explanation,
            totalAnswers,
            correctPct: totalAnswers > 0 ? Math.round((correct / totalAnswers) * 100) : 0,
          }
        : null,
    };
  });
}
