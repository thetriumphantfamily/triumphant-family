// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER SIDEBAR — Church member portal navigation with notifications
// Red notification badge for visibility
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/member/dashboard", icon: "🏠", hasCount: false },
  { name: "My Profile", href: "/member/profile", icon: "👤", hasCount: false },
  { name: "Notifications", href: "/member/notifications", icon: "🔔", hasCount: true },
  { name: "Give", href: "/member/give", icon: "💰", hasCount: false },
  { name: "Giving History", href: "/member/giving-history", icon: "📊", hasCount: false },
  { name: "Attendance", href: "/member/attendance", icon: "✅", hasCount: false },
  { name: "Prayer Requests", href: "/member/prayer-requests", icon: "🙏", hasCount: false },
  { name: "Testimonies", href: "/member/testimonies", icon: "📖", hasCount: false },
  { name: "Events", href: "/member/events", icon: "📅", hasCount: false },
  { name: "Announcements", href: "/member/announcements", icon: "📢", hasCount: false },
  { name: "Devotional", href: "/member/devotional", icon: "📕", hasCount: false },
  { name: "Bible", href: "/member/bible", icon: "✝️", hasCount: false },
  { name: "Sermons", href: "/member/sermons", icon: "🎙️", hasCount: false },
  { name: "Live", href: "/member/live", icon: "📺", hasCount: false },
  { name: "Celebrations", href: "/member/celebrations", icon: "🎂", hasCount: false },
  { name: "Ask Pastor", href: "/member/ask-pastor", icon: "❓", hasCount: false },
  { name: "Departments", href: "/member/departments", icon: "⛪", hasCount: false },
  { name: "ID Card", href: "/member/id-card", icon: "🪪", hasCount: false },
];

interface Member {
  id?: string;
  full_name?: string;
  member_id?: string;
  department?: string;
  photo_url?: string;
}

export default function MemberSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadMember();
  }, []);

  useEffect(() => {
    if (member?.id) {
      loadUnreadCount(member.id);
      const interval = setInterval(() => loadUnreadCount(member.id!), 30000);
      return () => clearInterval(interval);
    }
  }, [member?.id]);

  const loadMember = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) {
                setMember(parsed);
                break;
              }
            }
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    }
  };

  const loadUnreadCount = async (memberId: string) => {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from("tfam_notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_type", "member")
        .eq("recipient_id", memberId)
        .eq("is_read", false);
      setUnreadCount(count || 0);
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    setIsLoggingOut(true);
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      router.push("/member/login");
    }, 500);
  };

  const firstName = member?.full_name?.split(" ")[0]?.toUpperCase() || "";

  return (
    <>
      {/* Mobile Toggle */}
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

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-30" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 text-white z-40 transform transition-transform duration-300 flex flex-col shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Header */}
        <div className="flex-shrink-0 p-4 border-b border-brand-gold-400/20">
          <Link
            href="/member/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/images/logo/logo.png"
              alt="TFAM"
              width={48}
              height={48}
              unoptimized
              className="w-12 h-12 object-contain flex-shrink-0"
            />
            <div>
              <p className="font-heading font-bold text-white text-base">Member Portal</p>
              <p className="text-xs text-brand-gold-400 font-semibold">Triumphant Family</p>
            </div>
          </Link>
        </div>

        {/* Member Profile Card */}
        {member && (
          <div className="flex-shrink-0 p-4 border-b border-brand-gold-400/20">
            <Link
              href="/member/profile"
              className="flex items-center gap-3"
              onClick={() => setMobileOpen(false)}
            >
              {member.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo_url}
                  alt={member.full_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold-400 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-brand-purple-900 font-black text-lg flex-shrink-0 border-2 border-brand-gold-400">
                  {firstName.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-black text-white text-sm truncate">{firstName}</p>
                <p className="text-xs text-brand-gold-400 font-bold truncate">
                  {member.member_id || "MEMBER"}
                </p>
                {member.department && (
                  <p className="text-xs text-brand-purple-200 font-semibold uppercase tracking-wide truncate">
                    {member.department}
                  </p>
                )}
              </div>
            </Link>
          </div>
        )}

        {/* Nav */}
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
                    if (item.hasCount && member?.id) {
                      loadUnreadCount(member.id);
                    }
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

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-brand-gold-400/20 space-y-2 bg-brand-purple-900/50">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-brand-purple-100 hover:bg-white/10 transition-colors text-sm"
          >
            <span className="text-lg">🌐</span>
            <span>View Website</span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-brand-purple-100 hover:bg-white/10 transition-colors text-sm disabled:opacity-50"
          >
            <span className="text-lg">🚪</span>
            <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}