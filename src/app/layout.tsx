import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import NextTopLoader from 'nextjs-toploader';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';
import { APP_NAME, APP_DESCRIPTION, APP_URL } from '@/constants';
import { SITE_TAGLINE, LOGO_PATH, organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME, url: APP_URL }],
  creator: APP_NAME,
  publisher: APP_NAME,
  // OG image comes from src/app/opengraph-image.tsx (file convention), so no
  // static `images` here; per-page OG tags are built with pageMetadata().
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['en_CA'],
    url: '/',
    siteName: APP_NAME,
    title: `${APP_NAME} | ${SITE_TAGLINE}`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} | ${SITE_TAGLINE}`,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  // Paste the tokens from Google Search Console / Bing Webmaster Tools into these
  // env vars if you verify via HTML tag instead of DNS.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  icons: {
    icon: LOGO_PATH,
    apple: LOGO_PATH,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
          <GoogleAnalytics />
          <MicrosoftClarity />
          <ThemeProvider>
            <NextTopLoader color="#2563eb" height={3} showSpinner={false} />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
