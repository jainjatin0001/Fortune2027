import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Play, GraduationCap, BarChart2, Target, Globe,
  Monitor, ClipboardList, BookOpen, FileText, Headphones, LayoutDashboard,
  Users, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us',
  description: "Learn about Delta Tutors's mission to make premium test prep and coding education accessible to all US and Canadian students.",
};

const heroFeatures = [
  { icon: GraduationCap, label: 'Expert-Led',     desc: 'IITians & industry experts',   pos: 'top-left' },
  { icon: Target,        label: 'Personalized',   desc: 'Learning paths that work',     pos: 'top-right' },
  { icon: BarChart2,     label: 'Proven Results', desc: '250,000+ students trust us',   pos: 'bottom-left' },
  { icon: Globe,         label: 'Accessible',     desc: 'Premium education for all',    pos: 'bottom-right' },
];

const features = [
  { icon: Monitor,        label: 'Live Exam Interface',    desc: 'Realistic, full-length SAT, ACT & AP exams with real-time experience.',           color: '#7c3aed', bg: '#ede9fe' },
  { icon: ClipboardList,  label: 'Smart Quizzing',         desc: 'Weekly tests, module tests & custom tests to track your progress.',                color: '#0891b2', bg: '#cffafe' },
  { icon: BookOpen,       label: 'Comprehensive Content',  desc: 'In-depth courses with question sets for each topic & module.',                     color: '#059669', bg: '#d1fae5' },
  { icon: FileText,       label: 'Full-Length AP Tests',   desc: 'Authentic AP exam practice with detailed performance insights.',                   color: '#d97706', bg: '#fef3c7' },
  { icon: Headphones,     label: 'Instant Doubt Support',  desc: 'Get instant help via Email, WhatsApp & priority scheduling.',                     color: '#e11d48', bg: '#ffe4e6' },
  { icon: LayoutDashboard,label: 'Smart Dashboard',        desc: 'Track progress, solve questions & improve in one unified space.',                  color: '#0891b2', bg: '#cffafe' },
];

const values = [
  { icon: Target,     label: 'Results-Driven',       desc: 'We focus on what matters — measurable improvement and real outcomes.',                       color: '#7c3aed', bg: '#ede9fe' },
  { icon: Users,      label: 'Student-First',         desc: 'Every decision we make is centered around student success and growth.',                      color: '#059669', bg: '#d1fae5' },
  { icon: ShieldCheck,label: 'Accessible Excellence', desc: 'Premium education should be accessible to every ambitious student.',                         color: '#d97706', bg: '#fef3c7' },
  { icon: Globe,      label: 'Integrity & Trust',     desc: 'We uphold the highest standards of transparency, honesty, and academic integrity.',          color: '#2563eb', bg: '#dbeafe' },
];

const team = [
  { name: 'Divyansh', role: 'Founder & CEO', school: 'IIT Bombay', prev: 'Ex-Software Engineer, Google',        initials: 'DJ', color: '#1e3a8a', linkedin: 'https://www.linkedin.com/in/jatin-jain' },
  { name: 'Jatin',  role: 'Founder & CTO', school: 'IIT Delhi',  prev: 'Machine Learning Engineer, Meta',    initials: 'JJ', color: '#0f766e', linkedin: 'https://www.linkedin.com/in/divyansh-jain' },
];

const stats = [
  { icon: Users,    value: '250,000+', label: 'Students Empowered' },
  { icon: BarChart2,value: '220+',     label: 'Average SAT Score Increase' },
  { icon: BookOpen, value: '98%',      label: 'AP Pass Rate' },
  { icon: Globe,    value: '2',        label: 'Countries Served US & Canada' },
];

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #0f2050 0%, #17356D 60%, #1a4080 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(124,58,237,0.10) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container-app" style={{ paddingBlock: '4rem', position: 'relative' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left — text */}
            <div>
              <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                About Delta Tutors
              </p>
              <h1 className="text-4xl lg:text-5xl" style={{ color: '#ffffff', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
                Excellence is<br />Our Standard
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '420px' }}>
                Delta Tutors was founded with a simple belief — every student deserves world-class academic preparation, regardless of their background or where they live.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/sign-up">
                  <Button size="lg" style={{ background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, gap: '0.5rem' }}>
                    Start Your Journey <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)', fontWeight: 600, gap: '0.5rem' }}>
                    <Play className="h-4 w-4" style={{ fill: '#fff' }} /> Explore Courses
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — shield + feature nodes (hidden on mobile, shown on lg+) */}
            <div className="hidden lg:flex" style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', minHeight: '360px' }}>
              {/* Center shield */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <Image src="/images/logos/logo_5.png" alt="Delta Tutors Shield" width={180} height={180} style={{ objectFit: 'contain', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }} />
              </div>
              {heroFeatures.map(({ icon: Icon, label, desc, pos }) => {
                const s: React.CSSProperties = { position: 'absolute', display: 'flex', alignItems: 'center', gap: '0.6rem' };
                if (pos === 'top-left')     { s.top = '10%'; s.left = '0'; }
                if (pos === 'top-right')    { s.top = '10%'; s.right = '0'; s.flexDirection = 'row-reverse'; }
                if (pos === 'bottom-left')  { s.bottom = '10%'; s.left = '0'; }
                if (pos === 'bottom-right') { s.bottom = '10%'; s.right = '0'; s.flexDirection = 'row-reverse'; }
                return (
                  <div key={label} style={s}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon className="h-5 w-5" style={{ color: '#f59e0b' }} />
                    </div>
                    <div>
                      <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>{label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', lineHeight: 1.3 }}>{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile-only: 2×2 feature grid below the text */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              {heroFeatures.map(({ icon: Icon, label, desc }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon className="h-4 w-4" style={{ color: '#f59e0b' }} />
                  </div>
                  <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2 }}>{label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', lineHeight: 1.4 }}>{desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section style={{ background: '#ffffff', paddingBlock: '5rem' }}>
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Image */}
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', lineHeight: 0 }}>
              <Image
                src="/images/hero/about_us.png"
                alt="Delta Tutors study desk with SAT, ACT, AP Calculus and Python books, laptop showing the platform, and branded mug"
                width={700}
                height={520}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
            </div>

            {/* Text */}
            <div>
              <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Our Story</p>
              <h2 className="text-3xl lg:text-4xl" style={{ color: '#17356D', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
                Built by Students.<br />Designed for Success.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                <p>We were once students navigating the same challenges you face today — overwhelming content, high costs, and a lack of personal guidance.</p>
                <p>After achieving top scores through relentless self-study and guidance from mentors at IITs and top global companies, we set out to build the platform we wish we had.</p>
                <p>Delta Tutors combines the depth of expert instruction with the power of smart technology to deliver a seamless, effective, and affordable learning experience.</p>
              </div>
              <div style={{ background: '#fef9ec', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#f59e0b', fontSize: '1.1rem' }}>☆</span>
                <p style={{ color: '#92400e', fontSize: '0.875rem', fontStyle: 'italic', fontWeight: 500 }}>Born from experience. Built on trust. Driven by results.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What Makes Us Different ── */}
      <section style={{ background: '#f8fafc', paddingBlock: '5rem' }}>
        <div className="container-app">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What Makes Us Different</p>
            <h2 className="text-3xl lg:text-4xl" style={{ color: '#0f172a', fontWeight: 800 }}>Everything You Need. All in One Place.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, label, desc, color, bg }) => (
              <div key={label} className="card-base" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{label}</h3>
                <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section style={{ background: '#ffffff', paddingBlock: '5rem' }}>
        <div className="container-app">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Our Values</p>
            <h2 className="text-3xl lg:text-4xl" style={{ color: '#0f172a', fontWeight: 800 }}>The Principles That Guide Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, label, desc, color, bg }) => (
              <div key={label} className="card-base" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{label}</h3>
                <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ background: 'linear-gradient(135deg, #0f2050 0%, #17356D 60%, #1a4080 100%)', paddingBlock: '5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container-app" style={{ position: 'relative' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left text */}
            <div>
              <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Built by the Best</p>
              <h2 className="text-3xl lg:text-4xl" style={{ color: '#ffffff', fontWeight: 800, lineHeight: 1.25, marginBottom: '1.25rem' }}>
                Engineers. Educators. Innovators.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '0.75rem' }}>
                We are a team of IIT graduates, educators, and industry professionals passionate about building the future of learning.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                Our goal is simple — help students achieve their dream scores and unlock their full potential.
              </p>
            </div>

            {/* Right — team cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {team.map(({ name, role, school, prev, initials, color, linkedin }) => (
                <div key={name} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Avatar */}
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.4rem', border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{role}</p>
                    <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>{school}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{prev}</p>
                  </div>
                  {/* LinkedIn */}
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} on LinkedIn`}
                    style={{ width: '32px', height: '32px', borderRadius: '7px', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}
                  >
                    <LinkedInIcon className="h-4 w-4"  />
                  </a>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#17356D', paddingBlock: '3.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container-app">
          <p className="text-center" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2.5rem' }}>Our Impact So Far</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="h-7 w-7 mx-auto" style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
                <p style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{value}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '0.4rem' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
