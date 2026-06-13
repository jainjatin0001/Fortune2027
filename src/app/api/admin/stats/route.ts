import { NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const admin = await requireAdmin().catch((e) => {
      if (e.message === 'UNAUTHORIZED') throw { status: 401 };
      if (e.message === 'FORBIDDEN') throw { status: 403 };
      throw e;
    });

    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalQuizAttempts,
      recentUsers,
      contactMessages,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
      prisma.quizAttempt.count({ where: { status: 'COMPLETED' } }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
      }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    void admin;

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalQuizAttempts,
      recentUsers,
      pendingContactMessages: contactMessages,
    });
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) {
      const err = e as { status: number };
      if (err.status === 401) return unauthorized();
      if (err.status === 403) return forbidden();
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
