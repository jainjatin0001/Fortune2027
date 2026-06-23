import Link from 'next/link';
import { BookOpen, Calculator, FlaskConical, Code2, GraduationCap, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';

const categories = [
  {
    icon: BookOpen,
    label: 'SAT Prep',
    desc: 'Complete preparation with practice tests, quizzes & strategies.',
    href: '/sat-prep',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    color: 'var(--color-sat)',
    light: 'var(--color-sat-light)',
    stat1: { value: '1600', label: 'Max Score' },
    stat2: { value: '2 Sections', label: '' },
    exploreLabel: 'Explore SAT',
  },
  {
    icon: Calculator,
    label: 'ACT Prep',
    desc: 'Full preparation for all four sections with real-time practice.',
    href: '/act-prep',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
    color: 'var(--color-act)',
    light: 'var(--color-act-light)',
    stat1: { value: '36', label: 'Max Score' },
    stat2: { value: '4 Sections', label: '' },
    exploreLabel: 'Explore ACT',
  },
  {
    icon: FlaskConical,
    label: 'AP Exams',
    desc: '20+ AP subjects with full-length practice tests & detailed content.',
    href: '/ap-prep',
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    color: 'var(--color-ap)',
    light: 'var(--color-ap-light)',
    stat1: { value: '5', label: 'Max Score' },
    stat2: { value: '20+ Subjects', label: '' },
    exploreLabel: 'Explore AP',
  },
  {
    icon: Code2,
    label: 'Coding',
    desc: 'Python, ML, Data Science, Web Dev & Gen AI courses for all levels.',
    href: '/coding',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    color: 'var(--color-coding)',
    light: 'var(--color-coding-light)',
    stat1: { value: '5', label: 'Tracks' },
    stat2: { value: 'Expert-Led', label: '' },
    exploreLabel: 'Explore Coding',
  },
  {
    icon: GraduationCap,
    label: 'High School',
    desc: 'Core subjects to strengthen your foundation and excel academically.',
    href: '/pricing',
    gradient: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
    color: 'var(--color-highschool)',
    light: 'var(--color-highschool-light)',
    stat1: { value: '12+', label: 'Subjects' },
    stat2: { value: 'Grades 8-12', label: '' },
    exploreLabel: 'Explore Now',
  },
];

export function CourseCategoriesSection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
      <div className="container-app">
        <SectionHeader
          eyebrow="Explore Top Courses"
          title="Choose Your Path to Success"
          subtitle="From standardized test prep to coding careers — one platform covers your entire academic journey."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map(({ icon: Icon, label, desc, href, gradient, color, stat1, stat2, exploreLabel }) => (
            <Link
              key={label}
              href={href}
              className="card-base group flex flex-col overflow-hidden"
            >
              {/* Gradient header */}
              <div
                className="h-24 flex items-center justify-center shrink-0"
                style={{ background: gradient }}
              >
                <Icon className="h-10 w-10 text-white opacity-90" />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {label}
                </h3>
                <p
                  className="text-xs leading-relaxed mb-4 flex-1"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  {desc}
                </p>

                {/* Stats */}
                <div
                  className="flex items-center gap-3 mb-4 pb-4"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                  <div>
                    <div className="text-base font-black" style={{ color }}>{stat1.value}</div>
                    <div className="text-[10px]" style={{ color: 'var(--color-muted-foreground)' }}>{stat1.label}</div>
                  </div>
                  <div className="w-px h-6" style={{ background: 'var(--color-border)' }} />
                  <div>
                    <div className="text-base font-black" style={{ color }}>{stat2.value}</div>
                  </div>
                </div>

                {/* CTA */}
                <div
                  className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                  style={{ color }}
                >
                  {exploreLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            View All Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
