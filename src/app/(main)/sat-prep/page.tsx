import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, TrendingUp, Target, Brain, Trophy, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { formatPrice, getCategoryBadgeClass, getCategoryLabel } from '@/lib/utils';

const satGradient = 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)';

export const metadata: Metadata = {
  title: 'SAT Preparation',
  description: 'Comprehensive SAT prep with 1000+ practice questions, adaptive drills, and 10 full-length mock tests. Average student improvement: +220 points.',
};

const satSections = [
  {
    name: 'Math',
    score: '200–800',
    topics: ['Heart of Algebra', 'Problem Solving & Data Analysis', 'Advanced Math', 'Additional Topics'],
    color: 'var(--color-sat)',
    light: 'var(--color-sat-light)',
  },
  {
    name: 'Reading & Writing',
    score: '200–800',
    topics: ['Craft & Structure', 'Information & Ideas', 'Standard English Conventions', 'Expression of Ideas'],
    color: 'var(--color-act)',
    light: 'var(--color-act-light)',
  },
];

const features = [
  { icon: Brain, title: 'Adaptive Practice Engine', desc: 'Questions adjust to your level and target your weakest areas automatically.' },
  { icon: Target, title: '10 Full-Length Mock SATs', desc: 'Realistic digital SAT simulations with timing and score reporting.' },
  { icon: TrendingUp, title: 'Score Prediction', desc: 'AI-powered score estimator updated after every practice session.' },
  { icon: Trophy, title: 'College Board Aligned', desc: 'All content mirrors actual SAT question types, difficulty distribution, and formats.' },
];

const previewTopics = [
  { section: 'Math', topic: 'Linear Equations', difficulty: 'Medium' },
  { section: 'Math', topic: 'Quadratic Functions', difficulty: 'Hard' },
  { section: 'Reading & Writing', topic: 'Main Idea', difficulty: 'Easy' },
  { section: 'Reading & Writing', topic: 'Subject-Verb Agreement', difficulty: 'Medium' },
];

async function getSATCourses() {
  try {
    const rows = await prisma.course.findMany({
      where: {
        isPublished: true,
        program: { OR: [{ slug: { contains: 'sat' } }, { name: { contains: 'SAT' } }] },
      },
      select: {
        id: true, title: true, slug: true, shortDesc: true,
        difficulty: true, price: true, isFree: true,
        program: { select: { name: true, slug: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      take: 6,
    });
    return rows.map((c) => ({ ...c, price: Number(c.price) }));
  } catch {
    return [];
  }
}

export default async function SATPage() {
  const [user, satCourses] = await Promise.all([currentUser(), getSATCourses()]);
  const isSignedIn = !!user;
  return (
    <div style={{ background: 'var(--color-background)' }}>
      {/* Hero */}
      <section className="hero-bg py-20">
        <div className="container-app">
          <div className="max-w-3xl">
            <span className="text-label mb-4 block" style={{ color: '#93c5fd' }}>
              SAT PREPARATION
            </span>
            <h1 className="text-hero text-white mb-6">
              Conquer the SAT with{' '}
              <span className="gradient-text-accent">Expert Prep</span>
            </h1>
            <p className="text-body-lg mb-8" style={{ color: 'rgba(203,213,225,0.9)' }}>
              Comprehensive preparation for the Digital SAT. 1,400+ practice questions, 10 full-length mock tests, and an adaptive system that improves your weakest areas first.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="text-white font-semibold" style={{ background: 'var(--gradient-accent)' }}>
                  Start SAT Prep Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/sat-exam">
                <Button variant="outline" size="lg" className="bg-transparent text-white hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                  Take Practice Exam
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-8">
              {['+220 avg score improvement', '1,400+ practice questions', '10 mock exams'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(203,213,225,0.9)' }}>
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SAT Sections */}
      <section className="section-padding">
        <div className="container-app">
          <SectionHeader eyebrow="Course Structure" title="What's on the SAT?" subtitle="The Digital SAT has two sections, each scored 200–800 for a max total of 1600." />
          <div className="grid md:grid-cols-2 gap-8">
            {satSections.map((section) => (
              <div key={section.name} className="card-base p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: section.light, color: section.color }}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--color-foreground)' }}>{section.name}</h3>
                    <span className="text-sm font-medium" style={{ color: section.color }}>Score: {section.score}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {section.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                      <CheckCircle className="h-4 w-4 shrink-0" style={{ color: section.color }} />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader eyebrow="Platform Features" title="Everything You Need to Score 1500+" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-base p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAT Courses from DB */}
      {satCourses.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--color-background)' }}>
          <div className="container-app">
            <SectionHeader eyebrow="SAT Courses" title="Enroll in an SAT Course" subtitle="Structured courses to guide you from first lesson to exam day." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {satCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="card-base overflow-hidden group block">
                  <div className="h-40 relative" style={{ background: satGradient }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white opacity-30" />
                    </div>
                    {course.isFree && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white bg-green-600">FREE</span>
                    )}
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getCategoryBadgeClass('SAT_PREP')}`}>
                      {getCategoryLabel('SAT_PREP')}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>
                      {course.title}
                    </h3>
                    {course.shortDesc && (
                      <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--color-muted-foreground)' }}>{course.shortDesc}</p>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>{course.difficulty}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />New
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{course._count.enrollments.toLocaleString()} enrolled</span>
                      <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>{formatPrice(course.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/courses">
                <Button variant="outline" size="lg" className="gap-2">View All Courses <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Practice — conditionally gated */}
      <section className="section-padding">
        <div className="container-app">
          <SectionHeader
            eyebrow="Try It Now"
            title="Practice SAT Questions"
            subtitle={
              isSignedIn
                ? 'You\'re signed in — jump straight into practice.'
                : 'Sign in to access real practice questions with instant feedback and explanations.'
            }
          />
          <div className="max-w-2xl mx-auto">
            {isSignedIn ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: 'var(--color-background-alt)', border: '1px solid var(--color-border)' }}
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
                  Take a timed SAT practice exam with all sections, a question palette, and a full score report.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/dashboard/sat-exam">
                    <Button className="text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                      Start SAT Practice Exam
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
                  style={{ background: 'var(--color-background-alt)', border: '1px dashed var(--color-border)' }}
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
                    Create a free account to access SAT practice questions, timed quizzes, and a full-length practice exam with detailed explanations.
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
      <section className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-narrow text-center">
          <h2 className="text-heading-2 mb-4" style={{ color: 'var(--color-foreground)' }}>
            Ready for a Full Practice SAT?
          </h2>
          <p className="text-body mb-8" style={{ color: 'var(--color-muted-foreground)' }}>
            Take a timed, section-based SAT practice exam with real exam conditions — timer, question palette, and section lockout.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/dashboard/sat-exam">
              <Button size="lg" className="text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                Take Practice SAT Exam
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
