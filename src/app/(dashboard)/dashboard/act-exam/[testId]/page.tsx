import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { getACTMockTest } from '@/../data/act';
import ACTExamClient from './ACTExamClient';

export default async function ACTTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { testId } = await params;
  const test = getACTMockTest(testId);
  if (!test) notFound();

  return <ACTExamClient test={test} />;
}
