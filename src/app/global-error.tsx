'use client';

// Replaces the root layout when it crashes, so it must render its own <html>/<body>
// and can't rely on globals.css or providers.
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#f8fafc',
          color: '#0f172a',
          textAlign: 'center',
          padding: 16,
        }}
      >
        <title>Something went wrong | Delta Tutors</title>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: '#475569', marginBottom: 24 }}>Please try again in a moment.</p>
          <button
            onClick={() => unstable_retry()}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: 0,
              background: '#1e3a8a',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
