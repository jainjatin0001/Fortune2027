'use client';

import { QuizInterface } from '@/components/shared/QuizInterface';
import type { APSubject } from '@/../data/ap';

export default function APQuizClient({ subject }: { subject: APSubject }) {
  return (
    <QuizInterface
      questions={subject.questions}
      title={subject.title}
      timeLimit={subject.timeLimit}
    />
  );
}
