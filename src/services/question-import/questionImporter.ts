import { prisma } from '@/lib/prisma';
import type { ImportSession, ImportSessionConfig, SaveImportQuestionInput } from './types';
import { extractTextFromPdf } from './pdfExtractor';
import { splitQuestionTextIntoChunks } from './chunkGenerator';
import { extractQuestionsFromChunk } from './questionExtractor';
import { extractAnswers } from './answerExtractor';
import { extractExplanations } from './explanationExtractor';
import { getOllamaTimeoutMs, isOllamaTimeoutError } from './ollamaClient';
import { matchImportedQuestions } from './questionMatcher';
import { validateImport } from './validator';
import { createImportSession, replacePreviewQuestions, setSessionProgress, updateImportSession } from './importSession';

export async function createSessionFromUpload(params: {
  createdByUserId: string;
  config: ImportSessionConfig;
  questionPdf: File;
  answerPdf?: File;
  explanationPdf?: File;
}): Promise<ImportSession> {
  const questionText = (await extractTextFromPdf(params.questionPdf)).text;
  const answerText = params.answerPdf ? (await extractTextFromPdf(params.answerPdf)).text : undefined;
  const explanationText = params.explanationPdf ? (await extractTextFromPdf(params.explanationPdf)).text : undefined;
  return createImportSession(params.createdByUserId, params.config, questionText, answerText, explanationText);
}

export async function processImportSession(session: ImportSession): Promise<void> {
  try {
    setSessionProgress(session, 'chunking', 'Splitting PDF into question chunks...');
    const textChunks = splitQuestionTextIntoChunks(session.questionText, session.config.chunkSize);
    session.chunks = textChunks.map((chunk) => ({
      ...chunk,
      status: 'pending',
      attempts: 0,
      questions: [],
    }));
    updateImportSession(session, { chunks: session.chunks });

    await processPendingChunks(session);

    if (session.chunks.some((chunk) => chunk.status === 'failed')) {
      setSessionProgress(session, 'failed', 'Some chunks failed. Retry failed chunks to continue.');
      return;
    }

    await finalizeImportSession(session);
  } catch (error) {
    session.errors.push(error instanceof Error ? error.message : 'Import failed.');
    setSessionProgress(session, 'failed', session.errors.at(-1) ?? 'Import failed.');
  }
}

export async function retryImportChunk(session: ImportSession, chunkIndex: number): Promise<void> {
  const chunk = session.chunks[chunkIndex];
  if (!chunk) throw new Error('Chunk not found.');

  chunk.status = 'pending';
  chunk.error = undefined;
  chunk.questions = [];
  await processPendingChunks(session, chunkIndex);

  if (!session.chunks.some((item) => item.status === 'failed')) {
    await finalizeImportSession(session);
  } else {
    setSessionProgress(session, 'failed', 'Some chunks failed. Retry failed chunks to continue.');
  }
}

export async function updatePreviewQuestions(session: ImportSession, questions: SaveImportQuestionInput[]): Promise<void> {
  const matched = questions.map((question) => ({
    ...question,
    warnings: question.warnings ?? [],
    status: question.status ?? 'ready',
  }));
  const validation = validateImport(matched, answerMapFromQuestions(matched), explanationMapFromQuestions(matched));
  replacePreviewQuestions(session, validation.questions);
  updateImportSession(session, { warnings: validation.warnings, errors: validation.errors });
}

export async function saveImportSession(session: ImportSession): Promise<string[]> {
  if (session.errors.length > 0) {
    throw new Error('Resolve import errors before saving.');
  }

  const invalid = session.questions.find((question) => question.status === 'error');
  if (invalid) throw new Error(`Question ${invalid.questionNumber} has validation errors.`);

  setSessionProgress(session, 'saving', 'Saving draft questions...');
  const savedIds = await prisma.$transaction(async (tx) => {
    const ids: string[] = [];
    for (const question of session.questions) {
      const created = await tx.question.create({
        data: {
          subjectId: session.config.subjectId,
          topicId: session.config.topicId || null,
          statement: buildStatementHtml(question),
          explanation: question.explanation ? textToHtml(question.explanation) : null,
          difficulty: session.config.difficulty,
          questionType: question.questionType,
          sourceType: session.config.sourceType,
          points: session.config.points,
          tags: session.config.tags,
          isActive: true,
          options: {
            create: question.options.map((option, idx) => ({
              content: textToHtml(option.content),
              imageUrl: option.imageUrl ?? null,
              isCorrect: isCorrectOption(option.label, question.correctAnswer),
              sortOrder: idx,
            })),
          },
        },
      });
      ids.push(created.id);
    }
    return ids;
  });

  updateImportSession(session, {
    status: 'saved',
    savedQuestionIds: savedIds,
    questionText: '',
    answerText: undefined,
    explanationText: undefined,
  });
  setSessionProgress(session, 'saved', `Saved ${savedIds.length} draft questions.`);
  return savedIds;
}

async function processPendingChunks(session: ImportSession, onlyChunkIndex?: number): Promise<void> {
  const chunks = typeof onlyChunkIndex === 'number'
    ? session.chunks.filter((chunk) => chunk.index === onlyChunkIndex)
    : session.chunks;

  for (const chunk of chunks) {
    if (chunk.status === 'completed') continue;
    chunk.status = 'processing';
    chunk.attempts += 1;
    setSessionProgress(session, 'extracting_questions', `Chunk ${chunk.index + 1} of ${session.chunks.length}`, chunk.index + 1);

    try {
      chunk.questions = await extractQuestionsFromChunk(chunk.text);
      chunk.status = 'completed';
      chunk.error = undefined;
    } catch (error) {
      if (isOllamaTimeoutError(error)) {
        setSessionProgress(session, 'extracting_questions', `Chunk ${chunk.index + 1} timed out; retrying one question at a time...`, chunk.index + 1);
      }

      try {
        chunk.questions = await extractChunkQuestionByQuestion(chunk.text);
        chunk.status = 'completed';
        chunk.error = undefined;
      } catch (fallbackError) {
        chunk.status = 'failed';
        chunk.error = fallbackError instanceof Error
          ? fallbackError.message
          : error instanceof Error
            ? error.message
            : 'Chunk extraction failed.';
      }
    }
    updateImportSession(session, { chunks: session.chunks });
  }
}

async function extractChunkQuestionByQuestion(chunkText: string) {
  const singleQuestionChunks = splitQuestionTextIntoChunks(chunkText, 1);
  if (singleQuestionChunks.length <= 1) {
    throw new Error(`Ollama timed out on a single-question request after ${Math.round(getOllamaTimeoutMs() / 1000)} seconds. Try restarting Ollama, closing other heavy apps, or using a smaller/faster local model.`);
  }

  const questions = [];
  const failures: string[] = [];

  for (const singleQuestionChunk of singleQuestionChunks) {
    try {
      questions.push(...await extractQuestionsFromChunk(singleQuestionChunk.text));
    } catch (error) {
      failures.push(`question block ${singleQuestionChunk.index + 1}: ${error instanceof Error ? error.message : 'failed'}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Question-by-question fallback failed for ${failures.length} block(s): ${failures.join('; ')}`);
  }

  return questions;
}

async function finalizeImportSession(session: ImportSession): Promise<void> {
  const extractedQuestions = session.chunks.flatMap((chunk) => chunk.questions);

  if (session.answerText) {
    setSessionProgress(session, 'extracting_answers', 'Extracting Answers...');
    session.answers = await extractAnswers(session.answerText);
  }

  if (session.explanationText) {
    setSessionProgress(session, 'extracting_explanations', 'Extracting Explanations...');
    session.explanations = await extractExplanations(session.explanationText);
  }

  setSessionProgress(session, 'matching', 'Matching...');
  const matched = matchImportedQuestions(extractedQuestions, session.answers, session.explanations);

  setSessionProgress(session, 'validating', 'Validation...');
  const validation = validateImport(matched, session.answers, session.explanations);
  replacePreviewQuestions(session, validation.questions);
  updateImportSession(session, {
    warnings: validation.warnings,
    errors: validation.errors,
  });
  setSessionProgress(session, validation.errors.length > 0 ? 'failed' : 'preview_ready', validation.errors.length > 0 ? 'Validation errors found.' : 'Generating Preview...');
}

function buildStatementHtml(question: SaveImportQuestionInput): string {
  const parts = [textToHtml(question.question)];
  if (question.tables.length > 0) {
    parts.push(question.tables.map((table) => `<pre>${escapeHtml(table)}</pre>`).join(''));
  }
  if (question.math.length > 0) {
    parts.push(question.math.map((math) => `<p>${escapeHtml(math)}</p>`).join(''));
  }
  return parts.join('');
}

function textToHtml(text: string): string {
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return `<p>${escapeHtml(text).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isCorrectOption(label: string, correctAnswer?: string): boolean {
  if (!correctAnswer) return false;
  const labels = correctAnswer.toUpperCase().split(',').map((item) => item.trim());
  return labels.includes(label.toUpperCase());
}

function answerMapFromQuestions(questions: SaveImportQuestionInput[]) {
  return questions.reduce<Record<string, string>>((acc, question) => {
    if (question.correctAnswer) acc[question.questionNumber] = question.correctAnswer;
    return acc;
  }, {});
}

function explanationMapFromQuestions(questions: SaveImportQuestionInput[]) {
  return questions.reduce<Record<string, string>>((acc, question) => {
    if (question.explanation) acc[question.questionNumber] = question.explanation;
    return acc;
  }, {});
}
