'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, BarChart2, Bookmark, Trophy, Brain,
  Settings, User, Code2, FlaskConical, Play, GraduationCap, Shield,
  LockKeyhole, LockKeyholeOpen, X, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';
import { useSidebar } from './DashboardSidebarProvider';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',  href: '/dashboard' },
  { icon: BookOpen,        label: 'My Courses', href: '/dashboard/courses' },
  // { icon: Brain,           label: 'Practice',   href: '/dashboard/practice' },
  { icon: Trophy,          label: 'Quizzes',    href: '/dashboard/quizzes',  requiresPurchase: true },
  { icon: Bookmark,        label: 'PYQs',       href: '/dashboard/pyqs',     requiresPurchase: true },
  { icon: BarChart2,       label: 'Progress',   href: '/dashboard/progress' },
  { icon: Play,            label: 'Demo',       href: '/dashboard/demo' },
];

const examItems = [
  { icon: GraduationCap, label: 'SAT Practice Exam', href: '/dashboard/sat-exam', color: '#7c3aed' },
  { icon: GraduationCap, label: 'ACT Practice Exam', href: '/dashboard/act-exam', color: '#0891b2' },
  { icon: FlaskConical,  label: 'AP Exams',          href: '/dashboard/ap-exam',  color: '#b45309' },
];

const quickItems = [
  { icon: BookOpen,     label: 'SAT Prep', href: '/sat-prep' },
  { icon: FlaskConical, label: 'AP Exams', href: '/ap-prep' },
  { icon: Code2,        label: 'Coding',   href: '/coding' },
];

const bottomItems = [
  { icon: User,     label: 'Profile',  href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

interface DashboardSidebarProps {
  role?: string;
  isPurchased?: boolean;
}

export function DashboardSidebar({ role, isPurchased }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [showLockedModal, setShowLockedModal] = useState(false);

  const isUnlocked = role === 'ADMIN' || role === 'SUPER_ADMIN' || !!isPurchased;

  const lockedModal = showLockedModal ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={() => setShowLockedModal(false)}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowLockedModal(false)}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg"
          style={{ color: 'var(--color-muted-foreground)', background: 'var(--color-muted)' }}
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: '#fef3c7' }}
        >
          <LockKeyhole className="h-6 w-6" style={{ color: '#d97706' }} />
        </div>

        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-foreground)' }}>
          Premium Feature
        </h3>
        <p className="text-sm mb-5" style={{ color: 'var(--color-muted-foreground)' }}>
          This feature is available to students with an active course subscription. Explore our courses or view pricing plans to get access.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/courses"
            onClick={() => setShowLockedModal(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Explore Courses <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            onClick={() => setShowLockedModal(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)' }}
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  // ── Collapsed: icon-only rail ─────────────────────────────────
  if (!open) {
    return (
      <>
        {lockedModal}
        <aside
          className="hidden lg:flex flex-col h-screen sticky top-0 overflow-hidden shrink-0"
          style={{
            width: 'var(--sidebar-collapsed)',
            background: 'var(--sidebar-bg)',
            borderRight: '1px solid var(--sidebar-border)',
          }}
        >
          {/* Logo mark */}
          <div
            className="flex items-center justify-center h-16 border-b shrink-0"
            style={{ borderColor: 'var(--sidebar-border)' }}
          >
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logos/logo_5.png" alt="Delta Tutors" className="w-8 h-8 object-contain" />
            </Link>
          </div>

          {/* Nav icons */}
          <nav className="flex-1 flex flex-col items-center py-3 gap-0.5 overflow-y-auto" aria-label="Dashboard navigation">
            {navItems.map(({ icon: Icon, label, href, requiresPurchase }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              const locked = requiresPurchase && !isUnlocked;

              if (locked) {
                return (
                  <button
                    key={href}
                    title={label}
                    onClick={() => setShowLockedModal(true)}
                    className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)]"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <LockKeyhole
                      className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5"
                      style={{ color: '#d97706' }}
                    />
                  </button>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-xl transition-colors',
                    active
                      ? 'bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)]'
                      : 'text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)]',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                </Link>
              );
            })}

            <div className="w-8 border-t my-2" style={{ borderColor: 'var(--sidebar-border)' }} />

            {examItems.map(({ icon: Icon, label, href, color }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-xl transition-colors',
                    active
                      ? 'bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)]'
                      : 'text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)]',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: active ? undefined : color }} />
                </Link>
              );
            })}

            <div className="w-8 border-t my-2" style={{ borderColor: 'var(--sidebar-border)' }} />

            {quickItems.map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0" />
              </Link>
            ))}
          </nav>

          {/* Bottom icons */}
          <div
            className="flex flex-col items-center py-3 gap-0.5 border-t"
            style={{ borderColor: 'var(--sidebar-border)' }}
          >
            {bottomItems.map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0" />
              </Link>
            ))}
            {role === 'SUPER_ADMIN' && (
              <Link
                href="/admin"
                title="Admin Panel"
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
                style={{
                  color: 'var(--color-danger)',
                  background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)',
                }}
              >
                <Shield className="h-4 w-4 shrink-0" />
              </Link>
            )}
          </div>
        </aside>
      </>
    );
  }

  // ── Expanded: full sidebar ────────────────────────────────────
  return (
    <>
      {lockedModal}
      <aside
        className="hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto"
        style={{
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/logo_5.png" alt="Delta Tutors" className="w-9 h-9 object-contain shrink-0" />
            <div className="flex flex-col items-start gap-[2px]">
              <span className="text-[15px] font-bold leading-none" style={{ color: '#17356D' }}>
                {APP_NAME}
              </span>
              <div className="flex items-center w-full gap-1">
                <div className="h-px flex-1" style={{ background: '#C7A14B' }} />
                <span style={{ color: '#C7A14B', fontSize: '7px', lineHeight: 1 }}>✦</span>
                <div className="h-px flex-1" style={{ background: '#C7A14B' }} />
              </div>
              <span className="text-[9px] font-medium tracking-widest" style={{ color: '#C7A14B' }}>
                Pursuit of Excellence
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1" aria-label="Dashboard navigation">
          <div
            className="text-xs font-semibold mb-3 px-3"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            MAIN MENU
          </div>

          {navItems.map(({ icon: Icon, label, href, requiresPurchase }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            const locked = requiresPurchase && !isUnlocked;

            if (locked) {
              return (
                <button
                  key={href}
                  onClick={() => setShowLockedModal(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)]"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  <LockKeyhole className="h-3.5 w-3.5 ml-auto shrink-0" style={{ color: '#d97706' }} />
                </button>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)]'
                    : 'text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)]',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {requiresPurchase && (
                  <LockKeyholeOpen className="h-3.5 w-3.5 ml-auto shrink-0 text-green-500" />
                )}
              </Link>
            );
          })}

          <div
            className="text-xs font-semibold mt-6 mb-3 px-3 pt-2 border-t"
            style={{ color: 'var(--color-muted-foreground)', borderColor: 'var(--sidebar-border)' }}
          >
            PRACTICE EXAMS
          </div>

          {examItems.map(({ icon: Icon, label, href, color }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)]'
                    : 'text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)]',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: active ? undefined : color }} />
                {label}
              </Link>
            );
          })}

          <div
            className="text-xs font-semibold mt-6 mb-3 px-3 pt-2 border-t"
            style={{ color: 'var(--color-muted-foreground)', borderColor: 'var(--sidebar-border)' }}
          >
            QUICK ACCESS
          </div>

          {quickItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom items */}
        <div className="p-4 border-t space-y-1" style={{ borderColor: 'var(--sidebar-border)' }}>
          {bottomItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}

          {role === 'SUPER_ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                color: 'var(--color-danger)',
                background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)',
              }}
            >
              <Shield className="h-4 w-4 shrink-0" />
              Admin Panel
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
