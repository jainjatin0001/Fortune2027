-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "passage" TEXT;

-- AlterTable
ALTER TABLE "mock_tests" ADD COLUMN     "isDemo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "mock_test_sections" ADD COLUMN     "breakAfter" INTEGER NOT NULL DEFAULT 0;
