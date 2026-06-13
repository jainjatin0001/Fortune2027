'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, HelpCircle, BarChart2,
  FileText, Bell, Settings, Shield, Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
  { icon: HelpCircle, label: 'Questions', href: '/admin/questions' },
  { icon: BarChart2, label: 'Analytics', href: '/admin/analytics' },
  { icon: FileText, label: 'Blog', href: '/admin/blog' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  { icon: Database, label: 'Audit Logs', href: '/admin/audit' },
  { icon: Shield, label: 'Roles & Permissions', href: '/admin/roles' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
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
      <div className="p-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
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

      <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
        <div className="text-xs font-semibold mb-3 px-3" style={{ color: 'var(--color-muted-foreground)' }}>ADMIN MENU</div>
        {adminNavItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
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
      </nav>
    </aside>
  );
}
