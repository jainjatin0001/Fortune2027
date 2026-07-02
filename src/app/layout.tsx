import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import NextTopLoader from 'nextjs-toploader';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';
import { APP_NAME, APP_DESCRIPTION, APP_URL } from '@/constants';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — Premium SAT, ACT, AP & Coding Prep`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'SAT prep', 'ACT prep', 'AP exam preparation', 'Python courses',
    'coding bootcamp', 'online tutoring', 'high school test prep',
    'machine learning course', 'data science', 'web development',
    'US students', 'Canada students',
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — Premium SAT, ACT, AP & Coding Prep`,
    description: APP_DESCRIPTION,
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630, alt: APP_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — Premium SAT, ACT, AP & Coding Prep`,
    description: APP_DESCRIPTION,
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/images/logos/logo_5.png',
    apple: '/images/logos/logo_5.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
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
