-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "acceptedAnswers" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "mock_test_question_attempts" ADD COLUMN     "textAnswer" TEXT;
