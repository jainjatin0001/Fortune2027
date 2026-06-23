import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background)' }}>
      <div className="container-app">
        <div
          className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(124,58,237,0.15) 0%, transparent 50%)',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Rocket icon */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Rocket className="h-7 w-7 text-white" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
              Ready to Achieve Your Best Score?
            </h2>
            <p className="text-lg mb-10 opacity-80">
              Join 250,000+ students and start your journey today.
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
              <Link href="/courses">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base font-semibold bg-transparent text-white hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
