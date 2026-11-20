/**
 * Colours for the free exam tool pages and cards (SAT, ACT): brand blue, the same tokens the
 * rest of the site already uses (buttons, links), so light/dark mode just work.
 * Change the look of every exam tool element here.
 */
export const TOOL_THEME = {
  /** Icons, badges, CTA text, small labels. */
  color: 'var(--color-accent)',
  /** Icon tiles and result panels. */
  tint: 'var(--color-primary-light)',
  /** Primary buttons. */
  button: 'var(--gradient-primary)',
  /** Small labels on the dark hero. */
  heroLabel: '#93c5fd',
  // Each new token carries a fallback so the hub renders even if globals.css hasn't reloaded.
  /** Logo colours, used by the home tools hub (panel headers, exam pills, accent line). */
  brandNavy: 'var(--color-brand-navy, #17356d)',
  brandGold: 'var(--color-brand-gold, #c7a14b)',
  /** Home hub panel header: a lighter, softer blue than the logo navy. */
  hubHeader: 'linear-gradient(135deg, #2a52a8 0%, #3b6fd1 100%)',
  /** Richer gold for the hub's exam pills, pill outline and accent line (logo gold is more muted). */
  hubGold: '#d9a62e',
  /** Warm beige section background (dark navy in dark mode). */
  hubBackground: 'var(--color-hub-bg, #f8f5ee)',
} as const;
