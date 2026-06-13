import { currentUser } from '@clerk/nextjs/server';
import { cache } from 'react';
import { prisma } from './prisma';
import { NextResponse } from 'next/server';

export const getDbUser = cache(async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
        firstName: clerkUser.firstName ?? 'User',
        lastName: clerkUser.lastName ?? '',
        avatarUrl: clerkUser.imageUrl,
      },
    });
  }

  return user;
});

export async function requireDbUser() {
  const user = await getDbUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireDbUser();
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function badRequest(message = 'Bad request') {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = 'Internal server error') {
  return NextResponse.json({ error: message }, { status: 500 });
}
