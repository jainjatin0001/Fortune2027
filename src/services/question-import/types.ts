import type { DifficultyLevel, QuestionSourceType, QuestionType } from '@prisma/client';

export type ImportPdfKind = 'questions' | 'answers' | 'explanations';

export type ImportStatus =
  | 'idle'
  | 'uploading'
  | 'extracting_pdf'
  | 'chunking'
  | 'extracting_questions'
  | 'extracting_answers'
  | 'extracting_explanations'
  | 'matching'
  | 'validating'
  | 'preview_ready'
  | 'saving'
  | 'saved'
  | 'failed';

export type ImportChunkStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ImportOption {
  label: string;
  content: string;
  imageUrl?: string;
}

export interface ExtractedQuestion {
  questionNumber: string;
  question: string;
  options: ImportOption[];
  images: string[];
  tables: string[];
  math: string[];
  questionType: QuestionType;
}

export type AnswerMap = Record<string, string>;
export type ExplanationMap = Record<string, string>;

export interface ImportWarning {
  code: string;
  message: string;
  questionNumber?: string;
}

export interface ImportChunk {
  id: string;
  index: number;
  text: string;
  status: ImportChunkStatus;
  attempts: number;
  questions: ExtractedQuestion[];
  error?: string;
}

export interface ImportedQuestionPreview extends ExtractedQuestion {
  correctAnswer?: string;
  explanation?: string;
  status: 'ready' | 'warning' | 'error';
  warnings: ImportWarning[];
}

export interface ImportSessionConfig {
  chunkSize: number;
  programId: string;
  subjectId: string;
  topicId?: string;
  difficulty: DifficultyLevel;
  sourceType: QuestionSourceType;
  points: number;
  tags: string[];
}

export interface ImportProgress {
  status: ImportStatus;
  message: string;
  currentChunk: number;
  completedChunks: number;
  failedChunks: number;
  totalChunks: number;
  totalQuestions: number;
  percent: number;
}

export interface ImportSession {
  id: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  config: ImportSessionConfig;
  status: ImportStatus;
  progress: ImportProgress;
  questionText: string;
  answerText?: string;
  explanationText?: string;
  chunks: ImportChunk[];
  answers: AnswerMap;
  explanations: ExplanationMap;
  questions: ImportedQuestionPreview[];
  warnings: ImportWarning[];
  errors: string[];
  savedQuestionIds: string[];
}

export interface QuestionImportStartInput extends ImportSessionConfig {
  questionPdf: File;
  answerPdf?: File;
  explanationPdf?: File;
}

export interface SaveImportQuestionInput {
  questionNumber: string;
  question: string;
  options: ImportOption[];
  correctAnswer?: string;
  explanation?: string;
  images: string[];
  tables: string[];
  math: string[];
  questionType: QuestionType;
  warnings: ImportWarning[];
  status: 'ready' | 'warning' | 'error';
}
