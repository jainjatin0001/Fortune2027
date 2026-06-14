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
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '20'));
    const search = searchParams.get('search') ?? '';
    const subjectId = searchParams.get('subjectId');

    const where = {
      ...(subjectId && { subjectId }),
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    };

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where,
        include: {
          subject: { select: { name: true } },
          parentTopic: { select: { name: true } },
          _count: { select: { questions: true, childTopics: true } },
        },
        orderBy: [{ subjectId: 'asc' }, { sortOrder: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.topic.count({ where }),
    ]);

    return NextResponse.json({ topics, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { subjectId, name, slug, description, parentTopicId, sortOrder } = body;

    if (!subjectId || !name || !slug) return badRequest('subjectId, name, and slug are required');

    const existing = await prisma.topic.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

    const topic = await prisma.topic.create({
      data: {
        subjectId,
        name,
        slug,
        description: description ?? null,
        parentTopicId: parentTopicId || null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ topic }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
