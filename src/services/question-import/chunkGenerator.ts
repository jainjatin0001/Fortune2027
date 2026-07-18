export interface TextChunk {
  id: string;
  index: number;
  text: string;
}

const QUESTION_START = /(?:^|\n)\s*(?:Question\s*)?(\d{1,4})[\).:-]\s+/gi;

export function splitQuestionTextIntoChunks(text: string, questionsPerChunk: number): TextChunk[] {
  const size = Math.max(1, Math.min(25, questionsPerChunk));
  const matches = [...text.matchAll(QUESTION_START)];

  if (matches.length < 2) {
    return fallbackChunks(text, size);
  }

  const questionBlocks = matches.map((match, idx) => {
    const start = match.index ?? 0;
    const end = idx + 1 < matches.length ? matches[idx + 1].index ?? text.length : text.length;
    return text.slice(start, end).trim();
  }).filter(Boolean);

  const chunks: TextChunk[] = [];
  for (let i = 0; i < questionBlocks.length; i += size) {
    chunks.push({
      id: `chunk-${chunks.length + 1}`,
      index: chunks.length,
      text: questionBlocks.slice(i, i + size).join('\n\n'),
    });
  }
  return chunks;
}

function fallbackChunks(text: string, questionsPerChunk: number): TextChunk[] {
  const maxChars = Math.max(5000, questionsPerChunk * 1800);
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks: TextChunk[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (next.length > maxChars && current) {
      chunks.push({ id: `chunk-${chunks.length + 1}`, index: chunks.length, text: current });
      current = paragraph;
    } else {
      current = next;
    }
  }

  if (current) chunks.push({ id: `chunk-${chunks.length + 1}`, index: chunks.length, text: current });
  return chunks;
}
