// ───────────────────────────────────────────────────────────────
// MEMBER LOGIN PAGE — APK-first (auto-redirects if logged in)
// ───────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import MemberLoginClient from "@/components/church/MemberLoginClient";

export const metadata: Metadata = {
  title: "Member Login | The Triumphant Family",
  description: "Login to your member portal at The Triumphant Family Ministry.",
};

export default function MemberLoginPage() {
  return <MemberLoginClient />;
}