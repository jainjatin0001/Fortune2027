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
    const userId = searchParams.get('userId');
    if (!userId) return badRequest('userId is required');

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        isPublished: true,
        isFree: true,
        program: { select: { name: true } },
        enrollments: {
          where: { userId },
          select: { id: true, status: true, enrolledAt: true },
          take: 1,
        },
      },
      orderBy: [{ isPublished: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        price: course.price,
        isPublished: course.isPublished,
        isFree: course.isFree,
        programName: course.program.name,
        enrollment: course.enrollments[0] ?? null,
      })),
    });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await withAdmin();
    const body = await req.json();
    const { userId, courseId, recordPayment = true } = body;

    if (!userId || !courseId) return badRequest('userId and courseId are required');

    const [user, course] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, firstName: true, lastName: true },
      }),
      prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, price: true },
      }),
    ]);

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const existingPaidOrder = recordPayment
      ? await prisma.payment.findFirst({
          where: {
            userId,
            status: 'COMPLETED',
            order: { items: { some: { courseId } } },
          },
          select: { id: true },
        })
      : null;

    const result = await prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId, status: 'ACTIVE' },
        update: { status: 'ACTIVE', expiresAt: null },
        include: { course: { select: { id: true, title: true } } },
      });

      let paymentCreated = false;

      if (recordPayment && !existingPaidOrder) {
        const amount = course.price;
        const order = await tx.order.create({
          data: {
            userId,
            status: 'CONFIRMED',
            subtotal: amount,
            total: amount,
            currency: 'USD',
            notes: `Manual admin enrollment: ${course.title}`,
          },
        });

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            courseId,
            title: course.title,
            price: amount,
          },
        });

        await tx.payment.create({
          data: {
            orderId: order.id,
            userId,
            amount,
            currency: 'USD',
            status: 'COMPLETED',
            provider: 'OTHER',
            providerOrderId: `manual:${order.id}`,
            metadata: {
              source: 'admin_manual_enrollment',
              adminUserId: admin.id,
              adminEmail: admin.email,
              studentEmail: user.email,
            },
            paidAt: new Date(),
          },
        });

        paymentCreated = true;
      }

      return { enrollment, paymentCreated, paymentAlreadyRecorded: !!existingPaidOrder };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
