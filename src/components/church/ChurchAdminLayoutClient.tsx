// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN LAYOUT CLIENT — Brand purple gradient (same as main website)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import ChurchAdminAuthGuard from "./ChurchAdminAuthGuard";
import ChurchAdminSidebar from "./ChurchAdminSidebar";

export default function ChurchAdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChurchAdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
        <ChurchAdminSidebar />
        <div className="lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
        </div>
      </div>
    </ChurchAdminAuthGuard>
  );
}