import type { Metadata } from 'next';
import { HeroSection } from '@/features/home/HeroSection';
import { TrustSection } from '@/features/home/TrustSection';
import { FeaturesSection } from '@/features/home/FeaturesSection';
import { CourseCategoriesSection } from '@/features/home/CourseCategoriesSection';
import { FeaturedCoursesSection } from '@/features/home/FeaturedCoursesSection';
import { PracticeTestBanner } from '@/features/home/PracticeTestBanner';
import { TestimonialsSection } from '@/features/home/TestimonialsSection';
import { HomePricingSection } from '@/features/home/HomePricingSection';
import { CTASection } from '@/features/home/CTASection';
import { APP_NAME, APP_DESCRIPTION } from '@/constants';

export const metadata: Metadata = {
  title: `${APP_NAME} — Premium SAT, ACT, AP & Coding Prep`,
  description: APP_DESCRIPTION,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <CourseCategoriesSection />
      {/* <FeaturedCoursesSection /> */}
      <PracticeTestBanner />
      <TestimonialsSection />
      <HomePricingSection />
      {/* <CTASection /> */}
    </>
  );
}
