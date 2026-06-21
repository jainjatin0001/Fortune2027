import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CoursePlayerClient } from './_components/CoursePlayerClient';
import type { AssetData } from './_components/AssetViewer';
import type { SidebarModule } from './_components/AssetSidebar';

export const metadata: Metadata = { title: 'Course Player' };

const PROGRAM_COLOR: Record<string, string> = {
  sat: '#7c3aed',
  'sat-prep': '#7c3aed',
  act: '#0891b2',
  'act-prep': '#0891b2',
  ap: '#b45309',
  'ap-exam': '#b45309',
  coding: '#059669',
  'high-school': '#be185d',
};

function getProgramColor(slug?: string | null) {
  if (!slug) return 'var(--color-primary)';
  return (
    PROGRAM_COLOR[slug] ??
    PROGRAM_COLOR[slug.split('-')[0]] ??
    'var(--color-primary)'
  );
}

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ asset?: string }>;
}) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { courseId } = await params;
  const { asset: urlAssetId } = await searchParams;

  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';

  // ── Fetch course + all published content ──────────────────────
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      program: { select: { name: true, slug: true } },
      modules: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          assets: {
            where: { isPublished: true },
            orderBy: { sortOrder: 'asc' },
            include: {
              quiz: {
                include: {
                  questions: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                      question: {
                        include: { options: { orderBy: { sortOrder: 'asc' } } },
                      },
                    },
                  },
                },
              },
              questionSet: {
                include: {
                  items: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                      question: {
                        include: { options: { orderBy: { sortOrder: 'asc' } } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  // ── Access control ────────────────────────────────────────────
  const enrollment = isAdmin
    ? null
    : await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
        include: {
          assetProgress: { select: { assetId: true, isCompleted: true } },
          courseProgress: true,
        },
      });

  if (!isAdmin && (!enrollment || enrollment.status !== 'ACTIVE')) {
    redirect('/dashboard/courses');
  }

  // ── Serialise data for the client ─────────────────────────────
  const completedAssetIds =
    enrollment?.assetProgress
      .filter(p => p.isCompleted)
      .map(p => p.assetId) ?? [];

  const allAssets = course.modules.flatMap(m => m.assets);

  // Resolve initial active asset server-side so there's no client flash:
  //   1. URL param  2. first incomplete  3. first asset
  const initialActiveAssetId =
    (urlAssetId && allAssets.some(a => a.id === urlAssetId) ? urlAssetId : null) ??
    allAssets.find(a => !completedAssetIds.includes(a.id))?.id ??
    allAssets[0]?.id ??
    null;

  // All assets as a JSON-safe flat array passed to the client once.
  // Subsequent navigation is pure client-side state — no re-fetch.
  const allAssetData: AssetData[] = allAssets.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    assetType: a.assetType as AssetData['assetType'],
    videoUrl: a.videoUrl,
    videoDuration: a.videoDuration,
    videoProvider: a.videoProvider,
    pdfUrl: a.pdfUrl,
    articleContent: a.articleContent,
    quiz: a.quiz
      ? {
          id: a.quiz.id,
          title: a.quiz.title,
          timeLimit: a.quiz.timeLimit,
          passingScore: a.quiz.passingScore,
          questions: a.quiz.questions.map(qq => ({
            sortOrder: qq.sortOrder,
            question: {
              id: qq.question.id,
              statement: qq.question.statement,
              difficulty: qq.question.difficulty,
              explanation: qq.question.explanation,
              options: qq.question.options.map(o => ({
                id: o.id,
                content: o.content,
                isCorrect: o.isCorrect,
                sortOrder: o.sortOrder,
              })),
            },
          })),
        }
      : null,
    questionSet: a.questionSet
      ? {
          id: a.questionSet.id,
          title: a.questionSet.title,
          questions: a.questionSet.items.map(item => ({
            sortOrder: item.sortOrder,
            question: {
              id: item.question.id,
              statement: item.question.statement,
              difficulty: item.question.difficulty,
              explanation: item.question.explanation,
              options: item.question.options.map(o => ({
                id: o.id,
                content: o.content,
                isCorrect: o.isCorrect,
                sortOrder: o.sortOrder,
              })),
            },
          })),
        }
      : null,
  }));

  const sidebarModules: SidebarModule[] = course.modules
    .filter(m => m.assets.length > 0) // omit empty modules
    .map(m => ({
      id: m.id,
      title: m.title,
      assets: m.assets.map(a => ({
        id: a.id,
        title: a.title,
        assetType: a.assetType as SidebarModule['assets'][number]['assetType'],
        videoDuration: a.videoDuration,
        isFree: a.isFree,
      })),
    }));

  const color = getProgramColor(course.program?.slug);
  const initialProgressPct = Number(enrollment?.courseProgress?.completionPct ?? 0);
  const totalCount = enrollment?.courseProgress?.totalAssets ?? allAssets.length;

  return (
    <CoursePlayerClient
      courseId={courseId}
      courseTitle={course.title}
      allAssets={allAssetData}
      sidebarModules={sidebarModules}
      initialActiveAssetId={initialActiveAssetId}
      completedAssetIds={completedAssetIds}
      enrollmentId={enrollment?.id ?? null}
      color={color}
      initialProgressPct={initialProgressPct}
      totalCount={totalCount}
    />
  );
}
