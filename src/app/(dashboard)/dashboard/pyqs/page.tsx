import { Bookmark, Clock } from 'lucide-react';

export default function PYQsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: '#ede9fe' }}
        >
          <Bookmark className="h-8 w-8" style={{ color: '#7c3aed' }} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-foreground)' }}>
          PYQs — Coming Soon
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
          Previous Year Questions are on their way — curated, categorised by topic, and paired with expert explanations so you can learn from real exam patterns. Check back soon!
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ background: '#ede9fe', color: '#6d28d9' }}
        >
          <Clock className="h-4 w-4" />
          Launching Soon
        </div>
      </div>
    </div>
  );
}
