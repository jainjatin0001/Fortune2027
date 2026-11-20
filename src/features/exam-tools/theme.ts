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
} as const;
