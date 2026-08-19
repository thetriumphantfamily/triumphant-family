// ───────────────────────────────────────────────────────────────
// MEMBER DASHBOARD — Instant load + Push Notification Setup
// ───────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import PushNotificationSetup from "@/components/PushNotificationSetup";

interface Member {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string | null;
  photo_url: string | null;
  department: string | null;
  date_joined: string | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getTitle(gender: string | null): string {
  if (gender === "male") return "Brother";
  if (gender === "female") return "Sister";
  return "";
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const QUICK_LINKS = [
  { name: "Give", href: "/member/give", icon: "💰", desc: "Pay tithes & offerings" },
  { name: "Devotional", href: "/member/devotional", icon: "📕", desc: "Today's Word" },
  { name: "Church Chat", href: "/member/church-chat", icon: "💬", desc: "Family chatroom" },
  { name: "Attendance", href: "/member/attendance", icon: "✅", desc: "Check in" },
  { name: "Prayer", href: "/member/prayer-requests", icon: "🙏", desc: "Submit prayer" },
  { name: "Ask Pastor", href: "/member/ask-pastor", icon: "❓", desc: "Ask a question" },
  { name: "Bible", href: "/member/bible", icon: "✝️", desc: "Read the Word" },
  { name: "Sermons", href: "/member/sermons", icon: "🎙️", desc: "Watch sermons" },
  { name: "Events", href: "/member/events", icon: "📅", desc: "Upcoming events" },
  { name: "ID Card", href: "/member/id-card", icon: "🪪", desc: "Digital ID" },
];

export default function MemberDashboardClient() {
  const [member, setMember] = useState<Member | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // ─────────────────────────────────────────────
  // LOAD SESSION INSTANTLY FROM localStorage
  // No loading screen — content shows immediately
  // ─────────────────────────────────────────────
  useEffect(() => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;

      const parsed = JSON.parse(session);
      setMember(parsed);

      // Load notifications in background (no blocking)
      if (parsed.id) {
        loadNotifications(parsed.id);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  }, []);

  const loadNotifications = async (memberId: string) => {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from("tfam_notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_type", "member")
        .eq("recipient_id", memberId)
        .eq("is_read", false);
      setUnreadNotifications(count || 0);
    } catch (err) {
      console.error("Notifications error:", err);
    }
  };

  // ─────────────────────────────────────────────
  // NO LOADING SCREEN — just wait for member data
  // Shows blank purple bg (matches splash seamlessly)
  // ─────────────────────────────────────────────
  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900" />
    );
  }

  const greeting = getGreeting();
  const title = getTitle(member.gender);
  const firstName = member.full_name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Push Notification Setup */}
      <PushNotificationSetup userId={member.id} userType="member" />

      {/* Welcome Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Member Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            {member.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-brand-gold-400 shadow-gold"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-brand-purple-900 font-black text-2xl border-2 border-brand-gold-400">
                {firstName.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-white/80 font-semibold text-base md:text-lg">{greeting},</p>
              <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {title} {firstName}!
              </h1>
              <p className="text-brand-purple-200 text-xs md:text-sm font-semibold mt-1">
                {member.member_id} • {member.department || "No Department"}
              </p>
            </div>
          </div>

          {/* Notification Alert */}
          {unreadNotifications > 0 && (
            <Link
              href="/member/notifications"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-400/40 hover:bg-red-500/30 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white font-bold text-sm">
                🔔 {unreadNotifications} new notification{unreadNotifications > 1 ? "s" : ""}
              </span>
            </Link>
          )}

          <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
            <p className="text-brand-purple-200 italic text-sm">
              &ldquo;The LORD is my shepherd; I shall not want.&rdquo;
            </p>
            <p className="text-brand-purple-300 text-xs mt-1 font-semibold">— Psalm 23:1</p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-white font-heading font-black text-lg mb-4">⚡ Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-4 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-center"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{link.icon}</div>
              <p className="font-black text-white text-xs">{link.name}</p>
              <p className="text-brand-purple-200 text-[10px] mt-0.5">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-heading font-bold text-white mb-3">⏰ Service Times</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-brand-purple-200">Sunday Service</span>
              <span className="font-bold text-white">8:00 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-purple-200">Wednesday Service</span>
              <span className="font-bold text-white">9:00 AM</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-heading font-bold text-white mb-3">📍 Church Location</h3>
          <p className="text-sm text-brand-purple-200 leading-relaxed">
            1, Arifanla Bus Stop, Akute, Ogun State, Nigeria
          </p>
          <p className="text-sm text-brand-purple-200 font-semibold mt-2">
            📱 +234 802 262 0704
          </p>
        </div>
      </div>

      {/* Member Info */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h3 className="font-heading font-bold text-white mb-3">📋 My Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-brand-purple-300 text-xs uppercase tracking-widest font-semibold">Full Name</p>
            <p className="text-white font-bold">{member.full_name}</p>
          </div>
          <div>
            <p className="text-brand-purple-300 text-xs uppercase tracking-widest font-semibold">Member ID</p>
            <p className="text-brand-gold-400 font-black">{member.member_id}</p>
          </div>
          <div>
            <p className="text-brand-purple-300 text-xs uppercase tracking-widest font-semibold">Email</p>
            <p className="text-white font-bold">{member.email}</p>
          </div>
          <div>
            <p className="text-brand-purple-300 text-xs uppercase tracking-widest font-semibold">Phone</p>
            <p className="text-white font-bold">{member.phone}</p>
          </div>
          <div>
            <p className="text-brand-purple-300 text-xs uppercase tracking-widest font-semibold">Department</p>
            <p className="text-white font-bold">{member.department || "Not assigned"}</p>
          </div>
          {member.date_joined && (
            <div>
              <p className="text-brand-purple-300 text-xs uppercase tracking-widest font-semibold">Joined</p>
              <p className="text-white font-bold">{formatDate(member.date_joined)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}