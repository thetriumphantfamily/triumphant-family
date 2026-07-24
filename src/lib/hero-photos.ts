// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO PHOTOS HELPER — Fetch active hero photos from database
// With fallback to default photos if none uploaded
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";

// Default fallback photos (if admin hasn't uploaded any yet)
const DEFAULT_PHOTOS = [
  "/images/hero/prophet-1.png",
  "/images/hero/prophet-2.png",
  "/images/hero/prophet-3.png",
  "/images/hero/prophet-4.png",
];

/**
 * Get active hero photos from database
 * Falls back to default photos if none uploaded
 */
export async function getHeroPhotos(): Promise<string[]> {
  try {
    const supabase = await createClient();

    const { data: photos, error } = await supabase
      .from("hero_photos")
      .select("url")
      .eq("is_active", true)
      .order("position", { ascending: true });

    if (error) {
      console.error("Error fetching hero photos:", error);
      return DEFAULT_PHOTOS;
    }

    // Return uploaded photos if any, otherwise fallback to defaults
    if (photos && photos.length > 0) {
      return photos.map((p) => p.url);
    }

    return DEFAULT_PHOTOS;
  } catch (err) {
    console.error("Unexpected error fetching hero photos:", err);
    return DEFAULT_PHOTOS;
  }
}