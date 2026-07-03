import { auth, currentUser } from '@clerk/nextjs/server';
import { cache } from 'react';
import { prisma } from './prisma';
import { NextResponse } from 'next/server';

export const getDbUser = cache(async () => {
  // auth() reads the JWT locally — no Clerk network call for existing users
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  // User not yet in DB — fetch full Clerk profile only on first visit
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? '';

  // A row with this email may already exist from a different Clerk instance
  // (e.g. a test-instance account created before the production instance).
  // Reconcile by re-pointing that row to the current clerkId instead of
  // creating a duplicate, which would violate the unique-email constraint.
  const byEmail = email
    ? await prisma.user.findUnique({ where: { email } })
    : null;
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { clerkId: clerkUser.id },
    });
  }

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.firstName ?? 'User',
      lastName: clerkUser.lastName ?? '',
      avatarUrl: clerkUser.imageUrl,
    },
  });
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

export async function requireSuperAdmin() {
  const user = await requireDbUser();
  if (user.role !== 'SUPER_ADMIN') {
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
