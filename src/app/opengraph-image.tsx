import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Delta Tutors: online SAT, ACT, AP and coding tutoring for US and Canadian students';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: 'Digital SAT · ACT · AP · Coding',
    title: 'Live 1:1 tutoring and full-length practice tests',
    subtitle: 'Personalized test prep for high school students in the US & Canada',
  });
}
