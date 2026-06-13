import { NextRequest, NextResponse } from 'next/server';
import { getDbUser, unauthorized, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (courseId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
        include: { course: { select: { id: true, title: true, category: true } } },
      });
      return NextResponse.json({ enrolled: !!enrollment, enrollment });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: { id: true, title: true, category: true, thumbnailUrl: true, totalLessons: true, durationHours: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ enrollments, hasAny: enrollments.length > 0 });
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

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      create: { userId: user.id, courseId, status: 'ACTIVE' },
      update: { status: 'ACTIVE' },
      include: { course: { select: { id: true, title: true, category: true } } },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
