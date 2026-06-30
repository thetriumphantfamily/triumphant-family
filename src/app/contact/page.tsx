import { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoSection from "@/components/contact/ContactInfoSection";
import ContactForm from "@/components/contact/ContactForm";
import LocationSection from "@/components/contact/LocationSection";
import SocialConnectSection from "@/components/contact/SocialConnectSection";

export const metadata: Metadata = {
  title: "Contact Us | The Triumphant Family",
  description:
    "Get in touch with The Triumphant Family Ministry. Send us a message, call, WhatsApp, email, or visit our church in Akute, Ogun State, Nigeria.",
  openGraph: {
    title: "Contact Us | The Triumphant Family",
    description:
      "Get in touch with The Triumphant Family Ministry. Send us a message, call, WhatsApp, email, or visit us.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactInfoSection />
      <ContactForm />
      <LocationSection />
      <SocialConnectSection />
    </main>
  );
}