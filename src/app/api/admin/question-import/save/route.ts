import { NextRequest, NextResponse } from 'next/server';
import { badRequest } from '@/lib/auth';
import { deleteImportSession, getImportSession } from '@/services/question-import/importSession';
import { saveImportSession } from '@/services/question-import/questionImporter';
import { importAuthError, withImportAdmin } from '../_utils';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const user = await withImportAdmin();
    const body = await req.json() as { sessionId?: string };
    if (!body.sessionId) return badRequest('sessionId is required.');

    const session = getImportSession(body.sessionId, user.id);
    if (!session) return NextResponse.json({ error: 'Import session not found.' }, { status: 404 });

    const savedQuestionIds = await saveImportSession(session);
    deleteImportSession(session.id, user.id);
    return NextResponse.json({ savedQuestionIds, count: savedQuestionIds.length });
  } catch (error) {
    return importAuthError(error) ?? NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save imported questions.' }, { status: 500 });
  }
}
