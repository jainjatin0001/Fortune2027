'use client';

import Link from 'next/link';
import { useId, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavDropdownProps = {
  label: string;
  href: string;
  items: { label: string; href: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Classes for the top-level link (active/inactive styles come from the navbar). */
  linkClassName: string;
  pathname: string;
};

/**
 * Accessible "disclosure navigation" dropdown (WAI-ARIA APG pattern):
 * - the label stays a normal link to the section page;
 * - a separate chevron button toggles the submenu (aria-expanded / aria-controls),
 *   so it works on touch screens where hover doesn't exist;
 * - opens on hover for mouse users only; Esc closes and returns focus to the button;
 *   moving focus out of the menu closes it.
 */
export function NavDropdown({ label, href, items, open, onOpenChange, linkClassName, pathname }: NavDropdownProps) {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="relative flex items-center"
      // Hover only for real mice: on touch screens a tap fires a fake "enter" before the
      // click, which would open and then immediately toggle the menu closed.
      onPointerEnter={(e) => e.pointerType === 'mouse' && onOpenChange(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onOpenChange(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          onOpenChange(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onOpenChange(false);
      }}
    >
      <Link href={href} className={cn(linkClassName, 'pr-1.5 xl:pr-2')}>
        {label}
      </Link>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label} menu`}
        onClick={() => onOpenChange(!open)}
        className="-ml-1 p-1.5 rounded-md text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--color-muted)] transition-colors"
      >
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      <div
        id={menuId}
        hidden={!open}
        className="absolute left-0 top-full pt-2 z-10"
      >
        <ul
          className="min-w-64 rounded-xl border p-2 shadow-lg"
          style={{ background: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
        >
          {items.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                aria-current={pathname === child.href ? 'page' : undefined}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm transition-colors',
                  pathname === child.href
                    ? 'text-[var(--nav-text-hover)] bg-[var(--color-primary-light)] font-medium'
                    : 'text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--color-muted)]'
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
