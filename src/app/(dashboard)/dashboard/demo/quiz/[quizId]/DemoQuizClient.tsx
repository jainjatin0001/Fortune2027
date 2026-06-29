'use client';

import { QuizInterface } from '@/components/shared/QuizInterface';
import type { DemoQuiz } from '@/../data/demo';

export default function DemoQuizClient({ quiz }: { quiz: DemoQuiz }) {
  return (
    <QuizInterface
      questions={quiz.questions}
      title={quiz.title}
      timeLimit={quiz.timeLimit}
    />
  );
}
