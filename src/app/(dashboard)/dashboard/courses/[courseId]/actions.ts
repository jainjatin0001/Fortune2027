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

  revalidatePath('/dashboard/courses');
  revalidatePath(`/dashboard/courses/${enrollment.courseId}`);
  return { ok: true };
}
