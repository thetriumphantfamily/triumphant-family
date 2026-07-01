// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN LAYOUT — Wrapper with sidebar
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Wraps ALL admin pages including login/forgot/reset.
// Auth check is done individually inside each protected page
// (dashboard, sermons, events, etc.) — NOT in this layout.
//
// WHY: If auth check is in layout, it applies to login page too
//      which creates a redirect loop. Better to check per-page.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | The Triumphant Family",
  description: "Admin dashboard for ministry management",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No wrapper, no sidebar — each page decides its own layout
  return <>{children}</>;
}