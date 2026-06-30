import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden, badRequest, notFound } from '@/lib/auth';
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

// POST — add one or many questions to a section
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    await withAdmin();
    const { sectionId } = await params;
    const body = await req.json();

    const section = await prisma.mockTestSection.findUnique({ where: { id: sectionId } });
    if (!section) return notFound('Section not found');

    // Accept a single { questionId, points } or an array
    const items: { questionId: string; points?: number }[] = Array.isArray(body.questions)
      ? body.questions
      : [{ questionId: body.questionId, points: body.points }];

    if (!items.length || items.some(i => !i.questionId)) {
      return badRequest('questionId(s) required');
    }

    const existing = await prisma.mockTestSectionQuestion.findMany({
      where: { sectionId },
      select: { sortOrder: true },
      orderBy: { sortOrder: 'desc' },
    });
    let nextOrder = (existing[0]?.sortOrder ?? -1) + 1;

    const created = await prisma.$transaction(
      items.map(item =>
        prisma.mockTestSectionQuestion.upsert({
          where: { sectionId_questionId: { sectionId, questionId: item.questionId } },
          update: { points: item.points ?? 1 },
          create: {
            sectionId,
            questionId: item.questionId,
            points: item.points ?? 1,
            sortOrder: nextOrder++,
          },
        })
      )
    );

    return NextResponse.json({ added: created.length }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — reorder questions in a section
// body: { order: [{ questionId, sortOrder }] }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    await withAdmin();
    const { sectionId } = await params;
    const body = await req.json();
    const order: { questionId: string; sortOrder: number }[] = body.order ?? [];

    if (!order.length) return badRequest('order array is required');

    await prisma.$transaction(
      order.map(({ questionId, sortOrder }) =>
        prisma.mockTestSectionQuestion.updateMany({
          where: { sectionId, questionId },
          data: { sortOrder },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
