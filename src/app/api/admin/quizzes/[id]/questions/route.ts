import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden } from '@/lib/auth';
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
    const questions = await prisma.quizQuestion.findMany({
      where: { quizId: id },
      include: { question: { include: { subject: { select: { name: true } }, options: { select: { id: true, content: true, isCorrect: true } } } } },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ questions });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;
    const { questionId, points, sortOrder } = await req.json();
    if (!questionId) return NextResponse.json({ error: 'questionId is required' }, { status: 400 });

    const existing = await prisma.quizQuestion.findUnique({ where: { quizId_questionId: { quizId: id, questionId } } });
    if (existing) return NextResponse.json({ error: 'Question already in quiz' }, { status: 409 });

    const count = await prisma.quizQuestion.count({ where: { quizId: id } });
    const qq = await prisma.quizQuestion.create({
      data: { quizId: id, questionId, points: points ?? 1, sortOrder: sortOrder ?? count },
    });
    return NextResponse.json({ quizQuestion: qq }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
