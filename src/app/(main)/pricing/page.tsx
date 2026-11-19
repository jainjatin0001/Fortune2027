import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { SectionHeader } from '@/components/shared/SectionHeader';
import PricingSection from './PricingSection';

export const metadata: Metadata = pageMetadata({ title: 'Pricing & Tutoring Plans', path: '/pricing', description: 'Compare Delta Tutors plans for live 1:1 online SAT, ACT, AP and coding tutoring. Monthly plans in USD for families in the US and Canada.' });

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--color-background)' }}>
      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
            as="h1"
            eyebrow="Plans & Pricing"
            title="Results-Driven Tutoring, Honest Pricing"
            subtitle="Live 1:1 sessions built around your goals — no fluff, no fine print."
          />
          <PricingSection />
        </div>
      </section>
    </div>
  );
}
