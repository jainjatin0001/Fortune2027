import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'SAT score calculator and superscore calculator';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: 'Free SAT tool',
    title: 'SAT Score & Superscore Calculator',
    subtitle: 'Combine your best section scores and estimate your digital SAT score',
  });
}
