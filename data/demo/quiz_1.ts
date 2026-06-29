/**
 * Demo Quiz 1 — Mixed SAT & ACT fundamentals
 * 10 questions covering core skills across both exams.
 */
import type { DemoQuestion } from '@/types';

export const DEMO_QUIZ_1: DemoQuestion[] = [
  {
    id: 'dq1-01',
    subject: 'SAT Math',
    topic: 'Linear Equations',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question: 'If 3x − 5 = 16, what is the value of x?',
    options: [
      { id: 'a', content: '5' },
      { id: 'b', content: '7' },
      { id: 'c', content: '9' },
      { id: 'd', content: '11' },
    ],
    correctAnswerId: 'b',
    explanation: '3x − 5 = 16 → 3x = 21 → x = 7.',
    points: 1,
    tags: ['algebra', 'linear-equations', 'sat-math'],
  },
  {
    id: 'dq1-02',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Subject-Verb Agreement',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the option that correctly completes the sentence:\n\n"The committee, along with several independent advisors, _____ reviewing the proposal."',
    options: [
      { id: 'a', content: 'are' },
      { id: 'b', content: 'were' },
      { id: 'c', content: 'is' },
      { id: 'd', content: 'have been' },
    ],
    correctAnswerId: 'c',
    explanation:
      '"Along with" is a prepositional phrase that does not change the grammatical subject. The true subject is "The committee" (singular), so the verb must be "is."',
    points: 1,
    tags: ['grammar', 'subject-verb-agreement', 'sat-rw'],
  },
  {
    id: 'dq1-03',
    subject: 'ACT Math',
    topic: 'Geometry — Triangles',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'In a right triangle, the two legs have lengths 9 and 12. What is the length of the hypotenuse?',
    options: [
      { id: 'a', content: '13' },
      { id: 'b', content: '14' },
      { id: 'c', content: '15' },
      { id: 'd', content: '18' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Using the Pythagorean theorem: c² = 9² + 12² = 81 + 144 = 225. c = √225 = 15.',
    points: 1,
    tags: ['pythagorean-theorem', 'geometry', 'act-math'],
  },
  {
    id: 'dq1-04',
    subject: 'SAT Reading & Writing',
    topic: 'Vocabulary in Context',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      '"The scientist\'s hypothesis was initially met with skepticism, but subsequent experiments corroborated her findings."\n\nAs used here, "corroborated" most nearly means:',
    options: [
      { id: 'a', content: 'contradicted' },
      { id: 'b', content: 'confirmed' },
      { id: 'c', content: 'complicated' },
      { id: 'd', content: 'questioned' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Corroborate" means to confirm or support with additional evidence. The context — experiments following up on an initially skeptical reception — indicates they confirmed (not contradicted) the findings.',
    points: 1,
    tags: ['vocabulary', 'words-in-context', 'sat-rw'],
  },
  {
    id: 'dq1-05',
    subject: 'ACT Math',
    topic: 'Percentages',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'What is 35% of 160?',
    options: [
      { id: 'a', content: '48' },
      { id: 'b', content: '52' },
      { id: 'c', content: '56' },
      { id: 'd', content: '64' },
    ],
    correctAnswerId: 'c',
    explanation:
      '35% × 160 = 0.35 × 160 = 56.',
    points: 1,
    tags: ['percentages', 'act-math'],
  },
  {
    id: 'dq1-06',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Transitions',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      '"She studied for six hours. _____, she still struggled with the exam."\n\nWhich transition best completes this sentence?',
    options: [
      { id: 'a', content: 'Therefore' },
      { id: 'b', content: 'As a result' },
      { id: 'c', content: 'Nevertheless' },
      { id: 'd', content: 'Consequently' },
    ],
    correctAnswerId: 'c',
    explanation:
      '"Nevertheless" (meaning "despite that") signals a contrast — extensive studying did not prevent struggle. "Therefore," "As a result," and "Consequently" all imply causation, which would lead to the opposite meaning.',
    points: 1,
    tags: ['transitions', 'grammar', 'sat-rw'],
  },
  {
    id: 'dq1-07',
    subject: 'SAT Math',
    topic: 'Functions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'If f(x) = x² + 3x − 4, what is f(2)?',
    options: [
      { id: 'a', content: '4' },
      { id: 'b', content: '6' },
      { id: 'c', content: '8' },
      { id: 'd', content: '10' },
    ],
    correctAnswerId: 'b',
    explanation:
      'f(2) = (2)² + 3(2) − 4 = 4 + 6 − 4 = 6.',
    points: 1,
    tags: ['functions', 'evaluation', 'sat-math'],
  },
  {
    id: 'dq1-08',
    subject: 'ACT English',
    topic: 'Punctuation',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which punctuation correctly joins these two independent clauses?\n\n"The experiment failed to replicate [BLANK] the researchers decided to redesign the protocol."',
    options: [
      { id: 'a', content: 'failed to replicate, the researchers' },
      { id: 'b', content: 'failed to replicate; the researchers' },
      { id: 'c', content: 'failed to replicate: the researchers' },
      { id: 'd', content: 'failed to replicate and, the researchers' },
    ],
    correctAnswerId: 'b',
    explanation:
      'A semicolon correctly joins two grammatically independent clauses without a coordinating conjunction. A comma alone (A) creates a comma splice. A colon (C) introduces a list or explanation, not a coordinate clause of equal standing. Option D has misplaced punctuation.',
    points: 1,
    tags: ['punctuation', 'semicolon', 'act-english'],
  },
  {
    id: 'dq1-09',
    subject: 'SAT Math',
    topic: 'Probability',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A bag contains 4 red, 6 blue, and 2 yellow marbles. If one marble is selected at random, what is the probability it is blue?',
    options: [
      { id: 'a', content: '1/2' },
      { id: 'b', content: '1/3' },
      { id: 'c', content: '2/3' },
      { id: 'd', content: '1/4' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Total marbles = 4 + 6 + 2 = 12. P(blue) = 6/12 = 1/2.',
    points: 1,
    tags: ['probability', 'sat-math'],
  },
  {
    id: 'dq1-10',
    subject: 'SAT Reading & Writing',
    topic: 'Main Idea',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      '"Recent evidence suggests that the gut microbiome significantly influences mood and anxiety. Researchers have found bidirectional communication between intestinal bacteria and the brain via the vagus nerve, a pathway now called the \'gut-brain axis.\' Disruptions to gut bacterial diversity have been correlated with increased rates of depression and anxiety in clinical studies."\n\nWhat is the central claim?',
    options: [
      { id: 'a', content: 'All mental health conditions are caused by gut bacteria.' },
      { id: 'b', content: 'The gut microbiome communicates with the brain and may influence mood and mental health.' },
      { id: 'c', content: 'The vagus nerve is the only pathway between the brain and the body.' },
      { id: 'd', content: 'Researchers have fully explained the cause of depression.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage describes a bidirectional gut-brain communication pathway and correlations between gut diversity and mood disorders. Option B accurately states the central claim without overstating it. Options A, C, and D make absolute or exaggerated claims not supported by the passage.',
    points: 1,
    tags: ['main-idea', 'science-passage', 'sat-rw'],
  },
];
