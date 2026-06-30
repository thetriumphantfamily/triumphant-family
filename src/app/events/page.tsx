// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS PAGE — Assembles all event sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Suspense } from "react";
import type { Metadata } from "next";
import LoadingSpinner   from "@/components/ui/LoadingSpinner";
import EventsHero       from "@/components/events/EventsHero";
import UpcomingEvents   from "@/components/events/UpcomingEvents";
import PastEvents       from "@/components/events/PastEvents";

// ── SEO Metadata ──
export const metadata: Metadata = {
  title:       "Events | The Triumphant Family",
  description: "Join us for life-transforming services, conferences, crusades, and special programs at The Triumphant Family ministry.",
  openGraph: {
    title:       "Ministry Events — The Triumphant Family",
    description: "Don't miss our upcoming services and special programs.",
    type:        "website",
  },
};

// ── Loading fallback ──
function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center">
      <LoadingSpinner size="lg" color="purple" label="Loading events..." />
    </div>
  );
}

export default function EventsPage() {
  return (
    <main>
      <EventsHero />

      <Suspense fallback={<SectionLoader />}>
        <UpcomingEvents />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PastEvents />
      </Suspense>
    </main>
  );
}