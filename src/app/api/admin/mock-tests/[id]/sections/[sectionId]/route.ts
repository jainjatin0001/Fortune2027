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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    await withAdmin();
    const { sectionId } = await params;
    const body = await req.json();
    const { name, shortName, timeLimit, hasCalculator, instructions, totalMarks, sortOrder } = body;

    const existing = await prisma.mockTestSection.findUnique({ where: { id: sectionId } });
    if (!existing) return notFound('Section not found');

    const section = await prisma.mockTestSection.update({
      where: { id: sectionId },
      data: {
        ...(name !== undefined && { name }),
        ...(shortName !== undefined && { shortName }),
        ...(timeLimit !== undefined && { timeLimit: parseInt(timeLimit) }),
        ...(hasCalculator !== undefined && { hasCalculator }),
        ...(instructions !== undefined && { instructions: instructions || null }),
        ...(totalMarks !== undefined && { totalMarks: parseInt(totalMarks) }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      },
      include: {
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json({ section });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    await withAdmin();
    const { sectionId } = await params;

    const existing = await prisma.mockTestSection.findUnique({ where: { id: sectionId } });
    if (!existing) return notFound('Section not found');

    await prisma.mockTestSection.delete({ where: { id: sectionId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
