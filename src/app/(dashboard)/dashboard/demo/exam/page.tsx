'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { QuizInterface } from '@/components/shared/QuizInterface';
import { getDemoQuestions } from '@/../data/demo';

const questions = getDemoQuestions();

export default function DemoExamPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Demo Exam</h1>
        <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          Full demo exam with all {questions.length} sample questions · 30 minutes
        </p>
      </div>
      <QuizInterface questions={questions} title="Demo Exam" timeLimit={1800} />
    </div>
  );
}
