'use client';

import { ClipboardCheck } from 'lucide-react';
import { AuthLinkCard } from '@/components/shared/AuthLinkCard';
import { EXAMS, GUEST_DASHBOARD_PATH, type ExamKey } from '@/lib/exams';

/**
 * Mock test card: signed-in students go straight to the exam's mock tests,
 * guests go to the dashboard preview. Client file because the icon component
 * can't be passed from a server component.
 */
export function MockTestCard({ exam, color, tint }: { exam: ExamKey; color?: string; tint?: string }) {
  const { name, mockTestPath } = EXAMS[exam];
  return (
    <AuthLinkCard
      signedInHref={mockTestPath}
      signedOutHref={GUEST_DASHBOARD_PATH}
      title={`Free ${name} Mock Test`}
      badge="Real exam format · Start for free"
      description={`Take a full-length, timed ${name} practice test and get a detailed score report.`}
      ctaLabel="Start a mock test"
      icon={ClipboardCheck}
      color={color}
      tint={tint}
    />
  );
}
