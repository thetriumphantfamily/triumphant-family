// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN LAYOUT CLIENT
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
      <div className="min-h-screen bg-gray-50">
        <ChurchAdminSidebar />
        <div className="lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
        </div>
      </div>
    </ChurchAdminAuthGuard>
  );
}