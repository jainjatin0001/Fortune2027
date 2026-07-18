import type { AnswerMap, ExplanationMap, ImportedQuestionPreview, ImportWarning } from './types';

export interface ImportValidationResult {
  questions: ImportedQuestionPreview[];
  warnings: ImportWarning[];
  errors: string[];
}

export function validateImport(
  questions: ImportedQuestionPreview[],
  answers: AnswerMap,
  explanations: ExplanationMap,
): ImportValidationResult {
  const warnings: ImportWarning[] = [];
  const errors: string[] = [];
  const seenNumbers = new Set<string>();
  const textFingerprints = new Map<string, string>();

  const validated = questions.map((question) => {
    const questionWarnings: ImportWarning[] = [];

    if (!question.questionNumber) {
      errors.push('A question is missing its question number.');
    } else if (seenNumbers.has(question.questionNumber)) {
      errors.push(`Duplicate question number ${question.questionNumber}.`);
    }
    seenNumbers.add(question.questionNumber);

    if (!question.question.trim()) {
      errors.push(`Question ${question.questionNumber || '(unknown)'} is missing text.`);
    }

    if (question.options.length < 2) {
      errors.push(`Question ${question.questionNumber} must have at least 2 options.`);
    }

    if (question.options.length > 6) {
      errors.push(`Question ${question.questionNumber} has more than 6 options.`);
    }

    if (!question.correctAnswer) {
      questionWarnings.push({
        code: 'missing_answer',
        message: 'Question has no answer.',
        questionNumber: question.questionNumber,
      });
    }

    if (Object.keys(explanations).length > 0 && !question.explanation) {
      questionWarnings.push({
        code: 'missing_explanation',
        message: 'Explanation missing.',
        questionNumber: question.questionNumber,
      });
    }

    const fingerprint = normalizeQuestionText(question.question);
    const duplicateOf = textFingerprints.get(fingerprint);
    if (fingerprint && duplicateOf) {
      questionWarnings.push({
        code: 'duplicate_question_text',
        message: `Possible duplicate of question ${duplicateOf}.`,
        questionNumber: question.questionNumber,
      });
    } else if (fingerprint) {
      textFingerprints.set(fingerprint, question.questionNumber);
    }

    warnings.push(...questionWarnings);
    return {
      ...question,
      warnings: questionWarnings,
      status: errors.some((error) => error.includes(`Question ${question.questionNumber}`)) ? 'error' as const : questionWarnings.length ? 'warning' as const : 'ready' as const,
    };
  });

  for (const questionNumber of Object.keys(answers)) {
    if (!seenNumbers.has(questionNumber)) {
      warnings.push({
        code: 'answer_without_question',
        message: `Answer exists for missing question ${questionNumber}.`,
        questionNumber,
      });
    }
  }

  return { questions: validated, warnings, errors };
}

function normalizeQuestionText(text: string): string {
  return text.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/\W+/g, ' ').trim();
}
