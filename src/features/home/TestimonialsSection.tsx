import { Star, Quote } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { TESTIMONIALS } from '@/constants';

export function TestimonialsSection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background)' }}>
      <div className="container-app">
        <SectionHeader
          eyebrow="Student Stories"
          title="Real Results, Real Students"
          subtitle="Join hundreds of thousands of students who improved their scores and launched their careers with EduReach."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="card-base p-6 flex flex-col">
              {/* Quote icon */}
              <Quote className="h-6 w-6 mb-4 opacity-30" style={{ color: 'var(--color-primary)' }} />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
                "{t.content}"
              </p>

              {/* Score badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
              >
                <span>{t.score}</span>
                <span>·</span>
                <span className="text-green-600">{t.improvement}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{t.school}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
