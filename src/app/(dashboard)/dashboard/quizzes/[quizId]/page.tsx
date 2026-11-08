import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { QuizInterface } from '@/components/shared/QuizInterface';
import type { DemoQuestion } from '@/types';

export const metadata: Metadata = { title: 'Quiz' };

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const { quizId } = await params;
  // Every signed-in user can take published quizzes; staff can also open drafts
  const isStaff = ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'].includes(user.role);

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, ...(isStaff ? {} : { isPublished: true }) },
    select: {
      title: true,
      timeLimit: true,
      passingScore: true,
      questions: {
        orderBy: { sortOrder: 'asc' },
        select: {
          points: true,
          question: {
            select: {
              id: true,
              statement: true,
              explanation: true,
              difficulty: true,
              questionType: true,
              acceptedAnswers: true,
              tags: true,
              subject: { select: { name: true } },
              topic: { select: { name: true } },
              options: { orderBy: { sortOrder: 'asc' }, select: { id: true, content: true, isCorrect: true } },
            },
          },
        },
      },
    },
  });
  if (!quiz) notFound();

  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const questions: DemoQuestion[] = quiz.questions.map(({ points, question }) => {
    const correctIndex = question.options.findIndex((option) => option.isCorrect);
    const correctAnswerIds = question.options
      .map((option, index) => (option.isCorrect ? letters[index] ?? String(index) : null))
      .filter((id): id is string => id !== null);
    return {
      id: question.id,
      subject: question.subject.name,
      topic: question.topic?.name ?? '',
      category: 'SAT_PREP',
      difficulty: question.difficulty,
      question: question.statement,
      options: question.options.map((option, index) => ({
        id: letters[index] ?? String(index),
        content: option.content,
        sourceOptionId: option.id,
      })),
      correctAnswerId: correctIndex >= 0 ? (letters[correctIndex] ?? String(correctIndex)) : '',
      questionType: question.questionType,
      correctAnswerIds,
      acceptedAnswers: question.acceptedAnswers,
      explanation: question.explanation ?? '',
      points,
      tags: question.tags,
    };
  });

  return (
    <QuizInterface
      questions={questions}
      title={quiz.title}
      timeLimit={quiz.timeLimit ? quiz.timeLimit * 60 : undefined}
      passingScore={quiz.passingScore}
      quizId={quizId}
    />
  );
}
