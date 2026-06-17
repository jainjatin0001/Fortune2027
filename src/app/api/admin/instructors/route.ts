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

    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};

    const [instructors, total] = await Promise.all([
      prisma.instructor.findMany({
        where,
        include: { _count: { select: { courses: true } } },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.instructor.count({ where }),
    ]);

    return NextResponse.json({ instructors, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { name, bio, title, linkedin, twitter, website } = body;

    if (!name) return badRequest('name is required');

    const instructor = await prisma.instructor.create({
      data: {
        name,
        bio: bio ?? null,
        title: title ?? null,
        linkedin: linkedin ?? null,
        twitter: twitter ?? null,
        website: website ?? null,
        credentials: [],
      },
    });

    return NextResponse.json({ instructor }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
