import type { ExamSchedule, StudyPlanContent } from './dates';
import { SAT_SCHEDULE, SAT_STUDY_PLAN } from './sat-dates';
import { ACT_US_SCHEDULE, ACT_INTERNATIONAL_SCHEDULE, ACT_STUDY_PLAN } from './act-dates';

export type ExamKey = 'sat' | 'act';

/** Per-exam settings shared by every tool page, card and section. Data only (server- and client-safe). */
export type ExamInfo = {
  key: ExamKey;
  name: string;
  prepPath: string;
  prepLabel: string;
  /** Signed-in students go here from the mock test card; guests go to the dashboard preview. */
  mockTestPath: string;
  /** Pre-fills "Course / Subject" in the contact pop-up. */
  contactCourse: string;
  /** First schedule drives the "Next SAT/ACT" countdown on cards. */
  schedules: ExamSchedule[];
  studyPlan: StudyPlanContent;
};

export const EXAMS: Record<ExamKey, ExamInfo> = {
  sat: {
    key: 'sat',
    name: 'SAT',
    prepPath: '/sat-prep',
    prepLabel: 'SAT Prep',
    mockTestPath: '/dashboard/sat-exam',
    contactCourse: 'SAT Prep',
    schedules: [SAT_SCHEDULE],
    studyPlan: SAT_STUDY_PLAN,
  },
  act: {
    key: 'act',
    name: 'ACT',
    prepPath: '/act-prep',
    prepLabel: 'ACT Prep',
    mockTestPath: '/dashboard/act-exam',
    contactCourse: 'ACT Prep',
    schedules: [ACT_US_SCHEDULE, ACT_INTERNATIONAL_SCHEDULE],
    studyPlan: ACT_STUDY_PLAN,
  },
};

/** Guest destination for mock test cards: /dashboard shows a sign-up preview when signed out. */
export const GUEST_DASHBOARD_PATH = '/dashboard';
