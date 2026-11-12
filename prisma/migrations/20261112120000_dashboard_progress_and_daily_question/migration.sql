-- Duplicate answers per (attempt, question) were possible before the unique index below:
-- keep only the most recent answer for each pair.
DELETE FROM "user_question_attempts" a
USING "user_question_attempts" b
WHERE a."quizAttemptId" IS NOT NULL
  AND a."quizAttemptId" = b."quizAttemptId"
  AND a."questionId" = b."questionId"
  AND (a."attemptedAt", a."id") < (b."attemptedAt", b."id");

-- Attempts that were started but never finished (every start used to create a new row)
UPDATE "quiz_attempts" SET "status" = 'ABANDONED', "updatedAt" = CURRENT_TIMESTAMP
WHERE "status" = 'IN_PROGRESS' AND "startedAt" < CURRENT_TIMESTAMP - INTERVAL '1 day';

UPDATE "mock_test_attempts" SET "status" = 'ABANDONED', "updatedAt" = CURRENT_TIMESTAMP
WHERE "status" = 'IN_PROGRESS' AND "startedAt" < CURRENT_TIMESTAMP - INTERVAL '1 day';

-- DropIndex
DROP INDEX "user_question_attempts_quizAttemptId_idx";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "dailyGoal" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "daily_question_tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_question_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_question_track_subjects" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "daily_question_track_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_questions" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isManual" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_question_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyQuestionId" TEXT NOT NULL,
    "selectedOptionIds" TEXT[],
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_question_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "questionsAnswered" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "studySeconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_daily_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_question_tracks_name_key" ON "daily_question_tracks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "daily_question_tracks_slug_key" ON "daily_question_tracks"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "daily_question_track_subjects_trackId_subjectId_key" ON "daily_question_track_subjects"("trackId", "subjectId");

-- CreateIndex
CREATE INDEX "daily_questions_questionId_idx" ON "daily_questions"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_questions_trackId_date_key" ON "daily_questions"("trackId", "date");

-- CreateIndex
CREATE INDEX "daily_question_attempts_dailyQuestionId_idx" ON "daily_question_attempts"("dailyQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_question_attempts_userId_dailyQuestionId_key" ON "daily_question_attempts"("userId", "dailyQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_activity_userId_date_key" ON "user_daily_activity"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_question_attempts_quizAttemptId_questionId_key" ON "user_question_attempts"("quizAttemptId", "questionId");

-- AddForeignKey
ALTER TABLE "daily_question_track_subjects" ADD CONSTRAINT "daily_question_track_subjects_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "daily_question_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_question_track_subjects" ADD CONSTRAINT "daily_question_track_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_questions" ADD CONSTRAINT "daily_questions_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "daily_question_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_questions" ADD CONSTRAINT "daily_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_question_attempts" ADD CONSTRAINT "daily_question_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_question_attempts" ADD CONSTRAINT "daily_question_attempts_dailyQuestionId_fkey" FOREIGN KEY ("dailyQuestionId") REFERENCES "daily_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_activity" ADD CONSTRAINT "user_daily_activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Seed the two SAT daily question tracks from the existing domain subjects
INSERT INTO "daily_question_tracks" ("id", "name", "slug", "sortOrder", "updatedAt") VALUES
  (gen_random_uuid()::text, 'SAT Math',   'sat-math',   0, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'SAT Verbal', 'sat-verbal', 1, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "daily_question_track_subjects" ("id", "trackId", "subjectId")
SELECT gen_random_uuid()::text, t."id", s."id"
FROM "daily_question_tracks" t
JOIN "subjects" s ON TRIM(s."slug") LIKE CASE t."slug" WHEN 'sat-math' THEN 'sat-math%' ELSE 'sat-verbal%' END
WHERE t."slug" IN ('sat-math', 'sat-verbal')
ON CONFLICT DO NOTHING;

-- Backfill daily activity from completed quizzes and mock tests, bucketed by the
-- student's profile time zone (UTC when missing or unrecognised)
WITH user_tz AS (
  SELECT u."id" AS "userId",
         CASE WHEN EXISTS (SELECT 1 FROM pg_timezone_names z WHERE z."name" = p."timezone")
              THEN p."timezone" ELSE 'UTC' END AS tz
  FROM "users" u LEFT JOIN "profiles" p ON p."userId" = u."id"
),
events AS (
  SELECT qa."userId",
         ((qa."completedAt" AT TIME ZONE 'UTC') AT TIME ZONE ut.tz)::date AS day,
         (SELECT COUNT(*) FROM "user_question_attempts" x WHERE x."quizAttemptId" = qa."id")::int AS answered,
         (SELECT COUNT(*) FROM "user_question_attempts" x WHERE x."quizAttemptId" = qa."id" AND x."isCorrect")::int AS correct,
         COALESCE(qa."timeTaken", 0) AS secs
  FROM "quiz_attempts" qa JOIN user_tz ut ON ut."userId" = qa."userId"
  WHERE qa."status" = 'COMPLETED' AND qa."completedAt" IS NOT NULL
  UNION ALL
  SELECT ma."userId",
         ((ma."completedAt" AT TIME ZONE 'UTC') AT TIME ZONE ut.tz)::date,
         COALESCE((SELECT SUM(s."correctCount" + s."incorrectCount") FROM "mock_test_section_attempts" s WHERE s."attemptId" = ma."id"), 0)::int,
         COALESCE((SELECT SUM(s."correctCount") FROM "mock_test_section_attempts" s WHERE s."attemptId" = ma."id"), 0)::int,
         COALESCE(ma."timeTaken", 0)
  FROM "mock_test_attempts" ma JOIN user_tz ut ON ut."userId" = ma."userId"
  WHERE ma."status" = 'COMPLETED' AND ma."completedAt" IS NOT NULL
)
INSERT INTO "user_daily_activity" ("id", "userId", "date", "questionsAnswered", "correctAnswers", "studySeconds", "updatedAt")
SELECT gen_random_uuid()::text, "userId", day, SUM(answered), SUM(correct), SUM(secs), CURRENT_TIMESTAMP
FROM events
GROUP BY "userId", day
ON CONFLICT ("userId", "date") DO NOTHING;
