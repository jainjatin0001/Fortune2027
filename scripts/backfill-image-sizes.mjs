// One-off: add width/height attributes to <img> tags in question HTML that lack them,
// so quiz/exam pages can reserve space before images load (no layout jump).
//
//   node scripts/backfill-image-sizes.mjs           # dry run — prints what would change
//   node scripts/backfill-image-sizes.mjs --apply   # writes the changes
//
// Uses DATABASE_URL from .env.local / .env. Safe to re-run: tags that already have a width are skipped.

import { config } from 'dotenv';
import pg from 'pg';
import sharp from 'sharp';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const APPLY = process.argv.includes('--apply');

// [table, id column, html column]
const TARGETS = [
  ['questions', 'id', 'statement'],
  ['questions', 'id', 'explanation'],
  ['question_options', 'id', 'content'],
  ['question_options', 'id', 'explanation'],
];

const IMG_WITHOUT_WIDTH = /<img\b(?![^>]*\bwidth=)[^>]*>/gi;
const sizeCache = new Map();

async function imageSize(src) {
  if (!sizeCache.has(src)) {
    sizeCache.set(src, (async () => {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { width, height } = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
      if (!width || !height) throw new Error('no dimensions');
      return { width, height };
    })());
  }
  return sizeCache.get(src);
}

async function addSizes(html) {
  let out = html;
  let changed = 0;
  for (const tag of html.match(IMG_WITHOUT_WIDTH) ?? []) {
    const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
    if (!src) continue;
    try {
      const { width, height } = await imageSize(src);
      out = out.replace(tag, tag.replace(/^<img\b/i, `<img width="${width}" height="${height}"`));
      changed++;
    } catch (e) {
      console.warn(`  ! skipped ${src}: ${e.message}`);
    }
  }
  return { out, changed };
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} on ${new URL(process.env.DATABASE_URL).host}\n`);

let rows = 0;
let images = 0;
for (const [table, idCol, col] of TARGETS) {
  const { rows: found } = await client.query(
    `SELECT "${idCol}" AS id, "${col}" AS html FROM ${table} WHERE "${col}" LIKE '%<img%'`,
  );
  for (const { id, html } of found) {
    const { out, changed } = await addSizes(html);
    if (!changed) continue;
    rows++;
    images += changed;
    console.log(`${table}.${col} ${id}: ${changed} image(s)  ${out.match(/<img[^>]*>/i)?.[0].slice(0, 110)}`);
    if (APPLY) await client.query(`UPDATE ${table} SET "${col}" = $1 WHERE "${idCol}" = $2`, [out, id]);
  }
}

await client.end();
console.log(`\n${rows} row(s), ${images} image(s) ${APPLY ? 'updated' : 'would be updated — re-run with --apply to write'}`);
