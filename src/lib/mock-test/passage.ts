// Splits a reading-style question into the stimulus (passage, notes, table, graph…)
// and the question stem, so the exam can show them side by side like the real
// digital tests. Nothing is stored — the question text stays whole in the bank and
// is only split when a test is served.
//
// A statement is split only when it is a clean run of top-level blocks whose last
// non-empty block is a paragraph ending in "?" (the stem). Anything else returns
// null and the question is shown in a single column, exactly as stored.

const VOID_TAGS = new Set(['img', 'br', 'hr', 'source', 'col', 'wbr']);
const TAG = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;

interface Block { name: string; html: string }

const plainText = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/** Top-level elements of an HTML fragment, or null if it isn't a clean block list. */
function topLevelBlocks(html: string): Block[] | null {
  const blocks: Block[] = [];
  let depth = 0;
  let start = 0;
  let open = '';
  let last = 0;
  TAG.lastIndex = 0;
  for (let m = TAG.exec(html); m; m = TAG.exec(html)) {
    const [tag, rawName, selfClose] = m;
    const name = rawName.toLowerCase();
    // Loose text between top-level blocks means the structure isn't what we expect
    if (depth === 0 && html.slice(last, m.index).trim()) return null;
    if (tag.startsWith('</')) {
      depth--;
      if (depth < 0) return null;
      if (depth === 0) blocks.push({ name: open, html: html.slice(start, m.index + tag.length) });
    } else if (VOID_TAGS.has(name) || selfClose) {
      if (depth === 0) blocks.push({ name, html: tag });
    } else {
      if (depth === 0) { start = m.index; open = name; }
      depth++;
    }
    last = TAG.lastIndex;
  }
  if (depth !== 0 || html.slice(last).trim()) return null;
  return blocks;
}

const isEmptyBlock = (b: Block) => b.name === 'p' && !plainText(b.html) && !/<(img|div|span)\b/i.test(b.html);

export function splitPassage(statement: string): { passage: string; stem: string } | null {
  const blocks = topLevelBlocks(statement);
  if (!blocks) return null;
  const content = blocks.filter(b => !isEmptyBlock(b));
  if (content.length < 2) return null;

  const stemBlocks = [content[content.length - 1]];
  if (stemBlocks[0].name !== 'p' || !/\?$/.test(plainText(stemBlocks[0].html))) return null;

  // A goal sentence in its own paragraph ("The student wants to…") belongs with the question
  const before = content[content.length - 2];
  if (content.length > 2 && before.name === 'p' && /^The (student|researcher) wants\b/.test(plainText(before.html))) {
    stemBlocks.unshift(before);
  }

  const passageBlocks = content.slice(0, content.length - stemBlocks.length);
  const passage = passageBlocks.map(b => b.html).join('');
  // The passage must carry real content: text, an image, a table or a math block
  if (!plainText(passage) && !/<(img|table|div)\b/i.test(passage)) return null;

  return { passage, stem: stemBlocks.map(b => b.html).join('') };
}
