import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/courses(.*)',
  '/subjects(.*)',
  '/sat-prep(.*)',
  '/act-prep(.*)',
  '/ap-prep(.*)',
  '/coding(.*)',
  '/blog(.*)',
  '/about',
  '/contact',
  '/pricing',
  '/sign-in(.*)',
  '/sign-up(.*)',
  // Signed-out visitors see a sign-up preview here; other dashboard pages still require sign-in
  '/dashboard',
  '/api/webhook(.*)',
  '/api/contact',
  '/api/newsletter',
  '/api/questions',
  '/sitemap.xml',
  '/robots.txt',
  // Generated social-preview images and icons must be fetchable by crawlers
  '/opengraph-image(.*)',
  '/twitter-image(.*)',
  '/icon(.*)',
  '/apple-icon(.*)',
]);

const isDashboardRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/settings(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  if ((isDashboardRoute(req) && !isPublicRoute(req)) || isAdminRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
