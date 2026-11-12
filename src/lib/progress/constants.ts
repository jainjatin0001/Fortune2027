// Client-safe constants shared by the dashboard UI and its server actions
export const DAILY_GOAL_MIN = 1;
export const DAILY_GOAL_MAX = 200;
export const DAILY_GOAL_PRESETS = [5, 10, 20, 30] as const;

/**
 * Official Digital SAT pace, keyed by daily-question track slug (the tracks already
 * group subjects into Math / Verbal). Math: 70 min ÷ 44 Qs; Reading & Writing: 64 min ÷ 54 Qs.
 */
export const PACE_TARGET_SECONDS: Record<string, number> = {
  'sat-math': 95,
  'sat-verbal': 71,
};
