import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
  /** Heading level for the title. Use 'h1' when this is the page's main heading. */
  as?: 'h1' | 'h2';
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
  as: Heading = 'h2',
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12', align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <span
          className="font-bold inline-block mb-3 text-sm"
          style={{ color: '#17356D', textTransform: 'none', letterSpacing: 'normal' }}
        >
          {eyebrow}
        </span>
      )}
      <Heading
        className={cn('text-heading-2 mb-4', titleClassName)}
        style={{ color: 'var(--color-foreground)' }}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            'text-body-lg',
            align === 'center' && 'max-w-2xl mx-auto'
          )}
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
