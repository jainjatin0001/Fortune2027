import { COMMON_STUDY_TASKS as T, type ExamSchedule, type StudyPlanContent } from './dates';

/**
 * Official ACT dates. Sources, checked 2026-11-20:
 * - US: act.org/content/act/en/products-and-services/the-act/registration/test-dates.html
 *   ("National test dates are for the United States, US territories, and Puerto Rico";
 *   deadlines 11:59 pm Central Time).
 * - Canada & other countries: ACT "International Test Dates 2026 | 2027" (global.act.org).
 * - Fees: act.org/.../the-act/registration/fees.html
 * To roll over to a new school year, edit this file only.
 */

export const ACT_DATES_LAST_CHECKED = '2026-11-20';
export const ACT_SCHOOL_YEAR = '2026–27';

export const ACT_FEES = {
  base: 70,
  science: 5,
  writing: 25,
  lateRegistration: 42,
  standby: 75,
  sourceUrl: 'https://www.act.org/content/act/en/products-and-services/the-act/registration/fees.html',
} as const;

export const ACT_US_SCHEDULE: ExamSchedule = {
  id: 'us',
  title: `US ACT dates ${ACT_SCHOOL_YEAR}`,
  region: 'United States, US territories and Puerto Rico',
  shortRegion: 'US',
  timeZone: 'America/Chicago',
  deadlineTime: '11:59 p.m. CT',
  lateFee: ACT_FEES.lateRegistration,
  registerUrl: 'https://www.act.org/content/act/en/products-and-services/the-act/registration/test-dates.html',
  registerLabel: 'Register on ACT.org',
  dates: [
    { testDate: '2026-09-19', registrationDeadline: '2026-08-14', lateDeadline: '2026-09-01', scoreRelease: '2026-10-06',
      bestFor: 'Seniors who want a fall score in time for early applications.' },
    { testDate: '2026-10-17', registrationDeadline: '2026-09-11', lateDeadline: '2026-09-29', scoreRelease: '2026-10-27',
      bestFor: 'Seniors applying Early Action or Early Decision: scores arrive in late October.' },
    { testDate: '2026-12-12', registrationDeadline: '2026-11-09', lateDeadline: '2026-11-29', scoreRelease: '2026-12-22',
      bestFor: 'The last fall date for most seniors applying Regular Decision. Check each college accepts December scores.' },
    { testDate: '2027-02-27', registrationDeadline: '2027-01-22', lateDeadline: '2027-02-09', scoreRelease: '2027-03-16',
      bestFor: 'Juniors taking their first official ACT after winter prep.' },
    { testDate: '2027-04-10', registrationDeadline: '2027-03-05', lateDeadline: '2027-03-23', scoreRelease: '2027-04-20',
      bestFor: 'Juniors on a second attempt, before AP exams in May.' },
    { testDate: '2027-06-12', registrationDeadline: '2027-05-07', lateDeadline: '2027-05-25', scoreRelease: '2027-06-23',
      bestFor: 'Juniors who want a strong score before summer and senior year.' },
    { testDate: '2027-07-10', registrationDeadline: '2027-06-04', lateDeadline: '2027-06-22', scoreRelease: '2027-07-20',
      bestFor: 'Rising seniors who want a final attempt over the summer, with no school-year workload.' },
  ],
};

/** Canada uses ACT's international schedule: two-day windows and different deadlines. */
export const ACT_INTERNATIONAL_SCHEDULE: ExamSchedule = {
  id: 'international',
  title: `Canada & International ACT dates ${ACT_SCHOOL_YEAR}`,
  region: 'Canada and every country outside the US',
  shortRegion: 'Canada & International',
  timeZone: 'America/Toronto',
  registerUrl: 'https://global.act.org/content/global/en/products-and-services/the-act-non-us.html',
  registerLabel: 'Register on ACT Global',
  dates: [
    { testDate: '2026-09-05', registrationDeadline: '2026-08-07', lateDeadline: '2026-08-21' },
    { testDate: '2026-10-23', testDateEnd: '2026-10-24', registrationDeadline: '2026-09-25', lateDeadline: '2026-10-09' },
    { testDate: '2026-12-11', testDateEnd: '2026-12-12', registrationDeadline: '2026-11-13', lateDeadline: '2026-11-27' },
    { testDate: '2027-02-12', testDateEnd: '2027-02-13', registrationDeadline: '2027-01-15', lateDeadline: '2027-01-29' },
    { testDate: '2027-04-02', testDateEnd: '2027-04-03', registrationDeadline: '2027-03-05', lateDeadline: '2027-03-19' },
    { testDate: '2027-06-11', testDateEnd: '2027-06-12', registrationDeadline: '2027-05-14', lateDeadline: '2027-05-28' },
    { testDate: '2027-07-09', testDateEnd: '2027-07-10', registrationDeadline: '2027-06-11', lateDeadline: '2027-06-25' },
  ],
};

/** ACT's projected (subject to change) US dates for next school year. */
export const ACT_NEXT_YEAR = {
  schoolYear: '2027–28',
  dates: ['2027-09-11', '2027-10-16', '2027-12-11', '2028-02-26', '2028-04-08', '2028-06-10', '2028-07-15'],
};

export const ACT_STUDY_PLAN: StudyPlanContent = {
  diagnostic: [
    'Take a full, timed ACT practice test: English, Math and Reading, plus Science if you will take it.',
    'Set a target composite from the middle 50% range of your college list.',
    'List your 3–5 weakest skills from the results.',
  ],
  skills: [
    T.studyHabit,
    'Start with your lowest section: grammar rules for English, algebra and geometry for Math, passage strategy for Reading.',
    T.errorLog,
  ],
  practice: [
    T.weeklyTest,
    T.review,
    'Practise pacing: about 42 seconds per English question and about 67 seconds per Math or Reading question.',
  ],
  finalWeek: [
    T.lightReview,
    'Print your admission ticket and pack your photo ID and an ACT-approved calculator.',
    T.sleep,
  ],
};
