import type { Metadata } from 'next';
import { SectionHeader } from '@/components/shared/SectionHeader';
import PricingSection from './PricingSection';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for every student.',
};

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--color-background)' }}>
      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
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
