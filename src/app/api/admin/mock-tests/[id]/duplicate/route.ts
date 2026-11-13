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

// POST — copy a mock test with all its sections and question links.
// The copy starts as an unpublished, non-demo draft so it never goes live by accident.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;

    const source = await prisma.mockTest.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: { questions: { orderBy: { sortOrder: 'asc' } } },
        },
      },
    });
    if (!source) return notFound('Mock test not found');

    const mockTest = await prisma.mockTest.create({
      data: {
        title: `${source.title} (copy)`,
        description: source.description,
        instructions: source.instructions,
        programId: source.programId,
        passingScore: source.passingScore,
        isPublished: false,
        isDemo: false,
        sections: {
          create: source.sections.map(s => ({
            name: s.name,
            shortName: s.shortName,
            sortOrder: s.sortOrder,
            timeLimit: s.timeLimit,
            hasCalculator: s.hasCalculator,
            instructions: s.instructions,
            totalMarks: s.totalMarks,
            breakAfter: s.breakAfter,
            questions: {
              create: s.questions.map(q => ({ questionId: q.questionId, sortOrder: q.sortOrder, points: q.points })),
            },
          })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ mockTest }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
