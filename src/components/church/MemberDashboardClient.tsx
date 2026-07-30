// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER DASHBOARD CLIENT — Church member portal overview
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Member {
  id: string;
  member_id: string;
  full_name: string;
  photo_url: string | null;
  department: string | null;
  gender: string | null;
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
  return "Beloved";
}

function getTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MemberDashboardClient() {
  const [member, setMember] = useState<Member | null>(null);
  const [todayDevotional, setTodayDevotional] = useState<{
    title: string;
    scripture: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      const supabase = createClient();

      const { data: memberData } = await supabase
        .from("tfam_members")
        .select("*")
        .eq("id", sessionData.id)
        .single();

      if (memberData) setMember(memberData);

      // Get today's devotional
      const today = new Date().toISOString().split("T")[0];
      const { data: devotionalData } = await supabase
        .from("tfam_devotionals")
        .select("title, scripture")
        .eq("publish_date", today)
        .eq("is_published", true)
        .single();

      if (devotionalData) setTodayDevotional(devotionalData);

      setLoading(false);
    } catch (err) {
      console.error("Dashboard error:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!member) return null;

  const greeting = getGreeting();
  const title = getTitle(member.gender);
  const todayDate = getTodayDate();

  return (
    <div className="space-y-6">
      {/* ━━━ WELCOME HEADER ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {member.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo_url} alt={member.full_name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-brand-gold-400 shadow-gold flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-3xl flex-shrink-0">
              {member.full_name.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <p className="text-brand-gold-400 font-semibold text-sm mb-1">
              {greeting}, {title}!
            </p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
              {member.full_name}
            </h1>
            <p className="text-brand-purple-100 text-sm mb-2">📅 {todayDate}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 font-semibold text-xs">
                {member.member_id}
              </span>
              {member.department && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-purple-500/40 text-brand-purple-100 font-semibold text-xs">
                  ⛪ {member.department}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scripture */}
        <div className="mt-6 pt-6 border-t border-brand-gold-400/30">
          <p className="text-brand-gold-400 italic text-sm">
            &ldquo;Behold, how good and how pleasant it is for brethren to dwell together in unity!&rdquo;
          </p>
          <p className="text-brand-purple-200 text-xs mt-1 font-semibold">— Psalm 133:1</p>
        </div>
      </div>

      {/* ━━━ TODAY'S DEVOTIONAL ━━━ */}
      {todayDevotional && (
        <Link
          href="/member/devotional"
          className="block bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5 lg:p-6 hover:border-brand-gold-400 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📖</span>
            </div>
            <div>
              <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-1">
                Today&rsquo;s Devotional
              </p>
              <p className="font-heading font-bold text-brand-purple-900 text-base mb-1">
                {todayDevotional.title}
              </p>
              <p className="text-brand-purple-700 text-sm italic">
                {todayDevotional.scripture}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* ━━━ QUICK ACCESS ━━━ */}
      <div>
        <h2 className="font-heading text-xl font-bold text-brand-purple-900 mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { href: "/member/give", icon: "💰", label: "Give" },
            { href: "/member/prayer-requests", icon: "🙏", label: "Prayer" },
            { href: "/member/devotional", icon: "📖", label: "Devotional" },
            { href: "/member/bible", icon: "📕", label: "Bible" },
            { href: "/member/sermons", icon: "🎬", label: "Sermons" },
            { href: "/member/live", icon: "📺", label: "Watch Live" },
            { href: "/member/events", icon: "📅", label: "Events" },
            { href: "/member/id-card", icon: "🎴", label: "ID Card" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-brand-gold-400 hover:-translate-y-0.5 transition-all text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <p className="text-xs font-bold text-brand-purple-900">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ━━━ INFO CARDS ━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md">
          <h3 className="font-heading font-bold text-brand-purple-900 mb-3">
            ⛪ Service Times
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sunday Service</span>
              <span className="font-bold text-brand-purple-900">8:00 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Wednesday Service</span>
              <span className="font-bold text-brand-purple-900">9:00 AM</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md">
          <h3 className="font-heading font-bold text-brand-purple-900 mb-3">
            📍 Church Location
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            1, Arifanla Bus Stop, Akute, Ogun State, Nigeria
          </p>
          <p className="text-sm text-brand-purple-600 font-semibold mt-2">
            📱 +234 802 262 0704
          </p>
        </div>
      </div>
    </div>
  );
}