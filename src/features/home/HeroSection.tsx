'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Bell, User } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const trustBadges = [
  'Live Exam Interface',
  'Instant Doubt Support',
  'AI-Powered Practice',
  'Track Progress',
];


export function HeroSection() {
  const { isSignedIn } = useAuth();
  const ctaHref = isSignedIn ? '/dashboard' : '/sign-up';

  return (
    <section className="hero-bg flex items-center py-14">
      <div className="container-app relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center px-4 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-wider"
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#93c5fd',
              }}
            >
              #1 All-in-One Academic Platform for US &amp; Canada Students
            </div>

            <h1 className="text-hero text-white mb-4 leading-[1.1]">
              Achieve Higher.<br />
              Get Ahead.<br />
              <span style={{ color: '#60a5fa' }}>Anywhere.</span>
            </h1>

            <p className="text-body-lg mb-6" style={{ color: 'rgba(203, 213, 225, 0.9)' }}>
              Expert-led preparation for SAT, ACT, AP Exams &amp; Coding.<br className="hidden sm:block" />
              Real practice. Real results. Real success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link href={ctaHref}>
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
                  className="h-12 font-semibold text-base px-8 bg-transparent text-white hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mb-6">
              {trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#86efac' }}>
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  {badge}
                </div>
              ))}
            </div>

            
          </motion.div>

          {/* Right — Dashboard Mockup (light-themed, matches actual product UI) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
              }}
            >
              {/* App top bar — light */}
              <div
                className="px-4 py-2.5 flex items-center gap-3"
                style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}
                >
                  E
                </div>
                <span className="text-sm font-bold" style={{ color: '#0f172a' }}>EduReach</span>
                <div
                  className="flex-1 mx-3 h-7 rounded-lg flex items-center px-3 text-xs"
                  style={{ background: '#e2e8f0', color: '#94a3b8' }}
                >
                  Search courses, topics...
                </div>
                <div className="flex gap-1.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#e2e8f0' }}>
                    <Bell className="h-3.5 w-3.5" style={{ color: '#64748b' }} />
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex">
                {/* Sidebar — light */}
                <div className="w-28 py-3 px-2.5 space-y-0.5 shrink-0" style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                  {[
                    { label: 'Dashboard', active: true },
                    { label: 'My Courses', active: false },
                    { label: 'Quizzes', active: false },
                    { label: 'Progress', active: false },
                    { label: 'Bookmarks', active: false },
                    { label: 'Mock Tests', active: false },
                    { label: 'Settings', active: false },
                    { label: 'Help Center', active: false },
                    { label: 'Sign Out', active: false },
                  ].map(({ label, active }) => (
                    <div
                      key={label}
                      className="text-xs px-2 py-1.5 rounded-md font-medium"
                      style={{
                        background: active ? '#dbeafe' : 'transparent',
                        color: active ? '#1d4ed8' : '#64748b',
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Main dashboard — white */}
                <div className="flex-1 p-4" style={{ background: '#ffffff' }}>
                  <div className="text-sm font-bold mb-0.5" style={{ color: '#0f172a' }}>Welcome back, Alex!</div>
                  <div className="text-xs mb-3" style={{ color: '#94a3b8' }}>Ready to keep going?</div>

                  {/* Stat boxes */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'Course Enrolled', value: '12' },
                      { label: 'Practice Questions', value: '1,428' },
                      { label: 'Total Tests', value: '18' },
                      { label: 'Average Score', value: '78%' },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-lg p-2 text-center"
                        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
                      >
                        <div className="font-black text-sm" style={{ color: '#1e3a8a' }}>{value}</div>
                        <div className="text-[9px] leading-tight mt-0.5" style={{ color: '#94a3b8' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom panels */}
                  <div className="grid grid-cols-5 gap-2.5" style={{ minHeight: '180px' }}>
                    {/* Progress + Activity */}
                    <div className="col-span-3 rounded-lg p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#0f172a' }}>Overall Progress</div>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#64748b' }}>78%</span>
                        <span style={{ color: '#16a34a' }}>+5%</span>
                      </div>
                      <div className="h-1.5 rounded-full mb-2.5" style={{ background: '#e2e8f0' }}>
                        <div className="h-full rounded-full" style={{ width: '78%', background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />
                      </div>

                      <div className="text-xs font-semibold mb-1.5" style={{ color: '#0f172a' }}>Recent Activity</div>
                      {[
                        { label: 'SAT Practice Test Completed', tag: 'SAT', color: '#7c3aed' },
                        { label: 'AP Calculus Quiz Completed', tag: 'AP', color: '#b45309' },
                        { label: 'ACT Math Test Completed', tag: 'ACT', color: '#0891b2' },
                      ].map(({ label, tag, color }) => (
                        <div key={label} className="flex items-center gap-2 mb-1">
                          <div
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                            style={{ background: color }}
                          >
                            {tag}
                          </div>
                          <span className="text-[10px] leading-tight" style={{ color: '#475569' }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Radar chart */}
                    <div
                      className="col-span-2 rounded-lg p-2 flex items-center justify-center"
                      style={{ background: '#f8fafc', border: '1px solid #e2e8f0', minHeight: '180px' }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full max-w-[110px]" style={{ height: '110px' }}>
                        <polygon points="50,8 88,30 88,70 50,92 12,70 12,30" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        <polygon points="50,36 62,43 62,57 50,64 38,57 38,43" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="50" y1="8" x2="50" y2="92" stroke="#e2e8f0" strokeWidth="0.5" />
                        <line x1="12" y1="30" x2="88" y2="70" stroke="#e2e8f0" strokeWidth="0.5" />
                        <line x1="88" y1="30" x2="12" y2="70" stroke="#e2e8f0" strokeWidth="0.5" />
                        <polygon points="50,14 82,34 80,68 50,85 20,66 18,32" fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth="1.5" />
                        {([[50,14],[82,34],[80,68],[50,85],[20,66],[18,32]] as [number,number][]).map(([cx, cy], i) => (
                          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#7c3aed" />
                        ))}
                        <text x="50" y="5" textAnchor="middle" fontSize="6" fill="#94a3b8">Math</text>
                        <text x="95" y="32" textAnchor="start" fontSize="6" fill="#94a3b8">Read</text>
                        <text x="95" y="72" textAnchor="start" fontSize="6" fill="#94a3b8">Write</text>
                        <text x="50" y="99" textAnchor="middle" fontSize="6" fill="#94a3b8">Science</text>
                        <text x="5" y="72" textAnchor="end" fontSize="6" fill="#94a3b8">Hist</text>
                        <text x="5" y="32" textAnchor="end" fontSize="6" fill="#94a3b8">Code</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
