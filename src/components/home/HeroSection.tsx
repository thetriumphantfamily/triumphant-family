// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO SECTION — Server component that fetches photos from database
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { getHeroPhotos } from "@/lib/hero-photos";
import HeroSectionClient from "./HeroSectionClient";

export default async function HeroSection() {
  const photos = await getHeroPhotos();
  return <HeroSectionClient photos={photos} />;
}