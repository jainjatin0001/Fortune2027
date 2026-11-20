import { CalendarDays, Calculator, type LucideIcon } from 'lucide-react';
import { EXAM_TOOL_LINKS, type ExamToolLink } from '@/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { LinkCard, type LinkCardProps } from '@/components/shared/LinkCard';
import { PayAsYouGoCard } from '@/components/shared/PayAsYouGoCard';
import { cn } from '@/lib/utils';
import { EXAMS, type ExamKey } from '@/lib/exams';
import { daysBetween, formatTestDate, getNextDate, relativeDays, todayIn } from '@/lib/exams/dates';
import { MockTestCard } from './MockTestCard';
import { TOOL_THEME } from './theme';

const TOOL_ICONS: Record<ExamToolLink['kind'], LucideIcon> = {
  dates: CalendarDays,
  calculator: Calculator,
};

/** "Next ACT: Dec 12, 2026 · in 22 days" from the exam's first (primary) schedule. */
function nextDateBadge(exam: ExamKey): string | undefined {
  const { name, schedules } = EXAMS[exam];
  const schedule = schedules[0];
  const today = todayIn(schedule.timeZone);
  const next = getNextDate(schedule, today);
  if (!next) return undefined;
  return `Next ${name}: ${formatTestDate(next, 'short')} · ${relativeDays(daysBetween(today, next.testDate))}`;
}

function toolCards(exam: ExamKey, excludeHref?: string): LinkCardProps[] {
  return EXAM_TOOL_LINKS[exam]
    .filter((t) => t.href !== excludeHref)
    .map((t) => ({
      href: t.href,
      title: t.label,
      description: t.description,
      ctaLabel: t.ctaLabel,
      icon: TOOL_ICONS[t.kind],
      badge: (t.kind === 'dates' ? nextDateBadge(exam) : undefined) ?? t.tagline,
    }));
}

type ExamToolsSectionProps = {
  /** One or more exams; tool cards are shown in this order. */
  exams: ExamKey[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  background?: string;
  /** Hide the card for the page the visitor is already on. */
  excludeHref?: string;
  /** Add the mock test card for the first exam (signed in → mock tests, guest → dashboard preview). */
  showMockTest?: boolean;
  /** Add the pay-as-you-go pricing card (opens the contact pop-up). */
  showPayAsYouGo?: boolean;
};

/** Grid of free-tool cards. Used on home, the SAT/ACT prep pages and every tool page. */
export function ExamToolsSection({
  exams,
  eyebrow,
  title,
  subtitle = 'Pick the right test date and see where your score stands. Free, with no sign-up needed.',
  background = 'var(--color-background)',
  excludeHref,
  showMockTest = false,
  showPayAsYouGo = false,
}: ExamToolsSectionProps) {
  const names = exams.map((e) => EXAMS[e].name).join(' & ');
  const primary = EXAMS[exams[0]];
  const cards = exams.flatMap((e) => toolCards(e, excludeHref));
  const count = cards.length + Number(showMockTest) + Number(showPayAsYouGo);
  const theme = { color: TOOL_THEME.color, tint: TOOL_THEME.tint };

  return (
    <section className="section-padding-sm" style={{ background }}>
      <div className="container-app">
        <SectionHeader
          eyebrow={eyebrow ?? `Free ${names} Tools`}
          title={title ?? `Plan Your ${names} and Track Your Score`}
          subtitle={subtitle}
        />
        {/* Grid rows stretch, so every card in a row has the same height. 3 cards → one row; 2 or 4 → two columns. */}
        <div className={cn('grid gap-5 md:grid-cols-2 mx-auto', count === 3 ? 'lg:grid-cols-3 max-w-6xl' : 'max-w-4xl')}>
          {cards.map((card) => (
            <LinkCard key={card.href} {...theme} {...card} />
          ))}
          {showMockTest && <MockTestCard exam={primary.key} {...theme} />}
          {showPayAsYouGo && <PayAsYouGoCard course={primary.contactCourse} {...theme} />}
        </div>
      </div>
    </section>
  );
}
