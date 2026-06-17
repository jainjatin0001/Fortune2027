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
    const search = searchParams.get('search') ?? '';
    const subjectId = searchParams.get('subjectId');
    const published = searchParams.get('published');

    const where = {
      ...(subjectId && { subjectId }),
      ...(search && { title: { contains: search, mode: 'insensitive' as const } }),
      ...(published !== null && published !== '' && { isPublished: published === 'true' }),
    };

    const [questionSets, total] = await Promise.all([
      prisma.questionSet.findMany({
        where,
        include: {
          subject: { select: { name: true } },
          topic: { select: { name: true } },
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.questionSet.count({ where }),
    ]);

    return NextResponse.json({ questionSets, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { title, description, subjectId, topicId, sourceType, isPublished } = body;

    if (!title) return badRequest('title is required');

    const questionSet = await prisma.questionSet.create({
      data: {
        title,
        description: description ?? null,
        subjectId: subjectId || null,
        topicId: topicId || null,
        sourceType: sourceType || null,
        isPublished: isPublished ?? false,
      },
    });

    return NextResponse.json({ questionSet }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
