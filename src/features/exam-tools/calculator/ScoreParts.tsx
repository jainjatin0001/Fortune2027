'use client';

import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { TOOL_THEME } from '../theme';

/** Labelled number field shared by both calculators. */
export function ScoreField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-foreground)' }}>
        {label}
      </label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        placeholder={placeholder ?? `${min}–${max}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="text-base"
      />
      {error && (
        <p id={errorId} className="text-xs mt-1" style={{ color: 'var(--color-destructive, #dc2626)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Result panel shared by both calculators: big total plus per-section rows. */
export function ScoreResult({
  label,
  total,
  sections,
  footnote,
}: {
  label: string;
  total: string;
  sections: { label: string; value: string; note?: string }[];
  footnote?: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{ background: TOOL_THEME.tint }}
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: TOOL_THEME.color }}>
        {label}
      </p>
      <p className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: 'var(--color-foreground)' }}>
        {total}
      </p>
      <dl className="grid grid-cols-2 gap-3 text-left">
        {sections.map((s) => (
          <div key={s.label} className="rounded-xl p-3" style={{ background: 'var(--color-card, var(--color-background))' }}>
            <dt className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{s.label}</dt>
            <dd className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>{s.value}</dd>
            {s.note && <dd className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{s.note}</dd>}
          </div>
        ))}
      </dl>
      {footnote && (
        <p className="text-xs mt-4" style={{ color: 'var(--color-foreground)' }}>
          {footnote}
        </p>
      )}
    </div>
  );
}

/** Card wrapper with heading for each calculator. */
export function CalculatorCard({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <div id={id} className="card-base p-5 sm:p-8 scroll-mt-24">
      <h2 className="text-heading-3 mb-2" style={{ color: 'var(--color-foreground)' }}>{title}</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--color-muted-foreground)' }}>{description}</p>
      {children}
    </div>
  );
}

/** Parse a field value; returns NaN for empty input. */
export function toNumber(value: string): number {
  return value.trim() === '' ? NaN : Number(value);
}
