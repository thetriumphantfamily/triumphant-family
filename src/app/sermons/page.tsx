// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS PAGE — Assembles all sermon sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Suspense } from "react";
import type { Metadata } from "next";
import LoadingSpinner   from "@/components/ui/LoadingSpinner";
import SermonsHero      from "@/components/sermons/SermonsHero";
import FeaturedSermon   from "@/components/sermons/FeaturedSermon";
import SermonsList      from "@/components/sermons/SermonsList";

// ── SEO Metadata ──
export const metadata: Metadata = {
  title:       "Sermon Library | The Triumphant Family",
  description: "Watch and listen to powerful sermons from Prophet Olayiwole Ogunsola. Anointed messages on faith, prayer, healing, breakthrough, and the Word of God.",
  openGraph: {
    title:       "Sermon Library — The Triumphant Family",
    description: "Feed your spirit with anointed messages from Prophet Olayiwole Ogunsola.",
    type:        "website",
  },
};

// ── Loading fallback ──
function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center">
      <LoadingSpinner size="lg" color="purple" label="Loading sermons..." />
    </div>
  );
}

export default function SermonsPage() {
  return (
    <main>
      <SermonsHero />

      <Suspense fallback={<SectionLoader />}>
        <FeaturedSermon />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <SermonsList />
      </Suspense>
    </main>
  );
}