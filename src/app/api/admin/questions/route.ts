import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden, badRequest } from '@/lib/auth';
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

export async function GET(req: NextRequest) {
  try {
    await withAdmin();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const subjectId = searchParams.get('subjectId');
    const difficulty = searchParams.get('difficulty');

    const where = {
      ...(subjectId && { subjectId }),
      ...(difficulty && { difficulty: difficulty.toUpperCase() as never }),
    };

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          options: { orderBy: { sortOrder: 'asc' } },
          subject: { select: { name: true, category: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({ questions, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { content, explanation, difficulty, subjectId, topic, tags, points, options } = body;

    if (!content) return badRequest('content is required');
    if (!options || options.length < 2) return badRequest('At least 2 options are required');
    if (!options.some((o: { isCorrect: boolean }) => o.isCorrect)) {
      return badRequest('At least one option must be marked as correct');
    }

    const question = await prisma.question.create({
      data: {
        content,
        explanation: explanation ?? null,
        difficulty: difficulty ?? 'MEDIUM',
        subjectId: subjectId ?? null,
        topic: topic ?? null,
        tags: tags ?? [],
        points: points ?? 1,
        options: {
          create: options.map((o: { content: string; isCorrect: boolean }, idx: number) => ({
            content: o.content,
            isCorrect: o.isCorrect,
            sortOrder: idx,
          })),
        },
      },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
