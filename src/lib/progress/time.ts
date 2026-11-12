// Calendar-day helpers. Streaks, goals and charts are bucketed by the student's
// local day, never the server's — a 11pm answer in New York belongs to that day.

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

/** Cookie set by <TimeZoneSync /> from the browser's Intl time zone. */
export const TZ_COOKIE = 'tz';
const FALLBACK_TZ = 'UTC';

export function isValidTimeZone(tz: string | undefined | null): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * The student's time zone: the device zone (cookie) wins because the profile
 * default is a placeholder most students never change; then the profile; then UTC.
 */
export async function getUserTimeZone(userId: string): Promise<string> {
  const fromCookie = (await cookies()).get(TZ_COOKIE)?.value;
  if (isValidTimeZone(fromCookie)) return fromCookie;

  const profile = await prisma.profile.findUnique({ where: { userId }, select: { timezone: true } });
  return isValidTimeZone(profile?.timezone) ? profile.timezone : FALLBACK_TZ;
}

/** 'YYYY-MM-DD' for the instant `at`, as seen on a wall clock in `tz`. */
export function toDateKey(at: Date, tz: string): string {
  // en-CA formats as ISO-style YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);
}

/** A date key as the UTC-midnight Date Prisma expects for @db.Date columns. */
export function dateKeyToDb(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

/** A @db.Date value read back from Prisma as a date key. */
export function dbToDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(key: string, days: number): string {
  const d = dateKeyToDb(key);
  d.setUTCDate(d.getUTCDate() + days);
  return dbToDateKey(d);
}

/** Whole days from `from` to `to` (both date keys). */
export function daysBetween(from: string, to: string): number {
  return Math.round((dateKeyToDb(to).getTime() - dateKeyToDb(from).getTime()) / 86_400_000);
}
