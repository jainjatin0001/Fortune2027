import crypto from 'crypto';
import type { ImportProgress, ImportSession, ImportSessionConfig, ImportStatus, ImportedQuestionPreview } from './types';

const SESSION_TTL_MS = 1000 * 60 * 60;

interface QuestionImportGlobal {
  __questionImportSessions?: Map<string, ImportSession>;
}

const globalForImportSessions = globalThis as unknown as QuestionImportGlobal;
const sessions = globalForImportSessions.__questionImportSessions ?? new Map<string, ImportSession>();
globalForImportSessions.__questionImportSessions = sessions;

export function createImportSession(createdByUserId: string, config: ImportSessionConfig, questionText: string, answerText?: string, explanationText?: string): ImportSession {
  cleanupExpiredSessions();
  const now = new Date();
  const session: ImportSession = {
    id: crypto.randomUUID(),
    createdByUserId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
    config,
    status: 'idle',
    progress: makeProgress('idle', 'Waiting to start', 0, 0, 0, 0, 0),
    questionText,
    answerText,
    explanationText,
    chunks: [],
    answers: {},
    explanations: {},
    questions: [],
    warnings: [],
    errors: [],
    savedQuestionIds: [],
  };
  sessions.set(session.id, session);
  console.log("[IMPORT] CREATE", session.id);
  console.log("[IMPORT] Sessions:", [...sessions.keys()]);
  return session;
}

export function getImportSession(sessionId: string, userId: string): ImportSession | null {
  cleanupExpiredSessions();
  const session = sessions.get(sessionId);
  if (!session || session.createdByUserId !== userId) return null;
  touch(session);
  
  console.log("[IMPORT] GET", sessionId);

  if (!session) {
      console.log("[IMPORT] NOT FOUND");
      console.log("[IMPORT] Existing:", [...sessions.keys()]);
  }
  return session;
}

export function updateImportSession(session: ImportSession, patch: Partial<ImportSession>): ImportSession {
  Object.assign(session, patch);
  touch(session);
  sessions.set(session.id, session);

  console.log("[IMPORT] UPDATE", session.id);
  return session;
}

export function deleteImportSession(sessionId: string, userId: string): boolean {
  const session = sessions.get(sessionId);
  console.log("[IMPORT] DELETE", sessionId);
  console.trace();
  if (!session || session.createdByUserId !== userId) return false;
  return sessions.delete(sessionId);
}

export function serializeImportSession(session: ImportSession): Omit<ImportSession, 'questionText' | 'answerText' | 'explanationText'> {
  return {
    id: session.id,
    createdByUserId: session.createdByUserId,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    expiresAt: session.expiresAt,
    config: session.config,
    status: session.status,
    progress: session.progress,
    chunks: session.chunks,
    answers: session.answers,
    explanations: session.explanations,
    questions: session.questions,
    warnings: session.warnings,
    errors: session.errors,
    savedQuestionIds: session.savedQuestionIds,
  };
}

export function setSessionProgress(session: ImportSession, status: ImportStatus, message: string, currentChunk = session.progress.currentChunk): void {
  session.status = status;
  session.progress = makeProgress(
    status,
    message,
    currentChunk,
    session.chunks.filter((chunk) => chunk.status === 'completed').length,
    session.chunks.filter((chunk) => chunk.status === 'failed').length,
    session.chunks.length,
    session.questions.length,
  );
  touch(session);
}

export function replacePreviewQuestions(session: ImportSession, questions: ImportedQuestionPreview[]): void {
  session.questions = questions;
  session.progress.totalQuestions = questions.length;
  touch(session);
}

function makeProgress(
  status: ImportStatus,
  message: string,
  currentChunk: number,
  completedChunks: number,
  failedChunks: number,
  totalChunks: number,
  totalQuestions: number,
): ImportProgress {
  const chunkPercent = totalChunks > 0 ? Math.round(((completedChunks + failedChunks) / totalChunks) * 70) : 0;
  const phaseBonus: Record<ImportStatus, number> = {
    idle: 0,
    uploading: 3,
    extracting_pdf: 8,
    chunking: 12,
    extracting_questions: 15,
    extracting_answers: 82,
    extracting_explanations: 87,
    matching: 92,
    validating: 96,
    preview_ready: 100,
    saving: 98,
    saved: 100,
    failed: Math.max(5, chunkPercent),
  };
  const percent = status === 'extracting_questions' ? Math.min(85, 15 + chunkPercent) : phaseBonus[status];
  return { status, message, currentChunk, completedChunks, failedChunks, totalChunks, totalQuestions, percent };
}

function touch(session: ImportSession): void {
  const now = new Date();
  session.updatedAt = now.toISOString();
  session.expiresAt = new Date(now.getTime() + SESSION_TTL_MS).toISOString();
}

function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (Date.parse(session.expiresAt) < now) sessions.delete(id);
  }

  console.log("[IMPORT] CLEANUP");

  for (const [id, session] of sessions) {
      console.log(id, session.expiresAt);
  }
}
