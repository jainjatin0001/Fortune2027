export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg" style={{ background: 'var(--color-muted)' }} />
        <div className="h-4 w-80 rounded-lg" style={{ background: 'var(--color-muted)' }} />
      </div>

      {/* Cards row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5"
            style={{ background: 'var(--color-muted)', height: '110px' }}
          />
        ))}
      </div>

      {/* Content block */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl"
            style={{ background: 'var(--color-muted)', height: '68px' }}
          />
        ))}
      </div>
    </div>
  );
}
