import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CourseCategory, DifficultyLevel } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'USD'): string {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', options ?? { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (Number.isInteger(hours)) return `${hours}h`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getDifficultyLabel(difficulty: DifficultyLevel): string {
  const map: Record<DifficultyLevel, string> = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
    EXPERT: 'Expert',
  };
  return map[difficulty];
}

export function getDifficultyClass(difficulty: DifficultyLevel): string {
  const map: Record<DifficultyLevel, string> = {
    EASY: 'difficulty-easy',
    MEDIUM: 'difficulty-medium',
    HARD: 'difficulty-hard',
    EXPERT: 'difficulty-expert',
  };
  return map[difficulty];
}

export function getCategoryLabel(category: CourseCategory): string {
  const map: Record<CourseCategory, string> = {
    SAT_PREP: 'SAT Prep',
    ACT_PREP: 'ACT Prep',
    AP_EXAM: 'AP Exam',
    HIGH_SCHOOL: 'High School',
    CODING: 'Coding',
    OTHER: 'Other',
  };
  return map[category];
}

export function getCategoryBadgeClass(category: CourseCategory): string {
  const map: Record<CourseCategory, string> = {
    SAT_PREP: 'badge-sat',
    ACT_PREP: 'badge-act',
    AP_EXAM: 'badge-ap',
    HIGH_SCHOOL: 'badge-hs',
    CODING: 'badge-coding',
    OTHER: '',
  };
  return map[category];
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function generateStarArray(rating: number): (0 | 0.5 | 1)[] {
  return Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return 1;
    if (rating >= i + 0.5) return 0.5;
    return 0;
  });
}
