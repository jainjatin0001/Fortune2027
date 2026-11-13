import { prisma } from '@/lib/prisma';

/**
 * The detailed (question-level) mock test report is a paid feature: staff always
 * see it, students need an active course enrollment. Everyone sees their scores.
 */
export async function canViewDetailedReport(user: { id: string; role: string }) {
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'INSTRUCTOR') return true;
  const active = await prisma.enrollment.count({ where: { userId: user.id, status: 'ACTIVE' } });
  return active > 0;
}
