// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER LAYOUT CLIENT — Brand purple gradient (same as main website)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { usePathname } from "next/navigation";
import MemberAuthGuard from "./MemberAuthGuard";
import MemberSidebar from "./MemberSidebar";

const PUBLIC_MEMBER_PAGES = [
  "/member/login",
  "/member/forgot-password",
  "/member/register",
];

export default function MemberLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_MEMBER_PAGES.includes(pathname);

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <MemberAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
        <MemberSidebar />
        <div className="lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
        </div>
      </div>
    </MemberAuthGuard>
  );
}