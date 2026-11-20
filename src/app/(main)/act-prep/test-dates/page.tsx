import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { EXAMS } from '@/lib/exams';
import { RECOMMENDED_PREP_WEEKS, formatDate, getNextDate } from '@/lib/exams/dates';
import {
  ACT_DATES_LAST_CHECKED,
  ACT_FEES,
  ACT_INTERNATIONAL_SCHEDULE,
  ACT_NEXT_YEAR,
  ACT_SCHOOL_YEAR,
  ACT_US_SCHEDULE,
} from '@/lib/exams/act-dates';
import { ExamToolPage, ToolContentSection } from '@/features/exam-tools/ExamToolPage';
import { DatesTable, NextTestCard, StudyPlanList } from '@/features/exam-tools/DateComponents';

const PATH = '/act-prep/test-dates';
const ACT = EXAMS.act;

// Statuses ("registration open", "next ACT") depend on today's date: refresh daily.
export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: `ACT Test Dates ${ACT_SCHOOL_YEAR}: US & Canada Registration Deadlines`,
  description: `All ${ACT_SCHOOL_YEAR} ACT test dates for the US and for Canada & international students, with registration and late deadlines, score release dates and a 12-week study plan for each date.`,
  path: PATH,
  hasRouteOgImage: true,
});

const SCHEDULES = [
  {
    schedule: ACT_US_SCHEDULE,
    intro: `For the United States, US territories and Puerto Rico. Registering after the regular deadline adds a $${ACT_FEES.lateRegistration} late fee. Deadlines end at ${ACT_US_SCHEDULE.deadlineTime}.`,
  },
  {
    schedule: ACT_INTERNATIONAL_SCHEDULE,
    intro:
      'For students in Canada and every other country outside the US. International test dates are two-day windows: you sit the test on one of the days at your test center. A late fee applies after the regular deadline.',
  },
];

export default function ActTestDatesPage() {
  return (
    <ExamToolPage
      toolsBackground="var(--color-background-alt)"
      afterTools={<ActDateGuides />}
      exam="act"
      path={PATH}
      breadcrumbLabel="Test Dates"
      eyebrow={`ACT ${ACT_SCHOOL_YEAR}`}
      title={`ACT Test Dates ${ACT_SCHOOL_YEAR}`}
      intro={
        <p>
          {`Every ACT date for the ${ACT_SCHOOL_YEAR} school year, for students in the United States and in Canada, with registration deadlines, late registration deadlines and score release dates, plus a week-by-week study plan for each date. Canada follows ACT's international schedule, which has different dates.`}
        </p>
      }
      note={
        <>
          Sources:{' '}
          <a href={ACT_US_SCHEDULE.registerUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            ACT (US)
          </a>{' '}
          and{' '}
          <a href={ACT_INTERNATIONAL_SCHEDULE.registerUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            ACT Global (international)
          </a>
          , last checked {formatDate(ACT_DATES_LAST_CHECKED, 'short')}.
        </>
      }
    >
      {/* Next date for each schedule, so US and Canadian students both see their own countdown. */}
      <ToolContentSection variant="wide" className="pt-10 sm:pt-12">
        <div className="grid gap-5 md:grid-cols-2">
          {SCHEDULES.map(({ schedule }) => {
            const next = getNextDate(schedule);
            return next ? (
              <NextTestCard key={schedule.id} examName={ACT.name} schedule={schedule} date={next} showRegion layout="compact" />
            ) : null;
          })}
        </div>
      </ToolContentSection>

      {SCHEDULES.map(({ schedule, intro }, i) => (
        <ToolContentSection
          key={schedule.id}
          variant="wide"
          title={schedule.title}
          intro={intro}
          background={i % 2 ? 'var(--color-background-alt)' : undefined}
        >
          <DatesTable examName={ACT.name} schedule={schedule} />
        </ToolContentSection>
      ))}

      <ToolContentSection
        variant="wide"
        title="A study plan for each ACT date"
        intro={`Most students do best with about ${RECOMMENDED_PREP_WEEKS} weeks of steady prep. Pick your date to see when to start and what to do each week.`}
      >
        <div className="space-y-8">
          {SCHEDULES.map(({ schedule }, i) => (
            <StudyPlanList
              key={schedule.id}
              examName={ACT.name}
              schedule={schedule}
              content={ACT.studyPlan}
              openFirst={i === 0}
              showRegionLabel
            />
          ))}
        </div>
      </ToolContentSection>

    </ExamToolPage>
  );
}

/** Supporting guides shown below the "More Free ACT Help" cards. */
function ActDateGuides() {
  return (
    <>
    <ToolContentSection title="How to choose your ACT date">
      <ul>
        <li>
          <strong>Juniors (grade 11):</strong> take your first ACT in February or April, so you have June,
          July and the fall of senior year to retake if needed.
        </li>
        <li>
          <strong>Seniors (grade 12) applying early:</strong> aim for September or October so your scores
          arrive before November early deadlines.
        </li>
        <li>
          <strong>Seniors applying Regular Decision:</strong> December is usually the last date colleges
          accept. Check each college&apos;s policy.
        </li>
        <li>
          <strong>Plan for two attempts.</strong> ACT automatically creates a superscore from your best
          English, Math and Reading scores across test dates.
        </li>
      </ul>
    </ToolContentSection>

    <ToolContentSection title="ACT fees and tips for Canadian students" background="var(--color-background-alt)">
      <p>
        In the US, the ACT (English, Math and Reading) costs <strong>${ACT_FEES.base}</strong>. Adding Science
        costs <strong>${ACT_FEES.science}</strong> more and Writing <strong>${ACT_FEES.writing}</strong> more.
        Late registration adds <strong>${ACT_FEES.lateRegistration}</strong>, and standby testing costs{' '}
        <strong>${ACT_FEES.standby}</strong>.{' '}
        <a href={ACT_FEES.sourceUrl} target="_blank" rel="noopener noreferrer">
          See all US fees on ACT.org
        </a>
        . Fees for international testing, including Canada, are listed on{' '}
        <a href={ACT_INTERNATIONAL_SCHEDULE.registerUrl} target="_blank" rel="noopener noreferrer">
          ACT Global
        </a>
        .
      </p>
      <p>
        Students in Canada register through ACT&apos;s international site and test on the international dates
        above, not the US dates. Seats can run out, so register as soon as you pick your date. Canadian students
        applying to US colleges follow the same US application deadlines, so use the same date guide above.
      </p>
    </ToolContentSection>

    <ToolContentSection title={`Projected US ACT dates for ${ACT_NEXT_YEAR.schoolYear}`}>
      <p>
        ACT has published these projected US dates for next school year. They are subject to change, and
        deadlines will be published later.
      </p>
      <ul>
        {ACT_NEXT_YEAR.dates.map((d) => (
          <li key={d}>{formatDate(d)}</li>
        ))}
      </ul>
    </ToolContentSection>
    </>
  );
}
