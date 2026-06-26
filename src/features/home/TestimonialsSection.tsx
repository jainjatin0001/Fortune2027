import { Star } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';

const testimonials = [
  {
    id: '1',
    name: 'Sarah J.',
    role: 'High School Junior',
    flag: '🇺🇸',
    avatarColor: '#7c3aed',
    content:
      '"Delta Tutors helped me improve my SAT score by 220 points. The practice tests were exactly like the real thing — all in one place."',
    rating: 5,
  },
  {
    id: '2',
    name: 'David M.',
    role: 'High School Senior',
    flag: '🇨🇦',
    avatarColor: '#2563eb',
    content:
      '"The detailed explanations and score analytics helped me focus on my weak areas and hit my target score."',
    rating: 5,
  },
  {
    id: '3',
    name: 'Jennifer L.',
    role: 'Parent',
    flag: '🇺🇸',
    avatarColor: '#059669',
    content:
      '"Excellent platform! The live test interface made my daughter feel fully prepared and confident on exam day."',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background)' }}>
      <div className="container-app">
        <SectionHeader
          eyebrow="What Students & Parents Say"
          title="Real Stories from Real Achievers"
          subtitle="Join hundreds of thousands of students who improved their scores and launched their careers with Delta Tutors."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="card-base p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sm leading-relaxed flex-1 mb-6 italic"
                style={{ color: 'var(--color-muted-foreground)' }}
              >
                {t.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: t.avatarColor }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                      {t.name}
                    </span>
                    <span>{t.flag}</span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="w-2 h-2 rounded-full"
              style={{
                background: i === 1 ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
