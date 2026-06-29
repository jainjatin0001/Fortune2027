import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { getSATMockTest } from '@/../data/sat';
import SATExamClient from './SATExamClient';

export default async function SATTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { testId } = await params;
  const test = getSATMockTest(testId);
  if (!test) notFound();

  return <SATExamClient test={test} />;
}
