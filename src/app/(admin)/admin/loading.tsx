export default function AdminLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="h-7 w-40 rounded-lg animate-pulse" style={{ background: 'var(--color-muted)' }} />
          <div className="h-4 w-24 rounded mt-2 animate-pulse" style={{ background: 'var(--color-muted)' }} />
        </div>
        <div className="h-9 w-28 rounded-lg animate-pulse" style={{ background: 'var(--color-muted)' }} />
      </div>

      {/* Table skeleton */}
      <div className="card-base overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--color-border)' }}>
          <div className="h-9 flex-1 max-w-xs rounded-lg animate-pulse" style={{ background: 'var(--color-muted)' }} />
          <div className="h-9 w-32 rounded-lg animate-pulse" style={{ background: 'var(--color-muted)' }} />
        </div>

        {/* Header row */}
        <div className="px-4 py-3 flex gap-6" style={{ background: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)' }}>
          {[120, 80, 80, 60, 70].map((w, i) => (
            <div key={i} className="h-3 rounded animate-pulse" style={{ width: w, background: 'var(--color-border)' }} />
          ))}
        </div>

        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3.5 flex gap-6 items-center"
            style={{ borderBottom: i < 7 ? '1px solid var(--color-border)' : undefined }}
          >
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3.5 w-48 rounded animate-pulse" style={{ background: 'var(--color-muted)', animationDelay: `${i * 40}ms` }} />
              <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'var(--color-muted)', animationDelay: `${i * 40 + 20}ms` }} />
            </div>
            <div className="h-3.5 w-16 rounded animate-pulse" style={{ background: 'var(--color-muted)', animationDelay: `${i * 40}ms` }} />
            <div className="h-3.5 w-12 rounded animate-pulse" style={{ background: 'var(--color-muted)', animationDelay: `${i * 40}ms` }} />
            <div className="h-5 w-16 rounded-full animate-pulse" style={{ background: 'var(--color-muted)', animationDelay: `${i * 40}ms` }} />
            <div className="flex gap-1.5 ml-auto">
              <div className="h-6 w-6 rounded animate-pulse" style={{ background: 'var(--color-muted)' }} />
              <div className="h-6 w-6 rounded animate-pulse" style={{ background: 'var(--color-muted)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
