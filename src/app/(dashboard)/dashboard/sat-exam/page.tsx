'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ExamInterface } from '@/components/shared/ExamInterface';
import { getDemoQuestions } from '@/../data/demo';
import type { ExamSection } from '@/components/shared/ExamInterface';

const rwQuestions = getDemoQuestions('SAT_PREP').filter((q) =>
  q.subject === 'SAT Reading & Writing'
);
const mathQuestions = getDemoQuestions('SAT_PREP').filter((q) =>
  q.subject === 'SAT Math'
);

const SAT_SECTIONS: ExamSection[] = [
  {
    name: 'Reading & Writing',
    shortName: 'R&W',
    questions: rwQuestions,
    timeLimit: 1200, // 20 min (scaled down for demo)
  },
  {
    name: 'Math',
    shortName: 'MATH',
    questions: mathQuestions,
    timeLimit: 1200, // 20 min (scaled down for demo)
  },
];

export default function SATExamPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <ExamInterface
      examName="SAT Practice Exam"
      examCode="SAT"
      subtitle="Digital SAT · Reading & Writing + Math · Demo questions"
      accentColor="#7c3aed"
      sections={SAT_SECTIONS}
    />
  );
}
