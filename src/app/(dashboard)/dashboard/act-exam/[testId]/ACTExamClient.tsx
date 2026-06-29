'use client';

import { ExamInterface } from '@/components/shared/ExamInterface';
import type { ACTMockTest } from '@/../data/act';

export default function ACTExamClient({ test }: { test: ACTMockTest }) {
  return (
    <ExamInterface
      examName={test.title}
      examCode="ACT"
      subtitle={`ACT · ${test.sections.length} sections · ${test.totalQuestions} questions`}
      accentColor="#0891b2"
      sections={test.sections}
    />
  );
}
