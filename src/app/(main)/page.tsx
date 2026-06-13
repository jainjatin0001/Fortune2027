import type { Metadata } from 'next';
import { HeroSection } from '@/features/home/HeroSection';
import { TrustSection } from '@/features/home/TrustSection';
import { CourseCategoriesSection } from '@/features/home/CourseCategoriesSection';
import { FeaturedCoursesSection } from '@/features/home/FeaturedCoursesSection';
import { TestimonialsSection } from '@/features/home/TestimonialsSection';
import { StatsSection } from '@/features/home/StatsSection';
import { FAQSection } from '@/features/home/FAQSection';
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
      <CourseCategoriesSection />
      <FeaturedCoursesSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
