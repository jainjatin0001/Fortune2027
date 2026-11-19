// One-off SEO cleanup: fix the typo'd / uppercase course slugs and trim stray
// whitespace from course titles (it leaks into <title> and og:title).
//
//   node scripts/seo-rename-course-slugs.mjs           # dry run: runs inside BEGIN … ROLLBACK, prints the result
//   node scripts/seo-rename-course-slugs.mjs --apply   # commits
//
// Run --apply right AFTER the deploy that adds the 301 redirects in next.config.ts,
// so old URLs redirect to the new slugs as soon as they exist.
// Safe to re-run: rows already renamed are skipped.
//
// Undo:  UPDATE courses SET slug = 'delta-sat-ecxellence' WHERE slug = 'delta-sat-excellence';
//        UPDATE courses SET slug = 'AP-Calculus-AB-2026'  WHERE slug = 'ap-calculus-ab';
//        (and remove the two redirects from next.config.ts)

import { config } from 'dotenv';
import pg from 'pg';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

const APPLY = process.argv.includes('--apply');

const RENAMES = [
  ['delta-sat-ecxellence', 'delta-sat-excellence'],
  ['AP-Calculus-AB-2026', 'ap-calculus-ab'],
];

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  await client.query('BEGIN');

  for (const [from, to] of RENAMES) {
    const taken = await client.query('SELECT id FROM courses WHERE slug = $1', [to]);
    if (taken.rowCount) {
      console.log(`skip  ${from} -> ${to}: target slug already exists`);
      continue;
    }
    const res = await client.query(
      'UPDATE courses SET slug = $2, "updatedAt" = now() WHERE slug = $1 RETURNING id, title',
      [from, to],
    );
    console.log(res.rowCount ? `rename ${from} -> ${to} (${res.rows[0].title})` : `skip  ${from}: not found`);
  }

  const trimmed = await client.query(
    `UPDATE courses SET title = btrim(title), "updatedAt" = now()
     WHERE title <> btrim(title) RETURNING slug, title`,
  );
  for (const row of trimmed.rows) console.log(`trim  title of ${row.slug} -> "${row.title}"`);

  const after = await client.query('SELECT slug, title, "isPublished" FROM courses ORDER BY "createdAt"');
  console.table(after.rows);

  if (APPLY) {
    await client.query('COMMIT');
    console.log('COMMITTED');
  } else {
    await client.query('ROLLBACK');
    console.log('DRY RUN: rolled back. Re-run with --apply to commit.');
  }
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  await client.end();
}
