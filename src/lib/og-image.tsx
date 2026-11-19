import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { APP_NAME, APP_URL } from '@/constants';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

let logoCache: string | null = null;
async function getLogoDataUrl(): Promise<string | null> {
  if (logoCache) return logoCache;
  try {
    const buf = await readFile(join(process.cwd(), 'public/images/logos/logo_5.png'));
    logoCache = `data:image/png;base64,${buf.toString('base64')}`;
    return logoCache;
  } catch {
    return null;
  }
}

/** Branded 1200×630 social preview card used by every opengraph-image route. */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const logo = await getLogoDataUrl();
  const shortTitle = title.length > 90 ? `${title.slice(0, 87)}…` : title;
  const titleSize = shortTitle.length > 60 ? 54 : shortTitle.length > 35 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #0f1f4d 0%, #1e3a8a 55%, #2563eb 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={44} height={64} alt="" style={{ objectFit: 'contain' }} />
          )}
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>{APP_NAME}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {eyebrow && (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                fontSize: 24,
                fontWeight: 600,
                padding: '8px 18px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.14)',
                color: '#dbeafe',
              }}
            >
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: titleSize, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
            {shortTitle}
          </div>
          {subtitle && (
            <div style={{ fontSize: 28, color: '#cbd5e1', lineHeight: 1.35 }}>{subtitle}</div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#bfdbfe' }}>
          <div>Online tutoring · United States & Canada</div>
          <div>{new URL(APP_URL).host.replace(/^www\./, '')}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
