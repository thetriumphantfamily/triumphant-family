// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY PAGE — Public photo gallery
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery | The Triumphant Family",
  description:
    "Photos from ministry services, prayer meetings, events, and outreach programs of The Triumphant Family Ministry.",
  openGraph: {
    title: "Gallery | The Triumphant Family",
    description:
      "Relive glorious moments from The Triumphant Family Ministry.",
    type: "website",
  },
};

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const items = gallery || [];

  return (
    <main>
      <GalleryHero />
      <GalleryGrid items={items} />
    </main>
  );
}