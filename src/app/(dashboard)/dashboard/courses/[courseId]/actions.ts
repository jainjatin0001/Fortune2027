'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getDbUser } from '@/lib/auth';

export async function markAssetComplete(
  enrollmentId: string,
  assetId: string,
): Promise<{ ok: boolean }> {
  const user = await getDbUser();
  if (!user) return { ok: false };

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          modules: {
            include: { assets: { select: { id: true } } },
          },
        },
      },
    },
  });

  if (!enrollment || enrollment.userId !== user.id) return { ok: false };

  await prisma.learningAssetProgress.upsert({
    where: { enrollmentId_assetId: { enrollmentId, assetId } },
    create: { enrollmentId, assetId, isCompleted: true, completedAt: new Date() },
    update: { isCompleted: true, completedAt: new Date() },
  });

  // ── Course-level progress ───────────────────────────────────────
  const allAssetIds = enrollment.course.modules.flatMap(m => m.assets.map(a => a.id));
  const totalAssets = allAssetIds.length;

  const completedAssets = await prisma.learningAssetProgress.count({
    where: { enrollmentId, isCompleted: true, assetId: { in: allAssetIds } },
  });

  const completionPct = totalAssets > 0 ? (completedAssets / totalAssets) * 100 : 0;

  await prisma.courseProgress.upsert({
    where: { enrollmentId },
    create: { enrollmentId, totalAssets, completedAssets, completionPct, lastAccessedAt: new Date() },
    update: { totalAssets, completedAssets, completionPct, lastAccessedAt: new Date() },
  });

  // ── Module-level progress ───────────────────────────────────────
  const assetModule = enrollment.course.modules.find(m =>
    m.assets.some(a => a.id === assetId)
  );

  if (assetModule) {
    const moduleAssetIds = assetModule.assets.map(a => a.id);
    const completedModuleAssets = await prisma.learningAssetProgress.count({
      where: { enrollmentId, isCompleted: true, assetId: { in: moduleAssetIds } },
    });
    const modulePct = moduleAssetIds.length > 0
      ? (completedModuleAssets / moduleAssetIds.length) * 100
      : 0;
    const isModuleComplete = completedModuleAssets >= moduleAssetIds.length && moduleAssetIds.length > 0;

    await prisma.moduleProgress.upsert({
      where: { enrollmentId_moduleId: { enrollmentId, moduleId: assetModule.id } },
      create: {
        enrollmentId,
        moduleId: assetModule.id,
        completionPct: modulePct,
        totalAssets: moduleAssetIds.length,
        completedAssets: completedModuleAssets,
        isCompleted: isModuleComplete,
        completedAt: isModuleComplete ? new Date() : null,
      },
      update: {
        completionPct: modulePct,
        totalAssets: moduleAssetIds.length,
        completedAssets: completedModuleAssets,
        isCompleted: isModuleComplete,
        completedAt: isModuleComplete ? new Date() : null,
      },
    });
  }

  revalidatePath('/dashboard/courses');
  revalidatePath(`/dashboard/courses/${enrollment.courseId}`);
  revalidatePath('/dashboard/progress');
  return { ok: true };
}
