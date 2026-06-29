import type { ExamSection } from '@/components/shared/ExamInterface';
import { ACT_MOCK_TEST_1_SECTIONS } from './mock_test_1';
import { ACT_MOCK_TEST_2_SECTIONS } from './mock_test_2';

export interface ACTMockTest {
  id: string;
  title: string;
  description: string;
  sections: ExamSection[];
  totalQuestions: number;
  totalTimeSeconds: number;
}

export const ACT_MOCK_TESTS: ACTMockTest[] = [
  {
    id: 'mock-test-1',
    title: 'ACT Mock Test 1',
    description: 'Full-length practice exam — English · Math · Reading · Science',
    sections: ACT_MOCK_TEST_1_SECTIONS,
    totalQuestions: ACT_MOCK_TEST_1_SECTIONS.reduce((acc, s) => acc + s.questions.length, 0),
    totalTimeSeconds: ACT_MOCK_TEST_1_SECTIONS.reduce((acc, s) => acc + s.timeLimit, 0),
  },
  {
    id: 'mock-test-2',
    title: 'ACT Mock Test 2',
    description: 'Full-length practice exam — English · Math · Reading · Science',
    sections: ACT_MOCK_TEST_2_SECTIONS,
    totalQuestions: ACT_MOCK_TEST_2_SECTIONS.reduce((acc, s) => acc + s.questions.length, 0),
    totalTimeSeconds: ACT_MOCK_TEST_2_SECTIONS.reduce((acc, s) => acc + s.timeLimit, 0),
  },
];

export function getACTMockTest(id: string): ACTMockTest | undefined {
  return ACT_MOCK_TESTS.find((t) => t.id === id);
}
