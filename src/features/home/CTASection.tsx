import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background)' }}>
      <div className="container-app">
        <div
          className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
          style={{ background: 'var(--gradient-hero)' }}
        >
          {/* Background decoration */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(124,58,237,0.15) 0%, transparent 50%)',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              Join 250,000+ students achieving their goals
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
              Ready to Reach Your Best Score?
            </h2>
            <p className="text-lg mb-10 opacity-80">
              Start free today. No credit card required. Access hundreds of practice questions immediately.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold"
                  style={{ background: 'rgba(255,255,255,1)', color: 'var(--color-primary)' }}
                >
                  Start Learning Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base font-semibold bg-transparent text-white hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
