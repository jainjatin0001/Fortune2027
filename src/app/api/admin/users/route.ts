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

export async function GET(req: NextRequest) {
  try {
    await withAdmin();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role');

    const where = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(role && { role: role as never }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, firstName: true, lastName: true, email: true,
          role: true, isActive: true, createdAt: true, avatarUrl: true,
          _count: { select: { enrollments: true, quizAttempts: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) {
      const err = e as { status: number };
      if (err.status === 401) return unauthorized();
      if (err.status === 403) return forbidden();
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { userId, role, isActive } = body;
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true },
    });

    return NextResponse.json({ user });
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) {
      const err = e as { status: number };
      if (err.status === 401) return unauthorized();
      if (err.status === 403) return forbidden();
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
