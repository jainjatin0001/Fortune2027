// Single source of truth for answer grading.
// Pure functions only — imported by both API routes (authoritative grading)
// and client players (instant feedback in practice quizzes).

import type { DemoQuestion, QuestionType } from '@/types';

export interface StudentAnswer {
  selectedOptionIds: string[];
  textAnswer?: string;
}

export interface AnswerKey {
  questionType: QuestionType;
  correctOptionIds: string[];
  acceptedAnswers: string[];
}

export function isTypedQuestion(questionType: QuestionType | undefined): boolean {
  return questionType === 'NUMERIC' || questionType === 'TEXT';
}

export function isAnswered(answer: StudentAnswer | undefined): boolean {
  if (!answer) return false;
  return answer.selectedOptionIds.length > 0 || !!answer.textAnswer?.trim();
}

// Accepts integers, decimals (".1765", "-2.5") and simple fractions ("3/17", "-3/17").
export function parseNumericAnswer(raw: string): number | null {
  const s = raw.trim().replace(/\s+/g, '').replace(/[−–]/g, '-');
  if (!s) return null;

  const fraction = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (fraction) {
    const den = Number(fraction[2]);
    if (den === 0) return null;
    return Number(fraction[1]) / den;
  }

  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  return Number(s);
}

function normalizeText(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').toLowerCase();
}

// NUMERIC compares by value, so "6/34" matches an accepted "3/17".
// It does not round: list every acceptable decimal form (".1764", ".1765") in acceptedAnswers.
function matchesAcceptedAnswer(questionType: QuestionType, input: string, accepted: string[]): boolean {
  if (questionType === 'NUMERIC') {
    const value = parseNumericAnswer(input);
    if (value === null) return false;
    return accepted.some(a => {
      const target = parseNumericAnswer(a);
      return target !== null && Math.abs(target - value) < 1e-9;
    });
  }
  const normalized = normalizeText(input);
  return accepted.some(a => normalizeText(a) === normalized);
}

// Returns null when the question was not answered (counts as skipped).
export function gradeAnswer(key: AnswerKey, answer: StudentAnswer | undefined): boolean | null {
  if (!answer || !isAnswered(answer)) return null;

  if (isTypedQuestion(key.questionType)) {
    return matchesAcceptedAnswer(key.questionType, answer.textAnswer ?? '', key.acceptedAnswers);
  }

  if (key.correctOptionIds.length === 0) return false;
  const selected = [...new Set(answer.selectedOptionIds)].sort();
  const correct = [...key.correctOptionIds].sort();
  return selected.length === correct.length && selected.every((id, i) => id === correct[i]);
}

// Answer key for display-layer questions, whose option IDs are letters ("a", "b", …).
export function demoAnswerKey(q: DemoQuestion): AnswerKey {
  return {
    questionType: q.questionType ?? 'SINGLE_CORRECT',
    correctOptionIds: q.correctAnswerIds ?? (q.correctAnswerId ? [q.correctAnswerId] : []),
    acceptedAnswers: q.acceptedAnswers ?? [],
  };
}
