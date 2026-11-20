import type { Metadata } from 'next';
import { pageMetadata, SITE_TAGLINE } from '@/lib/seo';
import { HeroSection } from '@/features/home/HeroSection';
import { TrustSection } from '@/features/home/TrustSection';
import { FeaturesSection } from '@/features/home/FeaturesSection';
import { CourseCategoriesSection } from '@/features/home/CourseCategoriesSection';
import { FeaturedCoursesSection } from '@/features/home/FeaturedCoursesSection';
import { PracticeTestBanner } from '@/features/home/PracticeTestBanner';
import { TestimonialsSection } from '@/features/home/TestimonialsSection';
import { HomePricingSection } from '@/features/home/HomePricingSection';
import { CTASection } from '@/features/home/CTASection';
import { ExamToolsHub } from '@/features/exam-tools/ExamToolsHub';
import { APP_NAME } from '@/constants';

// The SAT/ACT tools cards show the next SAT date and a countdown: refresh daily.
export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({ title: `${APP_NAME} | ${SITE_TAGLINE}`, absoluteTitle: true, path: '/', description: 'Live 1:1 online tutoring and full-length digital SAT, ACT and AP practice tests for high school students in the United States and Canada. Plus Python and coding courses for teens.' });

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <CourseCategoriesSection />
      <ExamToolsHub exams={['sat', 'act']} />
      {/* <FeaturedCoursesSection /> */}
      <PracticeTestBanner />
      <TestimonialsSection />
      <HomePricingSection />
      {/* <CTASection /> */}
    </>
  );
}
