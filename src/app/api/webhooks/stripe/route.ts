import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Raw body required for Stripe signature verification — do not parse as JSON
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe-signature header or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid stripe signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

    try {
      if (meta.type === 'course') {
        await handleCourseCheckout(session, meta);
      } else {
        await handlePlanCheckout(session, meta);
      }
    } catch (err) {
      console.error('[webhook/stripe] DB error:', err);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    await prisma.subscription.updateMany({
      where: { providerSubId: sub.id },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
  }

  return NextResponse.json({ received: true });
}

// ── Course one-time purchase ──────────────────────────────────────────────────
async function handleCourseCheckout(
  session: Stripe.Checkout.Session,
  meta: Record<string, string>,
) {
  const { userId, courseId, courseTitle, coursePrice } = meta;
  if (!userId || !courseId) throw new Error('Missing course metadata');

  const amount = Number(coursePrice ?? 0);

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        status: 'CONFIRMED',
        subtotal: amount,
        total: amount,
        currency: 'USD',
        notes: `Course purchase: ${courseTitle}`,
      },
    });

    await tx.orderItem.create({
      data: {
        orderId: order.id,
        courseId,
        title: courseTitle,
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
        provider: 'STRIPE',
        providerPaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        providerOrderId: session.id,
        paidAt: new Date(),
      },
    });

    // Create or reactivate enrollment
    await tx.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, status: 'ACTIVE' },
      update: { status: 'ACTIVE' },
    });
  });
}

// ── Monthly subscription plan ─────────────────────────────────────────────────
async function handlePlanCheckout(
  session: Stripe.Checkout.Session,
  meta: Record<string, string>,
) {
  const { userId, planId, planName, planPrice } = meta;
  if (!userId || !planId || !planName) throw new Error('Missing plan metadata');

  const amount = Number(planPrice ?? 0);

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        status: 'CONFIRMED',
        subtotal: amount,
        total: amount,
        currency: 'USD',
        notes: `Subscription: ${planName} Plan`,
      },
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        userId,
        amount,
        currency: 'USD',
        status: 'COMPLETED',
        provider: 'STRIPE',
        providerPaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        providerOrderId: session.id,
        paidAt: new Date(),
      },
    });

    const existing = await tx.subscription.findFirst({ where: { userId, planName: planId } });
    if (existing) {
      await tx.subscription.update({
        where: { id: existing.id },
        data: {
          status: 'ACTIVE',
          providerSubId: typeof session.subscription === 'string' ? session.subscription : undefined,
          cancelAtEnd: false,
          cancelledAt: null,
        },
      });
    } else {
      await tx.subscription.create({
        data: {
          userId,
          planName: planId,
          status: 'ACTIVE',
          providerSubId: typeof session.subscription === 'string' ? session.subscription : undefined,
        },
      });
    }
  });
}
