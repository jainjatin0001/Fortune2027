import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { QuizInterface } from '@/components/shared/QuizInterface';
import { getDemoQuestions } from '../../../../data/demo';

export const metadata: Metadata = {
  title: 'AP Exam Preparation',
  description: 'Comprehensive AP preparation for 20+ subjects. 98% pass rate among EduReach students.',
};

const apSubjects = [
  { name: 'Calculus AB', difficulty: 'Hard', enrolled: 21000 },
  { name: 'Calculus BC', difficulty: 'Expert', enrolled: 14000 },
  { name: 'US History', difficulty: 'Hard', enrolled: 15000 },
  { name: 'World History', difficulty: 'Hard', enrolled: 12000 },
  { name: 'Biology', difficulty: 'Hard', enrolled: 17000 },
  { name: 'Chemistry', difficulty: 'Expert', enrolled: 11000 },
  { name: 'Physics 1', difficulty: 'Hard', enrolled: 13000 },
  { name: 'Physics C', difficulty: 'Expert', enrolled: 8000 },
  { name: 'English Language', difficulty: 'Medium', enrolled: 19000 },
  { name: 'English Literature', difficulty: 'Hard', enrolled: 16000 },
  { name: 'Psychology', difficulty: 'Easy', enrolled: 22000 },
  { name: 'Computer Science A', difficulty: 'Medium', enrolled: 18000 },
  { name: 'Statistics', difficulty: 'Medium', enrolled: 20000 },
  { name: 'Environmental Science', difficulty: 'Medium', enrolled: 14000 },
  { name: 'Government & Politics', difficulty: 'Medium', enrolled: 15000 },
  { name: 'Economics (Macro)', difficulty: 'Medium', enrolled: 13000 },
  { name: 'Spanish Language', difficulty: 'Hard', enrolled: 10000 },
  { name: 'French Language', difficulty: 'Hard', enrolled: 7000 },
  { name: 'Human Geography', difficulty: 'Easy', enrolled: 17000 },
  { name: 'Art History', difficulty: 'Medium', enrolled: 6000 },
];

const diffColors: Record<string, string> = {
  Easy: 'difficulty-easy',
  Medium: 'difficulty-medium',
  Hard: 'difficulty-hard',
  Expert: 'difficulty-expert',
};

export default async function APPage() {
  const apQuestions = getDemoQuestions('AP_EXAM');

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <section className="hero-bg py-20">
        <div className="container-app max-w-3xl">
          <span className="text-label mb-4 block" style={{ color: '#93c5fd' }}>AP EXAM PREPARATION</span>
          <h1 className="text-hero text-white mb-6">
            Earn College Credit with{' '}
            <span className="gradient-text-accent">5-Score Prep</span>
          </h1>
          <p className="text-body-lg mb-8" style={{ color: 'rgba(203,213,225,0.9)' }}>
            Expert-designed prep for 20+ AP subjects. Our students achieve a 98% pass rate and a 67% rate of scoring a 5.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-white font-semibold" style={{ background: 'var(--gradient-accent)' }}>
                Start AP Prep <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 mt-8">
            {['20+ AP subjects', '98% pass rate', '67% score a 5'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(203,213,225,0.9)' }}>
                <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-app">
          <SectionHeader eyebrow="AP Subjects" title="20+ Subjects Covered" subtitle="Click any subject to begin your AP preparation." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {apSubjects.map((subject) => (
              <Link
                key={subject.name}
                href={`/ap-prep/${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="card-base p-4 group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-4 w-4 shrink-0" style={{ color: 'var(--color-ap)' }} />
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${diffColors[subject.difficulty]}`}>
                    {subject.difficulty}
                  </span>
                </div>
                <h3 className="text-sm font-semibold group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>
                  AP {subject.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                  {subject.enrolled.toLocaleString()} enrolled
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader eyebrow="Try It Now" title="Practice AP Questions" />
          {apQuestions.length > 0 && <QuizInterface questions={apQuestions.slice(0, 3)} title="AP Practice Quiz" />}
        </div>
      </section>
    </div>
  );
}
