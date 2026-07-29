// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BIBLE SCHOOL LANDING PAGE — Triumphant Disciples Academy
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TDAHero from "@/components/bible-school/TDAHero";
import TDAAbout from "@/components/bible-school/TDAAbout";
import TDALevels from "@/components/bible-school/TDALevels";
import TDABenefits from "@/components/bible-school/TDABenefits";
import TDAHowToRegister from "@/components/bible-school/TDAHowToRegister";
import TDACallToAction from "@/components/bible-school/TDACallToAction";

// ━━━ SEO Metadata ━━━
export const metadata: Metadata = {
  title: "Triumphant Disciples Academy | The Triumphant Family Bible School",
  description:
    "Join the Triumphant Disciples Academy (TDA) — the official Bible school of The Triumphant Family Ministry. Register for foundational Christian living, nurturing, church administration, and spiritual leadership courses.",
  openGraph: {
    title:
      "Triumphant Disciples Academy — The Triumphant Family Bible School",
    description:
      "Equipping believers with sound biblical knowledge for effective ministry. Register today for our 4-level discipleship programme.",
    type: "website",
  },
};

// ━━━ Loading fallback ━━━
function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center bg-brand-purple-900">
      <LoadingSpinner size="lg" color="gold" label="Loading..." />
    </div>
  );
}

export default function BibleSchoolPage() {
  return (
    <main>
      {/* Hero Section with rotating photos */}
      <Suspense fallback={<SectionLoader />}>
        <TDAHero />
      </Suspense>

      {/* About the Bible School */}
      <TDAAbout />

      {/* 4 School Levels */}
      <TDALevels />

      {/* Benefits of Joining */}
      <TDABenefits />

      {/* How to Register (3 Steps) */}
      <TDAHowToRegister />

      {/* Final Call to Action */}
      <TDACallToAction />
    </main>
  );
}