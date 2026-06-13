'use client';

import { Bell, Moon, Sun, Search } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-10 h-16 flex items-center justify-between px-6 border-b"
      style={{
        background: 'var(--color-background)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Search */}
      <div className="relative hidden sm:block w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />
        <Input
          placeholder="Search courses, quizzes..."
          className="pl-9 h-9 text-sm"
          style={{ background: 'var(--color-muted)' }}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Theme */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-muted-foreground)' }}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-muted-foreground)' }}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--color-danger)' }}
          />
        </button>

        {/* User */}
        <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
      </div>
    </header>
  );
}
