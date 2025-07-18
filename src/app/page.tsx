"use client";

import { FAQSection } from "@/components/Landing/FAQSection";
import { FeaturedItemsSection } from "@/components/Landing/FeaturedItemsSection";
import { FinalCTASection } from "@/components/Landing/FinalCTASection";
import { HeroSection } from "@/components/Landing/HeroSection";
import { HowItWorksSection } from "@/components/Landing/HowItworks";
import { OurStorySection } from "@/components/Landing/OurStorySection";
import { TestimonialsSection } from "@/components/Landing/TestimonialsSection";
import { ThemedBoxesSection } from "@/components/Landing/ThemedBoxesSection";
import { PageLayout } from "@/components/Layout/page-layout";

export default function Landing() {
  return (
    <PageLayout>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedItemsSection />
      <OurStorySection />
      <ThemedBoxesSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </PageLayout>
  );
}
