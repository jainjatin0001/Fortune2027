import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Brain, Target, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { QuizInterface } from '@/components/shared/QuizInterface';
import { getDemoQuestions } from '../../../../data/demo';

export const metadata: Metadata = {
  title: 'ACT Preparation',
  description: 'Comprehensive ACT prep for all four sections. Average improvement: +6 composite points.',
};

const actSections = [
  { name: 'English', questions: 75, minutes: 45, topics: ['Usage & Mechanics', 'Rhetorical Skills', 'Punctuation', 'Strategy'], color: 'var(--color-act)' },
  { name: 'Mathematics', questions: 60, minutes: 60, topics: ['Pre-Algebra', 'Algebra', 'Coordinate Geometry', 'Plane Geometry', 'Trigonometry'], color: 'var(--color-sat)' },
  { name: 'Reading', questions: 40, minutes: 35, topics: ['Literary Narrative', 'Social Science', 'Humanities', 'Natural Science'], color: 'var(--color-ap)' },
  { name: 'Science', questions: 40, minutes: 35, topics: ['Data Representation', 'Research Summaries', 'Conflicting Viewpoints'], color: 'var(--color-coding)' },
];

export default async function ACTPage() {
  const actQuestions = getDemoQuestions('ACT_PREP');

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <section className="hero-bg py-20">
        <div className="container-app">
          <div className="max-w-3xl">
            <span className="text-label mb-4 block" style={{ color: '#93c5fd' }}>ACT PREPARATION</span>
            <h1 className="text-hero text-white mb-6">
              Ace the ACT with{' '}
              <span className="gradient-text-accent">Targeted Prep</span>
            </h1>
            <p className="text-body-lg mb-8" style={{ color: 'rgba(203,213,225,0.9)' }}>
              Comprehensive ACT prep covering all four sections — English, Math, Reading, and Science. Average student improvement: +6 composite points.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="text-white font-semibold" style={{ background: 'var(--gradient-accent)' }}>
                  Start ACT Prep Free <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-8">
              {['+6 avg composite improvement', '800+ practice questions', '8 full mock ACTs'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(203,213,225,0.9)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-app">
          <SectionHeader eyebrow="ACT Structure" title="Four Sections, One Score" subtitle="The ACT scores each section 1–36. Your composite score is the average of all four." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actSections.map((s) => (
              <div key={s.name} className="card-base p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-bold text-white" style={{ background: s.color }}>
                  {s.name.charAt(0)}
                </div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--color-foreground)' }}>{s.name}</h3>
                <div className="flex gap-3 text-xs mb-3" style={{ color: 'var(--color-muted-foreground)' }}>
                  <span>{s.questions} Qs</span>
                  <span><Clock className="h-3 w-3 inline mr-0.5" />{s.minutes} min</span>
                </div>
                <ul className="space-y-1">
                  {s.topics.map((t) => (
                    <li key={t} className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                      <CheckCircle className="h-3 w-3 shrink-0" style={{ color: s.color }} />{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader eyebrow="Try It Now" title="Practice ACT Questions" subtitle="Sample questions — no account required." />
          {actQuestions.length > 0 && <QuizInterface questions={actQuestions.slice(0, 3)} title="ACT Practice Quiz" />}
        </div>
      </section>
    </div>
  );
}
