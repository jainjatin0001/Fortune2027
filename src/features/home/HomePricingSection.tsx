'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Clock, CalendarDays, Users, Shield,
  Award, RefreshCw, Tag, MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ContactModal } from '@/components/shared/ContactModal';
import { HOURLY_RATE } from '@/constants';

const structuredFeatures = [
  { title: 'Live 1:1 Expert Tutoring', sub: 'Regular personalized sessions' },
  { title: 'Complete Course Access', sub: 'All modules & question banks' },
  { title: 'Full-Length Tests & Quizzes', sub: 'SAT, ACT & AP full-length exams' },
  { title: 'Priority Support', sub: 'Email & WhatsApp support' },
  { title: 'Detailed Progress Tracking', sub: 'Dashboard + parent reports' },
  { title: 'Study Roadmaps', sub: 'Custom plan based on your goals' },
];

const paygoFeatures = [
  'Expert tutors, on your schedule',
  'No monthly commitment',
  'Ideal for doubt clearing & short-term help',
  'Available for SAT, ACT, AP & Coding',
];

const trustBadges = [
  { icon: Shield,     title: 'Secure & Safe',       sub: 'Your data is always protected' },
  { icon: Award,      title: 'Expert Instructors',   sub: 'From IITs & top institutes' },
  { icon: RefreshCw,  title: '30-Day Refund',        sub: "Not satisfied? We've got you." },
  { icon: Tag,        title: 'No Hidden Fees',       sub: 'Transparent pricing always' },
];

export function HomePricingSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="section-padding" style={{ background: 'var(--color-background-alt)' }}>
      <div className="container-app">
        <SectionHeader
          eyebrow="Flexible Learning Options"
          title="Plans That Fit Every Goal"
          subtitle="Choose a structured program for consistent support or pay only when you need expert help."
        />

        <ContactModal open={modalOpen} onOpenChange={setModalOpen} />

        {/* Two-panel card */}
        <div
          className="rounded-2xl overflow-hidden mb-4 relative"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div className="grid lg:grid-cols-2">

            {/* Left — Structured Programs */}
            <div className="p-8 lg:p-10" style={{ borderRight: '1px solid var(--color-border)' }}>
              {/* Icon + heading */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-primary-light)' }}>
                  <CalendarDays className="h-7 w-7" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold mb-0.5" style={{ color: 'var(--color-foreground)' }}>
                    Structured Programs
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
                    Best for consistent progress &amp; higher scores
                  </p>
                </div>
              </div>

              {/* Features — 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                {structuredFeatures.map(({ title, sub }) => (
                  <div key={title} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{title}</div>
                      <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust strip */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--color-primary-light)' }}>
                <Users className="h-5 w-5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <div>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
                    Trusted by{' '}
                    <span style={{ color: 'var(--color-accent)' }}> Students &amp; Parents</span>
                  </span>
                  <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Across the US &amp; Canada</div>
                </div>
              </div>
            </div>

            {/* Right — Pay-As-You-Go */}
            <div className="p-8 lg:p-10 relative">
              {/* Icon + heading */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-warning-light)' }}>
                  <Clock className="h-7 w-7" style={{ color: 'var(--color-warning)' }} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold mb-0.5" style={{ color: 'var(--color-foreground)' }}>
                    Pay-As-You-Go
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-warning)' }}>
                    Pay only for the help you need
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-1 mb-5">
                <span className="text-5xl font-black" style={{ color: 'var(--color-warning)' }}>
                  ${HOURLY_RATE}
                </span>
                <span className="text-base font-medium pb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>/hour</span>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {paygoFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-warning)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Help box */}
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--color-warning-light)' }}>
                <MessageCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'var(--color-warning)' }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    Need help choosing the right option?
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    Our academic advisors are here to help.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OR circle between panels — desktop only */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm z-10"
            style={{ background: 'var(--color-card)', border: '2px solid var(--color-border)', color: 'var(--color-muted-foreground)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            OR
          </div>
        </div>

        {/* Bottom advisor CTA */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
        >
          {/* Left info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-primary-light)' }}>
              <Users className="h-7 w-7" style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h4 className="font-extrabold text-base" style={{ color: 'var(--color-foreground)' }}>Talk to an Advisor</h4>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                Get personalized guidance and find the best plan for your child&apos;s success.
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              className="h-12 px-6 font-semibold gap-2"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #2563eb)', color: '#fff' }}
              onClick={() => setModalOpen(true)}
            >
              <CalendarDays className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-bold leading-none">Contact an Advisor</div>
                <div className="text-[10px] opacity-80 mt-0.5">Free Consultation</div>
              </div>
            </Button>

            <Link href="/pricing">
              <Button
                variant="outline"
                className="h-12 px-6 font-semibold gap-2"
                style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
              >
                <Tag className="h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-bold leading-none">View Pricing Plans</div>
                  <div className="text-[10px] opacity-70 mt-0.5">See all plans &amp; features</div>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust badges row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {trustBadges.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary-light)' }}>
                <Icon className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{title}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
