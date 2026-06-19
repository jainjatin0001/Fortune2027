import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function withAdmin() {
  try {
    return await requireAdmin();
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') throw { status: 401 };
    if (e instanceof Error && e.message === 'FORBIDDEN') throw { status: 403 };
    throw e;
  }
}

function authError(e: unknown): NextResponse | null {
  if (e && typeof e === 'object' && 'status' in e) {
    const err = e as { status: number };
    if (err.status === 401) return unauthorized();
    if (err.status === 403) return forbidden();
  }
  return null;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    await withAdmin();
    const { id, questionId } = await params;
    await prisma.quizQuestion.delete({ where: { quizId_questionId: { quizId: id, questionId } } });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
