'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ExamInterface } from '@/components/shared/ExamInterface';
import { getDemoQuestions } from '@/../data/demo';
import type { ExamSection } from '@/components/shared/ExamInterface';

const actAll = getDemoQuestions('ACT_PREP');

const ACT_SECTIONS: ExamSection[] = [
  {
    name: 'English',
    shortName: 'ENG',
    questions: actAll.filter((q) => q.subject === 'ACT English'),
    timeLimit: 300, // 5 min demo
  },
  {
    name: 'Mathematics',
    shortName: 'MATH',
    questions: actAll.filter((q) => q.subject === 'ACT Math'),
    timeLimit: 360, // 6 min demo
  },
  {
    name: 'Science',
    shortName: 'SCI',
    questions: actAll.filter((q) => q.subject === 'ACT Science'),
    timeLimit: 300, // 5 min demo
  },
];

export default function ACTExamPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <ExamInterface
      examName="ACT Practice Exam"
      examCode="ACT"
      subtitle="English · Math · Science · Demo questions"
      accentColor="#0891b2"
      sections={ACT_SECTIONS}
    />
  );
}
