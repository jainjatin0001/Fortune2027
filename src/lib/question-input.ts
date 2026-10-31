// Validates and normalizes the admin question payload (create, update, and bulk import).
// Keeps the per-type answer rules in one place so every write path enforces the same shape.

import { isTypedQuestion, parseNumericAnswer } from '@/lib/grading';
import type { DifficultyLevel, QuestionType } from '@/types';

const QUESTION_TYPES: QuestionType[] = ['SINGLE_CORRECT', 'MULTIPLE_CORRECT', 'NUMERIC', 'TEXT'];
const SOURCE_TYPES = ['MCQ', 'PYQ', 'PRACTICE', 'MOCK_TEST'] as const;
const DIFFICULTIES: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

type SourceType = (typeof SOURCE_TYPES)[number];

export interface QuestionOptionInput {
  content: string;
  isCorrect: boolean;
}

export interface QuestionAnswerInput {
  questionType: QuestionType;
  options: QuestionOptionInput[];
  acceptedAnswers: string[];
}

export function parseQuestionType(value: unknown): QuestionType | null {
  return QUESTION_TYPES.includes(value as QuestionType) ? (value as QuestionType) : null;
}

export function parseSourceType(value: unknown): SourceType | null {
  return SOURCE_TYPES.includes(value as SourceType) ? (value as SourceType) : null;
}

export function parseDifficulty(value: unknown): DifficultyLevel | null {
  return DIFFICULTIES.includes(value as DifficultyLevel) ? (value as DifficultyLevel) : null;
}

// Returns the normalized answer data, or an error message.
// Typed questions drop their options; option questions drop acceptedAnswers.
export function validateAnswerInput(
  questionType: QuestionType,
  rawOptions: unknown,
  rawAccepted: unknown,
): { data: QuestionAnswerInput } | { error: string } {
  if (isTypedQuestion(questionType)) {
    const acceptedAnswers = (Array.isArray(rawAccepted) ? rawAccepted : [])
      .map(a => String(a).trim())
      .filter(Boolean);
    if (acceptedAnswers.length === 0) return { error: 'At least one accepted answer is required' };
    if (questionType === 'NUMERIC') {
      const invalid = acceptedAnswers.find(a => parseNumericAnswer(a) === null);
      if (invalid) return { error: `"${invalid}" is not a valid number or fraction` };
    }
    return { data: { questionType, options: [], acceptedAnswers } };
  }

  const options: QuestionOptionInput[] = (Array.isArray(rawOptions) ? rawOptions : []).map(
    (o: { content?: unknown; isCorrect?: unknown }) => ({
      content: String(o?.content ?? ''),
      isCorrect: o?.isCorrect === true,
    }),
  );
  if (options.length < 2) return { error: 'At least 2 options are required' };
  const correctCount = options.filter(o => o.isCorrect).length;
  if (correctCount === 0) return { error: 'At least one option must be marked as correct' };
  if (questionType === 'SINGLE_CORRECT' && correctCount > 1) {
    return { error: 'Single-correct questions must have exactly one correct option' };
  }
  return { data: { questionType, options, acceptedAnswers: [] } };
}
