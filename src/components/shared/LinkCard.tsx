import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';

type CardContentProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Small highlighted line under the title, e.g. "Next SAT: Dec 5 · in 15 days". */
  badge?: string;
  /** Accent colour (CSS value) for icon, badge and CTA. */
  color?: string;
  /** Background for the icon tile. */
  tint?: string;
  headingAs?: 'h2' | 'h3';
};

export type LinkCardProps = CardContentProps & { href: string; ctaLabel: string };

/** Shared card classes so link cards and action cards are identical in size and style. */
export const FEATURE_CARD_CLASS = 'card-base group flex flex-col p-6 h-full text-left';

/** CTA row ("Label →") used at the bottom of every feature card. */
export function CardCta({ label, color = 'var(--color-accent)' }: { label: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
      style={{ color }}
    >
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </span>
  );
}

/** Icon + title + badge + description; the body shared by every feature card. */
export function CardContent({
  title,
  description,
  icon: Icon,
  badge,
  color = 'var(--color-accent)',
  tint = 'var(--color-primary-light)',
  headingAs: Heading = 'h3',
}: CardContentProps) {
  return (
    <>
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: tint }}
        >
          <Icon className="h-6 w-6" style={{ color }} aria-hidden />
        </div>
        <div className="min-w-0">
          <Heading className="font-bold text-base sm:text-lg leading-snug" style={{ color: 'var(--color-foreground)' }}>
            {title}
          </Heading>
          {badge && (
            <p className="text-xs font-semibold mt-1" style={{ color }}>
              {badge}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--color-muted-foreground)' }}>
        {description}
      </p>
    </>
  );
}

/** Whole-card link with icon, text, optional badge and an arrow CTA. */
export function LinkCard({ href, ctaLabel, ...content }: LinkCardProps) {
  return (
    <Link href={href} className={FEATURE_CARD_CLASS}>
      <CardContent {...content} />
      <CardCta label={ctaLabel} color={content.color} />
    </Link>
  );
}
