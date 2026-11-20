/**
 * Exam-agnostic scoring for the superscore calculator and score estimator.
 * Each exam supplies a ScoringConfig (see SCORING below); the UI is shared.
 * Pure functions, no React, so they're easy to test and reuse.
 */

export type ScoreSection = {
  key: string;
  label: string;
  /** Scaled score range and step (SAT 200–800 by 10, ACT 1–36 by 1). */
  min: number;
  max: number;
  step: number;
  /** Questions on a full-length practice test, for the estimator. */
  questions: number;
  /** Optional sections (ACT Science) are reported but not in the total. */
  optional?: boolean;
  /** Rough correct-answers → scaled-score curve: [correct, score] anchor points. */
  curve: [number, number][];
};

export type ScoringConfig = {
  examName: string;
  sections: ScoreSection[];
  /** "Total score" (SAT) or "Composite" (ACT). */
  totalLabel: string;
  /** SAT adds section scores; ACT averages them and rounds half up. */
  totalMethod: 'sum' | 'average';
  /** ± points around an estimate. */
  estimateMargin: number;
};

export type SectionScores = Record<string, number>;

const requiredSections = (c: ScoringConfig) => c.sections.filter((s) => !s.optional);

export function isValidScore(section: ScoreSection, score: number): boolean {
  return (
    Number.isInteger(score) &&
    score >= section.min &&
    score <= section.max &&
    (score - section.min) % section.step === 0
  );
}

export function combineScores(config: ScoringConfig, scores: SectionScores): number {
  const values = requiredSections(config).map((s) => scores[s.key]);
  const sum = values.reduce((a, b) => a + b, 0);
  // Math.round rounds .5 up for positive numbers, matching ACT's rule.
  return config.totalMethod === 'sum' ? sum : Math.round(sum / values.length);
}

// ─── Superscore (exact) ─────────────────────────────────────────────────────

export type SuperscoreResult = {
  /** Best score per section and the attempt index it came from (optional sections only if entered). */
  best: Record<string, { score: number; attempt: number } | undefined>;
  total: number;
  /** Highest single-sitting total, for comparison. */
  bestSingleTotal: number;
};

/** Attempts with any invalid/missing required section are ignored. Optional sections are used when valid. */
export function calculateSuperscore(config: ScoringConfig, attempts: SectionScores[]): SuperscoreResult | null {
  const required = requiredSections(config);
  const valid = attempts
    .map((scores, index) => ({ scores, index }))
    .filter(({ scores }) => required.every((s) => isValidScore(s, scores[s.key])));
  if (!valid.length) return null;

  const best: SuperscoreResult['best'] = {};
  for (const section of config.sections) {
    for (const { scores, index } of valid) {
      const score = scores[section.key];
      if (!isValidScore(section, score)) continue;
      if (!best[section.key] || score > best[section.key]!.score) best[section.key] = { score, attempt: index };
    }
  }

  const bestScores = Object.fromEntries(Object.entries(best).map(([k, v]) => [k, v?.score ?? NaN]));
  return {
    best,
    total: combineScores(config, bestScores),
    bestSingleTotal: Math.max(...valid.map(({ scores }) => combineScores(config, scores))),
  };
}

// ─── Estimate from correct answers (approximate) ────────────────────────────

export type ScoreRange = { low: number; mid: number; high: number };

const roundToStep = (s: ScoreSection, n: number) =>
  Math.min(s.max, Math.max(s.min, s.min + Math.round((n - s.min) / s.step) * s.step));

export function estimateSectionScore(config: ScoringConfig, section: ScoreSection, correct: number): ScoreRange {
  const n = Math.min(section.questions, Math.max(0, Math.round(correct)));
  // All right / none right are certain: no range.
  if (n === section.questions) return { low: section.max, mid: section.max, high: section.max };
  if (n === 0) return { low: section.min, mid: section.min, high: section.min };

  const { curve } = section;
  let mid = section.max;
  for (let i = 1; i < curve.length; i++) {
    const [x0, y0] = curve[i - 1];
    const [x1, y1] = curve[i];
    if (n <= x1) {
      mid = y0 + ((n - x0) / (x1 - x0)) * (y1 - y0);
      break;
    }
  }
  const m = roundToStep(section, mid);
  return {
    low: roundToStep(section, m - config.estimateMargin),
    mid: m,
    high: roundToStep(section, m + config.estimateMargin),
  };
}

export function combineRanges(config: ScoringConfig, ranges: Record<string, ScoreRange>): ScoreRange {
  const pick = (k: keyof ScoreRange) =>
    combineScores(config, Object.fromEntries(Object.entries(ranges).map(([key, r]) => [key, r[k]])));
  return { low: pick('low'), mid: pick('mid'), high: pick('high') };
}

export const formatRange = (r: ScoreRange) => (r.low === r.high ? String(r.mid) : `${r.low}–${r.high}`);

// ─── Exam configs ───────────────────────────────────────────────────────────
//
// Curves are typical, approximate shapes: the digital SAT is adaptive and ACT
// scales vary by test form, so neither publishes one fixed conversion table.

export type ScoredExam = 'sat' | 'act';

export const SCORING: Record<ScoredExam, ScoringConfig> = {
  sat: {
    examName: 'SAT',
    totalLabel: 'Total score',
    totalMethod: 'sum',
    estimateMargin: 30,
    sections: [
      { key: 'readingWriting', label: 'Reading & Writing', min: 200, max: 800, step: 10, questions: 54,
        curve: [[0, 200], [10, 310], [20, 420], [30, 520], [40, 620], [47, 700], [51, 750], [54, 800]] },
      { key: 'math', label: 'Math', min: 200, max: 800, step: 10, questions: 44,
        curve: [[0, 200], [8, 330], [16, 450], [24, 540], [32, 630], [38, 710], [42, 770], [44, 800]] },
    ],
  },
  // ACT since 2025: English 50 Qs, Math 45, Reading 36, Science 40 (optional, not in the Composite).
  act: {
    examName: 'ACT',
    totalLabel: 'Composite',
    totalMethod: 'average',
    estimateMargin: 1,
    sections: [
      { key: 'english', label: 'English', min: 1, max: 36, step: 1, questions: 50,
        curve: [[0, 1], [10, 9], [20, 14], [30, 19], [40, 25], [45, 30], [48, 33], [50, 36]] },
      { key: 'math', label: 'Math', min: 1, max: 36, step: 1, questions: 45,
        curve: [[0, 1], [10, 14], [20, 20], [30, 26], [38, 31], [42, 34], [45, 36]] },
      { key: 'reading', label: 'Reading', min: 1, max: 36, step: 1, questions: 36,
        curve: [[0, 1], [8, 10], [16, 17], [24, 23], [30, 28], [33, 32], [36, 36]] },
      { key: 'science', label: 'Science', min: 1, max: 36, step: 1, questions: 40, optional: true,
        curve: [[0, 1], [10, 14], [20, 20], [30, 26], [35, 30], [38, 33], [40, 36]] },
    ],
  },
};

/** Score scale of the total/composite, e.g. "400–1600" (SAT) or "1–36" (ACT). */
export function totalRange(config: ScoringConfig): string {
  const required = config.sections.filter((s) => !s.optional);
  if (config.totalMethod === 'average') {
    return `${Math.min(...required.map((s) => s.min))}–${Math.max(...required.map((s) => s.max))}`;
  }
  const sum = (k: 'min' | 'max') => required.reduce((a, s) => a + s[k], 0);
  return `${sum('min')}–${sum('max')}`;
}
