import { NextRequest, NextResponse } from 'next/server';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDemoQuestions } from '@/../data/demo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
  const demo = searchParams.get('demo') === 'true';

  if (demo) {
    const questions = getDemoQuestions(category ?? undefined);
    return NextResponse.json({ questions, source: 'demo' });
  }

  try {
    const user = await getDbUser();

    // Check if user has any active enrollment
    const hasEnrollment = user
      ? (await prisma.enrollment.count({ where: { userId: user.id, status: 'ACTIVE' } })) > 0
      : false;

    if (!hasEnrollment) {
      // Return demo questions for free users
      const questions = getDemoQuestions(category ?? undefined).slice(0, limit);
      return NextResponse.json({ questions, source: 'demo', limited: true });
    }

    // Full question set for enrolled users
    const where: Record<string, unknown> = { isActive: true };
    if (category) {
      const subject = await prisma.subject.findFirst({
        where: { slug: category },
      });
      if (subject) where.subjectId = subject.id;
    }
    if (difficulty) where.difficulty = difficulty.toUpperCase();

    const questions = await prisma.question.findMany({
      where,
      include: { options: { orderBy: { sortOrder: 'asc' } }, subject: { select: { name: true, slug: true } } },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ questions, source: 'db', limited: false });
  } catch {
    // Fallback to demo on any error
    const questions = getDemoQuestions(category ?? undefined).slice(0, limit);
    return NextResponse.json({ questions, source: 'demo', limited: true });
  }
}
