import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ExamToolPage, ToolContentSection } from '@/features/exam-tools/ExamToolPage';
import { SuperscoreCalculator } from '@/features/exam-tools/calculator/SuperscoreCalculator';
import { ScoreEstimator } from '@/features/exam-tools/calculator/ScoreEstimator';

const PATH = '/sat-prep/score-calculator';

const ESTIMATE_DISCLAIMER =
  "This is an estimate. The digital SAT adapts to you: your second module is easier or harder depending on how you did in the first, and harder questions can count for more. Two students with the same number right can get different scores. For an official practice score, use College Board's Bluebook app.";

export const metadata: Metadata = pageMetadata({
  title: 'SAT Score Calculator & Superscore Calculator',
  description:
    'Free SAT superscore calculator plus a digital SAT score estimator. Combine your best section scores and estimate your score from a practice test.',
  path: PATH,
  hasRouteOgImage: true,
});

export default function SatScoreCalculatorPage() {
  return (
    <ExamToolPage
      exam="sat"
      path={PATH}
      breadcrumbLabel="Score Calculator"
      eyebrow="Free SAT tool"
      title="SAT Score Calculator"
      intro={
        <p>
          Two free calculators in one place. Use the <a href="#superscore" className="underline">superscore calculator</a> to
          combine your best section scores from several SAT attempts, or the{' '}
          <a href="#estimate" className="underline">score estimator</a> to turn a practice test result into an estimated
          score range.
        </p>
      }
    >
      <ToolContentSection variant="wide" className="pt-10 sm:pt-12 pb-4">
        <div className="space-y-8">
          <SuperscoreCalculator exam="sat" />
          <ScoreEstimator exam="sat" disclaimer={ESTIMATE_DISCLAIMER} />
        </div>
      </ToolContentSection>

      <ToolContentSection title="How SAT scoring works">
        <p>
          The digital SAT has two sections: <strong>Reading &amp; Writing</strong> and <strong>Math</strong>. Each
          is scored from 200 to 800, for a total score between 400 and 1600. There is no penalty for wrong
          answers, so never leave a question blank.
        </p>
        <p>
          Each section has two modules. How you do on the first module decides whether your second module is
          easier or harder, and harder questions can earn more points. That&apos;s why the number of questions you
          get right only gives an estimate, not an exact score.
        </p>
      </ToolContentSection>

      <ToolContentSection title="What is an SAT superscore?" background="var(--color-background-alt)">
        <p>
          A superscore combines your highest Reading &amp; Writing score and your highest Math score from
          different test dates. For example, 650 Reading &amp; Writing in March and 700 Math in May gives a
          superscore of 1350, even if neither test was 1350 on its own.
        </p>
        <ul>
          <li>Many US colleges superscore the SAT, but not all. Check each college&apos;s admissions website.</li>
          <li>Some colleges ask for all your scores, so plan each attempt as if it counts.</li>
          <li>Superscoring is a good reason to plan for two or three attempts with focused prep in between.</li>
        </ul>
      </ToolContentSection>
    </ExamToolPage>
  );
}
