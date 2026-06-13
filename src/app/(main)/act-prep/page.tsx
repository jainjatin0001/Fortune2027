import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, Lock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { currentUser } from '@clerk/nextjs/server';

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

const previewTopics = [
  { section: 'English', topic: 'Punctuation — Colons', difficulty: 'Easy' },
  { section: 'Mathematics', topic: 'Trigonometry', difficulty: 'Hard' },
  { section: 'Science', topic: 'Data Interpretation', difficulty: 'Medium' },
];

export default async function ACTPage() {
  const user = await currentUser();
  const isSignedIn = !!user;
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
              <Link href="/dashboard/act-exam">
                <Button variant="outline" size="lg" className="text-white" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                  Take Practice Exam
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

      {/* Practice — conditionally gated */}
      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="Try It Now"
            title="Practice ACT Questions"
            subtitle={
              isSignedIn
                ? "You're signed in — jump straight into practice."
                : 'Sign in to access real practice questions with instant feedback and explanations.'
            }
          />
          <div className="max-w-2xl mx-auto">
            {isSignedIn ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--color-primary-light)' }}
                >
                  <Trophy className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="text-heading-3 mb-2" style={{ color: 'var(--color-foreground)' }}>
                  Ready to Practice?
                </h3>
                <p className="text-body mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
                  Take a timed ACT practice exam — English, Math, and Science — with a question palette and full score report.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/dashboard/act-exam">
                    <Button className="text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                      Start ACT Practice Exam
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/demo">
                    <Button variant="outline">Go to Dashboard</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Locked question previews */}
                <div className="space-y-3 mb-6">
                  {previewTopics.map(({ section, topic, difficulty }) => (
                    <div
                      key={topic}
                      className="card-base p-4 flex items-center justify-between opacity-60 select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: 'var(--color-primary-light)' }}
                        >
                          <Lock className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                            {topic}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                            {section} · {difficulty}
                          </p>
                        </div>
                      </div>
                      <Lock className="h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />
                    </div>
                  ))}
                </div>

                {/* Sign-in CTA */}
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{ background: 'var(--color-background)', border: '1px dashed var(--color-border)' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--color-primary-light)' }}
                  >
                    <Lock className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-heading-3 mb-2" style={{ color: 'var(--color-foreground)' }}>
                    Sign in to Practice
                  </h3>
                  <p className="text-body mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
                    Create a free account to access ACT practice questions, timed quizzes, and a full-length section-based practice exam.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/sign-up">
                      <Button className="text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                        Create Free Account
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Take full exam CTA */}
      <section className="section-padding-sm">
        <div className="container-narrow text-center">
          <h2 className="text-heading-2 mb-4" style={{ color: 'var(--color-foreground)' }}>
            Ready for a Full Practice ACT?
          </h2>
          <p className="text-body mb-8" style={{ color: 'var(--color-muted-foreground)' }}>
            Take a timed, section-based ACT practice exam — English, Math, and Science — with real exam conditions and a score report.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/dashboard/act-exam">
              <Button size="lg" className="text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                Take Practice ACT Exam
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" size="lg">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
