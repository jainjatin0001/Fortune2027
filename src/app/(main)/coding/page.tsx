import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Code2, Brain, BarChart2, Globe, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { QuizInterface } from '@/components/shared/QuizInterface';
import { getDemoQuestions } from '../../../../data/demo';

export const metadata: Metadata = {
  title: 'Coding Courses',
  description: 'Learn Python, Machine Learning, Data Science, and Web Development. Project-based courses for high school students.',
};

const tracks = [
  {
    icon: Code2,
    name: 'Python Programming',
    slug: 'python',
    desc: 'The most in-demand language. Start from zero, build real projects, master OOP and algorithms.',
    level: 'Beginner → Advanced',
    courses: 4,
    color: 'var(--color-coding)',
    light: 'var(--color-coding-light)',
    topics: ['Variables & Data Types', 'Functions & Scope', 'OOP', 'File I/O', 'Libraries & APIs'],
  },
  {
    icon: Brain,
    name: 'Machine Learning',
    slug: 'machine-learning',
    desc: 'Supervised/unsupervised learning, neural networks, and real-world ML projects with scikit-learn and PyTorch.',
    level: 'Intermediate → Expert',
    courses: 3,
    color: 'var(--color-sat)',
    light: 'var(--color-sat-light)',
    topics: ['Linear Regression', 'Classification', 'Neural Networks', 'NLP', 'Model Deployment'],
  },
  {
    icon: BarChart2,
    name: 'Data Science',
    slug: 'data-science',
    desc: 'Python, pandas, matplotlib, SQL, and statistical analysis. Build your data portfolio.',
    level: 'Beginner → Intermediate',
    courses: 3,
    color: 'var(--color-act)',
    light: 'var(--color-act-light)',
    topics: ['pandas & NumPy', 'Data Visualization', 'SQL', 'Statistics', 'EDA Projects'],
  },
  {
    icon: Globe,
    name: 'Web Development',
    slug: 'web-development',
    desc: 'HTML, CSS, JavaScript, React, and Next.js. Ship real full-stack applications.',
    level: 'Beginner → Advanced',
    courses: 5,
    color: 'var(--color-ap)',
    light: 'var(--color-ap-light)',
    topics: ['HTML & CSS', 'JavaScript', 'React', 'Next.js', 'APIs & Databases'],
  },
  {
    icon: Cpu,
    name: 'Computer Science AP',
    slug: 'cs-ap',
    desc: 'Java-based CS fundamentals aligned with the AP Computer Science A curriculum.',
    level: 'Intermediate',
    courses: 2,
    color: 'var(--color-highschool)',
    light: 'var(--color-highschool-light)',
    topics: ['Java Basics', 'OOP', 'Arrays & ArrayLists', 'Recursion', 'Sorting Algorithms'],
  },
];

export default async function CodingPage() {
  const codingQuestions = getDemoQuestions('CODING');

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <section className="hero-bg py-20">
        <div className="container-app max-w-3xl">
          <span className="text-label mb-4 block" style={{ color: '#93c5fd' }}>CODING COURSES</span>
          <h1 className="text-hero text-white mb-6">
            Learn to Code,{' '}
            <span className="gradient-text-accent">Build Your Future</span>
          </h1>
          <p className="text-body-lg mb-8" style={{ color: 'rgba(203,213,225,0.9)' }}>
            Project-based coding courses in Python, Machine Learning, Data Science, and Web Development — designed for high school and college students.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-white font-semibold" style={{ background: 'var(--gradient-accent)' }}>
                Start Coding Free <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 mt-8">
            {['5 coding tracks', '100+ hands-on projects', 'No install required'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(203,213,225,0.9)' }}>
                <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-app">
          <SectionHeader eyebrow="Learning Tracks" title="Five Paths to Your Coding Career" subtitle="Pick a track that matches your goals. Each includes structured lessons, projects, and coding challenges." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map(({ icon: Icon, name, slug, desc, level, courses, color, light, topics }) => (
              <Link key={slug} href={`/coding/${slug}`} className="card-base p-6 group block">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: light, color }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>{name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: light, color }}>{level}</span>
                      <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{courses} courses</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
                <ul className="space-y-1">
                  {topics.map((t) => (
                    <li key={t} className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                      <CheckCircle className="h-3 w-3 shrink-0" style={{ color }} />{t}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader eyebrow="Try It Now" title="Practice Coding Questions" />
          {codingQuestions.length > 0 && <QuizInterface questions={codingQuestions.slice(0, 4)} title="Coding Practice Quiz" />}
        </div>
      </section>
    </div>
  );
}
