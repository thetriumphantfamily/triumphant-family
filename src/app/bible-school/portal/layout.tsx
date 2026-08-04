// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA STUDENT PORTAL LAYOUT – Shared layout for all student pages
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import TDAAuthGuard from "@/components/bible-school/TDAAuthGuard";
import TDAStudentSidebar from "@/components/bible-school/TDAStudentSidebar";

export default function TDAPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TDAAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
        <TDAStudentSidebar />
        <div className="lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">
            {children}
          </div>
        </div>
      </div>
    </TDAAuthGuard>
  );
}