import { createClient } from "@/lib/supabase/server";
import {
  Video,
  Calendar,
  MessageSquare,
  HandHeart,
  Mail,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

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
    supabase
      .from("prayer_requests")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true }),
    supabase.from("leadership").select("id", { count: "exact", head: true }),
    supabase
      .from("testimonies")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false),
    supabase
      .from("prayer_requests")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
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

export default async function AdminDashboard() {
  const stats = await getStats();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const STAT_CARDS = [
    {
      name: "Sermons",
      value: stats.sermons,
      href: "/admin/sermons",
      icon: Video,
      color: "from-red-500 to-red-700",
    },
    {
      name: "Events",
      value: stats.events,
      href: "/admin/events",
      icon: Calendar,
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Testimonies",
      value: stats.testimonies,
      href: "/admin/testimonies",
      icon: MessageSquare,
      color: "from-green-500 to-green-700",
      badge: stats.pendingTestimonies,
    },
    {
      name: "Prayer Requests",
      value: stats.prayers,
      href: "/admin/prayers",
      icon: HandHeart,
      color: "from-brand-purple-500 to-brand-purple-700",
      badge: stats.pendingPrayers,
    },
    {
      name: "Messages",
      value: stats.messages,
      href: "/admin/messages",
      icon: Mail,
      color: "from-brand-gold-400 to-brand-gold-600",
      badge: stats.unreadMessages,
    },
    {
      name: "Leadership",
      value: stats.leadership,
      href: "/admin/leadership",
      icon: Users,
      color: "from-brand-magenta-500 to-purple-600",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-500">
          Logged in as{" "}
          <span className="font-bold text-brand-purple-600">
            {user?.email}
          </span>
        </p>
      </div>

      {/* Pending Actions Alert */}
      {(stats.pendingTestimonies > 0 ||
        stats.pendingPrayers > 0 ||
        stats.unreadMessages > 0) && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-brand-gold-50 to-orange-50 border-2 border-brand-gold-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-brand-purple-900" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">
                You have items pending review
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.pendingTestimonies > 0 && (
                  <Link
                    href="/admin/testimonies"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium border border-gray-200 transition-colors"
                  >
                    {stats.pendingTestimonies} testimony(ies) to approve →
                  </Link>
                )}
                {stats.pendingPrayers > 0 && (
                  <Link
                    href="/admin/prayers"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium border border-gray-200 transition-colors"
                  >
                    {stats.pendingPrayers} prayer(s) to review →
                  </Link>
                )}
                {stats.unreadMessages > 0 && (
                  <Link
                    href="/admin/messages"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium border border-gray-200 transition-colors"
                  >
                    {stats.unreadMessages} unread message(s) →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-purple-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}
              >
                <card.icon className="w-7 h-7 text-white" />
              </div>
              {card.badge && card.badge > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold">
                  {card.badge}
                </span>
              ) : null}
            </div>

            <p className="text-gray-500 text-sm mb-1">{card.name}</p>
            <p className="text-3xl font-heading font-bold text-gray-900 group-hover:text-brand-purple-600 transition-colors">
              {card.value}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-brand-purple-600 text-sm font-medium">
              <span>View all</span>
              <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-heading font-bold text-gray-900 text-xl mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/admin/sermons"
            className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-purple-400 hover:bg-brand-purple-50 text-center transition-all group"
          >
            <Video className="w-8 h-8 mx-auto mb-2 text-brand-purple-500 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-700">Add Sermon</p>
          </Link>
          <Link
            href="/admin/events"
            className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-purple-400 hover:bg-brand-purple-50 text-center transition-all group"
          >
            <Calendar className="w-8 h-8 mx-auto mb-2 text-brand-purple-500 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-700">Add Event</p>
          </Link>
          <Link
            href="/admin/leadership"
            className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-purple-400 hover:bg-brand-purple-50 text-center transition-all group"
          >
            <Users className="w-8 h-8 mx-auto mb-2 text-brand-purple-500 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-700">Add Leader</p>
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-purple-400 hover:bg-brand-purple-50 text-center transition-all group"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-brand-purple-500 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-700">Go Live</p>
          </Link>
        </div>
      </div>
    </div>
  );
}