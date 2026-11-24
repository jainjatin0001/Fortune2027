import { after } from 'next/server';
import { APP_URL } from '@/constants';
import { absoluteUrl } from '@/lib/seo';

/**
 * IndexNow: tells Bing (and Yandex, Seznam, Naver…) that a public URL was
 * added, changed or removed, so it is recrawled in minutes instead of days.
 *
 * The key is public by design: it must match public/<key>.txt, which is how
 * the search engine verifies we own the host. It never needs rotating.
 */
export const INDEXNOW_KEY = 'ffb7e806bba84c119a4ba31421a3eed7';

const ENDPOINT = 'https://api.indexnow.org/indexnow';

/** Only ping from a real deployment; never from localhost/dev. */
function enabled(): boolean {
  return process.env.NODE_ENV === 'production' && APP_URL.startsWith('https://');
}

async function submit(paths: string[]): Promise<void> {
  const urlList = [...new Set(paths.map((p) => absoluteUrl(p)))];
  if (!urlList.length || !enabled()) return;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(APP_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`),
        urlList,
      }),
    });
    if (!res.ok) console.warn(`[indexnow] ${res.status} for ${urlList.join(', ')}`);
  } catch (e) {
    console.warn('[indexnow] request failed', e);
  }
}

/**
 * Queue an IndexNow ping for these site paths (e.g. '/blog/my-post').
 * Runs after the response is sent, so it never slows down or breaks the
 * admin request that triggered it.
 */
export function pingIndexNow(...paths: string[]): void {
  after(() => submit(paths));
}
