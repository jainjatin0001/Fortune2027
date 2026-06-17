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
    const courseId = searchParams.get('courseId');

    const where = {
      ...(courseId && { courseId }),
      ...(search && { title: { contains: search, mode: 'insensitive' as const } }),
    };

    const [modules, total] = await Promise.all([
      prisma.module.findMany({
        where,
        include: {
          course: { select: { title: true, slug: true } },
          _count: { select: { assets: true } },
        },
        orderBy: [{ courseId: 'asc' }, { sortOrder: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.module.count({ where }),
    ]);

    return NextResponse.json({ modules, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { courseId, title, description, sortOrder, isPublished } = body;

    if (!courseId || !title) return badRequest('courseId and title are required');

    const module = await prisma.module.create({
      data: {
        courseId,
        title,
        description: description ?? null,
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? false,
      },
    });

    return NextResponse.json({ module }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
