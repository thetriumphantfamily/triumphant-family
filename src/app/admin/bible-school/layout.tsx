// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN LAYOUT — Shared layout for Bible School admin pages
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import TDAAdminAuthGuard from "@/components/bible-school/TDAAdminAuthGuard";
import TDAAdminSidebar from "@/components/bible-school/TDAAdminSidebar";

export default function TDAAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TDAAdminAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <TDAAdminSidebar />
        <div className="lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
        </div>
      </div>
    </TDAAdminAuthGuard>
  );
}