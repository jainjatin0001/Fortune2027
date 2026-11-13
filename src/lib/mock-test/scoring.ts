// Scaled scores on each exam's official scale, estimated from raw points.
// Real conversion tables differ per test form and aren't public, so sections
// are scaled proportionally — close enough to show where a student stands.

import type { ExamKind } from './exam-kind';

export interface ScoreBand {
  label: string;
  score: number;
  min: number;
  max: number;
  /** Raw points behind this score */
  earned: number;
  total: number;
}

export interface ScaledScore {
  kind: ExamKind;
  total: ScoreBand;
  /** Section / area scores, in display order */
  parts: ScoreBand[];
  /** Shown beside the parts, e.g. ACT Science which isn't in the composite */
  note?: string;
}

export interface RawSection {
  name: string;
  shortName: string;
  earned: number;
  total: number;
}

type Area = { label: string; earned: number; total: number };

function groupBy(sections: RawSection[], areaOf: (s: RawSection) => string | null, order: string[]) {
  const areas = new Map<string, Area>();
  for (const s of sections) {
    const label = areaOf(s);
    if (!label || s.total <= 0) continue;
    const a = areas.get(label) ?? { label, earned: 0, total: 0 };
    a.earned += s.earned;
    a.total += s.total;
    areas.set(label, a);
  }
  return order.flatMap(l => (areas.has(l) ? [areas.get(l)!] : []));
}

const text = (s: RawSection) => `${s.name} ${s.shortName}`.toLowerCase();

function scaleSAT(sections: RawSection[]): ScaledScore | null {
  // Every SAT section is either Math or Reading & Writing
  const areas = groupBy(sections, s => (/\bmath/.test(text(s)) || /^m\d*$/i.test(s.shortName) ? 'Math' : 'Reading and Writing'),
    ['Reading and Writing', 'Math']);
  if (!areas.length) return null;
  const parts = areas.map(a => ({
    ...a,
    // 200–800 in steps of 10, like the real score report
    score: 200 + Math.round((a.earned / a.total) * 60) * 10,
    min: 200,
    max: 800,
  }));
  return {
    kind: 'SAT',
    total: {
      label: 'Total Score',
      score: parts.reduce((n, p) => n + p.score, 0),
      min: 200 * parts.length,
      max: 800 * parts.length,
      earned: parts.reduce((n, p) => n + p.earned, 0),
      total: parts.reduce((n, p) => n + p.total, 0),
    },
    parts,
  };
}

function scaleACT(sections: RawSection[]): ScaledScore | null {
  const subjectOf = (s: RawSection) => {
    const t = text(s);
    if (/engl|\beng\b/.test(t)) return 'English';
    if (/math/.test(t)) return 'Math';
    if (/read/.test(t)) return 'Reading';
    if (/sci/.test(t)) return 'Science';
    return null;
  };
  const areas = groupBy(sections, subjectOf, ['English', 'Math', 'Reading', 'Science']);
  if (!areas.length) return null;
  const parts = areas.map(a => ({
    ...a,
    score: Math.max(1, Math.round(1 + (a.earned / a.total) * 35)),
    min: 1,
    max: 36,
  }));
  // The composite averages English, Math and Reading; Science is reported on its own
  const core = parts.filter(p => p.label !== 'Science');
  const basis = core.length ? core : parts;
  return {
    kind: 'ACT',
    total: {
      label: 'Composite',
      score: Math.round(basis.reduce((n, p) => n + p.score, 0) / basis.length),
      min: 1,
      max: 36,
      earned: basis.reduce((n, p) => n + p.earned, 0),
      total: basis.reduce((n, p) => n + p.total, 0),
    },
    parts,
    note: core.length && parts.some(p => p.label === 'Science') ? 'Science is scored separately and not part of the composite.' : undefined,
  };
}

export function scaleScore(kind: ExamKind | null, sections: RawSection[]): ScaledScore | null {
  if (kind === 'SAT') return scaleSAT(sections);
  if (kind === 'ACT') return scaleACT(sections);
  return null;
}
