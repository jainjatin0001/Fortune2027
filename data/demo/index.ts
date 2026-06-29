import { DEMO_QUIZ_1 } from './quiz_1';
import { DEMO_QUIZ_2 } from './quiz_2';
import { DEMO_QUIZ_3 } from './quiz_3';
import type { DemoQuestion } from '@/types';

export interface DemoQuiz {
  id: string;
  title: string;
  description: string;
  questions: DemoQuestion[];
  timeLimit: number; // seconds
  badge: string; // color hex
  topics: string[];
}

export const DEMO_QUIZZES: DemoQuiz[] = [
  {
    id: '1',
    title: 'Quiz 1 — SAT & ACT Core Skills',
    description: 'Mixed SAT Math, Reading & Writing, and ACT Math fundamentals',
    questions: DEMO_QUIZ_1,
    timeLimit: 900,
    badge: '#7c3aed',
    topics: ['Algebra', 'Grammar', 'Vocabulary', 'Geometry', 'Probability'],
  },
  {
    id: '2',
    title: 'Quiz 2 — Sciences & AP',
    description: 'Biology, Chemistry, Physics and AP-level science concepts',
    questions: DEMO_QUIZ_2,
    timeLimit: 900,
    badge: '#0891b2',
    topics: ['Biology', 'Chemistry', 'Physics', 'Data Interpretation'],
  },
  {
    id: '3',
    title: 'Quiz 3 — Critical Reasoning & History',
    description: 'AP US History, literary analysis, rhetoric, and argumentation',
    questions: DEMO_QUIZ_3,
    timeLimit: 900,
    badge: '#b45309',
    topics: ['US History', 'Rhetoric', 'Argumentation', 'Literary Analysis'],
  },
];

export function getDemoQuiz(id: string): DemoQuiz | undefined {
  return DEMO_QUIZZES.find((q) => q.id === id);
}

export const ALL_DEMO_QUESTIONS: DemoQuestion[] = [
  ...DEMO_QUIZ_1,
  ...DEMO_QUIZ_2,
  ...DEMO_QUIZ_3,
];
