// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIES PAGE — Public testimony wall + submission form
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Metadata } from "next";
import TestimoniesHero from "@/components/testimonies/TestimoniesHero";
import TestimoniesWall from "@/components/testimonies/TestimoniesWall";
import TestimonyForm from "@/components/testimonies/TestimonyForm";
import ShareCTA from "@/components/testimonies/ShareCTA";

export const metadata: Metadata = {
  title: "Testimonies | The Triumphant Family",
  description:
    "Read powerful testimonies of God's faithfulness — healings, breakthroughs, and miracles from members of The Triumphant Family Ministry. Share your own story!",
  openGraph: {
    title: "Testimonies | The Triumphant Family",
    description:
      "Read powerful testimonies of God's faithfulness from members of The Triumphant Family Ministry.",
    type: "website",
  },
};

export default function TestimoniesPage() {
  return (
    <main>
      <TestimoniesHero />
      <TestimoniesWall />
      <ShareCTA />
      <TestimonyForm />
    </main>
  );
}