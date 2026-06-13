import { NextResponse } from 'next/server';
import { getDbUser, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

    const enrollmentCount = await prisma.enrollment.count({
      where: { userId: user.id, status: 'ACTIVE' },
    });

    return NextResponse.json({
      ...user,
      profile,
      hasEnrollments: enrollmentCount > 0,
      tier: enrollmentCount > 0 ? 'premium' : 'free',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const { firstName, lastName, bio, grade, school, country, state, timezone, targetScore, examDate, phone } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      },
    });

    const profileData = { bio, grade, school, country, state, timezone, targetScore, examDate: examDate ? new Date(examDate) : undefined, phone };
    const filteredProfile = Object.fromEntries(
      Object.entries(profileData).filter(([, v]) => v !== undefined)
    );

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...filteredProfile },
      update: filteredProfile,
    });

    return NextResponse.json({ ...updatedUser, profile });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
