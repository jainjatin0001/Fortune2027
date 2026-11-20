'use client';

import { useAuth } from '@clerk/nextjs';
import { LinkCard, type LinkCardProps } from './LinkCard';

type AuthLinkCardProps = Omit<LinkCardProps, 'href'> & {
  signedInHref: string;
  signedOutHref: string;
};

/**
 * LinkCard whose destination depends on sign-in state, so pages can stay
 * static (no server-side auth check). Signed-out link is used until Clerk loads.
 */
export function AuthLinkCard({ signedInHref, signedOutHref, ...card }: AuthLinkCardProps) {
  const { isSignedIn } = useAuth();
  return <LinkCard href={isSignedIn ? signedInHref : signedOutHref} {...card} />;
}
