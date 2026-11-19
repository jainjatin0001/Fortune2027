'use client';

import Link from 'next/link';
import { Bell, Moon, Sun, Search, PanelLeft, Menu } from 'lucide-react';
import { SignUpButton, UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from './DashboardSidebarProvider';

export function DashboardHeader({ isSignedIn = true }: { isSignedIn?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { toggle, setMobileOpen } = useSidebar();

  return (
    <header
      className="sticky top-0 z-10 h-16 flex items-center justify-between gap-2 px-3 sm:px-6 border-b print:hidden"
      style={{
        background: 'var(--color-background)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Left: sidebar toggle + search */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Phone/tablet: open the navigation drawer */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-[var(--color-muted)]"
          style={{ color: 'var(--color-foreground)' }}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="lg:hidden shrink-0" aria-label="Delta Tutors home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logos/logo_5.png" alt="Delta Tutors" className="h-8 w-auto object-contain" />
        </Link>

        <button
          onClick={toggle}
          className="hidden lg:flex p-2 rounded-lg transition-colors hover:bg-[var(--color-muted)]"
          style={{ color: 'var(--color-muted-foreground)' }}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <div className="relative hidden md:block w-56 lg:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: 'var(--color-muted-foreground)' }}
          />
          <Input
            placeholder="Search courses, quizzes..."
            className="pl-9 h-9 text-sm"
            style={{ background: 'var(--color-muted)' }}
          />
        </div>
      </div>

      {/* Right: theme + notifications + user */}
      <div className="flex items-center gap-1.5 sm:gap-3 ml-auto shrink-0">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg transition-colors hover:bg-[var(--color-muted)]"
          style={{ color: 'var(--color-muted-foreground)' }}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </button>

        {isSignedIn ? (
          <>
            <button
              className="relative p-2 rounded-lg transition-colors hover:bg-[var(--color-muted)]"
              style={{ color: 'var(--color-muted-foreground)' }}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--color-danger)' }}
              />
            </button>

            <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
          </>
        ) : (
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard">
            <Button size="sm" className="text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
              Get Started
            </Button>
          </SignUpButton>
        )}
      </div>
    </header>
  );
}
