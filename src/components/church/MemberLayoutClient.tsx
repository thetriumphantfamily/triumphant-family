// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER LAYOUT CLIENT — Conditionally wraps member pages
// Login page gets no sidebar, other pages get full layout
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { usePathname } from "next/navigation";
import MemberAuthGuard from "./MemberAuthGuard";
import MemberSidebar from "./MemberSidebar";

export default function MemberLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/member/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <MemberAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <MemberSidebar />
        <div className="lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
        </div>
      </div>
    </MemberAuthGuard>
  );
}