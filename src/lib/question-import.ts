// JSON contract for bulk question import (PDF → JSON → admin review → DB).
// Produced today by a Claude Code session; later possibly by an in-app extractor.
// Batch-level fields (subject, topic, source, tags, points) are NOT part of the file.

import { gradeAnswer } from '@/lib/grading';
import { parseDifficulty, parseQuestionType, validateAnswerInput, type QuestionOptionInput } from '@/lib/question-input';
import type { QuestionType } from '@/types';

export interface ImportQuestion {
  externalId?: string;
  page?: number;
  difficulty: string;
  questionType: string;
  statement: string;
  options: QuestionOptionInput[];
  acceptedAnswers: string[];
  explanation?: string;
  skill?: string;
  /** Raw "Correct Answer:" line from the PDF ("C", ".1764, .1765, 3/17"); null when the PDF has none. */
  pdfCorrectAnswer?: string | null;
  /** Rendered source page(s) — a file name picked alongside the JSON, or an absolute URL. */
  pageImage?: string | string[];
  /**
   * Figures used in the HTML as <img src="…" width height>. Either uploaded URLs, or file names
   * picked alongside the JSON — those are uploaded to R2 by the import API at save time.
   */
  figures?: string[];
}

export interface ImportFile {
  source?: string;
  questions: ImportQuestion[];
}

export function parseImportFile(text: string): ImportFile {
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.questions)) throw new Error('JSON must have a "questions" array');
  const questions = data.questions.map((q: Partial<ImportQuestion>, i: number) => {
    if (!q || typeof q.statement !== 'string') throw new Error(`Question ${i + 1}: "statement" is missing`);
    return {
      ...q,
      difficulty: String(q.difficulty ?? 'MEDIUM').toUpperCase(),
      questionType: String(q.questionType ?? 'SINGLE_CORRECT').toUpperCase(),
      options: Array.isArray(q.options) ? q.options : [],
      acceptedAnswers: Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers.map(String) : [],
      figures: Array.isArray(q.figures) ? q.figures : [],
    } as ImportQuestion;
  });
  return { source: data.source, questions };
}

const hasContent = (html: string) =>
  /<(img|table)\b|data-type="math-(inline|block)"/i.test(html) || html.replace(/<[^>]*>/g, '').trim() !== '';

const htmlFields = (q: ImportQuestion) => [q.statement, q.explanation ?? '', ...q.options.map(o => o.content)];

/** <img> sources that are still local file names (not uploaded yet). */
export function localImageSources(q: ImportQuestion): string[] {
  const srcs = htmlFields(q).flatMap(html => [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1]));
  return [...new Set(srcs.filter(src => !/^https?:\/\//i.test(src)))];
}

/** Replaces <img src="name"> with the mapped URL; unmapped sources are left alone. */
export function replaceImgSrc(html: string, urls: Map<string, string>): string {
  return html.replace(/(<img\b[^>]*\bsrc=")([^"]+)(")/gi, (m, pre, src, post) => {
    const url = urls.get(src);
    return url ? pre + url + post : m;
  });
}

/** Replaces <img src="name"> with mapped URLs in every HTML field. */
export function replaceImageSources(q: ImportQuestion, urls: Map<string, string>): ImportQuestion {
  const swap = (html: string) => replaceImgSrc(html, urls);
  return {
    ...q,
    statement: swap(q.statement),
    explanation: q.explanation === undefined ? undefined : swap(q.explanation),
    options: q.options.map(o => ({ ...o, content: swap(o.content) })),
    figures: q.figures?.map(f => urls.get(f) ?? f),
  };
}

/**
 * Same rules the import API enforces; null when the question can be saved.
 * `figureFiles` = names of the figure files available for upload (picked / sent with the batch).
 */
export function validationError(q: ImportQuestion, figureFiles: ReadonlySet<string>): string | null {
  if (!hasContent(q.statement)) return 'Statement is empty';
  const missing = localImageSources(q).filter(src => !figureFiles.has(src));
  if (missing.length) return `Figure file not selected: ${missing.join(', ')}`;
  const type = parseQuestionType(q.questionType);
  if (!type) return `Invalid question type "${q.questionType}"`;
  if (!parseDifficulty(q.difficulty)) return `Invalid difficulty "${q.difficulty}"`;
  const answer = validateAnswerInput(type, q.options.filter(o => hasContent(o.content)), q.acceptedAnswers);
  return 'error' in answer ? answer.error : null;
}

const letter = (i: number) => String.fromCharCode(65 + i);

/** Checks the answer key against the PDF's "Correct Answer" line; null when they agree. */
export function answerMismatch(q: ImportQuestion): string | null {
  const pdf = q.pdfCorrectAnswer?.trim();
  if (!pdf) return 'PDF has no "Correct Answer" line — answer taken from the rationale';
  const type = parseQuestionType(q.questionType) as QuestionType;
  if (type === 'NUMERIC' || type === 'TEXT') {
    const forms = pdf.split(',').map(s => s.trim()).filter(Boolean);
    const key = { questionType: type, correctOptionIds: [], acceptedAnswers: q.acceptedAnswers };
    const missing = forms.filter(f => !gradeAnswer(key, { selectedOptionIds: [], textAnswer: f }));
    return missing.length ? `PDF answer ${missing.join(', ')} is not accepted` : null;
  }
  const marked = q.options.map((o, i) => (o.isCorrect ? letter(i) : '')).join('');
  const expected = pdf.toUpperCase().replace(/[^A-Z]/g, '');
  return marked === expected ? null : `PDF says ${pdf}, marked ${marked || 'none'}`;
}

export function hasFigure(q: ImportQuestion): boolean {
  return (q.figures?.length ?? 0) > 0 || /<img\b/i.test(q.statement);
}

export const optionLetter = letter;
