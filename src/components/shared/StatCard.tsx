import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ value, label, icon, className }: StatCardProps) {
  return (
    <div className={cn('text-center', className)}>
      {icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
        >
          {icon}
        </div>
      )}
      <div
        className="text-4xl font-black mb-1"
        style={{ color: 'var(--color-primary)' }}
      >
        {value}
      </div>
      <div className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
        {label}
      </div>
    </div>
  );
}
