import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

interface ClerkUserData {
  id: string;
  email_addresses: Array<{ email_address: string; id: string }>;
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: { type: string; data: ClerkUserData };
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as { type: string; data: ClerkUserData };
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === 'user.created' || type === 'user.updated') {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    )?.email_address ?? data.email_addresses[0]?.email_address ?? '';

    await prisma.user.upsert({
      where: { clerkId: data.id },
      create: {
        clerkId: data.id,
        email: primaryEmail,
        firstName: data.first_name ?? 'User',
        lastName: data.last_name ?? '',
        avatarUrl: data.image_url,
      },
      update: {
        email: primaryEmail,
        firstName: data.first_name ?? 'User',
        lastName: data.last_name ?? '',
        avatarUrl: data.image_url,
      },
    });
  }

  if (type === 'user.deleted') {
    await prisma.user.deleteMany({ where: { clerkId: data.id } });
  }

  return NextResponse.json({ received: true });
}
