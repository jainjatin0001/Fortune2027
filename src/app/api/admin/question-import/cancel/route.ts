import { NextRequest, NextResponse } from 'next/server';
import { badRequest } from '@/lib/auth';
import { deleteImportSession } from '@/services/question-import/importSession';
import { importAuthError, withImportAdmin } from '../_utils';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const user = await withImportAdmin();
    const body = await req.json() as { sessionId?: string };
    if (!body.sessionId) return badRequest('sessionId is required.');
    deleteImportSession(body.sessionId, user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return importAuthError(error) ?? NextResponse.json({ error: 'Failed to cancel import.' }, { status: 500 });
  }
}
