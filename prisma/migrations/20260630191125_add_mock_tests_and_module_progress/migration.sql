-- CreateEnum
CREATE TYPE "MockTestAttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- AlterEnum
ALTER TYPE "AssetType" ADD VALUE 'MOCK_TEST';

-- AlterTable
ALTER TABLE "learning_assets" ADD COLUMN     "mockTestId" TEXT;

-- CreateTable
CREATE TABLE "mock_tests" (
    "id" TEXT NOT NULL,
    "programId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mock_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_test_sections" (
    "id" TEXT NOT NULL,
    "mockTestId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "timeLimit" INTEGER NOT NULL,
    "hasCalculator" BOOLEAN NOT NULL DEFAULT false,
    "instructions" TEXT,
    "totalMarks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mock_test_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_test_section_questions" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "mock_test_section_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_test_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mockTestId" TEXT NOT NULL,
    "assetId" TEXT,
    "enrollmentId" TEXT,
    "status" "MockTestAttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "timeTaken" INTEGER,
    "totalScore" DOUBLE PRECISION,
    "earnedScore" DOUBLE PRECISION,
    "scaledScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mock_test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_test_section_attempts" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "timeTaken" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3),
    "earnedScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "incorrectCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "mock_test_section_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_test_question_attempts" (
    "id" TEXT NOT NULL,
    "sectionAttemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionIds" TEXT[],
    "isCorrect" BOOLEAN,
    "isSkipped" BOOLEAN NOT NULL DEFAULT false,
    "timeTaken" INTEGER,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_test_question_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mock_tests_programId_idx" ON "mock_tests"("programId");

-- CreateIndex
CREATE INDEX "mock_test_sections_mockTestId_idx" ON "mock_test_sections"("mockTestId");

-- CreateIndex
CREATE INDEX "mock_test_section_questions_sectionId_idx" ON "mock_test_section_questions"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "mock_test_section_questions_sectionId_questionId_key" ON "mock_test_section_questions"("sectionId", "questionId");

-- CreateIndex
CREATE INDEX "mock_test_attempts_userId_idx" ON "mock_test_attempts"("userId");

-- CreateIndex
CREATE INDEX "mock_test_attempts_mockTestId_idx" ON "mock_test_attempts"("mockTestId");

-- CreateIndex
CREATE INDEX "mock_test_attempts_enrollmentId_idx" ON "mock_test_attempts"("enrollmentId");

-- CreateIndex
CREATE INDEX "mock_test_section_attempts_attemptId_idx" ON "mock_test_section_attempts"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "mock_test_section_attempts_attemptId_sectionId_key" ON "mock_test_section_attempts"("attemptId", "sectionId");

-- CreateIndex
CREATE INDEX "mock_test_question_attempts_sectionAttemptId_idx" ON "mock_test_question_attempts"("sectionAttemptId");

-- AddForeignKey
ALTER TABLE "learning_assets" ADD CONSTRAINT "learning_assets_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "mock_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_tests" ADD CONSTRAINT "mock_tests_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_sections" ADD CONSTRAINT "mock_test_sections_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_section_questions" ADD CONSTRAINT "mock_test_section_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "mock_test_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_section_questions" ADD CONSTRAINT "mock_test_section_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_attempts" ADD CONSTRAINT "mock_test_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_attempts" ADD CONSTRAINT "mock_test_attempts_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_attempts" ADD CONSTRAINT "mock_test_attempts_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_section_attempts" ADD CONSTRAINT "mock_test_section_attempts_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "mock_test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_section_attempts" ADD CONSTRAINT "mock_test_section_attempts_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "mock_test_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_question_attempts" ADD CONSTRAINT "mock_test_question_attempts_sectionAttemptId_fkey" FOREIGN KEY ("sectionAttemptId") REFERENCES "mock_test_section_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_question_attempts" ADD CONSTRAINT "mock_test_question_attempts_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
