// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER HERO — Dynamic hero photos from admin (with fallback)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { getHeroPhotos } from "@/lib/hero-photos";
import PrayerHeroClient from "./PrayerHeroClient";

export default async function PrayerHero() {
  const photos = await getHeroPhotos();
  return <PrayerHeroClient photos={photos} />;
}