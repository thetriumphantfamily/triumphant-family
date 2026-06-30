// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ABOUT PAGE — Assembles all about sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Suspense } from "react";
import type { Metadata } from "next";
import LoadingSpinner       from "@/components/ui/LoadingSpinner";
import AboutHero            from "@/components/about/AboutHero";
import OurStorySection      from "@/components/about/OurStorySection";
import VisionMissionSection from "@/components/about/VisionMissionSection";
import ProphetBioSection    from "@/components/about/ProphetBioSection";
import LeadershipSection    from "@/components/about/LeadershipSection";
import CoreValuesSection    from "@/components/about/CoreValuesSection";
import JoinUsCTA            from "@/components/about/JoinUsCTA";

// ── SEO Metadata ──
export const metadata: Metadata = {
  title:       "About Us | The Triumphant Family",
  description: "Get to know The Triumphant Family — The Gleam of Salvation Apostolic Ministry. Meet Prophet Olayiwole Ogunsola and learn about our vision, mission, and leadership team.",
  openGraph: {
    title:       "About The Triumphant Family",
    description: "A global ministry of prayer, prophecy, and power led by Prophet Olayiwole Ogunsola.",
    type:        "website",
  },
};

// ── Loading fallback ──
function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center">
      <LoadingSpinner size="lg" color="purple" label="Loading..." />
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStorySection />
      <VisionMissionSection />
      <ProphetBioSection />

      <Suspense fallback={<SectionLoader />}>
        <LeadershipSection />
      </Suspense>

      <CoreValuesSection />
      <JoinUsCTA />
    </main>
  );
}