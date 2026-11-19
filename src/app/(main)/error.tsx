'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-padding" style={{ background: 'var(--color-background)' }}>
      <div className="container-narrow text-center">
        <h1 className="text-heading-2 mb-4" style={{ color: 'var(--color-foreground)' }}>
          Something went wrong
        </h1>
        <p className="text-body-lg mb-8" style={{ color: 'var(--color-muted-foreground)' }}>
          Sorry, this page didn&apos;t load properly. Please try again.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="px-6 py-3 rounded-lg font-semibold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)' }}
          >
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
