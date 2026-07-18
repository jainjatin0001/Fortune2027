import { NextRequest, NextResponse } from 'next/server';
import type { DifficultyLevel, QuestionSourceType } from '@prisma/client';
import { badRequest } from '@/lib/auth';
import { createSessionFromUpload, processImportSession } from '@/services/question-import/questionImporter';
import { serializeImportSession, setSessionProgress } from '@/services/question-import/importSession';
import { assertOllamaReady } from '@/services/question-import/ollamaClient';
import { importAuthError, withImportAdmin } from '../_utils';

export const runtime = 'nodejs';
export const maxDuration = 300;

const DIFFICULTY = new Set(['EASY', 'MEDIUM', 'HARD', 'EXPERT']);
const SOURCE_TYPES = new Set(['MCQ', 'PYQ', 'PRACTICE', 'MOCK_TEST']);

export async function POST(req: NextRequest) {
  try {
    const user = await withImportAdmin();
    const formData = await req.formData();
    const questionPdf = getFile(formData, 'questionPdf');
    const answerPdf = getOptionalFile(formData, 'answerPdf');
    const explanationPdf = getOptionalFile(formData, 'explanationPdf');

    if (!questionPdf) return badRequest('Question PDF is required.');

    const subjectId = getString(formData, 'subjectId');
    const programId = getString(formData, 'programId');
    if (!programId || !subjectId) return badRequest('Program and subject are required.');

    const rawDifficulty = getString(formData, 'difficulty') || 'MEDIUM';
    const rawSourceType = getString(formData, 'sourceType') || 'MCQ';
    const chunkSize = Number.parseInt(getString(formData, 'chunkSize') || '10', 10);
    const points = Number.parseInt(getString(formData, 'points') || '1', 10);

    if (!DIFFICULTY.has(rawDifficulty)) return badRequest('Invalid difficulty.');
    if (!SOURCE_TYPES.has(rawSourceType)) return badRequest('Invalid source type.');

    await assertOllamaReady();

    const session = await createSessionFromUpload({
      createdByUserId: user.id,
      questionPdf,
      answerPdf,
      explanationPdf,
      config: {
        chunkSize: Number.isFinite(chunkSize) ? chunkSize : 10,
        programId,
        subjectId,
        topicId: getString(formData, 'topicId') || undefined,
        difficulty: rawDifficulty as DifficultyLevel,
        sourceType: rawSourceType as QuestionSourceType,
        points: Number.isFinite(points) ? Math.max(1, points) : 1,
        tags: getString(formData, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean),
      },
    });

    setSessionProgress(session, 'extracting_questions', 'Extracting Questions...');
    void processImportSession(session);

    return NextResponse.json({ session: serializeImportSession(session) }, { status: 201 });
  } catch (error) {
    return importAuthError(error) ?? NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to start import.' }, { status: 500 });
  }
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function getOptionalFile(formData: FormData, key: string): File | undefined {
  return getFile(formData, key) ?? undefined;
}
