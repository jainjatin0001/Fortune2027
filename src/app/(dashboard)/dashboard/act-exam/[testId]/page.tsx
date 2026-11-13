import { redirect } from 'next/navigation';
import { mockTestPlayHref } from '@/lib/mock-test/paths';

// Free tests now play from /dashboard/mock-tests/[testId]
export default async function ACTTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  redirect(mockTestPlayHref(testId));
}
