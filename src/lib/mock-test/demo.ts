import { prisma } from '@/lib/prisma';
import { examKindOf, type ExamKind } from './exam-kind';
import { mockTestPlayHref } from './paths';

export interface DemoMockTestSummary {
  id: string;
  title: string;
  description: string | null;
  program: { id: string; name: string; slug: string };
  /** SAT / ACT get the matching exam interface and scaled scores */
  kind: ExamKind | null;
  sectionCount: number;
  totalQuestions: number;
  totalTimeSeconds: number;
  /** The student's most recent completed attempt, if any */
  lastAttempt: { id: string; percentage: number; scaledScore: number | null; completedAt: Date } | null;
  attemptCount: number;
}

const demoWhere = { isPublished: true, isDemo: true, programId: { not: null } };

/** Every published free (demo) mock test, grouped by program order then oldest first. */
export async function getDemoMockTests(userId: string): Promise<DemoMockTestSummary[]> {
  const tests = await prisma.mockTest.findMany({
    where: demoWhere,
    orderBy: [{ program: { sortOrder: 'asc' } }, { createdAt: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      program: { select: { id: true, slug: true, name: true } },
      sections: { select: { timeLimit: true, _count: { select: { questions: true } } } },
      attempts: {
        where: { userId, status: 'COMPLETED', completedAt: { not: null } },
        orderBy: { completedAt: 'desc' },
        select: { id: true, earnedScore: true, totalScore: true, scaledScore: true, completedAt: true },
      },
    },
  });

  return tests.flatMap(t => {
    if (!t.program) return [];
    const last = t.attempts[0];
    return [{
      id: t.id,
      title: t.title,
      description: t.description,
      program: t.program,
      kind: examKindOf(t.program),
      sectionCount: t.sections.length,
      totalQuestions: t.sections.reduce((acc, s) => acc + s._count.questions, 0),
      totalTimeSeconds: t.sections.reduce((acc, s) => acc + s.timeLimit, 0),
      attemptCount: t.attempts.length,
      lastAttempt: last
        ? {
            id: last.id,
            percentage: last.totalScore ? Math.round(((last.earnedScore ?? 0) / last.totalScore) * 100) : 0,
            scaledScore: last.scaledScore,
            completedAt: last.completedAt!,
          }
        : null,
    }];
  });
}

/** A single playable free test. */
export async function getDemoMockTest(id: string) {
  const test = await prisma.mockTest.findFirst({
    where: { ...demoWhere, id },
    select: { id: true, title: true, program: { select: { slug: true, name: true } } },
  });
  return test ? { ...test, kind: examKindOf(test.program) } : null;
}

/** Every published free test with its play link (for "Up next"). */
export async function getAllDemoMockTests() {
  const tests = await prisma.mockTest.findMany({
    where: demoWhere,
    orderBy: { createdAt: 'asc' },
    select: { id: true, title: true },
  });
  return tests.map(t => ({ ...t, href: mockTestPlayHref(t.id) }));
}

/** Slug of the first program with free tests for an exam — lets old /sat-exam links land pre-filtered */
export async function demoProgramSlugFor(kind: ExamKind) {
  const programs = await prisma.program.findMany({
    where: { mockTests: { some: demoWhere } },
    select: { slug: true, name: true },
    orderBy: { sortOrder: 'asc' },
  });
  return programs.find(p => examKindOf(p) === kind)?.slug ?? null;
}
