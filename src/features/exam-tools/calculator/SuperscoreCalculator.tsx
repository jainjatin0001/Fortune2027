'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SCORING, type ScoredExam, type ScoreSection, calculateSuperscore, isValidScore } from '@/lib/exams/scoring';
import { CalculatorCard, ScoreField, ScoreResult, toNumber } from './ScoreParts';

const MAX_ATTEMPTS = 6;

type Attempt = { id: number; values: Record<string, string> };

function fieldError(section: ScoreSection, value: string): string | undefined {
  if (value.trim() === '' || isValidScore(section, toNumber(value))) return undefined;
  return section.step > 1
    ? `Enter ${section.min}–${section.max} in steps of ${section.step}`
    : `Enter ${section.min}–${section.max}`;
}

/** Superscore calculator for any exam in SCORING (SAT, ACT). */
export function SuperscoreCalculator({ exam }: { exam: ScoredExam }) {
  const config = SCORING[exam];
  const emptyValues = () => Object.fromEntries(config.sections.map((s) => [s.key, '']));
  const [attempts, setAttempts] = useState<Attempt[]>(() => [
    { id: 1, values: emptyValues() },
    { id: 2, values: emptyValues() },
  ]);

  const update = (id: number, key: string, value: string) =>
    setAttempts((prev) => prev.map((a) => (a.id === id ? { ...a, values: { ...a.values, [key]: value } } : a)));
  const addAttempt = () =>
    setAttempts((prev) => [...prev, { id: Math.max(...prev.map((a) => a.id)) + 1, values: emptyValues() }]);
  const removeAttempt = (id: number) => setAttempts((prev) => prev.filter((a) => a.id !== id));

  const result = calculateSuperscore(
    config,
    attempts.map((a) => Object.fromEntries(config.sections.map((s) => [s.key, toNumber(a.values[s.key])]))),
  );
  const gain = result ? result.total - result.bestSingleTotal : 0;
  const required = config.sections.filter((s) => !s.optional).map((s) => s.label);

  return (
    <CalculatorCard
      id="superscore"
      title={`${config.examName} Superscore Calculator`}
      description={`Enter the section scores from each ${config.examName} you've taken. Your superscore combines your best ${required.join(', ').replace(/, ([^,]*)$/, ' and $1')} scores.`}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {attempts.map((a, i) => (
            <fieldset key={a.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
              <legend className="px-1 text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Attempt {i + 1}
              </legend>
              <div className="flex items-start gap-3">
                <div className={`grid flex-1 gap-3 grid-cols-2 ${config.sections.length > 2 ? 'sm:grid-cols-4' : ''}`}>
                  {config.sections.map((s) => (
                    <ScoreField
                      key={s.key}
                      label={s.optional ? `${s.label} (optional)` : s.label}
                      value={a.values[s.key]}
                      onChange={(v) => update(a.id, s.key, v)}
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      error={fieldError(s, a.values[s.key])}
                    />
                  ))}
                </div>
                {attempts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttempt(a.id)}
                    className="mt-6 p-2 rounded-lg transition-colors hover:bg-[var(--color-muted)]"
                    style={{ color: 'var(--color-muted-foreground)' }}
                    aria-label={`Remove attempt ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </fieldset>
          ))}
          {attempts.length < MAX_ATTEMPTS && (
            <Button type="button" variant="outline" size="sm" onClick={addAttempt}>
              <Plus className="h-4 w-4 mr-1" /> Add another attempt
            </Button>
          )}
        </div>

        <ScoreResult
          label={`Your ${config.examName} superscore`}
          total={result ? String(result.total) : '—'}
          sections={config.sections.map((s) => {
            const best = result?.best[s.key];
            return {
              label: s.optional ? `${s.label} (optional)` : s.label,
              value: best ? String(best.score) : '—',
              note: best ? `from attempt ${best.attempt + 1}` : undefined,
            };
          })}
          footnote={
            !result
              ? `Enter ${required.join(', ')} for at least one attempt.`
              : gain > 0
                ? `${gain} point${gain === 1 ? '' : 's'} higher than your best single test (${result.bestSingleTotal}).`
                : 'Same as your best single test.'
          }
        />
      </div>
    </CalculatorCard>
  );
}
