import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden, badRequest, notFound } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getExamPreset, presetToSectionRows } from '@/lib/mock-test/presets';

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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id: mockTestId } = await params;
    const body = await req.json();

    const mockTest = await prisma.mockTest.findUnique({ where: { id: mockTestId } });
    if (!mockTest) return notFound('Mock test not found');

    const count = await prisma.mockTestSection.count({ where: { mockTestId } });

    // Bulk: { preset: 'digital-sat' } appends a preset's sections after the existing ones
    if (body.preset !== undefined) {
      const preset = getExamPreset(body.preset);
      if (!preset) return badRequest('Unknown preset');
      await prisma.mockTestSection.createMany({
        data: presetToSectionRows(preset, count).map(row => ({ ...row, mockTestId })),
      });
      return NextResponse.json({ added: preset.sections.length }, { status: 201 });
    }

    const { name, shortName, timeLimit, hasCalculator, instructions, totalMarks, sortOrder, breakAfter } = body;

    if (!name) return badRequest('name is required');
    if (!shortName) return badRequest('shortName is required');
    if (!timeLimit) return badRequest('timeLimit is required');

    const section = await prisma.mockTestSection.create({
      data: {
        mockTestId,
        name,
        shortName,
        timeLimit: parseInt(timeLimit),
        hasCalculator: hasCalculator ?? false,
        instructions: instructions ?? null,
        totalMarks: totalMarks ? parseInt(totalMarks) : 0,
        breakAfter: breakAfter ? parseInt(breakAfter) : 0,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : count,
      },
      include: {
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — reorder sections
// body: { order: [{ id, sortOrder }] }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id: mockTestId } = await params;
    const body = await req.json();
    const order: { id: string; sortOrder: number }[] = body.order ?? [];

    if (!order.length) return badRequest('order array is required');

    await prisma.$transaction(
      order.map(({ id, sortOrder }) =>
        prisma.mockTestSection.updateMany({
          where: { id, mockTestId },
          data: { sortOrder },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
