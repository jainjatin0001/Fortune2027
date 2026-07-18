import { NextRequest, NextResponse } from 'next/server';
import { badRequest } from '@/lib/auth';
import { getImportSession, serializeImportSession } from '@/services/question-import/importSession';
import { updatePreviewQuestions } from '@/services/question-import/questionImporter';
import type { SaveImportQuestionInput } from '@/services/question-import/types';
import { importAuthError, withImportAdmin } from '../_utils';

export const runtime = 'nodejs';

export async function PUT(req: NextRequest) {
  try {
    const user = await withImportAdmin();
    const body = await req.json() as { sessionId?: string; questions?: SaveImportQuestionInput[] };
    if (!body.sessionId || !Array.isArray(body.questions)) return badRequest('sessionId and questions are required.');

    const session = getImportSession(body.sessionId, user.id);
    if (!session) return NextResponse.json({ error: 'Import session not found.' }, { status: 404 });

    await updatePreviewQuestions(session, body.questions);
    return NextResponse.json({ session: serializeImportSession(session) });
  } catch (error) {
    return importAuthError(error) ?? NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update preview.' }, { status: 500 });
  }
}
