// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY HERO — Dynamic hero photos from admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { getHeroPhotos } from "@/lib/hero-photos";
import GalleryHeroClient from "./GalleryHeroClient";

export default async function GalleryHero() {
  const photos = await getHeroPhotos();
  return <GalleryHeroClient photos={photos} />;
}