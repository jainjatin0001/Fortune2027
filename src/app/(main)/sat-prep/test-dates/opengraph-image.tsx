import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';
import { SAT_SCHOOL_YEAR } from '@/lib/exams/sat-dates';

export const alt = `SAT test dates ${SAT_SCHOOL_YEAR}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: 'Free SAT tool',
    title: `SAT Test Dates ${SAT_SCHOOL_YEAR}`,
    subtitle: 'Registration deadlines, score release dates and a study plan for every date',
  });
}
