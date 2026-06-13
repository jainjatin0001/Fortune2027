'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { QuizInterface } from '@/components/shared/QuizInterface';
import { getRandomDemoQuestions } from '@/../data/demo';

const questions = getRandomDemoQuestions(10);

export default function DemoQuizPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Demo Quiz</h1>
        <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          {questions.length} questions · 15 minutes · SAT, ACT, AP & Coding
        </p>
      </div>
      <QuizInterface questions={questions} title="Demo Quiz" timeLimit={900} />
    </div>
  );
}
