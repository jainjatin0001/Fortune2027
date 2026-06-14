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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;
    const body = await req.json();
    const { statement, explanation, difficulty, subjectId, topicId, tags, points, isActive, options } = body;

    const question = await prisma.question.update({
      where: { id },
      data: {
        ...(statement && { statement }),
        ...(explanation !== undefined && { explanation }),
        ...(difficulty && { difficulty }),
        ...(subjectId !== undefined && { subjectId }),
        ...(topicId !== undefined && { topicId }),
        ...(tags && { tags }),
        ...(points && { points }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
    });

    if (options && Array.isArray(options)) {
      await prisma.questionOption.deleteMany({ where: { questionId: id } });
      await prisma.questionOption.createMany({
        data: options.map((o: { content: string; isCorrect: boolean }, idx: number) => ({
          questionId: id,
          content: o.content,
          isCorrect: o.isCorrect,
          sortOrder: idx,
        })),
      });
    }

    const updated = await prisma.question.findUnique({
      where: { id },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    });

    return NextResponse.json({ question: updated });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
