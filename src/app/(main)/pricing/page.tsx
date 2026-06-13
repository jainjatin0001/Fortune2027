import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PRICING_PLANS } from '@/constants';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for every student. Start free, upgrade when ready.',
};

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--color-background)' }}>
      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="Pricing"
            title="Simple, Transparent Pricing"
            subtitle="Start free. No credit card required. Upgrade when you're ready."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card-base p-8 relative flex flex-col ${plan.isPopular ? 'outline outline-2 outline-[var(--color-primary)]' : ''}`}
              >
                {plan.isPopular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black" style={{ color: 'var(--color-primary)' }}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm pb-1" style={{ color: 'var(--color-muted-foreground)' }}>/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-foreground)' }}>
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/sign-up">
                  <Button
                    className="w-full font-semibold"
                    variant={plan.isPopular ? 'default' : 'outline'}
                    style={plan.isPopular ? { background: 'var(--gradient-primary)', color: '#fff' } : {}}
                  >
                    {plan.ctaLabel}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Annual saving note */}
          <p className="text-center text-sm mt-8" style={{ color: 'var(--color-muted-foreground)' }}>
            Save 20% with annual billing. All plans include a 7-day free trial.
          </p>
        </div>
      </section>
    </div>
  );
}
