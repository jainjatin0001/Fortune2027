import { COMMON_STUDY_TASKS as T, type ExamSchedule, type StudyPlanContent } from './dates';

/**
 * Official SAT Weekend dates. Source: College Board
 * (satsuite.collegeboard.org/sat/dates-deadlines and /scores/score-release-dates),
 * checked 2026-11-20. To roll over to a new school year, edit this file only.
 */

export const SAT_DATES_LAST_CHECKED = '2026-11-20';
export const SAT_SCHOOL_YEAR = '2026–27';

export const SAT_FEES = {
  registration: 68,
  internationalFee: 43,
  lateRegistration: 38,
  sourceUrl: 'https://satsuite.collegeboard.org/sat/registration/fees-refunds/test-fees',
} as const;

/** The SAT uses one schedule for the US, Canada and every other country. */
export const SAT_SCHEDULE: ExamSchedule = {
  id: 'all',
  title: `All ${SAT_SCHOOL_YEAR} SAT dates and deadlines`,
  region: 'Students in the United States, Canada and worldwide',
  shortRegion: 'US, Canada & worldwide',
  timeZone: 'America/New_York',
  deadlineTime: '11:59 p.m. ET',
  lateFee: SAT_FEES.lateRegistration,
  registerUrl: 'https://satsuite.collegeboard.org/sat/dates-deadlines',
  registerLabel: 'Register on College Board',
  dates: [
    { testDate: '2026-08-22', registrationDeadline: '2026-08-07', lateDeadline: '2026-08-11', scoreRelease: '2026-09-04',
      bestFor: 'Rising seniors who want a score early, with time left for a fall retake.' },
    { testDate: '2026-09-12', registrationDeadline: '2026-08-28', lateDeadline: '2026-09-01', scoreRelease: '2026-09-25',
      bestFor: 'Seniors applying Early Action or Early Decision who may want an October retake.' },
    { testDate: '2026-10-03', registrationDeadline: '2026-09-18', lateDeadline: '2026-09-22', scoreRelease: '2026-10-16',
      bestFor: 'Seniors with November 1 early deadlines: scores arrive in mid-October.' },
    { testDate: '2026-11-07', registrationDeadline: '2026-10-23', lateDeadline: '2026-10-27', scoreRelease: '2026-11-20',
      bestFor: 'Seniors applying Regular Decision who want one more attempt.' },
    { testDate: '2026-12-05', registrationDeadline: '2026-11-20', lateDeadline: '2026-11-24', scoreRelease: '2026-12-18',
      bestFor: 'The last fall date for most seniors applying Regular Decision. Check each college accepts December scores.' },
    { testDate: '2027-03-06', registrationDeadline: '2027-02-19', lateDeadline: '2027-02-23', scoreRelease: '2027-03-19',
      bestFor: 'Juniors taking their first official SAT after winter prep.' },
    { testDate: '2027-05-01', registrationDeadline: '2027-04-16', lateDeadline: '2027-04-20', scoreRelease: '2027-05-14',
      bestFor: 'Juniors on a second attempt. AP exams follow right after, so start prep early.' },
    { testDate: '2027-06-05', registrationDeadline: '2027-05-21', lateDeadline: '2027-05-25', scoreRelease: '2027-06-21',
      bestFor: 'Juniors who want a final spring attempt before senior year.' },
  ],
};

/** College Board's anticipated (not final) dates for next school year. */
export const SAT_NEXT_YEAR = {
  schoolYear: '2027–28',
  dates: ['2027-08-28', '2027-09-18', '2027-10-09', '2027-11-06', '2027-12-04', '2028-03-04', '2028-05-06', '2028-06-03'],
};

export const SAT_STUDY_PLAN: StudyPlanContent = {
  diagnostic: [
    'Take a full, timed digital practice test in Bluebook.',
    'Set a target score from the middle 50% range of your college list.',
    'List your 3–5 weakest skills from the score report.',
  ],
  skills: [T.studyHabit, 'Work through your weakest Math and Reading & Writing skills first.', T.errorLog],
  practice: [
    T.weeklyTest,
    T.review,
    'Practise pacing: about 71 seconds per Reading & Writing question and 95 seconds per Math question.',
  ],
  finalWeek: [
    T.lightReview,
    'Install and update Bluebook, check your device, and download your admission ticket.',
    T.sleep,
  ],
};
