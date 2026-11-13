'use client';

// Free (demo) mock tests run through the same player as course tests: the attempt is
// saved, graded on the server and counted in dashboard metrics. The SAT / ACT test
// interface is picked from the test's program.
import { MockTestPlayer } from '@/components/shared/MockTestPlayer';

export default function MockTestClient({ mockTestId, color }: { mockTestId: string; color: string }) {
  return <MockTestPlayer mockTestId={mockTestId} color={color} />;
}
