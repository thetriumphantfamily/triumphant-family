// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN LAYOUT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import ChurchAdminLayoutClient from "@/components/church/ChurchAdminLayoutClient";

export default function ChurchAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChurchAdminLayoutClient>{children}</ChurchAdminLayoutClient>;
}