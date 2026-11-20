import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ExamToolPage, ToolContentSection } from '@/features/exam-tools/ExamToolPage';
import { SuperscoreCalculator } from '@/features/exam-tools/calculator/SuperscoreCalculator';
import { ScoreEstimator } from '@/features/exam-tools/calculator/ScoreEstimator';

const PATH = '/act-prep/score-calculator';

const ESTIMATE_DISCLAIMER =
  "This is an estimate. Each ACT test form has its own conversion table, so the same number of correct answers can give a slightly different score on different tests. For an exact score on an official practice test, use the scoring table that comes with it.";

// The "More Free Help" cards show the next test date and a countdown: refresh daily.
export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: 'ACT Score Calculator & Superscore Calculator',
  description:
    'Free ACT superscore and composite score calculator, updated for the new ACT: the composite is the average of English, Math and Reading. Estimate your score from a practice test.',
  path: PATH,
  hasRouteOgImage: true,
});

export default function ActScoreCalculatorPage() {
  return (
    <ExamToolPage
      exam="act"
      path={PATH}
      breadcrumbLabel="Score Calculator"
      eyebrow="Free ACT tool"
      title="ACT Score Calculator"
      intro={
        <p>
          Two free calculators, updated for the new ACT. Use the <a href="#superscore" className="underline">superscore calculator</a> to
          combine your best section scores from several ACT attempts, or the{' '}
          <a href="#estimate" className="underline">score estimator</a> to turn a practice test result into an estimated
          composite.
        </p>
      }
    >
      <ToolContentSection variant="wide" className="pt-10 sm:pt-12 pb-4">
        <div className="space-y-8">
          <SuperscoreCalculator exam="act" />
          <ScoreEstimator exam="act" disclaimer={ESTIMATE_DISCLAIMER} />
        </div>
      </ToolContentSection>

      <ToolContentSection title="How ACT scoring works">
        <p>
          Each ACT section is scored from 1 to 36. Your <strong>Composite score</strong> is the average of your
          English, Math and Reading scores, rounded to the nearest whole number (halves round up). There is no
          penalty for wrong answers, so never leave a question blank.
        </p>
        <ul>
          <li>
            <strong>Science is optional.</strong> Since 2025, Science is an add-on that gets its own 1–36 score
            but no longer counts toward the Composite.
          </li>
          <li>
            <strong>Writing is optional</strong> and scored from 2 to 12. It doesn&apos;t affect your Composite.
          </li>
          <li>
            The current ACT has 50 English, 45 Math, 36 Reading and 40 Science questions. A few questions in each
            section are unscored field-test questions.
          </li>
        </ul>
      </ToolContentSection>

      <ToolContentSection title="What is an ACT superscore?" background="var(--color-background-alt)">
        <p>
          ACT automatically calculates a superscore if you test more than once: the average of your highest
          English, Math and Reading scores across all your test dates. For example, English 30 in February,
          Math 28 in April and Reading 32 in June give a superscore of 30, even if no single test was a 30.
        </p>
        <ul>
          <li>Many US colleges accept the ACT superscore, but not all. Check each college&apos;s admissions website.</li>
          <li>Science doesn&apos;t count toward the superscore, just as it doesn&apos;t count toward the Composite.</li>
          <li>Superscoring is a good reason to plan for two or three attempts with focused prep in between.</li>
        </ul>
      </ToolContentSection>
    </ExamToolPage>
  );
}
