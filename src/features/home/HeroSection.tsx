'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Award, Play, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STATS } from '@/constants';

export function HeroSection() {
  return (
    <section className="hero-bg min-h-[calc(100vh-72px)] flex items-center py-20">
      <div className="container-app relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#93c5fd',
              }}
            >
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              Trusted by 250,000+ students in the US & Canada
            </div>

            <h1 className="text-hero text-white mb-6 leading-[1.1]">
              Achieve Your{' '}
              <span className="gradient-text-accent">Best Score</span>{' '}
              on the SAT, ACT & AP
            </h1>

            <p className="text-body-lg mb-10" style={{ color: 'rgba(203, 213, 225, 0.9)' }}>
              Personalized study plans, 500+ practice tests, and expert-designed courses for SAT, ACT, AP Exams, and Coding — all in one premium platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="text-white font-semibold text-base px-8 h-12"
                  style={{ background: 'var(--gradient-accent)' }}
                >
                  Start Learning Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 font-semibold text-base px-8"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(148, 163, 184, 0.9)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Visual Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            {/* Main card */}
            <div
              className="card-glass p-6 rounded-2xl mb-4"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--color-sat-light)', color: 'var(--color-sat)' }}>
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">SAT Score Progress</div>
                  <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.8)' }}>Last 30 days</div>
                </div>
                <div className="ml-auto text-green-400 text-sm font-bold">+180</div>
              </div>
              {/* Fake progress bars */}
              {[
                { label: 'Math', score: 780, max: 800, color: '#7c3aed' },
                { label: 'Reading & Writing', score: 740, max: 800, color: '#2563eb' },
              ].map((s) => (
                <div key={s.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'rgba(203, 213, 225, 0.8)' }}>{s.label}</span>
                    <span className="text-white font-medium">{s.score}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(s.score / s.max) * 100}%`,
                        background: s.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Floating cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: '250K+ Students', sub: 'Across US & Canada', color: '#059669' },
                { icon: Award, label: '98% Pass Rate', sub: 'Score improvement', color: '#7c3aed' },
                { icon: Star, label: '4.9/5 Rating', sub: '18,000+ reviews', color: '#d97706' },
                { icon: TrendingUp, label: 'Avg +220 SAT', sub: 'In 3 months', color: '#0891b2' },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div
                  key={label}
                  className="card-glass p-4 rounded-xl"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ background: `${color}20`, color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-white text-sm font-semibold">{label}</div>
                  <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>{sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
