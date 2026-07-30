// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER PORTAL LAYOUT — Shared layout for all member pages
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import MemberLayoutClient from "@/components/church/MemberLayoutClient";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MemberLayoutClient>{children}</MemberLayoutClient>;
}