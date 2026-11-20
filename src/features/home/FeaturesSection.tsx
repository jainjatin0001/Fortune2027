import { Monitor, ClipboardList, BookOpen, FileText, MessageCircle, BarChart2, Users, Code2 } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';

const features = [
  {
    number: '1',
    icon: Monitor,
    title: 'Live Exam Interface',
    desc: 'Experience real SAT & ACT test interfaces with full-length, timed practice tests.',
    color: 'var(--color-accent)',
  },
  {
    number: '2',
    icon: ClipboardList,
    title: 'Smart Quizzing',
    desc: 'Weekly tests, module quizzes, and custom tests to track your concept mastery.',
    color: '#7c3aed',
  },
  {
    number: '3',
    icon: FileText,
    title: 'Question Sets',
    desc: 'Topic-wise question banks for every course & module with detailed explanations.',
    color: 'var(--color-warning)',
  },
  {
    number: '4',
    icon: BookOpen,
    title: 'AP Full-Length Tests',
    desc: 'Full-length AP exam simulations for 20+ subjects with accurate scoring.',
    color: '#0891b2',
  },
  {
    number: '5',
    icon: MessageCircle,
    title: 'Instant Doubt Support',
    desc: 'Get instant help via Email & WhatsApp. Schedule 1:1 live sessions anytime.',
    color: '#059669',
  },
  {
    number: '6',
    icon: BarChart2,
    title: 'Progress Dashboard',
    desc: 'Track your progress, weak areas, quiz history, and performance across all courses.',
    color: 'var(--color-accent)',
  },
  {
    number: '7',
    icon: Users,
    title: 'Expert Instructors',
    desc: 'Learn from university graduates and best in class tutors with years of experience.',
    color: '#be185d',
  },
  {
    number: '8',
    icon: Code2,
    title: 'In-Demand Skills',
    desc: 'Top courses in AI, ML, Data Science & Coding to build future-ready skills.',
    color: '#7c3aed',
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
      <div className="container-app">
        <SectionHeader
          eyebrow="Why Delta Tutors?"
          title="Everything You Need to Succeed"
          subtitle="Powerful tools, expert guidance, and personalized support — all in one platform."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ number, icon: Icon, title, desc, color }) => (
            <div
              key={number}
              className="flex flex-col gap-3 p-5 rounded-2xl"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              {/* Circular icon — centered at top */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                // A soft tint of the icon colour works on light and dark backgrounds.
                style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
              >
                <Icon className="h-6 w-6" />
              </div>

              {/* Number + title */}
              <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--color-foreground)' }}>
                {number}. {title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
