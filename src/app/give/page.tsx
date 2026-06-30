import { Metadata } from "next";
import GiveHero from "@/components/give/GiveHero";
import BankDetailsSection from "@/components/give/BankDetailsSection";
import WhyGiveSection from "@/components/give/WhyGiveSection";
import GivingTypesSection from "@/components/give/GivingTypesSection";
import PartnershipCTA from "@/components/give/PartnershipCTA";

export const metadata: Metadata = {
  title: "Give | The Triumphant Family",
  description:
    "Partner with The Triumphant Family Ministry through your tithes, offerings, and seed faith giving. Every seed sown advances the Kingdom of God.",
  openGraph: {
    title: "Give | The Triumphant Family",
    description:
      "Partner with The Triumphant Family Ministry through your tithes, offerings, and seed faith giving.",
    type: "website",
  },
};

export default function GivePage() {
  return (
    <main>
      <GiveHero />
      <BankDetailsSection />
      <WhyGiveSection />
      <GivingTypesSection />
      <PartnershipCTA />
    </main>
  );
}