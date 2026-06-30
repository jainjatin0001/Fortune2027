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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;

    const mockTest = await prisma.mockTest.findUnique({
      where: { id },
      include: {
        program: { select: { id: true, name: true, slug: true } },
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { questions: true } },
            questions: {
              orderBy: { sortOrder: 'asc' },
              include: {
                question: {
                  select: {
                    id: true,
                    statement: true,
                    difficulty: true,
                    questionType: true,
                    subject: { select: { name: true } },
                    topic: { select: { name: true } },
                    options: { select: { id: true, content: true, isCorrect: true, sortOrder: true }, orderBy: { sortOrder: 'asc' } },
                  },
                },
              },
            },
          },
        },
        _count: { select: { attempts: true } },
      },
    });

    if (!mockTest) return notFound('Mock test not found');
    return NextResponse.json({ mockTest });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;
    const body = await req.json();
    const { title, description, instructions, programId, passingScore, isPublished } = body;

    const existing = await prisma.mockTest.findUnique({ where: { id } });
    if (!existing) return notFound('Mock test not found');

    const mockTest = await prisma.mockTest.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(instructions !== undefined && { instructions: instructions || null }),
        ...(programId !== undefined && { programId: programId || null }),
        ...(passingScore !== undefined && { passingScore: parseInt(passingScore) }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: {
        program: { select: { name: true, slug: true } },
        _count: { select: { sections: true, attempts: true } },
      },
    });

    return NextResponse.json({ mockTest });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;

    const existing = await prisma.mockTest.findUnique({ where: { id } });
    if (!existing) return notFound('Mock test not found');

    await prisma.mockTest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
