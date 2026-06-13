'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, BarChart2, Bookmark, Trophy, Brain,
  Settings, User, Code2, FlaskConical, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'My Courses', href: '/dashboard/courses' },
  { icon: Brain, label: 'Practice', href: '/dashboard/practice' },
  { icon: BarChart2, label: 'Progress', href: '/dashboard/progress' },
  { icon: Trophy, label: 'Quizzes', href: '/dashboard/quizzes' },
  { icon: Bookmark, label: 'Bookmarks', href: '/dashboard/bookmarks' },
  { icon: Play, label: 'Demo', href: '/dashboard/demo' },
];

const bottomItems = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        minWidth: 'var(--sidebar-width)',
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'var(--gradient-primary)' }}
          >
            E
          </div>
          <span className="text-base font-bold" style={{ color: 'var(--color-foreground)' }}>
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1" aria-label="Dashboard navigation">
        <div className="text-xs font-semibold mb-3 px-3" style={{ color: 'var(--color-muted-foreground)' }}>
          MAIN MENU
        </div>
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)]'
                  : 'text-[var(--color-muted-foreground)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--color-foreground)]'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        <div className="text-xs font-semibold mt-6 mb-3 px-3 pt-2 border-t" style={{ color: 'var(--color-muted-foreground)', borderColor: 'var(--sidebar-border)' }}>
          QUICK ACCESS
        </div>
        {[
          { icon: BookOpen, label: 'SAT Prep', href: '/sat-prep' },
          { icon: FlaskConical, label: 'AP Exams', href: '/ap-prep' },
          { icon: Code2, label: 'Coding', href: '/coding' },
        ].map(({ icon: Icon, label, href }) => (
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
      </div>
    </aside>
  );
}
