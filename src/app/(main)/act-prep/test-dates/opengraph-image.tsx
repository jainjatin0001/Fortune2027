import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';
import { ACT_SCHOOL_YEAR } from '@/lib/exams/act-dates';

export const alt = `ACT test dates ${ACT_SCHOOL_YEAR}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: 'Free ACT tool',
    title: `ACT Test Dates ${ACT_SCHOOL_YEAR}`,
    subtitle: 'US & Canada registration deadlines and a study plan for every date',
  });
}
