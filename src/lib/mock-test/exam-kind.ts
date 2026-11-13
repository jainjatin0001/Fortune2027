// Which exam (SAT / ACT) a mock test is for — picks the test interface and the
// scaled-score scale — decided by the program the admin picked. Matches whole words so e.g. "sat-practice"
// counts as SAT only, not ACT.

export type ExamKind = 'SAT' | 'ACT';

export const EXAM_KIND_META: Record<ExamKind, { label: string; color: string }> = {
  SAT: { label: 'SAT', color: '#7c3aed' },
  ACT: { label: 'ACT', color: '#0891b2' },
};

export function examKindOf(program: { slug: string; name: string } | null | undefined): ExamKind | null {
  if (!program) return null;
  const words = `${program.slug} ${program.name}`.toLowerCase().split(/[^a-z0-9]+/);
  if (words.includes('sat')) return 'SAT';
  if (words.includes('act')) return 'ACT';
  return null;
}
