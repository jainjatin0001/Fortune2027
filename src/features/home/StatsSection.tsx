import { Users, BookOpen, Star, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: '250,000+', label: 'Students Enrolled', sub: 'Across US & Canada' },
  { icon: TrendingUp, value: '+220', label: 'Average SAT Improvement', sub: 'In 12 weeks of study' },
  { icon: BookOpen, value: '500+', label: 'Practice Tests', sub: 'Updated every semester' },
  { icon: Star, value: '4.9/5', label: 'Average Rating', sub: 'From 18,000+ reviews' },
];

export function StatsSection() {
  return (
    <section
      className="section-padding"
      style={{ background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 50%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(circle at 85% 50%, rgba(124,58,237,0.1) 0%, transparent 50%)',
        }}
      />
      <div className="container-app relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(59, 130, 246, 0.2)' }}
              >
                <Icon className="h-7 w-7 text-blue-300" />
              </div>
              <div className="text-4xl font-black text-white mb-1">{value}</div>
              <div className="text-sm font-semibold text-white mb-0.5">{label}</div>
              <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.8)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
