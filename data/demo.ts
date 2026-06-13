/**
 * DEMO QUESTION DATA
 *
 * Temporary data source until the Admin Portal APIs are built.
 * Migration path: replace `getDemoQuestions()` calls with API calls to
 * `/api/questions` — the DemoQuestion shape mirrors the DB Question shape.
 */

import type { DemoQuestion } from '@/types';

// ─────────────────────────────────────────────
// SAT QUESTIONS
// ─────────────────────────────────────────────
const satQuestions: DemoQuestion[] = [
  {
    id: 'sat-math-001',
    subject: 'SAT Math',
    topic: 'Linear Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'If 3x + 7 = 22, what is the value of 6x − 4?',
    options: [
      { id: 'a', content: '20' },
      { id: 'b', content: '26' },
      { id: 'c', content: '30' },
      { id: 'd', content: '34' },
    ],
    correctAnswerId: 'b',
    explanation:
      'From 3x + 7 = 22, we get 3x = 15, so x = 5. Then 6x − 4 = 6(5) − 4 = 30 − 4 = 26.',
    points: 1,
    tags: ['algebra', 'linear-equations', 'sat-math'],
  },
  {
    id: 'sat-math-002',
    subject: 'SAT Math',
    topic: 'Quadratic Functions',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'The function f(x) = x² − 6x + 5 has roots at x = a and x = b. What is the value of a + b?',
    options: [
      { id: 'a', content: '−6' },
      { id: 'b', content: '5' },
      { id: 'c', content: '6' },
      { id: 'd', content: '11' },
    ],
    correctAnswerId: 'c',
    explanation:
      "By Vieta's formulas, for ax² + bx + c, the sum of roots = −b/a = −(−6)/1 = 6. Alternatively, factor: (x−1)(x−5) = 0 gives roots 1 and 5, sum = 6.",
    points: 2,
    tags: ['quadratics', 'roots', 'vieta', 'sat-math'],
  },
  {
    id: 'sat-rw-001',
    subject: 'SAT Reading & Writing',
    topic: 'Main Idea',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'The following excerpt is from a scientific article: "Recent studies suggest that urban green spaces significantly reduce ambient air temperature through evapotranspiration and shading. Cities with higher tree canopy coverage report lower rates of heat-related illness during summer months."\n\nWhat is the main claim of this passage?',
    options: [
      { id: 'a', content: 'Urban areas are hotter than rural areas.' },
      { id: 'b', content: 'Green spaces in cities help lower temperatures and improve health outcomes.' },
      { id: 'c', content: 'Evapotranspiration is the primary driver of climate change.' },
      { id: 'd', content: 'City planners should focus on reducing heat-related illness.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage directly states two benefits of urban green spaces: reduced air temperature and lower heat-related illness rates. Option B captures both claims without adding unsupported conclusions.',
    points: 1,
    tags: ['reading-comprehension', 'main-idea', 'science-passage'],
  },
  {
    id: 'sat-rw-002',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Subject-Verb Agreement',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the option that best completes the sentence:\n\n"The committee, along with several independent advisors, _____ reviewing the proposal."',
    options: [
      { id: 'a', content: 'are' },
      { id: 'b', content: 'were' },
      { id: 'c', content: 'is' },
      { id: 'd', content: 'have been' },
    ],
    correctAnswerId: 'c',
    explanation:
      '"Along with" is a prepositional phrase that does not change the subject. The true subject is "The committee," which is singular, so the verb must be "is." If "and" were used instead, the subject would be plural.',
    points: 1,
    tags: ['grammar', 'subject-verb-agreement', 'sat-rw'],
  },
];

// ─────────────────────────────────────────────
// ACT QUESTIONS
// ─────────────────────────────────────────────
const actQuestions: DemoQuestion[] = [
  {
    id: 'act-math-001',
    subject: 'ACT Math',
    topic: 'Trigonometry',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'In a right triangle, the leg opposite angle θ has length 5 and the hypotenuse has length 13. What is the value of tan(θ)?',
    options: [
      { id: 'a', content: '5/13' },
      { id: 'b', content: '12/13' },
      { id: 'c', content: '5/12' },
      { id: 'd', content: '13/5' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Using the Pythagorean theorem: adjacent = √(13² − 5²) = √(169 − 25) = √144 = 12. Therefore tan(θ) = opposite/adjacent = 5/12.',
    points: 2,
    tags: ['trigonometry', 'right-triangles', 'act-math'],
  },
  {
    id: 'act-eng-001',
    subject: 'ACT English',
    topic: 'Punctuation',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'Which punctuation mark correctly completes the sentence?\n\n"She had three goals for the semester _____ improve her GPA, join the debate team, and prepare for the ACT."',
    options: [
      { id: 'a', content: ';' },
      { id: 'b', content: ':' },
      { id: 'c', content: ',' },
      { id: 'd', content: '—' },
    ],
    correctAnswerId: 'b',
    explanation:
      'A colon is used after an independent clause to introduce a list. The phrase before the blank ("She had three goals for the semester") is a complete sentence, making a colon the correct choice.',
    points: 1,
    tags: ['punctuation', 'colon', 'act-english'],
  },
  {
    id: 'act-sci-001',
    subject: 'ACT Science',
    topic: 'Data Interpretation',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A researcher measures the rate of photosynthesis in a plant at various light intensities. At 200 lux, the rate is 4 μmol O₂/min. At 400 lux, the rate is 7 μmol O₂/min. At 600 lux, the rate is 9 μmol O₂/min. At 800 lux, the rate is 9.5 μmol O₂/min. Based on this trend, what most likely limits photosynthesis at high light intensities?',
    options: [
      { id: 'a', content: 'Light availability' },
      { id: 'b', content: 'Carbon dioxide concentration or enzyme capacity' },
      { id: 'c', content: 'Water temperature' },
      { id: 'd', content: 'Oxygen toxicity' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The rate of photosynthesis increases sharply at lower light intensities but plateaus near 800 lux. This leveling off indicates the system is no longer light-limited; instead, another factor — such as CO₂ concentration or the capacity of the Calvin cycle enzymes — has become the limiting factor.',
    points: 2,
    tags: ['photosynthesis', 'data-interpretation', 'act-science'],
  },
];

// ─────────────────────────────────────────────
// AP QUESTIONS
// ─────────────────────────────────────────────
const apQuestions: DemoQuestion[] = [
  {
    id: 'ap-calc-001',
    subject: 'AP Calculus AB',
    topic: 'Derivatives',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Find the derivative of f(x) = 3x⁴ − 2x³ + 5x − 7.',
    options: [
      { id: 'a', content: '12x³ − 6x² + 5' },
      { id: 'b', content: '12x³ − 6x² − 5' },
      { id: 'c', content: '12x⁴ − 6x³ + 5' },
      { id: 'd', content: '3x³ − 2x² + 5' },
    ],
    correctAnswerId: 'a',
    explanation:
      "Applying the power rule: d/dx[3x⁴] = 12x³, d/dx[−2x³] = −6x², d/dx[5x] = 5, d/dx[−7] = 0. Therefore f'(x) = 12x³ − 6x² + 5.",
    points: 2,
    tags: ['derivatives', 'power-rule', 'ap-calc'],
  },
  {
    id: 'ap-ushistory-001',
    subject: 'AP US History',
    topic: 'Civil War Era',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The Emancipation Proclamation (1863) was significant primarily because it:',
    options: [
      { id: 'a', content: 'Immediately freed all enslaved people in the United States' },
      { id: 'b', content: 'Redefined the Civil War as a war for human freedom, altering its political and diplomatic character' },
      { id: 'c', content: 'Granted full citizenship rights to formerly enslaved people' },
      { id: 'd', content: 'Was the constitutional amendment that abolished slavery' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Emancipation Proclamation only freed enslaved people in Confederate states — not border states or Union-controlled areas. Its greatest significance was ideological: it transformed the war into an explicit fight against slavery, discouraging European powers from supporting the Confederacy and allowing Black men to enlist in the Union Army.',
    points: 2,
    tags: ['emancipation', 'civil-war', 'reconstruction', 'ap-ush'],
  },
  {
    id: 'ap-bio-001',
    subject: 'AP Biology',
    topic: 'Cell Division',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'During which phase of mitosis do sister chromatids separate and move toward opposite poles?',
    options: [
      { id: 'a', content: 'Prophase' },
      { id: 'b', content: 'Metaphase' },
      { id: 'c', content: 'Anaphase' },
      { id: 'd', content: 'Telophase' },
    ],
    correctAnswerId: 'c',
    explanation:
      'During Anaphase, the cohesin proteins holding sister chromatids together are cleaved by separase. Motor proteins walk the chromatids along spindle fibers toward opposite poles of the cell, ensuring each daughter cell receives one copy of each chromosome.',
    points: 2,
    tags: ['mitosis', 'cell-division', 'chromatids', 'ap-bio'],
  },
];

// ─────────────────────────────────────────────
// CODING QUESTIONS
// ─────────────────────────────────────────────
const codingQuestions: DemoQuestion[] = [
  {
    id: 'py-001',
    subject: 'Python',
    topic: 'Lists & Loops',
    category: 'CODING',
    difficulty: 'EASY',
    question:
      'What is the output of the following Python code?\n\n```python\nnumbers = [1, 2, 3, 4, 5]\nresult = [x ** 2 for x in numbers if x % 2 != 0]\nprint(result)\n```',
    options: [
      { id: 'a', content: '[1, 4, 9, 16, 25]' },
      { id: 'b', content: '[1, 9, 25]' },
      { id: 'c', content: '[4, 16]' },
      { id: 'd', content: '[2, 4]' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The list comprehension iterates over numbers [1,2,3,4,5], filters odd numbers (x % 2 != 0) giving [1,3,5], then squares each: [1², 3², 5²] = [1, 9, 25].',
    points: 1,
    tags: ['python', 'list-comprehension', 'loops', 'filtering'],
  },
  {
    id: 'py-002',
    subject: 'Python',
    topic: 'Functions & Scope',
    category: 'CODING',
    difficulty: 'MEDIUM',
    question:
      'What will the following code print?\n\n```python\nx = 10\n\ndef foo():\n    x = 20\n    def bar():\n        nonlocal x\n        x = 30\n    bar()\n    print(x)\n\nfoo()\nprint(x)\n```',
    options: [
      { id: 'a', content: '30\n10' },
      { id: 'b', content: '20\n10' },
      { id: 'c', content: '30\n30' },
      { id: 'd', content: '20\n30' },
    ],
    correctAnswerId: 'a',
    explanation:
      '`nonlocal x` inside `bar()` refers to the x in `foo()` (not the global x). After `bar()` runs, `foo()`\'s local x is 30, so `print(x)` inside `foo()` outputs 30. The global x remains 10.',
    points: 2,
    tags: ['python', 'closures', 'nonlocal', 'scope'],
  },
  {
    id: 'ml-001',
    subject: 'Machine Learning',
    topic: 'Supervised Learning',
    category: 'CODING',
    difficulty: 'MEDIUM',
    question:
      'In supervised machine learning, what is the key difference between a regression problem and a classification problem?',
    options: [
      { id: 'a', content: 'Regression uses neural networks; classification uses decision trees.' },
      { id: 'b', content: 'Regression predicts a continuous numerical output; classification predicts a discrete category.' },
      { id: 'c', content: 'Regression requires labeled data; classification does not.' },
      { id: 'd', content: 'Regression is unsupervised; classification is supervised.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Both are supervised learning tasks (they require labeled training data). The core distinction is the output type: regression outputs a continuous value (e.g., house price), while classification outputs a discrete label (e.g., spam/not spam). Any algorithm type — neural networks, trees, etc. — can be applied to either.',
    points: 2,
    tags: ['machine-learning', 'regression', 'classification', 'supervised-learning'],
  },
  {
    id: 'web-001',
    subject: 'Web Development',
    topic: 'JavaScript Fundamentals',
    category: 'CODING',
    difficulty: 'EASY',
    question:
      "What will the following JavaScript code output?\n\n```javascript\nconsole.log(typeof null);\nconsole.log(null === undefined);\n```",
    options: [
      { id: 'a', content: '"object"\ntrue' },
      { id: 'b', content: '"null"\nfalse' },
      { id: 'c', content: '"object"\nfalse' },
      { id: 'd', content: '"undefined"\ntrue' },
    ],
    correctAnswerId: 'c',
    explanation:
      '`typeof null` returns "object" — this is a well-known JavaScript bug that has been kept for backwards compatibility. `null === undefined` is false because strict equality checks both value AND type; null and undefined are different types even though `null == undefined` (loose equality) is true.',
    points: 1,
    tags: ['javascript', 'typeof', 'null', 'undefined', 'web-dev'],
  },
  {
    id: 'ds-001',
    subject: 'Data Science',
    topic: 'Statistics',
    category: 'CODING',
    difficulty: 'MEDIUM',
    question:
      'A dataset has the values: [4, 8, 6, 5, 3, 2, 8, 9, 2, 5]. What is the median?',
    options: [
      { id: 'a', content: '5.0' },
      { id: 'b', content: '5.2' },
      { id: 'c', content: '5.5' },
      { id: 'd', content: '6.0' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Sort the data: [2, 2, 3, 4, 5, 5, 6, 8, 8, 9]. With 10 values (even count), the median is the average of the 5th and 6th values: (5 + 6) / 2 = 5.5.',
    points: 2,
    tags: ['statistics', 'median', 'data-science'],
  },
];

// ─────────────────────────────────────────────
// EXPORTED HELPERS
// (mirror the future API interface so migration is a one-line swap)
// ─────────────────────────────────────────────
export const ALL_DEMO_QUESTIONS: DemoQuestion[] = [
  ...satQuestions,
  ...actQuestions,
  ...apQuestions,
  ...codingQuestions,
];

export function getDemoQuestions(category?: string): DemoQuestion[] {
  if (!category) return ALL_DEMO_QUESTIONS;
  return ALL_DEMO_QUESTIONS.filter((q) => q.category === category);
}

export function getDemoQuestion(id: string): DemoQuestion | undefined {
  return ALL_DEMO_QUESTIONS.find((q) => q.id === id);
}

export function getDemoQuestionsBySubject(subject: string): DemoQuestion[] {
  return ALL_DEMO_QUESTIONS.filter((q) => q.subject === subject);
}

export function getDemoQuestionsByDifficulty(difficulty: string): DemoQuestion[] {
  return ALL_DEMO_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

export function getRandomDemoQuestions(count: number, category?: string): DemoQuestion[] {
  const pool = getDemoQuestions(category);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
