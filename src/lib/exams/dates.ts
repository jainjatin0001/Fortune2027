/**
 * Exam-agnostic test date logic shared by the SAT and ACT tool pages.
 * Dates are ISO calendar dates (YYYY-MM-DD); no time-of-day maths, so there
 * are no daylight-saving or server-timezone bugs.
 */

export type ExamTestDate = {
  /** First (or only) test day. */
  testDate: string;
  /** Last day for multi-day international windows, e.g. ACT "23–24 October". */
  testDateEnd?: string;
  registrationDeadline: string;
  /** Last day to register with a late fee (also the change/cancel deadline). */
  lateDeadline: string;
  scoreRelease?: string;
  bestFor?: string;
};

export type ExamSchedule = {
  id: string;
  /** Section heading, e.g. "US test dates". */
  title: string;
  /** Who the schedule applies to. */
  region: string;
  /** Short label for cards, e.g. "US" or "Canada & international". */
  shortRegion: string;
  /** IANA zone used to decide what "today" is for statuses. */
  timeZone: string;
  /** Shown after deadlines, e.g. "11:59 p.m. ET". Omit when the source doesn't say. */
  deadlineTime?: string;
  /** Late registration fee in USD, when published. */
  lateFee?: number;
  registerUrl: string;
  /** Button text, e.g. "Register on College Board". */
  registerLabel: string;
  dates: ExamTestDate[];
};

// ─── Calendar helpers ────────────────────────────────────────────────────────

export function todayIn(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function toUtc(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / 86_400_000);
}

export function addDays(iso: string, days: number): string {
  return new Date(toUtc(iso) + days * 86_400_000).toISOString().slice(0, 10);
}

export function formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(toUtc(iso)));
}

/**
 * "December 12, 2026" or, for windows, "October 23–24, 2026".
 * No weekday on purpose: "Sat" reads like the SAT exam.
 */
export function formatTestDate(date: ExamTestDate, style: 'long' | 'short' = 'long'): string {
  if (!date.testDateEnd) return formatDate(date.testDate, style);
  const month = style === 'long' ? 'long' : 'short';
  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts }).format(new Date(toUtc(iso)));
  const [y1, m1] = date.testDate.split('-');
  const [y2, m2] = date.testDateEnd.split('-');
  if (y1 === y2 && m1 === m2) {
    return `${fmt(date.testDate, { month })} ${fmt(date.testDate, { day: 'numeric' })}–${fmt(date.testDateEnd, { day: 'numeric' })}, ${y1}`;
  }
  return `${fmt(date.testDate, { month, day: 'numeric' })} – ${fmt(date.testDateEnd, { month, day: 'numeric', year: 'numeric' })}`;
}

/** "today", "tomorrow", "in 5 days", "in 3 weeks" */
export function relativeDays(days: number): string {
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days < 21) return `in ${days} days`;
  return `in ${Math.round(days / 7)} weeks`;
}

// ─── Status ─────────────────────────────────────────────────────────────────

export type DateStatus = 'past' | 'open' | 'late' | 'closed';

export function getDateStatus(date: ExamTestDate, today: string): DateStatus {
  if (today >= date.testDate) return 'past';
  if (today <= date.registrationDeadline) return 'open';
  if (today <= date.lateDeadline) return 'late';
  return 'closed';
}

export function getUpcomingDates(schedule: ExamSchedule, today = todayIn(schedule.timeZone)): ExamTestDate[] {
  return schedule.dates.filter((d) => d.testDate > today);
}

export function getNextDate(schedule: ExamSchedule, today = todayIn(schedule.timeZone)): ExamTestDate | undefined {
  return getUpcomingDates(schedule, today)[0];
}

// ─── Study plan ─────────────────────────────────────────────────────────────

export const RECOMMENDED_PREP_WEEKS = 12;

/** Exam-specific tasks for each phase of the 12-week plan. */
export type StudyPlanContent = {
  diagnostic: string[];
  skills: string[];
  practice: string[];
  finalWeek: string[];
};

export type StudyPhase = { title: string; start: string; end: string; tasks: string[] };

export function buildStudyPlan(testDate: string, content: StudyPlanContent): StudyPhase[] {
  const weekStart = (weeksBefore: number) => addDays(testDate, -7 * weeksBefore);
  return [
    { title: 'Week 1: Diagnostic and goal', start: weekStart(12), end: addDays(weekStart(11), -1), tasks: content.diagnostic },
    { title: 'Weeks 2–7: Build skills', start: weekStart(11), end: addDays(weekStart(5), -1), tasks: content.skills },
    { title: 'Weeks 8–11: Timed practice', start: weekStart(5), end: addDays(weekStart(1), -1), tasks: content.practice },
    { title: 'Final week: Review and rest', start: weekStart(1), end: addDays(testDate, -1), tasks: content.finalWeek },
  ];
}

/** Tasks that are the same for every exam. */
export const COMMON_STUDY_TASKS = {
  studyHabit: 'Study 4–5 days a week, 45–60 minutes a session.',
  errorLog: 'Keep an error log: note why you missed each question, not just the answer.',
  weeklyTest: 'Take one full timed practice test a week, at the same time of day as the real test.',
  review: 'Review every mistake within 48 hours of each test.',
  lightReview: 'Light review of your error log only. No new full tests after midweek.',
  sleep: 'Plan the route to your test center and get a full night of sleep.',
} as const;
