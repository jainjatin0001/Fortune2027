'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, HelpCircle, BarChart2,
  FileText, Bell, Settings, Shield, Database, Layers,
  BookMarked, Tag, Megaphone, Mail, ArrowLeft, ChevronDown,
  ListChecks, ClipboardList, GraduationCap, UserCheck, FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';

const NAV_GROUPS = [
  { group: 'OVERVIEW', items: [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: BarChart2, label: 'Analytics', href: '/admin/analytics' },
    { icon: Users, label: 'Users', href: '/admin/users' },
  ]},
  { group: 'CURRICULUM', items: [
    { icon: Layers, label: 'Programs', href: '/admin/programs' },
    { icon: BookMarked, label: 'Subjects', href: '/admin/subjects' },
    { icon: Tag, label: 'Topics', href: '/admin/topics' },
    { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
    { icon: FolderOpen, label: 'Modules', href: '/admin/modules' },
    { icon: UserCheck, label: 'Instructors', href: '/admin/instructors' },
  ]},
  { group: 'ASSESSMENT', items: [
    { icon: HelpCircle, label: 'Questions', href: '/admin/questions' },
    { icon: ListChecks, label: 'Question Sets', href: '/admin/question-sets' },
    { icon: ClipboardList, label: 'Quizzes', href: '/admin/quizzes' },
    { icon: GraduationCap, label: 'Exams', href: '/admin/exams' },
  ]},
  { group: 'CONTENT', items: [
    { icon: FileText, label: 'Blog Posts', href: '/admin/blog' },
    { icon: Tag, label: 'Blog Categories', href: '/admin/blog-categories' },
    { icon: Megaphone, label: 'Announcements', href: '/admin/announcements' },
    { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  ]},
  { group: 'SYSTEM', items: [
    { icon: Mail, label: 'Contact Messages', href: '/admin/contact-messages' },
    { icon: Database, label: 'Audit Logs', href: '/admin/audit' },
    { icon: Shield, label: 'Roles & Permissions', href: '/admin/roles' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]},
];

const ALL_GROUPS = NAV_GROUPS.map((g) => g.group);
const STORAGE_KEY = 'admin-sidebar-collapsed';

export function AdminSidebar() {
  const pathname = usePathname();
  // Start with all groups expanded; hydrate from localStorage after mount
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCollapsed(new Set(JSON.parse(stored) as string[]));
    } catch {}
  }, []);

  const toggle = (group: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  // Auto-expand the group containing the active route
  useEffect(() => {
    if (!mounted) return;
    const activeGroup = NAV_GROUPS.find((g) =>
      g.items.some((item) => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))
    );
    if (activeGroup && collapsed.has(activeGroup.group)) {
      setCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(activeGroup.group);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mounted]);

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
      <div className="p-5 border-b shrink-0" style={{ borderColor: 'var(--sidebar-border)' }}>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'var(--gradient-primary)' }}>
            E
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>{APP_NAME}</div>
            <div className="text-xs" style={{ color: 'var(--color-danger)' }}>Admin Portal</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto" aria-label="Admin navigation">
        {NAV_GROUPS.map(({ group, items }) => {
          const isCollapsed = mounted && collapsed.has(group);
          const hasActive = items.some(
            (item) => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          );

          return (
            <div key={group} className="mb-1">
              {/* Group header — clickable to collapse */}
              <button
                onClick={() => toggle(group)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg mb-0.5 transition-colors hover:bg-[var(--sidebar-item-hover)] group/header"
              >
                <span
                  className="text-xs font-semibold tracking-wider"
                  style={{ color: hasActive ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
                >
                  {group}
                </span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200 opacity-0 group-hover/header:opacity-100',
                    isCollapsed ? '-rotate-90' : 'rotate-0'
                  )}
                  style={{ color: 'var(--color-muted-foreground)' }}
                />
              </button>

              {/* Items — hidden when collapsed */}
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
                )}
              >
                <div className="space-y-0.5 pb-1">
                  {items.map(({ icon: Icon, label, href }) => {
                    const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
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
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Back to dashboard */}
      <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--sidebar-border)' }}>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full"
          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
