import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { getAPSubject } from '@/../data/ap';
import APQuizClient from './APQuizClient';

export default async function APSubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { subjectId } = await params;
  const subject = getAPSubject(subjectId);
  if (!subject) notFound();

  return <APQuizClient subject={subject} />;
}
