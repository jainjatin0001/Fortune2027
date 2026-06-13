import type { Metadata } from 'next';
import { QuizInterface } from '@/components/shared/QuizInterface';
import { getDemoQuestions, getRandomDemoQuestions } from '../../../../../data/demo';

export const metadata: Metadata = { title: 'Practice Questions' };

export default function PracticePage() {
  const questions = getRandomDemoQuestions(8);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-heading-2 mb-2" style={{ color: 'var(--color-foreground)' }}>
          Practice Session
        </h1>
        <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
          Adaptive questions across all your enrolled subjects.
        </p>
      </div>
      <QuizInterface questions={questions} title="Mixed Practice Quiz" />
    </div>
  );
}
