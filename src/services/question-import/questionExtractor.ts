import type { ExtractedQuestion, ImportOption } from './types';
import { asString, asStringArray, getStringRecord, parseStrictJsonObject } from './json';
import { generateStrictJson } from './ollamaClient';

const ALLOWED_TYPES = new Set(['SINGLE_CORRECT', 'MULTIPLE_CORRECT', 'NUMERIC', 'TEXT']);

export async function extractQuestionsFromChunk(chunkText: string): Promise<ExtractedQuestion[]> {
  const json = await generateStrictJson(buildQuestionPrompt(chunkText));
  return normalizeQuestions(parseStrictJsonObject(json));
}

export function normalizeQuestions(root: Record<string, unknown>): ExtractedQuestion[] {
  const rawQuestions = Array.isArray(root.questions) ? root.questions : [];
  return rawQuestions.map((raw) => {
    const record = getStringRecord(raw);
    if (!record) throw new Error('Question item must be an object.');

    const rawOptions = Array.isArray(record.options) ? record.options : [];
    const options: ImportOption[] = rawOptions.map((option, idx) => {
      const optionRecord = getStringRecord(option);
      if (!optionRecord) {
        return { label: String.fromCharCode(65 + idx), content: asString(option) };
      }
      return {
        label: asString(optionRecord.label).toUpperCase() || String.fromCharCode(65 + idx),
        content: asString(optionRecord.content),
        imageUrl: asString(optionRecord.imageUrl) || undefined,
      };
    });

    const questionType = asString(record.questionType).toUpperCase();
    return {
      questionNumber: normalizeQuestionNumber(asString(record.questionNumber)),
      question: asString(record.question),
      options,
      images: asStringArray(record.images),
      tables: asStringArray(record.tables),
      math: asStringArray(record.math),
      questionType: ALLOWED_TYPES.has(questionType) ? questionType as ExtractedQuestion['questionType'] : 'SINGLE_CORRECT',
    };
  });
}

function normalizeQuestionNumber(value: string): string {
  return value.replace(/^question\s+/i, '').replace(/[^\dA-Za-z.-]/g, '').trim();
}

function buildQuestionPrompt(chunkText: string): string {
  return `/no_think

You extract structured questions from uploaded educational PDFs.

Rules:
- Return STRICT JSON only. No markdown. No prose.
- Be concise. Do not include reasoning.
- Extract only what appears in the text.
- Never generate, infer, or guess answers.
- Never generate, infer, or guess explanations.
- Preserve math, tables, image references, and option text when present in source text.
- If an image/table is referenced but not extractable from text, record a short source-derived placeholder in images/tables.
- questionType must be one of SINGLE_CORRECT, MULTIPLE_CORRECT, NUMERIC, TEXT.

Return this exact shape:
{
  "questions": [
    {
      "questionNumber": "1",
      "question": "question text",
      "options": [
        { "label": "A", "content": "option text", "imageUrl": "" }
      ],
      "images": [],
      "tables": [],
      "math": [],
      "questionType": "SINGLE_CORRECT"
    }
  ]
}

PDF chunk:
${chunkText}`;
}
