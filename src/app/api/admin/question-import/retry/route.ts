import { NextRequest, NextResponse } from 'next/server';
import { badRequest } from '@/lib/auth';
import { getImportSession, serializeImportSession } from '@/services/question-import/importSession';
import { retryImportChunk } from '@/services/question-import/questionImporter';
import { importAuthError, withImportAdmin } from '../_utils';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const user = await withImportAdmin();
    const body = await req.json() as { sessionId?: string; chunkIndex?: number };
    if (!body.sessionId || typeof body.chunkIndex !== 'number') return badRequest('sessionId and chunkIndex are required.');

    const session = getImportSession(body.sessionId, user.id);
    if (!session) return NextResponse.json({ error: 'Import session not found.' }, { status: 404 });

    void retryImportChunk(session, body.chunkIndex);
    return NextResponse.json({ session: serializeImportSession(session) });
  } catch (error) {
    return importAuthError(error) ?? NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to retry chunk.' }, { status: 500 });
  }
}
