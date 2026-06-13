import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: 'Already subscribed!' });
      }
      await prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: true } });
      return NextResponse.json({ message: 'Welcome back! You\'ve been resubscribed.' });
    }

    await prisma.newsletterSubscriber.create({ data: { email, firstName: name ?? null } });
    return NextResponse.json({ message: 'Subscribed! Check your email for confirmation.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    await prisma.newsletterSubscriber.updateMany({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Unsubscribed successfully.' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
