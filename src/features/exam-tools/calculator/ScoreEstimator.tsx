'use client';

import { useState } from 'react';
import {
  SCORING,
  type ScoredExam,
  type ScoreRange,
  combineRanges,
  estimateSectionScore,
  formatRange,
} from '@/lib/exams/scoring';
import { CalculatorCard, ScoreField, ScoreResult, toNumber } from './ScoreParts';

/** Estimates scaled scores from correct answers for any exam in SCORING (SAT, ACT). */
export function ScoreEstimator({ exam, disclaimer }: { exam: ScoredExam; disclaimer: string }) {
  const config = SCORING[exam];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.sections.map((s) => [s.key, ''])),
  );

  const rows = config.sections.map((s) => {
    const n = toNumber(values[s.key]);
    const empty = Number.isNaN(n);
    const valid = !empty && Number.isInteger(n) && n >= 0 && n <= s.questions;
    return {
      section: s,
      error: !empty && !valid ? `Enter 0–${s.questions}` : undefined,
      range: valid ? estimateSectionScore(config, s, n) : null,
    };
  });

  const requiredRows = rows.filter((r) => !r.section.optional);
  const total = requiredRows.every((r) => r.range)
    ? combineRanges(config, Object.fromEntries(requiredRows.map((r) => [r.section.key, r.range as ScoreRange])))
    : null;

  return (
    <CalculatorCard
      id="estimate"
      title={`${config.examName} Score Estimator`}
      description={`Enter how many questions you got right on a full-length ${config.examName} practice test to see an estimated score range.`}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          {rows.map(({ section: s, error }) => (
            <ScoreField
              key={s.key}
              label={`${s.label}${s.optional ? ' (optional)' : ''} correct (out of ${s.questions})`}
              value={values[s.key]}
              onChange={(v) => setValues((prev) => ({ ...prev, [s.key]: v }))}
              min={0}
              max={s.questions}
              error={error}
            />
          ))}
          <p className="sm:col-span-2 text-xs leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
            {disclaimer}
          </p>
        </div>

        <ScoreResult
          label={`Estimated ${config.totalLabel.toLowerCase()}`}
          total={total ? formatRange(total) : '—'}
          sections={rows.map(({ section: s, range }) => ({
            label: s.optional ? `${s.label} (optional)` : s.label,
            value: range ? formatRange(range) : '—',
          }))}
          footnote={total ? undefined : `Enter your correct answers for ${requiredRows.map((r) => r.section.label).join(', ')}.`}
        />
      </div>
    </CalculatorCard>
  );
}
