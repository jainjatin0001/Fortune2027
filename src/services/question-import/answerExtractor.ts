import type { AnswerMap } from './types';
import { generateStrictJson } from './ollamaClient';
import { parseStrictJsonObject, recordToStringMap } from './json';

export async function extractAnswers(answerText: string): Promise<AnswerMap> {
  const json = await generateStrictJson(`/no_think

Extract answer keys from this PDF text.

Rules:
- Return STRICT JSON only. No markdown. No prose.
- Be concise. Do not include reasoning.
- Extract only answers explicitly present in the text.
- Do not solve questions.
- Normalize labels to uppercase, e.g. A, B, C, D or A,C for multiple answers.
- Return shape: { "answers": { "1": "A", "2": "B" } }

Answer key text:
${answerText}`);

  return normalizeAnswers(parseStrictJsonObject(json));
}

export function normalizeAnswers(root: Record<string, unknown>): AnswerMap {
  const source = root.answers && typeof root.answers === 'object' && !Array.isArray(root.answers)
    ? root.answers as Record<string, unknown>
    : root;
  const mapped = recordToStringMap(source);
  const normalized: AnswerMap = {};

  for (const [questionNumber, answer] of Object.entries(mapped)) {
    const key = questionNumber.replace(/[^\dA-Za-z.-]/g, '').trim();
    const value = answer.toUpperCase().replace(/\s+/g, '').replace(/[;|]/g, ',');
    if (key && value) normalized[key] = value;
  }

  return normalized;
}
