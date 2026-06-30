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
    const published = searchParams.get('published');

    const where = {
      ...(programId && { programId }),
      ...(search && { title: { contains: search, mode: 'insensitive' as const } }),
      ...(published !== null && published !== '' && { isPublished: published === 'true' }),
    };

    const [mockTests, total] = await Promise.all([
      prisma.mockTest.findMany({
        where,
        include: {
          program: { select: { name: true, slug: true } },
          _count: { select: { sections: true, attempts: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.mockTest.count({ where }),
    ]);

    return NextResponse.json({ mockTests, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { title, description, instructions, programId, passingScore, isPublished } = body;

    if (!title) return badRequest('title is required');

    const mockTest = await prisma.mockTest.create({
      data: {
        title,
        description: description ?? null,
        instructions: instructions ?? null,
        programId: programId || null,
        passingScore: passingScore ? parseInt(passingScore) : 70,
        isPublished: isPublished ?? false,
      },
      include: {
        program: { select: { name: true, slug: true } },
        _count: { select: { sections: true, attempts: true } },
      },
    });

    return NextResponse.json({ mockTest }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
