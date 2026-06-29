import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { getDemoQuiz } from '@/../data/demo';
import DemoQuizClient from './DemoQuizClient';

export default async function DemoQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { quizId } = await params;
  const quiz = getDemoQuiz(quizId);
  if (!quiz) notFound();

  return <DemoQuizClient quiz={quiz} />;
}
