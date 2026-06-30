// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER PAGE — Assembles all prayer sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Suspense } from "react";
import type { Metadata } from "next";
import LoadingSpinner          from "@/components/ui/LoadingSpinner";
import PrayerHero              from "@/components/prayer/PrayerHero";
import PrayerForm              from "@/components/prayer/PrayerForm";
import PrayerScheduleSection   from "@/components/prayer/PrayerScheduleSection";
import PrayerWallSection       from "@/components/prayer/PrayerWallSection";
import PrayerPromisesSection   from "@/components/prayer/PrayerPromisesSection";

// ── SEO Metadata ──
export const metadata: Metadata = {
  title:       "Submit a Prayer Request | The Triumphant Family",
  description: "Submit your prayer request to The Triumphant Family. Prophet Olayiwole Ogunsola and our prayer team will stand in agreement with you. We believe in the power of united prayer.",
  openGraph: {
    title:       "Prayer Request — The Triumphant Family",
    description: "You are not alone. Submit your prayer request and let us pray with you.",
    type:        "website",
  },
};

// ── Loading fallback ──
function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center">
      <LoadingSpinner size="lg" color="purple" label="Loading prayers..." />
    </div>
  );
}

export default function PrayerPage() {
  return (
    <main>
      <PrayerHero />
      <PrayerForm />
      <PrayerScheduleSection />

      <Suspense fallback={<SectionLoader />}>
        <PrayerWallSection />
      </Suspense>

      <PrayerPromisesSection />
    </main>
  );
}