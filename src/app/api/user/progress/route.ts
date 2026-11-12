import { NextResponse } from 'next/server';
import { getDbUser, unauthorized } from '@/lib/auth';
import {
  getCourseProgress, getEngagementSummary, getMockTestResults, getQuizSummary, getSubjectStrengths,
} from '@/lib/progress/queries';
import { getUserTimeZone } from '@/lib/progress/time';

// Same read model as the dashboard page — one definition of every metric
export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return unauthorized();

    const tz = await getUserTimeZone(user.id);
    const [engagement, quizzes, mockTests, subjects, courses] = await Promise.all([
      getEngagementSummary(user.id, tz),
      getQuizSummary(user.id),
      getMockTestResults(user.id),
      getSubjectStrengths(user.id),
      getCourseProgress(user.id),
    ]);

    const { heatmap, ...summary } = engagement;
    return NextResponse.json({
      ...summary,
      activity: heatmap,
      quizzes,
      mockTests,
      subjects,
      courses,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
