import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// TEMPORARY diagnostic — remove after debugging the auth loop.
export async function GET() {
  const { userId, sessionId } = await auth();
  return NextResponse.json({
    serverSeesUser: Boolean(userId),
    userId: userId ?? null,
    sessionId: sessionId ?? null,
    secretKeyPrefix: (process.env.CLERK_SECRET_KEY ?? '').slice(0, 8),
    publishableKeyPrefix: (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '').slice(0, 8),
  });
}
