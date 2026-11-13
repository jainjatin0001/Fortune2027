import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { getDemoMockTest } from '@/lib/mock-test/demo';
import { EXAM_KIND_META } from '@/lib/mock-test/exam-kind';
import MockTestClient from './MockTestClient';

export default async function MockTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { testId } = await params;
  const test = await getDemoMockTest(testId);
  if (!test) notFound();

  return <MockTestClient mockTestId={test.id} color={test.kind ? EXAM_KIND_META[test.kind].color : '#4f46e5'} />;
}
