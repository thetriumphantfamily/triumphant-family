import { Metadata } from "next";
import { Suspense } from "react";
import LiveHero from "@/components/live/LiveHero";
import LiveStreamPlayer from "@/components/live/LiveStreamPlayer";
import LiveScheduleSection from "@/components/live/LiveScheduleSection";
import LiveChatCTA from "@/components/live/LiveChatCTA";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Watch Live | The Triumphant Family",
  description:
    "Join The Triumphant Family Ministry LIVE for powerful prayer, anointed worship, and prophetic declarations. Watch from anywhere in the world.",
  openGraph: {
    title: "Watch Live | The Triumphant Family",
    description:
      "Join The Triumphant Family Ministry LIVE for powerful prayer, anointed worship, and prophetic declarations.",
    type: "website",
  },
};

export default function LivePage() {
  return (
    <main>
      <LiveHero />
      <Suspense
        fallback={
          <div className="py-20 bg-gray-900">
            <LoadingSpinner size="lg" color="gold" />
          </div>
        }
      >
        <LiveStreamPlayer />
      </Suspense>
      <LiveScheduleSection />
      <LiveChatCTA />
    </main>
  );
}