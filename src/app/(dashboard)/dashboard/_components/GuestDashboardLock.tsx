'use client';

import { useEffect, useState } from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { ArrowRight, LockKeyhole, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/layout/DashboardSidebarProvider';
import { cn } from '@/lib/utils';

/**
 * Signed-out view of the dashboard: the real dashboard (rendered with an empty, brand-new account)
 * is greyed out and inert, with a sign-up card on top. The sidebar and header stay usable.
 * The card can be closed; clicking the greyed dashboard brings it back.
 */
export function GuestDashboardLock({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
  const [showPrompt, setShowPrompt] = useState(true);

  // Escape closes the card
  useEffect(() => {
    if (!showPrompt) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowPrompt(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPrompt]);

  return (
    <div className="relative">
      {/* The content is inert, so clicks on it land on this wrapper: reopen the sign-up card */}
      <div
        onClick={() => setShowPrompt(true)}
        title={showPrompt ? undefined : 'Sign up free to unlock your dashboard'}
        className={cn(!showPrompt && 'cursor-pointer')}
      >
        <div inert aria-hidden className="pointer-events-none select-none grayscale opacity-50">
          {children}
        </div>
      </div>

      {showPrompt && (
        /* Pinned to the viewport (below the header, beside the sidebar) so it stays in view while the
           page scrolls. `sticky` can't be used: <main> is overflow-auto but the window is what scrolls. */
        <div
          className={cn(
            'fixed top-16 right-0 bottom-0 left-0 z-30 overflow-y-auto pointer-events-none print:hidden',
            open ? 'lg:left-[var(--sidebar-width)]' : 'lg:left-[var(--sidebar-collapsed)]',
          )}
        >
          <div className="min-h-full flex items-start sm:items-center justify-center p-4 [&>*]:pointer-events-auto">
            <div
              role="dialog"
              aria-labelledby="guest-lock-title"
              className="relative w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl text-center animate-fade-in"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <button
                type="button"
                onClick={() => setShowPrompt(false)}
                aria-label="Close"
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg"
                style={{ color: 'var(--color-muted-foreground)', background: 'var(--color-muted)' }}
              >
                <X className="h-4 w-4" />
              </button>

              <span
                className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ color: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}
              >
                <LockKeyhole className="h-6 w-6" />
              </span>
              <h2 id="guest-lock-title" className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
                Sign up free to unlock your dashboard
              </h2>
              <p className="mt-1.5 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                Take quizzes and mock tests, answer the daily question and track your progress. No credit card needed.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard">
                  <Button size="lg" className="group w-full h-11 text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                    Create free account
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
                  <Button size="lg" variant="outline" className="w-full h-11 font-medium">
                    I already have an account
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
