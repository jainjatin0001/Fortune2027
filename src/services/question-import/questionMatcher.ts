import type { AnswerMap, ExplanationMap, ExtractedQuestion, ImportedQuestionPreview } from './types';

export function matchImportedQuestions(
  questions: ExtractedQuestion[],
  answers: AnswerMap,
  explanations: ExplanationMap,
): ImportedQuestionPreview[] {
  return questions.map((question) => ({
    ...question,
    correctAnswer: answers[question.questionNumber],
    explanation: explanations[question.questionNumber],
    warnings: [],
    status: 'ready',
  }));
}
