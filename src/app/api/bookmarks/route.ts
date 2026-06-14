import { NextRequest, NextResponse } from 'next/server';
import { getDbUser, unauthorized, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        course: { select: { id: true, title: true, thumbnailUrl: true, difficulty: true, program: { select: { name: true, slug: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookmarks });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const { courseId } = body;
    if (!courseId) return badRequest('courseId is required');

    const existing = await prisma.bookmark.findFirst({
      where: { userId: user.id, courseId },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ bookmarked: false });
    }

    await prisma.bookmark.create({ data: { userId: user.id, courseId } });
    return NextResponse.json({ bookmarked: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
