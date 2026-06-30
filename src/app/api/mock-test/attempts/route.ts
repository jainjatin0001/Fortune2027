import { NextResponse } from 'next/server';
import { requireDbUser, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    return unauthorized();
  }

  try {
    const attempts = await prisma.mockTestAttempt.findMany({
      where: { userId: user.id, status: 'COMPLETED' },
      include: {
        mockTest: { select: { id: true, title: true } },
      },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ attempts });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
