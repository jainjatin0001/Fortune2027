'use client';

import { ExamInterface } from '@/components/shared/ExamInterface';
import type { SATMockTest } from '@/../data/sat';

export default function SATExamClient({ test }: { test: SATMockTest }) {
  return (
    <ExamInterface
      examName={test.title}
      examCode="SAT"
      subtitle={`Digital SAT · ${test.sections.length} sections · ${test.totalQuestions} questions`}
      accentColor="#7c3aed"
      sections={test.sections}
    />
  );
}
