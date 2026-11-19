import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: '/sat-prep', label: 'Digital SAT Prep' },
  { href: '/act-prep', label: 'ACT Prep' },
  { href: '/ap-prep', label: 'AP Exam Prep' },
  { href: '/coding', label: 'Coding for Teens' },
  { href: '/courses', label: 'All Courses' },
  { href: '/blog', label: 'Blog' },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="main-with-nav flex-1">
        <section className="section-padding" style={{ background: 'var(--color-background)' }}>
          <div className="container-narrow text-center">
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--color-accent)' }}>404</p>
            <h1 className="text-heading-2 mb-4" style={{ color: 'var(--color-foreground)' }}>
              We couldn&apos;t find that page
            </h1>
            <p className="text-body-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-muted-foreground)' }}>
              The link may be broken or the page may have moved. Try one of these instead:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {suggestions.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                  style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)' }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
