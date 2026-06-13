import Link from 'next/link';
import { BookOpen, Calculator, FlaskConical, Code2, GraduationCap, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';

const categories = [
  {
    icon: BookOpen,
    label: 'SAT Prep',
    desc: 'Comprehensive Math & Reading/Writing prep with 1000+ practice questions.',
    href: '/sat-prep',
    colorVar: '--color-sat',
    lightVar: '--color-sat-light',
    stats: '1600 max score',
  },
  {
    icon: Calculator,
    label: 'ACT Prep',
    desc: 'Full coverage of English, Math, Reading, Science, and Writing.',
    href: '/act-prep',
    colorVar: '--color-act',
    lightVar: '--color-act-light',
    stats: '36 max score',
  },
  {
    icon: FlaskConical,
    label: 'AP Exams',
    desc: 'Earn college credit early. Courses for 20+ AP subjects with real exam simulation.',
    href: '/ap-prep',
    colorVar: '--color-ap',
    lightVar: '--color-ap-light',
    stats: '20+ subjects',
  },
  {
    icon: Code2,
    label: 'Coding',
    desc: 'Python, ML, Data Science, and Web Development tracks for all levels.',
    href: '/coding',
    colorVar: '--color-coding',
    lightVar: '--color-coding-light',
    stats: '5 tracks',
  },
  {
    icon: GraduationCap,
    label: 'High School',
    desc: 'Core subjects — Algebra, Biology, Chemistry, Physics, History, and more.',
    href: '/subjects',
    colorVar: '--color-highschool',
    lightVar: '--color-highschool-light',
    stats: '12+ subjects',
  },
];

export function CourseCategoriesSection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background)' }}>
      <div className="container-app">
        <SectionHeader
          eyebrow="What We Offer"
          title="Everything You Need to Succeed"
          subtitle="From standardized test prep to coding careers — one platform covers your entire academic journey."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map(({ icon: Icon, label, desc, href, colorVar, lightVar, stats }) => (
            <Link
              key={label}
              href={href}
              className="card-base group p-6 flex flex-col"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{
                  background: `var(${lightVar})`,
                  color: `var(${colorVar})`,
                }}
              >
                <Icon className="h-6 w-6" />
              </div>
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
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    background: `var(${lightVar})`,
                    color: `var(${colorVar})`,
                  }}
                >
                  {stats}
                </span>
                <ArrowRight
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200"
                  style={{ color: `var(${colorVar})` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
