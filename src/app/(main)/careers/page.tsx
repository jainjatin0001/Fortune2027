import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight, BookOpen, Briefcase, Calculator, Camera, CheckCircle2, Clock, Code, Film,
  FlaskConical, Globe, GraduationCap, Layers, Megaphone, PenLine, PhoneCall, Presentation,
  Rocket, Send, Smartphone, TrendingUp, Users, Wallet,
} from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { ContactModalButton } from '@/components/shared/ContactModalButton';

export const metadata: Metadata = pageMetadata({
  title: 'Careers',
  path: '/careers',
  description: 'Join Delta Tutors as a remote SAT, ACT, AP or coding tutor, subject matter expert, content creator, UGC creator, video editor or Meta ads expert.',
});

const heroHighlights = [
  { icon: Globe, label: 'Remote-First', desc: 'Work from anywhere' },
  { icon: Clock, label: 'Flexible Hours', desc: 'Choose your schedule' },
  { icon: Users, label: 'Global Students', desc: 'US, Canada & beyond' },
  { icon: TrendingUp, label: 'Grow With Us', desc: 'Early-stage impact' },
];

const perks = [
  { icon: Globe, label: 'Work From Anywhere', desc: 'Our team is fully remote. All you need is a laptop, a stable connection and a passion for teaching or creating.', color: '#2563eb', bg: '#dbeafe' },
  { icon: Clock, label: 'Flexible Schedule', desc: 'Pick the hours and workload that suit you, whether part-time, freelance or project-based.', color: '#7c3aed', bg: '#ede9fe' },
  { icon: Layers, label: 'Ready-Made Platform', desc: 'Teach with our question bank, full-length mock tests, quizzes and student dashboards. No setup needed.', color: '#0891b2', bg: '#cffafe' },
  { icon: GraduationCap, label: 'Motivated Students', desc: 'Work with ambitious high school students preparing for the SAT, ACT, AP exams and coding.', color: '#059669', bg: '#d1fae5' },
  { icon: Wallet, label: 'Fair, On-Time Pay', desc: 'Transparent rates agreed up front and paid reliably, so you can focus on doing great work.', color: '#d97706', bg: '#fef3c7' },
  { icon: Rocket, label: 'Real Impact', desc: 'Join early, shape how we teach and grow your role as the platform grows.', color: '#e11d48', bg: '#ffe4e6' },
];

type Role = { icon: LucideIcon; title: string; type: string; desc: string; lookFor: string[] };

const roleGroups: { id: string; eyebrow: string; title: string; subtitle: string; color: string; bg: string; roles: Role[] }[] = [
  {
    id: 'teaching',
    eyebrow: 'Teaching & Academics',
    title: 'Tutors & Subject Matter Experts',
    subtitle: 'For educators who know their subject deeply and can make it click for students.',
    color: '#2563eb',
    bg: '#dbeafe',
    roles: [
      {
        icon: Calculator,
        title: 'SAT Tutor',
        type: 'Remote · Part-time / Freelance',
        desc: 'Coach students 1:1 and in small groups on SAT Math and Reading & Writing, with a focus on strategy and score gains.',
        lookFor: ['Strong SAT score or proven tutoring results', 'Familiar with the digital SAT format', 'Clear, patient communicator'],
      },
      {
        icon: BookOpen,
        title: 'ACT Tutor',
        type: 'Remote · Part-time / Freelance',
        desc: 'Help students master ACT English, Math, Reading and Science with timing drills and targeted practice.',
        lookFor: ['High ACT score or proven tutoring results', 'Comfortable teaching multiple sections', 'Data-driven approach to progress'],
      },
      {
        icon: FlaskConical,
        title: 'AP Subject Expert',
        type: 'Remote · Part-time / Freelance',
        desc: 'Teach AP courses such as Calculus, Physics, Chemistry, Biology, Statistics or Computer Science through to exam day.',
        lookFor: ['Degree or deep expertise in the subject', 'Knowledge of the AP curriculum and exam style', 'Teaching or tutoring experience'],
      },
      {
        icon: Code,
        title: 'Coding Instructor',
        type: 'Remote · Part-time / Freelance',
        desc: 'Teach Python, AI & ML, Web Development and problem-solving to beginners and advanced high school learners.',
        lookFor: ['Solid programming background', 'Can explain concepts simply to teens', 'Project-based teaching mindset'],
      },
      {
        icon: GraduationCap,
        title: 'High School Tutor',
        type: 'Remote · Part-time / Freelance',
        desc: 'Support Grades 8–12 students in Math, Science and English with homework help and concept building.',
        lookFor: ['Strong command of high school curriculum', 'Experience with US or Canadian syllabi is a plus', 'Encouraging, student-first approach'],
      },
      {
        icon: PenLine,
        title: 'Question Writer & Content Reviewer',
        type: 'Remote · Contract / Project-based',
        desc: 'Write and review exam-style questions, explanations and study material for our SAT, ACT and AP question banks.',
        lookFor: ['Subject expertise with an eye for detail', 'Excellent written English', 'Understanding of exam question design'],
      },
    ],
  },
  {
    id: 'marketing',
    eyebrow: 'Marketing & Creative',
    title: 'Creators & Growth Specialists',
    subtitle: 'For storytellers and marketers who want to reach students and parents around the world.',
    color: '#d97706',
    bg: '#fef3c7',
    roles: [
      {
        icon: Camera,
        title: 'Content Creator',
        type: 'Remote · Freelance / Part-time',
        desc: 'Create engaging study tips, exam strategies and education content for Instagram, YouTube and TikTok.',
        lookFor: ['Portfolio of education or lifestyle content', 'Understands short-form trends', 'Comfortable on camera or with voice-over'],
      },
      {
        icon: Smartphone,
        title: 'EdTech UGC Creator',
        type: 'Remote · Freelance / Per project',
        desc: 'Produce authentic user-generated style videos showing how students learn and improve with Delta Tutors.',
        lookFor: ['UGC portfolio, ideally in EdTech or apps', 'Natural, relatable on-camera presence', 'Quick turnaround on briefs'],
      },
      {
        icon: Film,
        title: 'Video Editor',
        type: 'Remote · Freelance / Part-time',
        desc: 'Edit lessons, reels, ads and explainer videos with clean captions, motion graphics and strong hooks.',
        lookFor: ['Premiere Pro, Final Cut, DaVinci or CapCut', 'Short-form and long-form editing experience', 'Motion graphics skills are a plus'],
      },
      {
        icon: Megaphone,
        title: 'Meta Ads Expert',
        type: 'Remote · Freelance / Contract',
        desc: 'Plan, launch and optimize Facebook and Instagram campaigns that bring in students and parents.',
        lookFor: ['Proven Meta Ads results with case studies', 'Strong grasp of targeting, creatives and funnels', 'Comfortable with analytics and reporting'],
      },
    ],
  },
];

const steps = [
  { icon: Send, title: 'Apply', desc: 'Send your details and a link to your CV, LinkedIn or portfolio.' },
  { icon: PhoneCall, title: 'Intro Call', desc: 'A short conversation about your experience and availability.' },
  { icon: Presentation, title: 'Demo or Task', desc: 'A demo lesson for tutors, or a small sample task for creators.' },
  { icon: CheckCircle2, title: 'Onboard', desc: 'Get set up on the platform and start working with our team.' },
];

const eyebrowStyle: React.CSSProperties = { color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' };
const heroBg = 'linear-gradient(135deg, #0f2050 0%, #17356D 60%, #1a4080 100%)';

export default function CareersPage() {
  return (
    <div>

      {/* ── Hero ── */}
      <section style={{ background: heroBg, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(124,58,237,0.10) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="container-app" style={{ paddingBlock: '4.5rem', position: 'relative' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p style={{ ...eyebrowStyle, marginBottom: '1rem' }}>Careers at Delta Tutors</p>
              <h1 className="text-4xl lg:text-5xl" style={{ color: '#ffffff', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
                Teach, Create &amp;<br />Grow With Us
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>
                We&apos;re building a global team of tutors, subject matter experts and creators who help high school students reach their best in the SAT, ACT, AP exams and coding.
              </p>
              <div className="flex flex-wrap gap-3">
                <ContactModalButton preset="careers" size="lg" style={{ background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, gap: '0.5rem' }}>
                  Apply Now <ArrowRight className="h-4 w-4" />
                </ContactModalButton>
                <Button asChild size="lg" variant="outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)', fontWeight: 600, gap: '0.5rem' }}>
                  <a href="#open-roles">
                    <Briefcase className="h-4 w-4" /> View Open Roles
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroHighlights.map(({ icon: Icon, label, desc }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon className="h-5 w-5" style={{ color: '#f59e0b' }} aria-hidden />
                  </div>
                  <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>{label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: 1.4 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section style={{ background: '#ffffff', paddingBlock: '5rem' }}>
        <div className="container-app">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <p style={eyebrowStyle}>Why Join Us</p>
            <h2 className="text-3xl lg:text-4xl" style={{ color: '#0f172a', fontWeight: 800 }}>Do Your Best Work, Your Way</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map(({ icon: Icon, label, desc, color, bg }) => (
              <div key={label} className="card-base" style={{ padding: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon className="h-6 w-6" style={{ color }} aria-hidden />
                </div>
                <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{label}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section id="open-roles" style={{ background: '#f8fafc', paddingBlock: '5rem', scrollMarginTop: '5rem' }}>
        <div className="container-app">
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <p style={eyebrowStyle}>Open Roles</p>
            <h2 className="text-3xl lg:text-4xl" style={{ color: '#0f172a', fontWeight: 800, marginBottom: '0.75rem' }}>Find Your Place on the Team</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, maxWidth: '620px', marginInline: 'auto' }}>
              We welcome applications from professionals worldwide. Pick a role and apply in under two minutes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {roleGroups.map(({ id, eyebrow, title, subtitle, color, bg, roles }) => (
              <div key={id} aria-labelledby={`${id}-heading`} role="region">
                <div style={{ marginBottom: '1.75rem' }}>
                  <span style={{ display: 'inline-block', background: bg, color, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.75rem', borderRadius: '999px', marginBottom: '0.75rem' }}>
                    {eyebrow}
                  </span>
                  <h3 id={`${id}-heading`} className="text-2xl" style={{ color: '#0f172a', fontWeight: 800, marginBottom: '0.35rem' }}>{title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.92rem' }}>{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {roles.map(({ icon: Icon, title: roleTitle, type, desc, lookFor }) => (
                    <article key={roleTitle} className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `3px solid ${color}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon className="h-5 w-5" style={{ color }} aria-hidden />
                        </div>
                        <div>
                          <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.02rem', lineHeight: 1.3 }}>{roleTitle}</h4>
                          <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>{type}</p>
                        </div>
                      </div>
                      <p style={{ color: '#475569', fontSize: '0.86rem', lineHeight: 1.65 }}>{desc}</p>
                      <div>
                        <p style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.5rem' }}>What we look for</p>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {lookFor.map((item) => (
                            <li key={item} style={{ display: 'flex', gap: '0.5rem', color: '#475569', fontSize: '0.82rem', lineHeight: 1.5 }}>
                              <CheckCircle2 className="h-4 w-4" style={{ color, flexShrink: 0, marginTop: '0.1rem' }} aria-hidden />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <ContactModalButton
                        preset="careers"
                        defaultCourse={roleTitle}
                        variant="outline"
                        aria-label={`Apply for ${roleTitle}`}
                        style={{ marginTop: 'auto', alignSelf: 'flex-start', color, borderColor: color, fontWeight: 600, gap: '0.4rem' }}
                      >
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </ContactModalButton>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hiring Process ── */}
      <section style={{ background: '#ffffff', paddingBlock: '5rem' }}>
        <div className="container-app">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <p style={eyebrowStyle}>How We Hire</p>
            <h2 className="text-3xl lg:text-4xl" style={{ color: '#0f172a', fontWeight: 800 }}>A Simple, Respectful Process</h2>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="card-base" style={{ padding: '1.5rem', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '1rem', right: '1.25rem', color: '#e2e8f0', fontWeight: 800, fontSize: '2rem', lineHeight: 1 }} aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#17356D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon className="h-5 w-5" style={{ color: '#f59e0b' }} aria-hidden />
                </div>
                <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.6 }}>{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Open Application CTA ── */}
      <section style={{ background: heroBg, paddingBlock: '4.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 90% 30%, rgba(245,158,11,0.10) 0%, transparent 45%)', pointerEvents: 'none' }} />
        <div className="container-app text-center" style={{ position: 'relative', maxWidth: '720px' }}>
          <p style={eyebrowStyle}>Don&apos;t See Your Role?</p>
          <h2 className="text-3xl lg:text-4xl" style={{ color: '#ffffff', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
            We&apos;re Always Looking for Great People
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            If you&apos;re an educator, expert or creator who can help students succeed, send us an open application and tell us how you&apos;d like to contribute.
          </p>
          <ContactModalButton preset="careers" defaultCourse="Open Application" size="lg" style={{ background: '#f59e0b', color: '#0f172a', border: 'none', fontWeight: 700, gap: '0.5rem' }}>
            Send an Open Application <ArrowRight className="h-4 w-4" />
          </ContactModalButton>
        </div>
      </section>

    </div>
  );
}
