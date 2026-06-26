'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Menu, X, ChevronDown, BookOpen, GraduationCap, Code2, FlaskConical, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const navItems = [
    { label: 'SAT Prep', href: '/sat-prep', icon: BookOpen },
    { label: 'ACT Prep', href: '/act-prep', icon: GraduationCap },
    { label: 'AP Exams', href: '/ap-prep', icon: FlaskConical },
    { label: 'Coding', href: '/coding', icon: Code2 },
    { label: 'Blog', href: '/blog', icon: null },
    { label: 'Pricing', href: '/pricing', icon: null },
  ];

  return (
    <header
      className={cn(
        'nav-fixed transition-all duration-200',
        isScrolled && 'shadow-md'
      )}
      style={{ zIndex: 'var(--z-sticky)' }}
    >
      <div className="container-app h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logos/logo_5.png" alt="Delta Tutors" className="h-10 w-auto object-contain" />
          <div className="hidden sm:flex flex-col items-start justify-center gap-[2px]">
            <span
              className="text-[15px] font-bold leading-none"
              style={{ color: '#17356D' }}
            >
              Delta Tutors
            </span>
            <div className="flex items-center w-full gap-1">
              <div className="h-px flex-1" style={{ background: '#C7A14B' }} />
              <span style={{ color: '#C7A14B', fontSize: '7px', lineHeight: 1 }}>✦</span>
              <div className="h-px flex-1" style={{ background: '#C7A14B' }} />
            </div>
            <span
              className="text-[9px] font-medium tracking-widest"
              style={{ color: '#C7A14B' }}
            >
              Pursuit of Excellence
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'text-[var(--nav-text-hover)] bg-[var(--color-primary-light)]'
                  : 'text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--color-muted)]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-[var(--nav-text-muted)] hover:text-[var(--nav-text)] hover:bg-[var(--color-muted)] transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </button>

          {isLoaded && (
            <>
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex text-[var(--nav-text)] hover:text-[var(--nav-text-hover)]"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-8 h-8',
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="text-[var(--nav-text)]">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      size="sm"
                      className="text-white font-semibold"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-lg text-[var(--nav-text)] hover:bg-[var(--color-muted)] transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{
            background: 'var(--nav-bg)',
            borderColor: 'var(--nav-border)',
          }}
        >
          <nav className="container-app py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-[var(--color-accent)] bg-[var(--color-primary-light)]'
                    : 'text-[var(--nav-text)] hover:bg-[var(--color-muted)]'
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </Link>
            ))}
            {isLoaded && !isSignedIn && (
              <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" className="flex-1">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="flex-1 text-white"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
