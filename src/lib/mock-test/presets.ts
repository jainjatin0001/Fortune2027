// Section structures the admin builder can stamp onto a mock test in one click.
// Everything stays editable afterwards — presets only save typing. To support a
// new exam, add an entry here; nothing else needs to change.

export interface SectionPreset {
  name: string;
  shortName: string;
  /** minutes */
  minutes: number;
  hasCalculator: boolean;
  /** minutes of optional break offered after this section */
  breakAfterMinutes?: number;
  /** Official question count — shown as a target in the builder, not enforced */
  targetQuestions?: number;
  instructions?: string;
}

export interface ExamPreset {
  key: string;
  label: string;
  description: string;
  sections: SectionPreset[];
}

const SAT_RW_DIRECTIONS =
  '<p>This section tests reading and writing skills. Each question comes with a short passage (sometimes with a table or graph). Read the passage and the question, then pick the best answer based on what the passage says.</p><p>Every question is multiple choice with one best answer.</p>';

const SAT_MATH_DIRECTIONS =
  '<p>This section tests math skills. You may use the calculator for every question, and the reference sheet is in the toolbar.</p><p>Unless a question says otherwise, variables stand for real numbers and figures are drawn to scale in a plane.</p><p>For multiple-choice questions, choose the correct answer. For questions without choices, type your answer in the box.</p>';

export const EXAM_PRESETS: ExamPreset[] = [
  {
    key: 'digital-sat',
    label: 'Digital SAT',
    description: 'Reading & Writing (2 modules) · 10-min break · Math (2 modules)',
    sections: [
      { name: 'Reading and Writing — Module 1', shortName: 'RW1', minutes: 32, hasCalculator: false, targetQuestions: 27, instructions: SAT_RW_DIRECTIONS },
      { name: 'Reading and Writing — Module 2', shortName: 'RW2', minutes: 32, hasCalculator: false, targetQuestions: 27, breakAfterMinutes: 10, instructions: SAT_RW_DIRECTIONS },
      { name: 'Math — Module 1', shortName: 'M1', minutes: 35, hasCalculator: true, targetQuestions: 22, instructions: SAT_MATH_DIRECTIONS },
      { name: 'Math — Module 2', shortName: 'M2', minutes: 35, hasCalculator: true, targetQuestions: 22, instructions: SAT_MATH_DIRECTIONS },
    ],
  },
  {
    key: 'act',
    label: 'ACT',
    description: 'English · Math · 10-min break · Reading · Science',
    sections: [
      { name: 'English', shortName: 'ENG', minutes: 35, hasCalculator: false, targetQuestions: 50 },
      { name: 'Mathematics', shortName: 'MATH', minutes: 50, hasCalculator: true, targetQuestions: 45, breakAfterMinutes: 10 },
      { name: 'Reading', shortName: 'READ', minutes: 40, hasCalculator: false, targetQuestions: 36 },
      { name: 'Science', shortName: 'SCI', minutes: 40, hasCalculator: false, targetQuestions: 40 },
    ],
  },
];

export function getExamPreset(key: string | null | undefined) {
  return EXAM_PRESETS.find(p => p.key === key);
}

/** Section `create` rows for Prisma, numbered from `startOrder`. */
export function presetToSectionRows(preset: ExamPreset, startOrder = 0) {
  return preset.sections.map((s, i) => ({
    name: s.name,
    shortName: s.shortName,
    timeLimit: s.minutes * 60,
    hasCalculator: s.hasCalculator,
    breakAfter: (s.breakAfterMinutes ?? 0) * 60,
    instructions: s.instructions ?? null,
    sortOrder: startOrder + i,
  }));
}

/** Target question count for a section, matched by short name across presets. */
export function targetQuestionsFor(shortName: string): number | undefined {
  for (const p of EXAM_PRESETS) {
    const hit = p.sections.find(s => s.shortName === shortName);
    if (hit) return hit.targetQuestions;
  }
  return undefined;
}
