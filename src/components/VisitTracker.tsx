// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VISIT TRACKER — Invisible component that records page visits
// Add to root layout so it runs on every public page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ━━━ Detect device type ━━━
function getDevice(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

// ━━━ Detect country from browser language ━━━
function getCountry(): string {
  try {
    const lang = navigator.language || "unknown";
    const region = new Intl.Locale(lang).region;
    if (region) return region;
    return lang.split("-")[1] || "unknown";
  } catch {
    return "unknown";
  }
}

// ━━━ Generate session ID ━━━
function getSessionId(): string {
  let sid = sessionStorage.getItem("tfam_session_id");
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem("tfam_session_id", sid);
  }
  return sid;
}

// ━━━ Pages to skip tracking (admin + member portals) ━━━
const SKIP_PREFIXES = ["/admin", "/member", "/bible-school/portal"];

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip admin and member pages
    const shouldSkip = SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (shouldSkip) return;

    const trackVisit = async () => {
      try {
        const supabase = createClient();
        await supabase.from("website_visits").insert({
          page: pathname,
          referrer: document.referrer || null,
          device: getDevice(),
          country: getCountry(),
          session_id: getSessionId(),
        });
      } catch {
        // Silently fail — never break the user experience
      }
    };

    // Small delay to not block page render
    const timer = setTimeout(trackVisit, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Invisible — renders nothing
  return null;
}