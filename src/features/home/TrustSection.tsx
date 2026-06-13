import { Shield, CheckCircle, Star, Clock } from 'lucide-react';

const trustPoints = [
  { icon: Shield, title: 'College Board Aligned', desc: 'Content mirrors actual SAT & AP curriculum.' },
  { icon: CheckCircle, title: 'ACT Official Standards', desc: 'Comprehensive coverage of all ACT test areas.' },
  { icon: Star, title: '18,000+ Five-Star Reviews', desc: 'Consistently top-rated by students & parents.' },
  { icon: Clock, title: 'Study at Your Own Pace', desc: 'Access content any time, on any device.' },
];

export function TrustSection() {
  return (
    <section className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
      <div className="container-app">
        {/* Partners strip */}
        <div className="text-center mb-10">
          <p className="text-label mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
            Trusted by Students Preparing For
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {['SAT®', 'ACT®', 'AP®', 'IB', 'PSAT', 'CLEP'].map((exam) => (
              <span
                key={exam}
                className="text-lg font-black tracking-wider"
                style={{ color: 'var(--color-foreground)' }}
              >
                {exam}
              </span>
            ))}
          </div>
        </div>

        {/* Trust points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {trustPoints.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 items-start">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>{title}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
