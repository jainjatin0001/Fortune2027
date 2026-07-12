'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const badges = [
  'Real Exam Interface',
  'Timed Section Tests',
  'Instant Results',
  'Detailed Explanations',
];

export function PracticeTestBanner() {
  const { isSignedIn } = useAuth();
  const ctaHref = isSignedIn ? '/dashboard/sat-exam' : '/sign-up';

  return (
    <section
      className="py-6"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle radial glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          'radial-gradient(ellipse at 5% 50%, rgba(59,130,246,0.18) 0%, transparent 45%), radial-gradient(ellipse at 95% 50%, rgba(124,58,237,0.12) 0%, transparent 45%)',
      }} />

      <div className="container-app relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* Left — Laptop mockup */}
          <div className="shrink-0 relative">
            {/* Laptop frame */}
            <div className="relative">
              {/* Screen bezel */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  width: '380px',
                  background: '#1e293b',
                  border: '3px solid #334155',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                  padding: '5px',
                }}
              >
                {/* Screen — light-themed interface */}
                <div className="rounded-lg overflow-hidden" style={{ background: '#f8fafc' }}>
                  {/* Browser top bar */}
                  <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-2 h-3.5 rounded text-[7px] flex items-center px-2" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                      deltatutors.us/sat-practice
                    </div>
                  </div>

                  {/* Test interface content */}
                  <div className="p-2.5">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/logos/logo_5.png" alt="Delta Tutors" className="w-4 h-4 object-contain rounded" />
                        <span className="text-[9px] font-bold" style={{ color: '#0f172a' }}>SAT Practice Test — Section 2</span>
                      </div>
                      <div className="text-[8px] font-semibold px-1.5 py-0.5 rounded" style={{ background: '#fef3c7', color: '#d97706' }}>
                        ⏱ 32:14
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 rounded-full mb-2" style={{ background: '#e2e8f0' }}>
                      <div className="h-full rounded-full w-[55%]" style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />
                    </div>

                    {/* Question label */}
                    <div className="text-[9px] font-semibold mb-1" style={{ color: '#475569' }}>Question 14 of 27 — Reading & Writing</div>

                    {/* Options — compact */}
                    {['A) had been studying', 'B) studies', 'C) was studying', 'D) has studied'].map((opt, i) => (
                      <div
                        key={opt}
                        className="flex items-center gap-1.5 mb-1 px-2 py-0.5 rounded text-[8px]"
                        style={{
                          background: i === 2 ? '#dbeafe' : '#f8fafc',
                          border: i === 2 ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                          color: i === 2 ? '#1d4ed8' : '#475569',
                          fontWeight: i === 2 ? 600 : 400,
                        }}
                      >
                        {opt}
                      </div>
                    ))}

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-1.5 pt-1.5" style={{ borderTop: '1px solid #e2e8f0' }}>
                      <span className="text-[8px]" style={{ color: '#94a3b8' }}>14 / 27 answered</span>
                      <div className="text-[8px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                        Next →
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop hinge + base */}
              <div className="mx-6 h-2 rounded-t-none rounded-b-md" style={{ background: '#1e293b', border: '1px solid #334155' }} />
              <div className="mx-2 h-3 rounded-b-xl" style={{ background: '#0f172a', border: '1px solid #1e293b' }} />
            </div>
          </div>

          {/* Center — text + badges */}
          <div className="flex-1 text-center lg:text-left">
            {/* New chip */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              New
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
              Real Practice. Real Results.
            </h2>
            <p className="text-base mb-6" style={{ color: 'rgba(203,213,225,0.85)' }}>
              Experience the real SAT &amp; ACT test interface with full-length, timed practice tests.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start">
              {badges.map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#86efac' }}>
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right — CTA */}
          <div className="shrink-0">
            <Link href={ctaHref}>
              <Button
                size="lg"
                className="h-12 px-8 font-semibold text-base whitespace-nowrap"
                style={{ background: '#ffffff', color: '#1e3a8a' }}
              >
                Try Full Practice Test
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
