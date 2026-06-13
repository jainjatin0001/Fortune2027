import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Target, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about EduReach\'s mission to make premium test prep and coding education accessible to all US and Canadian students.',
};

const values = [
  { icon: Target, title: 'Results-Driven', desc: 'Every feature is designed to improve your score. We measure success by student outcomes, not engagement metrics.' },
  { icon: Users, title: 'Student-First', desc: 'Built with student input. Our curriculum is continuously refined based on real student performance data and feedback.' },
  { icon: Heart, title: 'Accessible Education', desc: 'Premium education shouldn\'t be locked behind expensive tutors. Our free tier ensures every student can start.' },
  { icon: Globe, title: 'US & Canada Focused', desc: 'Designed specifically for North American academic standards, curriculum, and college admissions requirements.' },
];

const team = [
  { name: 'Dr. Sarah Mitchell', role: 'Co-Founder & CEO', bg: '#7c3aed' },
  { name: 'James Park', role: 'Co-Founder & CTO', bg: '#0891b2' },
  { name: 'Dr. Alicia Torres', role: 'Head of Curriculum', bg: '#d97706' },
  { name: 'Ryan Chen', role: 'Lead Data Scientist', bg: '#059669' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--color-background)' }}>
      {/* Hero */}
      <section className="hero-bg section-padding">
        <div className="container-narrow text-center">
          <h1 className="text-hero text-white mb-6">Our Mission</h1>
          <p className="text-xl text-white opacity-80 mb-8 leading-relaxed">
            To make world-class academic preparation accessible to every student in the United States and Canada — regardless of zip code or budget.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="text-white font-semibold" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Join Our Community
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeader eyebrow="Our Story" title="Why We Built EduReach" align="left" />
          <div className="space-y-4 text-body" style={{ color: 'var(--color-muted-foreground)' }}>
            <p>EduReach was founded in 2022 by two former students who experienced firsthand the gap between high-quality SAT tutoring available to wealthy families and the mediocre free resources available to everyone else.</p>
            <p>After achieving top scores through intensive self-study using fragmented, low-quality materials, they set out to build what they wished had existed: a single, beautifully designed platform that combines the depth of expensive private tutoring with the accessibility of a free product.</p>
            <p>Today, EduReach serves over 250,000 students across the US and Canada, with an average SAT score improvement of 220 points and a 98% AP pass rate among active users.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <SectionHeader eyebrow="Our Values" title="What We Stand For" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
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

      {/* Team */}
      <section className="section-padding">
        <div className="container-app">
          <SectionHeader eyebrow="The Team" title="Built by Educators & Engineers" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, bg }) => (
              <div key={name} className="card-base p-6 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl" style={{ background: bg }}>
                  {name.charAt(0)}
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{name}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
