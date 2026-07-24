// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GIVE HERO — Dynamic hero photos from admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { getHeroPhotos } from "@/lib/hero-photos";
import GiveHeroClient from "./GiveHeroClient";

export default async function GiveHero() {
  const photos = await getHeroPhotos();
  return <GiveHeroClient photos={photos} />;
}