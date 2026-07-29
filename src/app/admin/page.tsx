// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN DASHBOARD — Clean beautiful themed hero + stats + quick actions
// NO BLOBS, NO SPLASHES — Pure gradient + gold accents only
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";

async function getStats() {
  const supabase = await createClient();

  const [
    sermonsResult,
    eventsResult,
    testimoniesResult,
    prayersResult,
    messagesResult,
    leadershipResult,
    pendingTestimoniesResult,
    pendingPrayersResult,
    unreadMessagesResult,
  ] = await Promise.all([
    supabase.from("sermons").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("testimonies").select("id", { count: "exact", head: true }),
    supabase.from("prayer_requests").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("leadership").select("id", { count: "exact", head: true }),
    supabase.from("testimonies").select("id", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("prayer_requests").select("id", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);

  return {
    sermons: sermonsResult.count || 0,
    events: eventsResult.count || 0,
    testimonies: testimoniesResult.count || 0,
    prayers: prayersResult.count || 0,
    messages: messagesResult.count || 0,
    leadership: leadershipResult.count || 0,
    pendingTestimonies: pendingTestimoniesResult.count || 0,
    pendingPrayers: pendingPrayersResult.count || 0,
    unreadMessages: unreadMessagesResult.count || 0,
  };
}

// ━━━ Get time-based greeting ━━━
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// ━━━ Get today's date nicely ━━━
function getTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AdminDashboard() {
  // ━━━ AUTH PROTECTION ━━━
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const stats = await getStats();
  const greeting = getGreeting();
  const todayDate = getTodayDate();

  const STAT_CARDS = [
    {
      name: "Sermons",
      value: stats.sermons,
      href: "/admin/sermons",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      name: "Events",
      value: stats.events,
      href: "/admin/events",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
        </svg>
      ),
    },
    {
      name: "Testimonies",
      value: stats.testimonies,
      href: "/admin/testimonies",
      badge: stats.pendingTestimonies,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      name: "Prayer Requests",
      value: stats.prayers,
      href: "/admin/prayers",
      badge: stats.pendingPrayers,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      name: "Messages",
      value: stats.messages,
      href: "/admin/messages",
      badge: stats.unreadMessages,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      name: "Leadership",
      value: stats.leadership,
      href: "/admin/leadership",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">

          {/* ━━━ HERO HEADER — Clean, No Blobs ━━━ */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 lg:p-10 shadow-2xl mb-8">
            {/* Gold top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
                    <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                    <span className="text-brand-gold-300 font-semibold text-xs uppercase tracking-widest">
                      Ministry Command Center
                    </span>
                  </div>

                  {/* Greeting */}
                  <p className="text-brand-gold-400 font-semibold text-lg mb-1">
                    {greeting}, Prophet!
                  </p>

                  {/* Main Heading */}
                  <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                    Welcome to Your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                      Command Center
                    </span>
                  </h1>

                  {/* Date */}
                  <p className="text-brand-purple-100 text-sm md:text-base mb-4">
                    📅 {todayDate}
                  </p>

                  <p className="text-brand-purple-100 text-sm md:text-base max-w-2xl leading-relaxed">
                    Manage every aspect of The Triumphant Family Ministry from
                    one beautiful dashboard. Your Kingdom work continues here.
                  </p>
                </div>

                {/* Right Side Icon */}
                <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-brand-purple-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                </div>
              </div>

              {/* Scripture at bottom */}
              <div className="mt-6 pt-6 border-t border-brand-gold-400/30">
                <p className="text-brand-gold-400 italic text-sm md:text-base">
                  &ldquo;And I will give you shepherds according to mine heart,
                  which shall feed you with knowledge and understanding.&rdquo;
                </p>
                <p className="text-brand-purple-200 text-xs mt-1 font-semibold">
                  — Jeremiah 3:15
                </p>
              </div>
            </div>
          </div>

          {/* ━━━ PENDING ACTIONS ALERT — Clean ━━━ */}
          {(stats.pendingTestimonies > 0 ||
            stats.pendingPrayers > 0 ||
            stats.unreadMessages > 0) && (
            <div className="mb-8 relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-700 border-2 border-red-400/60 p-6 shadow-xl">
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 animate-pulse">
                  <svg
                    className="w-7 h-7 text-brand-purple-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-white text-xl mb-3">
                    🚨 Attention Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.pendingTestimonies > 0 && (
                      <Link
                        href="/admin/testimonies"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-bold transition-colors"
                      >
                        {stats.pendingTestimonies} testimony(ies) →
                      </Link>
                    )}
                    {stats.pendingPrayers > 0 && (
                      <Link
                        href="/admin/prayers"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-bold transition-colors"
                      >
                        {stats.pendingPrayers} prayer(s) →
                      </Link>
                    )}
                    {stats.unreadMessages > 0 && (
                      <Link
                        href="/admin/messages"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-bold transition-colors"
                      >
                        {stats.unreadMessages} unread message(s) →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ━━━ STATS SECTION HEADER ━━━ */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-brand-purple-900"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              </div>
              <h2 className="font-heading font-bold text-brand-purple-900 text-xl">
                Ministry Overview
              </h2>
            </div>
          </div>

          {/* ━━━ STATS GRID — Uniform purple + gold ━━━ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {STAT_CARDS.map((card) => (
              <Link
                key={card.name}
                href={card.href}
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gold top bar */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900">
                      <span className="w-7 h-7">{card.icon}</span>
                    </div>

                    {card.badge && card.badge > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 shadow-lg animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span className="text-white text-xs font-bold">
                          {card.badge} NEW
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <p className="text-brand-purple-200 text-sm uppercase tracking-widest font-semibold mb-2">
                    {card.name}
                  </p>

                  <p className="text-5xl font-heading font-bold text-white mb-4">
                    {card.value}
                  </p>

                  <div className="pt-4 border-t border-brand-gold-400/30 flex items-center gap-2 text-brand-gold-400 text-sm font-bold group-hover:gap-3 transition-all">
                    <span>Manage {card.name}</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ━━━ QUICK ACTIONS — Clean ━━━ */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-purple-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-white text-xl">
                  Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { href: "/admin/sermons", emoji: "🎬", label: "Add Sermon" },
                  { href: "/admin/events", emoji: "📅", label: "Add Event" },
                  { href: "/admin/leadership", emoji: "👥", label: "Add Leader" },
                  { href: "/admin/settings", emoji: "🔴", label: "Go Live" },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="p-4 rounded-xl bg-brand-purple-950/60 border-2 border-brand-gold-400/30 hover:border-brand-gold-400 text-center transition-all group"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                      {action.emoji}
                    </div>
                    <p className="text-sm font-bold text-white">{action.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Script tagline */}
          <p className="text-center mt-8 text-brand-purple-600 text-sm italic font-medium">
            &ldquo;Serving God&rsquo;s people with excellence and grace.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}