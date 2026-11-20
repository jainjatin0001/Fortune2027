import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { EXAMS } from '@/lib/exams';
import { RECOMMENDED_PREP_WEEKS, formatDate, getNextDate } from '@/lib/exams/dates';
import { SAT_DATES_LAST_CHECKED, SAT_FEES, SAT_NEXT_YEAR, SAT_SCHEDULE, SAT_SCHOOL_YEAR } from '@/lib/exams/sat-dates';
import { ExamToolPage, ToolContentSection } from '@/features/exam-tools/ExamToolPage';
import { DatesTable, NextTestCard, StudyPlanList } from '@/features/exam-tools/DateComponents';

const PATH = '/sat-prep/test-dates';
const SAT = EXAMS.sat;

// Statuses ("registration open", "next SAT") depend on today's date: refresh daily.
export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: `SAT Test Dates ${SAT_SCHOOL_YEAR}: Registration Deadlines & Study Plans`,
  description: `All ${SAT_SCHOOL_YEAR} SAT dates with registration and late deadlines, score release dates and a 12-week study plan for each test date. For students in the US and Canada.`,
  path: PATH,
  hasRouteOgImage: true,
});

export default function SatTestDatesPage() {
  const next = getNextDate(SAT_SCHEDULE);

  return (
    <ExamToolPage
      toolsBackground="var(--color-background)"
      afterTools={<SatDateGuides />}
      exam="sat"
      path={PATH}
      breadcrumbLabel="Test Dates"
      eyebrow={`SAT ${SAT_SCHOOL_YEAR}`}
      title={`SAT Test Dates ${SAT_SCHOOL_YEAR}`}
      intro={
        <p>
          {`Every SAT date for the ${SAT_SCHOOL_YEAR} school year, with registration deadlines, late registration deadlines and score release dates, plus a week-by-week study plan for each test date. The same dates apply to students in the United States, Canada and worldwide.`}
        </p>
      }
      note={
        <>
          Source:{' '}
          <a href={SAT_SCHEDULE.registerUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            College Board
          </a>
          , last checked {formatDate(SAT_DATES_LAST_CHECKED, 'short')}. Deadlines end at {SAT_SCHEDULE.deadlineTime}.
        </>
      }
    >
      {next && (
        <ToolContentSection variant="wide" className="pt-10 sm:pt-12">
          <NextTestCard examName={SAT.name} schedule={SAT_SCHEDULE} date={next} />
        </ToolContentSection>
      )}

      <ToolContentSection
        variant="wide"
        title={SAT_SCHEDULE.title}
        intro={`Register by the registration deadline to avoid the $${SAT_FEES.lateRegistration} late fee. The late deadline is also the last day to change your test center or cancel.`}
      >
        <DatesTable examName={SAT.name} schedule={SAT_SCHEDULE} />
      </ToolContentSection>

      <ToolContentSection
        variant="wide"
        background="var(--color-background-alt)"
        title="A study plan for each SAT date"
        intro={`Most students do best with about ${RECOMMENDED_PREP_WEEKS} weeks of steady prep. Pick your date to see when to start and what to do each week.`}
      >
        <StudyPlanList examName={SAT.name} schedule={SAT_SCHEDULE} content={SAT.studyPlan} />
      </ToolContentSection>

    </ExamToolPage>
  );
}

/** Supporting guides shown below the "More Free SAT Help" cards. */
function SatDateGuides() {
  return (
    <>
    <ToolContentSection title="How to choose your SAT date" background="var(--color-background-alt)">
      <ul>
        <li>
          <strong>Juniors (grade 11):</strong> take your first SAT in March or May, so you have June and the
          fall of senior year to retake if needed.
        </li>
        <li>
          <strong>Seniors (grade 12) applying early:</strong> aim for August, September or October so your
          scores arrive before November early deadlines.
        </li>
        <li>
          <strong>Seniors applying Regular Decision:</strong> November and December are usually the last
          dates colleges accept. Check each college&apos;s policy.
        </li>
        <li>
          <strong>Plan for two attempts.</strong> Many students improve on their second try, and colleges that
          superscore will combine your best section scores.
        </li>
      </ul>
    </ToolContentSection>

    <ToolContentSection title="Registration fees and tips for Canadian students">
      <p>
        The SAT costs <strong>${SAT_FEES.registration}</strong> in the United States. Students testing outside
        the US, including in Canada, pay an extra <strong>${SAT_FEES.internationalFee}</strong> international
        fee. Registering after the regular deadline adds a <strong>${SAT_FEES.lateRegistration}</strong> late
        fee. Fee waivers are available for eligible students.{' '}
        <a href={SAT_FEES.sourceUrl} target="_blank" rel="noopener noreferrer">
          See all fees on College Board
        </a>
        .
      </p>
      <p>
        Seats at test centers can run out, so register as soon as you pick your date. Canadian students
        applying to US colleges follow the same US application deadlines, so use the same date guide above.
      </p>
    </ToolContentSection>

    <ToolContentSection title={`Anticipated SAT dates for ${SAT_NEXT_YEAR.schoolYear}`} background="var(--color-background-alt)">
      <p>
        College Board has announced these expected dates for next school year. They can still change, and
        deadlines will be published later.
      </p>
      <ul>
        {SAT_NEXT_YEAR.dates.map((d) => (
          <li key={d}>{formatDate(d)}</li>
        ))}
      </ul>
    </ToolContentSection>
    </>
  );
}
