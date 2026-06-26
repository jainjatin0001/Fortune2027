import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PRICING_PLANS } from '@/constants';

export async function POST(req: NextRequest) {
  try {
    const user = await requireDbUser();
    const body = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    // ── Course one-time purchase ──────────────────────────────────────────────
    if (body.type === 'course') {
      const { courseId } = body as { courseId: string };
      if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 });

      const course = await prisma.course.findUnique({
        where: { id: courseId, isPublished: true },
        select: { id: true, title: true, shortDesc: true, price: true, isFree: true },
      });
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      if (course.isFree) return NextResponse.json({ error: 'Course is free — use enrollment API' }, { status: 400 });

      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
      });
      if (existing?.status === 'ACTIVE') {
        return NextResponse.json({ error: 'Already enrolled' }, { status: 409 });
      }

      const price = Number(course.price);

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: course.title,
                description: course.shortDesc ?? undefined,
              },
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
          },
        ],
        customer_email: user.email,
        metadata: {
          type: 'course',
          userId: user.id,
          courseId: course.id,
          courseTitle: course.title,
          coursePrice: String(price),
        },
        success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/courses/${courseId}`,
      });

      return NextResponse.json({ url: session.url });
    }

    // ── Subscription plan ─────────────────────────────────────────────────────
    const { planId } = body as { planId: string };
    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Plan`,
              description: plan.description,
            },
            recurring: { interval: 'month' },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        type: 'plan',
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
        planPrice: String(plan.price),
      },
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[checkout/session]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
