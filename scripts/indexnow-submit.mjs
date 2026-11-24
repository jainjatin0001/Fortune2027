// Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver…).
//
//   node scripts/indexnow-submit.mjs                          # https://www.deltatutors.us
//   node scripts/indexnow-submit.mjs https://other-domain.com # another host
//
// Run once after the deploy that serves public/<key>.txt. Day-to-day changes are
// pinged automatically by src/lib/indexnow.ts when admins publish/update content.
// Safe to re-run any time (e.g. after a big SEO change).

import { readFileSync } from 'node:fs';

const SITE = (process.argv[2] ?? 'https://www.deltatutors.us').replace(/\/+$/, '');

// Single source for the key: src/lib/indexnow.ts.
const libSource = readFileSync(new URL('../src/lib/indexnow.ts', import.meta.url), 'utf8');
const KEY = libSource.match(/INDEXNOW_KEY = '([^']+)'/)?.[1];
if (!KEY) throw new Error('INDEXNOW_KEY not found in src/lib/indexnow.ts');

// 1. The key file must be live, or IndexNow rejects the whole batch.
const keyRes = await fetch(`${SITE}/${KEY}.txt`);
const keyBody = (await keyRes.text()).trim();
if (!keyRes.ok || keyBody !== KEY) {
  console.error(`Key file not live at ${SITE}/${KEY}.txt (status ${keyRes.status}). Deploy first.`);
  process.exit(1);
}

// 2. Collect URLs from the live sitemap.
const sitemapRes = await fetch(`${SITE}/sitemap.xml`);
if (!sitemapRes.ok) {
  console.error(`Could not fetch ${SITE}/sitemap.xml (status ${sitemapRes.status}).`);
  process.exit(1);
}
const xml = await sitemapRes.text();
const urlList = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) {
  console.error('Sitemap has no <loc> entries.');
  process.exit(1);
}

// 3. Submit (IndexNow accepts up to 10,000 URLs per request).
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urlList.slice(0, 10000),
  }),
});

console.log(`Submitted ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
if (res.status === 200 || res.status === 202) {
  console.log('Accepted. Bing Webmaster → IndexNow should update within a few hours to a day.');
} else {
  console.log(await res.text());
  process.exit(1);
}
