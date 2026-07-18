import type { ExplanationMap } from './types';
import { generateStrictJson } from './ollamaClient';
import { parseStrictJsonObject, recordToStringMap } from './json';

export async function extractExplanations(explanationText: string): Promise<ExplanationMap> {
  const json = await generateStrictJson(`/no_think

Extract answer explanations from this PDF text.

Rules:
- Return STRICT JSON only. No markdown. No prose.
- Be concise. Do not include reasoning.
- Extract only explanations explicitly present in the text.
- Do not generate missing explanations.
- Return shape: { "explanations": { "1": "Explanation text", "2": "Explanation text" } }

Explanation PDF text:
${explanationText}`);

  return normalizeExplanations(parseStrictJsonObject(json));
}

export function normalizeExplanations(root: Record<string, unknown>): ExplanationMap {
  const source = root.explanations && typeof root.explanations === 'object' && !Array.isArray(root.explanations)
    ? root.explanations as Record<string, unknown>
    : root;
  const mapped = recordToStringMap(source);
  const normalized: ExplanationMap = {};

  for (const [questionNumber, explanation] of Object.entries(mapped)) {
    const key = questionNumber.replace(/[^\dA-Za-z.-]/g, '').trim();
    if (key && explanation) normalized[key] = explanation;
  }

  return normalized;
}
