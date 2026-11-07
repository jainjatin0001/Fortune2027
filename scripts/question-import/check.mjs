// Checks a batch JSON before handing it over:
//   - every math node renders in KaTeX (throwOnError)
//   - no unconverted \( \[ delimiters left in the HTML
//   - SINGLE_CORRECT answer key matches the PDF "Correct Answer" letter
//   - every <img src="file"> exists in the batch folder and has width/height
// usage: node scripts/question-import/check.mjs imports/<batch>/<batch>.json

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import katex from 'katex';

const file = process.argv[2];
const dir = dirname(file);
const data = JSON.parse(readFileSync(file, 'utf8'));
const unescape = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

let mathNodes = 0;
const problems = [];
for (const q of data.questions) {
  const htmls = [q.statement, q.explanation ?? '', ...q.options.map(o => o.content)];
  for (const html of htmls) {
    for (const m of html.matchAll(/data-math-src="([^"]*)"/g)) {
      mathNodes++;
      try { katex.renderToString(unescape(m[1]), { throwOnError: true }); }
      catch (e) { problems.push(`${q.externalId}: KaTeX "${unescape(m[1])}" — ${e.message}`); }
    }
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
      const src = m[0].match(/src="([^"]+)"/)?.[1] ?? '';
      if (!/\bwidth="\d+"/.test(m[0]) || !/\bheight="\d+"/.test(m[0])) problems.push(`${q.externalId}: <img ${src}> missing width/height`);
      if (!/^https?:/.test(src) && !existsSync(join(dir, src))) problems.push(`${q.externalId}: figure file ${src} not in batch folder`);
    }
  }
  if (/\\\(|\\\[/.test(htmls.join(''))) problems.push(`${q.externalId}: unconverted math delimiter`);
  if (q.questionType === 'SINGLE_CORRECT' && q.pdfCorrectAnswer != null) {
    const marked = q.options.map((o, i) => (o.isCorrect ? 'ABCDEFGH'[i] : '')).join('');
    if (marked !== q.pdfCorrectAnswer) problems.push(`${q.externalId}: marked ${marked || 'none'}, PDF says ${q.pdfCorrectAnswer}`);
  }
  if (q.pdfCorrectAnswer == null) problems.push(`${q.externalId}: no "Correct Answer" line in PDF (will be flagged for review)`);
}

problems.forEach(p => console.log('•', p));
console.log(`${data.questions.length} questions, ${mathNodes} math nodes, ${problems.length} issue(s)`);
