// Read model for the student dashboard. Every function takes a studentId (not the
// session user) so the same queries can back a parent's view of a linked student.

import { Prisma, type DifficultyLevel, type QuestionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PACE_TARGET_SECONDS } from './constants';
import { computeStreak, type StreakSummary } from './activity';
import { addDays, dbToDateKey, toDateKey } from './time';
import { getAllDemoMockTests } from '@/lib/mock-test/demo';
import { examKindOf, type ExamKind } from '@/lib/mock-test/exam-kind';
import { scaleScore } from '@/lib/mock-test/scoring';

// A full year, GitHub-contribution style
const HEATMAP_WEEKS = 53;
/** A subject needs this many answers before it is called strong or weak */
export const MIN_ANSWERS_FOR_SIGNAL = 10;
export const WEAK_ACCURACY = 60;
export const STRONG_ACCURACY = 80;

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : null);

// ── Engagement: streak, daily goal, heatmap, headline totals ──────────────────

export interface HeatmapCell {
  date: string;
  answered: number;
}

export interface EngagementSummary {
  todayKey: string;
  streak: StreakSummary;
  dailyGoal: number;
  answeredToday: number;
  goalDaysLast7: number;
  examDate: Date | null;
  targetScore: number | null;
  totals: { answered: number; correct: number; accuracy: number | null };
  /** Accuracy over the last 7 days and the 7 days before, for the trend delta */
  accuracyLast7: number | null;
  accuracyPrev7: number | null;
  studySecondsLast7: number;
  /** HEATMAP_WEEKS full weeks (Sun→Sat), oldest first; future days are omitted */
  heatmap: HeatmapCell[];
}

export async function getEngagementSummary(studentId: string, tz: string): Promise<EngagementSummary> {
  const [rows, profile] = await Promise.all([
    prisma.userDailyActivity.findMany({
      where: { userId: studentId },
      orderBy: { date: 'asc' },
      select: { date: true, questionsAnswered: true, correctAnswers: true, studySeconds: true },
    }),
    prisma.profile.findUnique({
      where: { userId: studentId },
      select: { dailyGoal: true, examDate: true, targetScore: true },
    }),
  ]);

  const todayKey = toDateKey(new Date(), tz);
  const byDay = new Map(rows.map(r => [dbToDateKey(r.date), r]));
  const dailyGoal = profile?.dailyGoal ?? 10;

  const sumWindow = (fromOffset: number, toOffset: number) => {
    let answered = 0, correct = 0, seconds = 0, goalDays = 0;
    for (let i = fromOffset; i <= toOffset; i++) {
      const r = byDay.get(addDays(todayKey, -i));
      if (!r) continue;
      answered += r.questionsAnswered;
      correct += r.correctAnswers;
      seconds += r.studySeconds;
      if (r.questionsAnswered >= dailyGoal) goalDays++;
    }
    return { answered, correct, seconds, goalDays };
  };
  const last7 = sumWindow(0, 6);
  const prev7 = sumWindow(7, 13);

  const totals = rows.reduce(
    (t, r) => ({ answered: t.answered + r.questionsAnswered, correct: t.correct + r.correctAnswers }),
    { answered: 0, correct: 0 },
  );

  // Start on the Sunday HEATMAP_WEEKS-1 weeks back so columns line up as weeks
  const todayDow = new Date(`${todayKey}T00:00:00Z`).getUTCDay();
  const start = addDays(todayKey, -(todayDow + (HEATMAP_WEEKS - 1) * 7));
  const heatmap: HeatmapCell[] = [];
  for (let key = start; key <= todayKey; key = addDays(key, 1)) {
    heatmap.push({ date: key, answered: byDay.get(key)?.questionsAnswered ?? 0 });
  }

  return {
    todayKey,
    streak: computeStreak(rows.filter(r => r.questionsAnswered > 0).map(r => dbToDateKey(r.date)), todayKey),
    dailyGoal,
    answeredToday: byDay.get(todayKey)?.questionsAnswered ?? 0,
    goalDaysLast7: last7.goalDays,
    examDate: profile?.examDate ?? null,
    targetScore: profile?.targetScore ?? null,
    totals: { ...totals, accuracy: pct(totals.correct, totals.answered) },
    accuracyLast7: pct(last7.correct, last7.answered),
    accuracyPrev7: pct(prev7.correct, prev7.answered),
    studySecondsLast7: last7.seconds,
    heatmap,
  };
}

// ── Quizzes ───────────────────────────────────────────────────────────────────

export const RECENT_QUIZZES_LIMIT = 20;

export interface QuizSummary {
  completed: number;
  passed: number;
  avgScore: number | null;
  recent: { id: string; quizId: string; title: string; score: number; passed: boolean; completedAt: Date }[];
}

export async function getQuizSummary(studentId: string): Promise<QuizSummary> {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: studentId, status: 'COMPLETED', completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    select: {
      id: true,
      score: true,
      completedAt: true,
      quiz: { select: { id: true, title: true, passingScore: true } },
    },
  });

  const scored = attempts.map(a => ({
    id: a.id,
    quizId: a.quiz.id,
    title: a.quiz.title,
    score: Math.round(a.score ?? 0),
    passed: (a.score ?? 0) >= a.quiz.passingScore,
    completedAt: a.completedAt!,
  }));

  return {
    completed: scored.length,
    passed: scored.filter(a => a.passed).length,
    avgScore: scored.length ? Math.round(scored.reduce((s, a) => s + a.score, 0) / scored.length) : null,
    recent: scored.slice(0, RECENT_QUIZZES_LIMIT),
  };
}

export interface SubjectOption {
  id: string;
  name: string;
  programName: string;
}

export interface DailyAccuracyPoint {
  subjectId: string;
  /** Local calendar day of quiz completion, YYYY-MM-DD in the student's time zone */
  day: string;
  answered: number;
  correct: number;
}

/**
 * Per-subject, per-day quiz accuracy. The client re-buckets to day / week / month
 * per selected range and aggregates "All subjects", so switching filters is instant.
 */
export async function getQuizAccuracyByDay(studentId: string, tz: string) {
  const [points, subjects] = await Promise.all([
    // day comes back as text: a DATE value would be re-parsed in the server's time zone
    prisma.$queryRaw<DailyAccuracyPoint[]>`
      SELECT q."subjectId",
             to_char((qa."completedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${tz}, 'YYYY-MM-DD') AS day,
             COUNT(*)::int AS answered,
             COUNT(*) FILTER (WHERE u."isCorrect")::int AS correct
      FROM "user_question_attempts" u
      JOIN "quiz_attempts" qa ON qa."id" = u."quizAttemptId"
      JOIN "questions" q ON q."id" = u."questionId"
      WHERE qa."userId" = ${studentId} AND qa."status" = 'COMPLETED' AND qa."completedAt" IS NOT NULL
      GROUP BY 1, 2
      ORDER BY 2`,
    prisma.subject.findMany({
      where: { isActive: true },
      orderBy: [{ program: { sortOrder: 'asc' } }, { sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, program: { select: { name: true } } },
    }),
  ]);

  return {
    points,
    subjects: subjects.map(s => ({ id: s.id, name: s.name, programName: s.program.name })) satisfies SubjectOption[],
  };
}

// ── Every graded answer (quizzes + mock tests) ───────────────────────────────

/**
 * One row per graded answer from completed quizzes and mock tests — the common
 * source for strengths, difficulty, pacing and mistakes. Quizzes only record total
 * time, so a quiz answer's `seconds` is the attempt time split evenly across its answers.
 * Mock-test skips are excluded; they were never answered.
 */
const answeredQuestions = (studentId: string) => Prisma.sql`
  SELECT u."questionId", COALESCE(u."isCorrect", false) AS "isCorrect", qa."completedAt" AS "answeredAt",
         qa."timeTaken"::float / COUNT(*) OVER (PARTITION BY qa."id") AS seconds
  FROM "user_question_attempts" u
  JOIN "quiz_attempts" qa ON qa."id" = u."quizAttemptId"
  WHERE qa."userId" = ${studentId} AND qa."status" = 'COMPLETED'
  UNION ALL
  SELECT m."questionId", COALESCE(m."isCorrect", false), ma."completedAt", m."timeTaken"::float
  FROM "mock_test_question_attempts" m
  JOIN "mock_test_section_attempts" sa ON sa."id" = m."sectionAttemptId"
  JOIN "mock_test_attempts" ma ON ma."id" = sa."attemptId"
  WHERE ma."userId" = ${studentId} AND ma."status" = 'COMPLETED' AND NOT m."isSkipped"`;

// ── Subject strengths ─────────────────────────────────────────────────────────

export interface SubjectStrength {
  subjectId: string;
  name: string;
  answered: number;
  correct: number;
  accuracy: number;
  status: 'strong' | 'weak' | 'developing' | 'not-enough-data';
}

export async function getSubjectStrengths(studentId: string): Promise<SubjectStrength[]> {
  const rows = await prisma.$queryRaw<{ subjectId: string; name: string; answered: number; correct: number }[]>`
    SELECT s."id" AS "subjectId", s."name",
           COUNT(*)::int AS answered,
           COUNT(*) FILTER (WHERE a."isCorrect")::int AS correct
    FROM (${answeredQuestions(studentId)}) a
    JOIN "questions" q ON q."id" = a."questionId"
    JOIN "subjects" s ON s."id" = q."subjectId"
    GROUP BY s."id", s."name"`;

  return rows
    .map(r => {
      const accuracy = pct(r.correct, r.answered) ?? 0;
      const status: SubjectStrength['status'] =
        r.answered < MIN_ANSWERS_FOR_SIGNAL ? 'not-enough-data'
          : accuracy >= STRONG_ACCURACY ? 'strong'
            : accuracy < WEAK_ACCURACY ? 'weak'
              : 'developing';
      return { ...r, accuracy, status };
    })
    .sort((a, b) => b.answered - a.answered);
}

// ── Accuracy by difficulty ────────────────────────────────────────────────────

const DIFFICULTY_ORDER: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

export interface DifficultyAccuracy {
  difficulty: DifficultyLevel;
  answered: number;
  correct: number;
  accuracy: number;
}

export async function getDifficultyBreakdown(studentId: string): Promise<DifficultyAccuracy[]> {
  const rows = await prisma.$queryRaw<{ difficulty: DifficultyLevel; answered: number; correct: number }[]>`
    SELECT q."difficulty", COUNT(*)::int AS answered, COUNT(*) FILTER (WHERE a."isCorrect")::int AS correct
    FROM (${answeredQuestions(studentId)}) a
    JOIN "questions" q ON q."id" = a."questionId"
    GROUP BY q."difficulty"`;

  return rows
    .map(r => ({ ...r, accuracy: pct(r.correct, r.answered) ?? 0 }))
    .sort((a, b) => DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty));
}

// ── Pacing ────────────────────────────────────────────────────────────────────

export interface PacingRow {
  slug: string;
  name: string;
  answered: number;
  avgSeconds: number;
  targetSeconds: number;
}

const PACE_OUTLIER_CAP_SECONDS = 600;

/** Average seconds per answered question per exam section, for sections with an official pace */
export async function getPacing(studentId: string): Promise<PacingRow[]> {
  const rows = await prisma.$queryRaw<{ slug: string; name: string; answered: number; avgSeconds: number }[]>`
    -- Capped per answer so a quiz left open in a tab doesn't swamp the average
    SELECT t."slug", t."name", COUNT(*)::int AS answered, ROUND(AVG(LEAST(a.seconds, ${PACE_OUTLIER_CAP_SECONDS})))::int AS "avgSeconds"
    FROM (${answeredQuestions(studentId)}) a
    JOIN "questions" q ON q."id" = a."questionId"
    JOIN "daily_question_track_subjects" ts ON ts."subjectId" = q."subjectId"
    JOIN "daily_question_tracks" t ON t."id" = ts."trackId"
    WHERE a.seconds > 0
    GROUP BY t."slug", t."name", t."sortOrder"
    ORDER BY t."sortOrder"`;

  return rows
    .filter(r => r.slug in PACE_TARGET_SECONDS)
    .map(r => ({ ...r, targetSeconds: PACE_TARGET_SECONDS[r.slug] }));
}

// ── Mistakes to review ────────────────────────────────────────────────────────

export interface MistakeQuestion {
  questionId: string;
  answeredAt: string;
  statement: string;
  imageUrl: string | null;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  subjectName: string;
  options: { id: string; content: string; imageUrl: string | null }[];
}

export const MISTAKES_LIMIT = 20;

/**
 * Questions whose most recent answer was wrong — a later correct answer clears it.
 * Options ship without the answer key; it is revealed only after a retry.
 */
export async function getMistakes(studentId: string): Promise<{ total: number; items: MistakeQuestion[] }> {
  const latestWrong = await prisma.$queryRaw<{ questionId: string; answeredAt: Date; total: number }[]>`
    SELECT "questionId", "answeredAt", (COUNT(*) OVER ())::int AS total
    FROM (
      SELECT DISTINCT ON (a."questionId") a."questionId", a."isCorrect", a."answeredAt"
      FROM (${answeredQuestions(studentId)}) a
      ORDER BY a."questionId", a."answeredAt" DESC
    ) latest
    WHERE NOT latest."isCorrect"
    ORDER BY "answeredAt" DESC
    LIMIT ${MISTAKES_LIMIT}`;
  if (latestWrong.length === 0) return { total: 0, items: [] };

  const questions = await prisma.question.findMany({
    where: { id: { in: latestWrong.map(r => r.questionId) } },
    select: {
      id: true,
      statement: true,
      imageUrl: true,
      questionType: true,
      difficulty: true,
      subject: { select: { name: true } },
      options: { orderBy: { sortOrder: 'asc' }, select: { id: true, content: true, imageUrl: true } },
    },
  });
  const byId = new Map(questions.map(q => [q.id, q]));

  return {
    total: latestWrong[0].total,
    items: latestWrong.flatMap(r => {
      const q = byId.get(r.questionId);
      if (!q) return [];
      return [{
        questionId: q.id,
        answeredAt: r.answeredAt.toISOString(),
        statement: q.statement,
        imageUrl: q.imageUrl,
        questionType: q.questionType,
        difficulty: q.difficulty,
        subjectName: q.subject.name,
        options: q.options,
      }];
    }),
  };
}

/** True when the student has a wrong graded answer for this question (gates practice retries) */
export async function hasMistakeOn(studentId: string, questionId: string): Promise<boolean> {
  const [row] = await prisma.$queryRaw<{ found: boolean }[]>`
    SELECT EXISTS (SELECT 1 FROM (${answeredQuestions(studentId)}) a
                   WHERE a."questionId" = ${questionId} AND NOT a."isCorrect") AS found`;
  return row?.found ?? false;
}

// ── Mock tests ────────────────────────────────────────────────────────────────

export interface MockTestResult {
  id: string;
  title: string;
  completedAt: Date;
  percentage: number;
  passed: boolean;
  timeTaken: number | null;
  /** Score per section in test order — names are whatever the admin configured */
  sections: { name: string; percentage: number }[];
  program: { id: string; name: string } | null;
  /** Estimated score on the exam's scale (SAT / ACT programs only) */
  scaled: { score: number; min: number; max: number; label: string; kind: ExamKind } | null;
}

function scaledFor(
  program: { slug: string; name: string } | null,
  sectionAttempts: { earnedScore: number; totalScore: number; section: { name: string; shortName: string } }[],
): MockTestResult['scaled'] {
  const kind = examKindOf(program);
  const s = scaleScore(kind, sectionAttempts.map(sa => ({ ...sa.section, earned: sa.earnedScore, total: sa.totalScore })));
  return kind && s ? { score: s.total.score, min: s.total.min, max: s.total.max, label: s.total.label, kind } : null;
}

export async function getMockTestResults(studentId: string): Promise<MockTestResult[]> {
  const attempts = await prisma.mockTestAttempt.findMany({
    where: { userId: studentId, status: 'COMPLETED', completedAt: { not: null } },
    orderBy: { completedAt: 'asc' },
    select: {
      id: true,
      completedAt: true,
      earnedScore: true,
      totalScore: true,
      timeTaken: true,
      mockTest: { select: { title: true, passingScore: true, program: { select: { id: true, name: true, slug: true } } } },
      sectionAttempts: {
        orderBy: { section: { sortOrder: 'asc' } },
        select: { earnedScore: true, totalScore: true, section: { select: { name: true, shortName: true } } },
      },
    },
  });

  return attempts.map(a => {
    const percentage = pct(a.earnedScore ?? 0, a.totalScore ?? 0) ?? 0;
    return {
      id: a.id,
      title: a.mockTest.title,
      completedAt: a.completedAt!,
      percentage,
      passed: percentage >= a.mockTest.passingScore,
      timeTaken: a.timeTaken,
      sections: a.sectionAttempts.map(sa => ({
        name: sa.section.name.trim(),
        percentage: pct(sa.earnedScore, sa.totalScore) ?? 0,
      })),
      program: a.mockTest.program ? { id: a.mockTest.program.id, name: a.mockTest.program.name } : null,
      scaled: scaledFor(a.mockTest.program, a.sectionAttempts),
    };
  });
}

// ── Courses ───────────────────────────────────────────────────────────────────

export async function getCourseProgress(studentId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: studentId, status: 'ACTIVE' },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      course: { select: { id: true, title: true, program: { select: { name: true, slug: true } } } },
      courseProgress: { select: { completionPct: true, completedAssets: true, totalAssets: true, lastAccessedAt: true } },
    },
  });

  return enrollments.map(e => ({
    enrollmentId: e.id,
    courseId: e.course.id,
    title: e.course.title,
    programName: e.course.program.name,
    programSlug: e.course.program.slug,
    completionPct: Math.round(e.courseProgress?.completionPct ?? 0),
    completedAssets: e.courseProgress?.completedAssets ?? 0,
    totalAssets: e.courseProgress?.totalAssets ?? 0,
    lastAccessedAt: e.courseProgress?.lastAccessedAt ?? null,
  }));
}

export type CourseProgressItem = Awaited<ReturnType<typeof getCourseProgress>>[number];

// ── Up next ───────────────────────────────────────────────────────────────────

export type UpNextItem =
  | { kind: 'practice'; subjectName: string | null; accuracy: number | null; quizTitle: string; href: string }
  | { kind: 'course'; courseTitle: string; nextLesson: string | null; completionPct: number; href: string }
  | { kind: 'mock'; title: string; daysSinceLast: number | null; attemptedBefore: boolean; href: string }
  | { kind: 'locked'; feature: 'course' | 'mock' }
  | { kind: 'empty'; feature: 'practice' | 'course' | 'mock' };

/** Pick a published quiz, preferring the weakest subject and quizzes the student hasn't completed */
async function suggestQuiz(studentId: string, strengths: SubjectStrength[]): Promise<UpNextItem> {
  const weakest = strengths
    .filter(s => s.status !== 'not-enough-data')
    .sort((a, b) => a.accuracy - b.accuracy)[0] ?? null;

  const notDone = { attempts: { none: { userId: studentId, status: 'COMPLETED' as const } } };
  const candidates = [
    ...(weakest ? [{ isPublished: true, subjectId: weakest.subjectId, ...notDone }, { isPublished: true, subjectId: weakest.subjectId }] : []),
    { isPublished: true, ...notDone },
  ];
  // Fallbacks in priority order, fetched in parallel — the first hit wins
  const found = await Promise.all(candidates.map(where =>
    prisma.quiz.findFirst({ where, orderBy: { createdAt: 'asc' }, select: { id: true, title: true, subjectId: true } }),
  ));
  const quiz = found.find(q => q !== null);
  if (quiz) {
    const focus = weakest && quiz.subjectId === weakest.subjectId ? weakest : null;
    return {
      kind: 'practice',
      subjectName: focus?.name ?? null,
      accuracy: focus?.accuracy ?? null,
      quizTitle: quiz.title,
      href: `/dashboard/quizzes/${quiz.id}`,
    };
  }
  return { kind: 'empty', feature: 'practice' };
}

async function suggestLesson(studentId: string): Promise<UpNextItem> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: studentId, status: 'ACTIVE' },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          modules: {
            where: { isPublished: true },
            orderBy: { sortOrder: 'asc' },
            select: { assets: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, title: true } } },
          },
        },
      },
      courseProgress: { select: { completionPct: true, lastAccessedAt: true } },
      assetProgress: { where: { isCompleted: true }, select: { assetId: true } },
      updatedAt: true,
    },
  });

  // Most recently studied unfinished course first
  const recency = (e: (typeof enrollments)[number]) => (e.courseProgress?.lastAccessedAt ?? e.updatedAt).getTime();
  const unfinished = enrollments
    .filter(e => (e.courseProgress?.completionPct ?? 0) < 100)
    .sort((a, b) => recency(b) - recency(a));

  for (const e of unfinished) {
    const done = new Set(e.assetProgress.map(p => p.assetId));
    const next = e.course.modules.flatMap(m => m.assets).find(a => !done.has(a.id));
    if (!next) continue;
    return {
      kind: 'course',
      courseTitle: e.course.title,
      nextLesson: next.title,
      completionPct: Math.round(e.courseProgress?.completionPct ?? 0),
      href: `/dashboard/courses/${e.course.id}?asset=${next.id}`,
    };
  }
  return { kind: 'empty', feature: 'course' };
}

async function suggestMockTest(studentId: string, tz: string, isEnrolled: boolean): Promise<UpNextItem> {
  const [assets, demos, attempts] = await Promise.all([
    isEnrolled
      ? prisma.learningAsset.findMany({
          where: {
            assetType: 'MOCK_TEST',
            isPublished: true,
            mockTest: { isPublished: true },
            module: { isPublished: true, course: { enrollments: { some: { userId: studentId, status: 'ACTIVE' } } } },
          },
          orderBy: [{ module: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
          select: { id: true, mockTestId: true, mockTest: { select: { title: true } }, module: { select: { courseId: true } } },
        })
      : Promise.resolve([]),
    // Free demo tests on the SAT/ACT practice pages are open to every student
    getAllDemoMockTests(),
    prisma.mockTestAttempt.findMany({
      where: { userId: studentId, status: 'COMPLETED', completedAt: { not: null } },
      select: { mockTestId: true, completedAt: true },
    }),
  ]);

  // Course tests first, then free tests not already reachable through a course
  const courseTestIds = new Set(assets.map(a => a.mockTestId));
  const candidates = [
    ...assets.flatMap(a => a.mockTestId ? [{
      mockTestId: a.mockTestId,
      title: a.mockTest?.title ?? 'Mock test',
      href: `/dashboard/courses/${a.module.courseId}?asset=${a.id}`,
    }] : []),
    ...demos.filter(d => !courseTestIds.has(d.id)).map(d => ({
      mockTestId: d.id,
      title: d.title,
      href: d.href,
    })),
  ];
  if (candidates.length === 0) return isEnrolled ? { kind: 'empty', feature: 'mock' } : { kind: 'locked', feature: 'mock' };

  const lastByTest = new Map<string, Date>();
  for (const a of attempts) {
    const prev = lastByTest.get(a.mockTestId);
    if (!prev || a.completedAt! > prev) lastByTest.set(a.mockTestId, a.completedAt!);
  }
  const lastAny = attempts.reduce<Date | null>((m, a) => (!m || a.completedAt! > m ? a.completedAt! : m), null);

  // A test not taken yet, else the one taken longest ago
  const pick = candidates.find(c => !lastByTest.has(c.mockTestId))
    ?? [...candidates].sort((a, b) => (lastByTest.get(a.mockTestId)?.getTime() ?? 0) - (lastByTest.get(b.mockTestId)?.getTime() ?? 0))[0];

  const today = toDateKey(new Date(), tz);
  return {
    kind: 'mock',
    title: pick.title.trim(),
    daysSinceLast: lastAny ? Math.max(0, Math.round((Date.parse(today) - Date.parse(toDateKey(lastAny, tz))) / 86_400_000)) : null,
    attemptedBefore: lastByTest.has(pick.mockTestId),
    href: pick.href,
  };
}

/**
 * Three next actions. Quizzes are open to every signed-in student; lessons and
 * course mock tests need an active enrollment, but free (demo) mock tests are open to all,
 * so the mock slot only shows as locked when neither is available.
 */
export async function getUpNext(studentId: string, tz: string, strengths: SubjectStrength[], isEnrolled: boolean) {
  const [practice, course, mock] = await Promise.all([
    suggestQuiz(studentId, strengths),
    isEnrolled ? suggestLesson(studentId) : Promise.resolve<UpNextItem>({ kind: 'locked', feature: 'course' }),
    suggestMockTest(studentId, tz, isEnrolled),
  ]);
  return [practice, course, mock];
}
