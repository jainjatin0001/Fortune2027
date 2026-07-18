import { NextResponse } from 'next/server';
import { forbidden, requireAdmin, unauthorized } from '@/lib/auth';

export async function withImportAdmin() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      throw new Response('Unauthorized', { status: 401 });
    }
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      throw new Response('Forbidden', { status: 403 });
    }
    throw error;
  }
}

export function importAuthError(error: unknown): NextResponse | null {
  if (error instanceof Response) {
    if (error.status === 401) return unauthorized();
    if (error.status === 403) return forbidden();
  }
  return null;
}

export function errorResponse(error: unknown, fallback = 'Internal server error'): NextResponse {
  return NextResponse.json({ error: error instanceof Error ? error.message : fallback }, { status: 500 });
}
