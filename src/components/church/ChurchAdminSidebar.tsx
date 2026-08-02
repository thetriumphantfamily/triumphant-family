// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN SIDEBAR — Church management navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin/church/dashboard", icon: "📊", hasCount: false },
  { name: "Notifications", href: "/admin/church/notifications", icon: "🔔", hasCount: true },
  { name: "Church Chat", href: "/admin/church/church-chat", icon: "💬", hasCount: false },
  { name: "Members", href: "/admin/church/members", icon: "👥", hasCount: false },
  { name: "Visitors", href: "/admin/church/visitors", icon: "🆕", hasCount: false },
  { name: "Attendance", href: "/admin/church/attendance", icon: "✅", hasCount: false },
  { name: "Giving", href: "/admin/church/giving", icon: "💰", hasCount: false },
  { name: "Prayer Requests", href: "/admin/church/prayer", icon: "🙏", hasCount: false },
  { name: "Devotionals", href: "/admin/church/devotionals", icon: "📖", hasCount: false },
  { name: "Announcements", href: "/admin/church/announcements", icon: "📢", hasCount: false },
  { name: "Pastoral Care", href: "/admin/church/pastoral-care", icon: "💝", hasCount: false },
  { name: "Care Requests", href: "/admin/church/care-requests", icon: "🏥", hasCount: false },
  { name: "Ask Pastor", href: "/admin/church/ask-pastor", icon: "❓", hasCount: false },
  { name: "Discipleship", href: "/admin/church/discipleship", icon: "🎯", hasCount: false },
  { name: "Small Groups", href: "/admin/church/small-groups", icon: "👥", hasCount: false },
  { name: "Departments", href: "/admin/church/departments", icon: "⛪", hasCount: false },
  { name: "TFAM AI", href: "/admin/church/ai-assistant", icon: "🤖", hasCount: false },
  { name: "Reports", href: "/admin/church/reports", icon: "📈", hasCount: false },
  { name: "Settings", href: "/admin/church/settings", icon: "⚙️", hasCount: false },
];

export default function ChurchAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from("tfam_notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_type", "admin")
        .eq("is_read", false);
      setUnreadCount(count || 0);
    } catch { /* ignore */ }
  };

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    setIsLoggingOut(true);
    localStorage.removeItem("church_admin_session");
    toast.success("Logged out successfully");
    setTimeout(() => { router.push("/admin/login"); }, 500);
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold text-brand-purple-900"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-30" />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 text-white z-40 transform transition-transform duration-300 flex flex-col shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex-shrink-0 p-4 border-b border-brand-gold-400/20">
          <Link href="/admin/church/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <Image src="/images/logo/logo.png" alt="TFAM" width={48} height={48} unoptimized className="w-12 h-12 object-contain flex-shrink-0" />
            <div>
              <p className="font-heading font-bold text-white text-sm">Church Admin</p>
              <p className="text-xs text-brand-purple-200 font-semibold">Management</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const showCount = item.hasCount && unreadCount > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setMobileOpen(false);
                    if (item.hasCount) loadUnreadCount();
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold"
                      : "text-brand-purple-100 hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-sm flex-1">{item.name}</span>
                  {showCount && (
                    <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-red-500 text-white text-[11px] font-black shadow-lg shadow-red-500/50 animate-pulse ring-2 ring-red-400">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex-shrink-0 p-3 border-t border-brand-gold-400/20 space-y-2 bg-brand-purple-900/50">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-brand-purple-100 hover:bg-white/10 transition-colors text-sm">
            <span className="text-lg">🌐</span>
            <span>View Website</span>
          </Link>
          <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-brand-purple-100 hover:bg-white/10 transition-colors text-sm disabled:opacity-50">
            <span className="text-lg">🚪</span>
            <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}