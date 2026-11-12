import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  /** Controls rendered at the right of the header (filters, menus) */
  toolbar?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, description, action, toolbar, className, children }: SectionCardProps) {
  return (
    <section className={cn('card-base p-5 sm:p-6 flex flex-col', className)} aria-label={title}>
      <header className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>{title}</h2>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{description}</p>
          )}
        </div>
        {toolbar}
        {action && (
          <Link
            href={action.href}
            className="text-sm flex items-center gap-1 hover:underline shrink-0"
            style={{ color: 'var(--color-accent)' }}
          >
            {action.label} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </header>
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
}

export function EmptyState({ icon: Icon, title, body, cta }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="text-center py-8 px-4">
      <Icon className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-muted-foreground)' }} />
      <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{title}</p>
      <p className="text-xs mt-1 max-w-xs mx-auto" style={{ color: 'var(--color-muted-foreground)' }}>{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex mt-4 text-sm font-semibold px-4 py-2 rounded-lg text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

export function SectionSkeleton({ className, height = 220 }: { className?: string; height?: number }) {
  return (
    <div
      className={cn('rounded-xl animate-pulse', className)}
      style={{ background: 'var(--color-muted)', height }}
      aria-hidden
    />
  );
}
