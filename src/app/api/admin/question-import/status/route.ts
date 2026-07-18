import { NextRequest, NextResponse } from 'next/server';
import { getImportSession, serializeImportSession } from '@/services/question-import/importSession';
import { importAuthError, withImportAdmin } from '../_utils';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await withImportAdmin();
    const sessionId = req.nextUrl.searchParams.get('sessionId') ?? '';
    const session = getImportSession(sessionId, user.id);
    if (!session) {
      return NextResponse.json({
        error: 'Import session not found. The server may have restarted or the temporary session expired. Start the import again.',
      }, { status: 404 });
    }
    return NextResponse.json({ session: serializeImportSession(session) });
  } catch (error) {
    return importAuthError(error) ?? NextResponse.json({ error: 'Failed to load import session.' }, { status: 500 });
  }
}
