import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, BookOpen, Star,
  Rocket, GraduationCap, Briefcase, Lightbulb,
  Users, Trophy, Code2, Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { formatPrice, getCategoryBadgeClass, getCategoryLabel } from '@/lib/utils';

const codingGradient = 'linear-gradient(135deg, #059669 0%, #047857 100%)';

export const metadata: Metadata = {
  title: 'Coding Courses',
  description: 'Learn Python, Machine Learning, Data Science, and Web Development. Project-based courses for high school students.',
};

const stats = [
  { icon: Users,    value: '500+',    label: 'Students Enrolled' },
  { icon: Code2,    value: '1,200+',  label: 'Projects Built' },
  { icon: BookOpen, value: '25,000+', label: 'Coding Exercises Solved' },
  { icon: Trophy,   value: '95%',     label: 'Completion Rate' },
];

const benefits = [
  {
    icon: Rocket,
    title: 'Build Real Skills',
    desc: 'Work on real-world projects and strengthen problem-solving abilities.',
    color: 'var(--color-coding)',
    light: 'var(--color-coding-light)',
  },
  {
    icon: GraduationCap,
    title: 'Boost College Applications',
    desc: 'Create an impressive portfolio that stands out in college admissions.',
    color: 'var(--color-sat)',
    light: 'var(--color-sat-light)',
  },
  {
    icon: Briefcase,
    title: 'Prepare for Future Careers',
    desc: 'High-demand coding skills for careers in tech, AI, data, and beyond.',
    color: 'var(--color-act)',
    light: 'var(--color-act-light)',
  },
  {
    icon: Lightbulb,
    title: 'Think Better, Solve Better',
    desc: 'Improve logical thinking and approach challenges with confidence.',
    color: 'var(--color-ap)',
    light: 'var(--color-ap-light)',
  },
];

const journeySteps = [
  { step: '01', icon: Code2,        title: 'Foundations',     desc: 'Learn Python basics and build confidence.' },
  { step: '02', icon: BookOpen,     title: 'Data Structures', desc: 'Master core concepts and solve problems.' },
  { step: '03', icon: Rocket,       title: 'Projects',        desc: 'Build real-world projects and gain experience.' },
  { step: '04', icon: Lightbulb,    title: 'Advanced Topics', desc: 'Explore AI, ML, and advanced algorithms.' },
  { step: '05', icon: Trophy,       title: 'Career Ready',    desc: 'Prepare for interviews, Internships & beyond.' },
];

const stepColors = [
  { color: 'var(--color-coding)',     light: 'var(--color-coding-light)' },
  { color: 'var(--color-sat)',        light: 'var(--color-sat-light)' },
  { color: 'var(--color-act)',        light: 'var(--color-act-light)' },
  { color: 'var(--color-ap)',         light: 'var(--color-ap-light)' },
  { color: 'var(--color-highschool)', light: 'var(--color-highschool-light)' },
];

const testimonials = [
  {
    quote: 'Delta Tutors helped me build my first ML project which really impressed the colleges I applied to!',
    name: 'Jason L.',
    school: 'University of Toronto',
    flag: '🇨🇦',
  },
  {
    quote: 'The Python bootcamp is super well structured and beginner friendly.',
    name: 'Emily R.',
    school: 'UC Berkeley',
    flag: '🇺🇸',
  },
  {
    quote: 'The coding challenges help me stay consistent and keep improving every day!',
    name: 'Daniel M.',
    school: 'McGill University',
    flag: '🇨🇦',
  },
];

async function getCodingCourses() {
  try {
    const rows = await prisma.course.findMany({
      where: {
        isPublished: true,
        program: { OR: [{ slug: { contains: 'cod' } }, { name: { contains: 'Coding' } }, { name: { contains: 'coding' } }] },
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

export default async function CodingPage() {
  const [user, codingCourses] = await Promise.all([currentUser(), getCodingCourses()]);
  const practiceHref = user ? '/dashboard' : '/sign-up';

  return (
    <div style={{ background: 'var(--color-background)' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero-bg" style={{ paddingBlock: '5rem 5rem' }}>
        <div className="container-app">

          {/* Two-column: text + code editor */}
          <div className="grid lg:grid-cols-2 gap-12 items-center pb-0">

            {/* Left: text */}
            <div>
              <span className="text-label mb-4 block" style={{ color: '#93c5fd' }}>CODING COURSES</span>
              <h1 className="text-hero text-white mb-5">
                Learn Coding.{' '}
                <span className="gradient-text-accent">Build Your Future.</span>
              </h1>
              <p className="text-body-lg mb-8" style={{ color: 'rgba(203,213,225,0.85)' }}>
                Build the coding, problem-solving, and AI skills that top universities and tomorrow's world demand.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/courses">
                  <Button size="lg" className="font-semibold text-white" style={{ background: 'var(--gradient-accent)' }}>
                    Explore Courses <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href={practiceHref}>
                  <Button
                    size="lg"
                    className="font-semibold text-white"
                    style={{
                      background: 'transparent',
                      border: '1.5px solid rgba(255,255,255,0.55)',
                    }}
                  >
                    Try Coding Practice
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-5">
                {['No Install Required', 'Beginner to Advanced', 'US & Canada Curriculum'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(203,213,225,0.9)' }}>
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: code editor mockup */}
            <div className="hidden lg:flex justify-end">
              <div className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl" style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#2d2d2d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>fibonacci.py</span>
                </div>
                {/* Code body */}
                <div className="p-5 font-mono text-sm leading-7" style={{ color: '#d4d4d4' }}>
                  <div><span style={{ color: '#569cd6' }}>def</span> <span style={{ color: '#dcdcaa' }}>fibonacci</span><span style={{ color: '#d4d4d4' }}>(n):</span></div>
                  <div className="pl-6"><span style={{ color: '#9cdcfe' }}>a</span>, <span style={{ color: '#9cdcfe' }}>b</span> <span style={{ color: '#d4d4d4' }}>=</span> <span style={{ color: '#b5cea8' }}>0</span>, <span style={{ color: '#b5cea8' }}>1</span></div>
                  <div className="pl-6"><span style={{ color: '#9cdcfe' }}>result</span> <span style={{ color: '#d4d4d4' }}>=</span> <span style={{ color: '#d4d4d4' }}>[]</span></div>
                  <div className="pl-6"><span style={{ color: '#c586c0' }}>for</span> <span style={{ color: '#9cdcfe' }}>_</span> <span style={{ color: '#c586c0' }}>in</span> <span style={{ color: '#dcdcaa' }}>range</span><span style={{ color: '#d4d4d4' }}>(n):</span></div>
                  <div className="pl-12"><span style={{ color: '#9cdcfe' }}>result</span><span style={{ color: '#d4d4d4' }}>.</span><span style={{ color: '#dcdcaa' }}>append</span><span style={{ color: '#d4d4d4' }}>(a)</span></div>
                  <div className="pl-12"><span style={{ color: '#9cdcfe' }}>a</span>, <span style={{ color: '#9cdcfe' }}>b</span> <span style={{ color: '#d4d4d4' }}>=</span> <span style={{ color: '#9cdcfe' }}>b</span>, <span style={{ color: '#9cdcfe' }}>a</span> <span style={{ color: '#d4d4d4' }}>+</span> <span style={{ color: '#9cdcfe' }}>b</span></div>
                  <div className="pl-6"><span style={{ color: '#c586c0' }}>return</span> <span style={{ color: '#9cdcfe' }}>result</span></div>
                  <div className="mt-2"><span style={{ color: '#dcdcaa' }}>print</span><span style={{ color: '#d4d4d4' }}>(</span><span style={{ color: '#dcdcaa' }}>fibonacci</span><span style={{ color: '#d4d4d4' }}>(</span><span style={{ color: '#b5cea8' }}>13</span><span style={{ color: '#d4d4d4' }}>))</span></div>
                </div>
                {/* Run output */}
                <div className="mx-4 mb-4 px-4 py-2 rounded-lg flex items-center gap-3" style={{ background: '#0d3321' }}>
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                  <span className="font-mono text-xs" style={{ color: '#4ade80' }}>
                    # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Stats — overlaps hero bottom / next section top ───── */}
      <div className="relative z-10 container-app" style={{ marginTop: '-3.5rem' }}>
        <div
          className="card-base grid grid-cols-2 md:grid-cols-4 shadow-xl overflow-hidden"
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              className="flex items-center gap-4 px-6 py-6"
              style={{
                borderRight: i < 3 ? '1px solid var(--color-border)' : undefined,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-coding-light)', color: 'var(--color-coding)' }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-black" style={{ color: 'var(--color-foreground)' }}>{value}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Learn Coding ──────────────────────────────────── */}
      <section className="section-padding" style={{ paddingTop: '6rem' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="Why Learn Coding?"
            title="Skills that open doors"
            subtitle="Coding is the most in-demand skill of the 21st century. Here's why students choose Delta Tutors."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, desc, color, light }) => (
              <div key={title} className="card-base p-6 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: light, color }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coding Journey ────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader
            eyebrow="Your Coding Journey"
            title="A clear path from beginner to advanced"
            subtitle="Follow our structured curriculum and go from zero to career-ready, step by step."
          />
          <div className="relative">
            <div
              className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px"
              style={{ background: 'var(--color-border)' }}
            />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative">
              {journeySteps.map(({ step, icon: Icon, title, desc }, i) => {
                const { color, light } = stepColors[i];
                return (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div
                      className="w-20 h-20 rounded-full flex flex-col items-center justify-center mb-4 border-4 z-10"
                      style={{ background: light, borderColor: color }}
                    >
                      <span className="text-xs font-black" style={{ color }}>{step}</span>
                      <Icon className="h-5 w-5 mt-0.5" style={{ color }} />
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>{title}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses ───────────────────────────────────────────── */}
      {codingCourses.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--color-background)' }}>
          <div className="container-app">
            <SectionHeader
              eyebrow="Popular Courses"
              title="Start learning with our top courses"
              subtitle="Hands-on, project-based coding courses built for high school and college students."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {codingCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="card-base overflow-hidden group block">
                  <div className="h-40 relative" style={{ background: codingGradient }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white opacity-30" />
                    </div>
                    {course.isFree && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white bg-green-600">FREE</span>
                    )}
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getCategoryBadgeClass('CODING')}`}>
                      {getCategoryLabel('CODING')}
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
                <Button variant="outline" size="lg" className="gap-2">
                  View All Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader eyebrow="What Students Say" title="Loved by students across the US & Canada" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, school, flag }) => (
              <div key={name} className="card-base p-6 flex flex-col gap-4">
                <Quote className="h-7 w-7 shrink-0" style={{ color: 'var(--color-coding)' }} />
                <p className="text-sm flex-1" style={{ color: 'var(--color-muted-foreground)' }}>&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: codingGradient }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{name}</div>
                    <div className="text-xs flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                      {school} <span>{flag}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section
        className="py-10"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
      >
        <div className="container-app">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-heading-2 text-white mb-1">Ready to start your coding journey?</h2>
              <p style={{ color: 'rgba(219,234,254,0.85)' }}>Join hundreds of students and start building your future today.</p>
            </div>
            <div className="shrink-0">
              <Link href={practiceHref}>
                <Button
                  size="lg"
                  className="font-semibold"
                  style={{ background: '#ffffff', color: '#1e3a8a' }}
                >
                  Start Free Practice <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
