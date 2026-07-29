// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITE CHROME WRAPPER — Path checker only (client component)
// Renders children with or without chrome slots
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { usePathname } from "next/navigation";

// ━━━ Paths where main website chrome should be HIDDEN ━━━
const HIDDEN_CHROME_PATHS = [
  "/bible-school/portal",
  "/admin",
];

export default function SiteChromeWrapper({
  chrome,
  children,
}: {
  chrome: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const shouldHideChrome = HIDDEN_CHROME_PATHS.some((path) =>
    pathname?.startsWith(path)
  );

  if (shouldHideChrome) {
    // Portal/admin pages — no chrome
    return <>{children}</>;
  }

  // Regular pages — show chrome + content
  return (
    <>
      {chrome}
      {children}
    </>
  );
}