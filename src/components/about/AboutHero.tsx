// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ABOUT HERO — Dynamic hero photos from admin (with fallback)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { getHeroPhotos } from "@/lib/hero-photos";
import AboutHeroClient from "./AboutHeroClient";

export default async function AboutHero() {
  const photos = await getHeroPhotos();
  return <AboutHeroClient photos={photos} />;
}