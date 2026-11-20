import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';
import { EXAMS, type ExamKey } from '@/lib/exams';
import { ExamToolsSection } from './ExamToolsSection';
import { TOOL_THEME } from './theme';

type ExamToolPageProps = {
  exam: ExamKey;
  path: string;
  /** Short name for the breadcrumb, e.g. "Test Dates". */
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  /** Small line under the intro, e.g. "Last checked against College Board: …". */
  note?: React.ReactNode;
  /** Extra JSON-LD for the page (breadcrumbs are added automatically). */
  jsonLd?: Record<string, unknown>[];
  /** Main tool content, shown before the "More Free Help" cards. */
  children: React.ReactNode;
  /** Supporting content (guides, fees, next year's dates), shown after the "More Free Help" cards. */
  afterTools?: React.ReactNode;
  /** Background of the "More Free Help" section, so it can alternate with its neighbours. */
  toolsBackground?: string;
};

/**
 * Shared shell for every exam tool page (SAT, ACT): hero with breadcrumb + H1,
 * main content, cards for the other tool / mock test / pay-as-you-go tutoring,
 * then optional supporting content.
 */
export function ExamToolPage({
  exam,
  path,
  breadcrumbLabel,
  eyebrow,
  title,
  intro,
  note,
  jsonLd = [],
  children,
  afterTools,
  toolsBackground,
}: ExamToolPageProps) {
  const info = EXAMS[exam];
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: info.prepLabel, path: info.prepPath },
    { name: breadcrumbLabel, path },
  ];

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <JsonLd data={[breadcrumbJsonLd(crumbs), ...jsonLd]} />

      <section className="hero-bg py-12 sm:py-16">
        <div className="container-app relative">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-xs" style={{ color: 'rgba(203,213,225,0.75)' }}>
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.path} className="hover:text-white transition-colors">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white font-medium">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: TOOL_THEME.heroLabel }}>
              {eyebrow}
            </p>
            <h1 className="text-hero text-white mb-4">{title}</h1>
            <div className="text-base leading-relaxed" style={{ color: 'rgba(226,232,240,0.9)' }}>
              {intro}
            </div>
            {note && (
              <p className="text-xs mt-4" style={{ color: 'rgba(203,213,225,0.7)' }}>
                {note}
              </p>
            )}
          </div>
        </div>
      </section>

      {children}

      <ExamToolsSection
        exams={[exam]}
        eyebrow="Keep Going"
        title={`More Free ${info.name} Help`}
        subtitle="Use our other free tool, or get expert help when you need it."
        background={toolsBackground}
        excludeHref={path}
        showMockTest
        showPayAsYouGo
      />

      {afterTools}
    </div>
  );
}

/**
 * Consistent content block for tool pages.
 * - `prose` (default): narrow column with text styling for paragraphs/lists/links.
 * - `wide`: wider column for tables, cards and calculators; children keep their own styles.
 */
export function ToolContentSection({
  title,
  intro,
  children,
  variant = 'prose',
  background = 'var(--color-background)',
  className = 'section-padding-sm',
}: {
  title?: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'prose' | 'wide';
  background?: string;
  className?: string;
}) {
  const isProse = variant === 'prose';
  return (
    <section className={className} style={{ background }}>
      <div className={isProse ? 'container-narrow' : 'container-app'}>
        <div className={isProse ? undefined : 'max-w-5xl mx-auto'}>
          {title && (
            <h2 className="text-heading-3 mb-2" style={{ color: 'var(--color-foreground)' }}>
              {title}
            </h2>
          )}
          {intro && (
            <p className="text-sm mb-6" style={{ color: 'var(--color-foreground)' }}>
              {intro}
            </p>
          )}
          {isProse ? (
            // Body text uses the foreground colour: muted grey fails contrast on the alt background.
            <div
              className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed [&_a]:underline [&_a]:font-medium [&_a]:text-[var(--color-accent)] [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </section>
  );
}
