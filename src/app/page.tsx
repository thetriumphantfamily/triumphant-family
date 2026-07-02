// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HOMEPAGE — The Triumphant Family Ministry Website
// Assembles all homepage sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Suspense } from "react";
import LoadingSpinner      from "@/components/ui/LoadingSpinner";
import HeroSection         from "@/components/home/HeroSection";
import WelcomeSection      from "@/components/home/WelcomeSection";
import CorePromisesSection from "@/components/home/CorePromisesSection";
import ServiceTimesSection from "@/components/home/ServiceTimesSection";
import SermonsPreview      from "@/components/home/SermonsPreview";
import EventsPreview       from "@/components/home/EventsPreview";
import GalleryPreview      from "@/components/home/GalleryPreview";
import PrayerCTASection    from "@/components/home/PrayerCTASection";
import TestimoniesSection  from "@/components/home/TestimoniesSection";
import LiveStreamBanner    from "@/components/home/LiveStreamBanner";

// ── Loading fallback ──
function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center">
      <LoadingSpinner size="lg" color="purple" label="Loading..." />
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Live stream alert (only shown when live) */}
      <Suspense fallback={null}>
        <LiveStreamBanner />
      </Suspense>

      {/* Hero */}
      <HeroSection />

      {/* Welcome from Prophet */}
      <WelcomeSection />

      {/* Core Promises */}
      <CorePromisesSection />

      {/* Service Times */}
      <ServiceTimesSection />

      {/* Latest Sermons */}
      <Suspense fallback={<SectionLoader />}>
        <SermonsPreview />
      </Suspense>

      {/* Upcoming Events */}
      <Suspense fallback={<SectionLoader />}>
        <EventsPreview />
      </Suspense>

      {/* Gallery Preview */}
      <Suspense fallback={<SectionLoader />}>
        <GalleryPreview />
      </Suspense>

      {/* Prayer CTA */}
      <PrayerCTASection />

      {/* Testimonies */}
      <Suspense fallback={<SectionLoader />}>
        <TestimoniesSection />
      </Suspense>
    </main>
  );
}