import type { ExamSection } from '@/components/shared/ExamInterface';
import { SAT_MOCK_TEST_1_SECTIONS } from './mock_test_1';
import { SAT_MOCK_TEST_2_SECTIONS } from './mock_test_2';

export interface SATMockTest {
  id: string;
  title: string;
  description: string;
  sections: ExamSection[];
  totalQuestions: number;
  totalTimeSeconds: number;
}

export const SAT_MOCK_TESTS: SATMockTest[] = [
  {
    id: 'mock-test-1',
    title: 'SAT Mock Test 1',
    description: 'Full-length practice exam — Reading & Writing + Math · Digital SAT format',
    sections: SAT_MOCK_TEST_1_SECTIONS,
    totalQuestions: SAT_MOCK_TEST_1_SECTIONS.reduce((acc, s) => acc + s.questions.length, 0),
    totalTimeSeconds: SAT_MOCK_TEST_1_SECTIONS.reduce((acc, s) => acc + s.timeLimit, 0),
  },
  {
    id: 'mock-test-2',
    title: 'SAT Mock Test 2',
    description: 'Full-length practice exam — Reading & Writing + Math · Digital SAT format',
    sections: SAT_MOCK_TEST_2_SECTIONS,
    totalQuestions: SAT_MOCK_TEST_2_SECTIONS.reduce((acc, s) => acc + s.questions.length, 0),
    totalTimeSeconds: SAT_MOCK_TEST_2_SECTIONS.reduce((acc, s) => acc + s.timeLimit, 0),
  },
];

export function getSATMockTest(id: string): SATMockTest | undefined {
  return SAT_MOCK_TESTS.find((t) => t.id === id);
}
