// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE STREAM BANNER — Only shown when ministry is streaming live
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LiveStreamBanner() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "is_live_streaming")
    .single();

  const isLive = data?.value === "true";
  if (!isLive) return null;

  return (
    <div className="bg-red-600 text-white py-3 px-4">
      <div className="container-custom flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <span className="font-bold uppercase tracking-wider text-sm">
            🔴 We Are Live Now!
          </span>
        </div>
        <span className="text-red-100 text-sm hidden sm:inline">•</span>
        <span className="text-red-100 text-sm">
          The Triumphant Family is currently streaming a live service
        </span>
        <Link
          href="/live"
          className="px-4 py-1.5 rounded-full bg-white text-red-600 font-bold text-sm hover:bg-red-50 transition-colors flex-shrink-0"
        >
          Watch Now →
        </Link>
      </div>
    </div>
  );
}