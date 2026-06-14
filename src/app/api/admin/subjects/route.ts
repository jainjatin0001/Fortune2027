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
    const programId = searchParams.get('programId');

    const where = {
      ...(programId && { programId }),
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        include: {
          program: { select: { name: true } },
          _count: { select: { topics: true, questions: true } },
        },
        orderBy: [{ programId: 'asc' }, { sortOrder: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subject.count({ where }),
    ]);

    return NextResponse.json({ subjects, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { programId, name, slug, description, sortOrder } = body;

    if (!programId || !name || !slug) return badRequest('programId, name, and slug are required');

    const existing = await prisma.subject.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

    const subject = await prisma.subject.create({
      data: { programId, name, slug, description: description ?? null, sortOrder: sortOrder ?? 0 },
    });

    return NextResponse.json({ subject }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
