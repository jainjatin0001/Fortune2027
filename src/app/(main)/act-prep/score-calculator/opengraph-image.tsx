import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'ACT score calculator and superscore calculator';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: 'Free ACT tool',
    title: 'ACT Score & Superscore Calculator',
    subtitle: 'Superscore and composite, updated for the new ACT scoring',
  });
}
