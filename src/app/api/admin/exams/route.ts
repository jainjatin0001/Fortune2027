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
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(published !== null && published !== '' && { isPublished: published === 'true' }),
    };

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        include: {
          program: { select: { name: true } },
          _count: { select: { questions: true } },
        },
        orderBy: [{ examYear: 'desc' }, { examMonth: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.exam.count({ where }),
    ]);

    return NextResponse.json({ exams, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { programId, name, description, examYear, examMonth, session, isPublished } = body;

    if (!programId || !name || !examYear) return badRequest('programId, name, and examYear are required');

    const exam = await prisma.exam.create({
      data: {
        programId,
        name,
        description: description ?? null,
        examYear: parseInt(examYear),
        examMonth: examMonth ? parseInt(examMonth) : null,
        session: session ?? null,
        isPublished: isPublished ?? false,
      },
    });

    return NextResponse.json({ exam }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
