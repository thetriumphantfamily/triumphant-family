// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER SIDEBAR — Church member portal navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/member/dashboard", icon: "🏠" },
  { name: "My Profile", href: "/member/profile", icon: "👤" },
  { name: "Give", href: "/member/give", icon: "💰" },
  { name: "Giving History", href: "/member/giving-history", icon: "📊" },
  { name: "Attendance", href: "/member/attendance", icon: "✅" },
  { name: "Prayer Requests", href: "/member/prayer-requests", icon: "🙏" },
  { name: "Testimonies", href: "/member/testimonies", icon: "📝" },
  { name: "Events", href: "/member/events", icon: "📅" },
  { name: "Announcements", href: "/member/announcements", icon: "📢" },
  { name: "Devotional", href: "/member/devotional", icon: "📖" },
  { name: "Bible", href: "/member/bible", icon: "📕" },
  { name: "Sermons", href: "/member/sermons", icon: "🎬" },
  { name: "Live", href: "/member/live", icon: "📺" },
  { name: "ID Card", href: "/member/id-card", icon: "🎴" },
  { name: "Ask Pastor", href: "/member/ask-pastor", icon: "❓" },
  { name: "Birthdays", href: "/member/celebrations", icon: "🎂" },
  { name: "My Department", href: "/member/departments", icon: "⛪" },
];

export default function MemberSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [session, setSession] = useState<{
    full_name: string;
    member_id: string;
    photo_url: string | null;
    department: string | null;
  } | null>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem("tfam_member_session");
    if (sessionData) {
      try {
        setSession(JSON.parse(sessionData));
      } catch (err) {
        console.error("Session parse error:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;

    setIsLoggingOut(true);
    localStorage.removeItem("tfam_member_session");
    toast.success("Logged out successfully");
    setTimeout(() => {
      router.push("/member/login");
    }, 500);
  };

  return (
    <>
      {/* Mobile toggle */}
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

      {/* Backdrop */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-30" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 text-white z-40 transform transition-transform duration-300 flex flex-col shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-white/10">
          <Link href="/member/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <Image src="/images/logo/logo.png" alt="TFAM Logo" width={48} height={48} unoptimized className="w-12 h-12 object-contain flex-shrink-0" />
            <div>
              <p className="font-heading font-bold text-white text-sm">Member Portal</p>
              <p className="text-xs text-brand-gold-400 font-semibold">Triumphant Family</p>
            </div>
          </Link>
        </div>

        {/* Member Info */}
        {session && (
          <div className="flex-shrink-0 p-4 border-b border-white/10 bg-brand-purple-950/40">
            <div className="flex items-center gap-3">
              {session.photo_url ? (
                <Image src={session.photo_url} alt={session.full_name} width={48} height={48} className="rounded-full border-2 border-brand-gold-400 w-12 h-12 object-cover" unoptimized />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold">
                  {session.full_name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{session.full_name}</p>
                <p className="text-brand-gold-400 text-xs font-semibold">{session.member_id}</p>
                {session.department && (
                  <p className="text-brand-purple-200 text-xs">{session.department}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold"
                      : "text-brand-purple-100 hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-white/10 space-y-2 bg-brand-purple-900/50">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-brand-purple-100 hover:bg-white/10 transition-colors text-sm">
            <span className="text-lg">🌐</span>
            Visit Website
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 transition-colors text-sm disabled:opacity-50"
          >
            <span className="text-lg">🚪</span>
            {isLoggingOut ? "Logging out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}