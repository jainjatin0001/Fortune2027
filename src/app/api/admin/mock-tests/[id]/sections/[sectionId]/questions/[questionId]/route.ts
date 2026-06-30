import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden, notFound } from '@/lib/auth';
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
  { params }: { params: Promise<{ id: string; sectionId: string; questionId: string }> }
) {
  try {
    await withAdmin();
    const { sectionId, questionId } = await params;

    const existing = await prisma.mockTestSectionQuestion.findUnique({
      where: { sectionId_questionId: { sectionId, questionId } },
    });
    if (!existing) return notFound('Question not found in section');

    await prisma.mockTestSectionQuestion.delete({
      where: { sectionId_questionId: { sectionId, questionId } },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
