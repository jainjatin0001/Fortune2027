import { Monitor, ClipboardList, BookOpen, FileText, MessageCircle, BarChart2, Users, Code2 } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';

const features = [
  {
    number: '1',
    icon: Monitor,
    title: 'Live Exam Interface',
    desc: 'Experience real SAT & ACT test interfaces with full-length, timed practice tests.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    number: '2',
    icon: ClipboardList,
    title: 'Smart Quizzing',
    desc: 'Weekly tests, module quizzes, and custom tests to track your concept mastery.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    number: '3',
    icon: FileText,
    title: 'Question Sets',
    desc: 'Topic-wise question banks for every course & module with detailed explanations.',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    number: '4',
    icon: BookOpen,
    title: 'AP Full-Length Tests',
    desc: 'Full-length AP exam simulations for 20+ subjects with accurate scoring.',
    color: '#0891b2',
    bg: '#ecfeff',
  },
  {
    number: '5',
    icon: MessageCircle,
    title: 'Instant Doubt Support',
    desc: 'Get instant help via Email & WhatsApp. Schedule 1:1 live sessions anytime.',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    number: '6',
    icon: BarChart2,
    title: 'Progress Dashboard',
    desc: 'Track your progress, weak areas, quiz history, and performance across all courses.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    number: '7',
    icon: Users,
    title: 'Expert Instructors',
    desc: 'Learn from IT graduates and industry experts with years of teaching experience.',
    color: '#be185d',
    bg: '#fdf2f8',
  },
  {
    number: '8',
    icon: Code2,
    title: 'In-Demand Skills',
    desc: 'Top courses in AI, ML, Data Science & Coding to build future-ready skills.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding" style={{ background: '#f8fafc' }}>
      <div className="container-app">
        <SectionHeader
          eyebrow="Why Delta Tutors?"
          title="Everything You Need to Succeed"
          subtitle="Powerful tools, expert guidance, and personalized support — all in one platform."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ number, icon: Icon, title, desc, color, bg }) => (
            <div
              key={number}
              className="flex flex-col gap-3 p-5 rounded-2xl bg-white"
              style={{ border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              {/* Circular icon — centered at top */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                style={{ background: bg, color }}
              >
                <Icon className="h-6 w-6" />
              </div>

              {/* Number + title */}
              <h3 className="font-bold text-sm leading-snug" style={{ color: '#0f172a' }}>
                {number}. {title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
