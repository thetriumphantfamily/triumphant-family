// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA HERO — Triumphant Disciples Academy landing hero
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { getHeroPhotos } from "@/lib/hero-photos";
import TDAHeroClient from "./TDAHeroClient";

export default async function TDAHero() {
  const photos = await getHeroPhotos();
  return <TDAHeroClient photos={photos} />;
}