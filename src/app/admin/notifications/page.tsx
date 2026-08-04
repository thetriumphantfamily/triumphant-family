// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN NOTIFICATIONS PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import SiteNotificationsClient from "@/components/admin/SiteNotificationsClient";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: notifications } = await supabase
    .from("site_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const allNotifications = notifications || [];
  const unreadCount = allNotifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">

          {/* ━━━ HEADER CARD ━━━ */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl mb-6">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="relative z-10">

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/admin" className="text-brand-purple-200 hover:text-white font-semibold transition-colors">
                  Dashboard
                </Link>
                <svg className="w-4 h-4 text-brand-purple-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-brand-gold-400 font-semibold">Notifications</span>
              </div>

              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
                    <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                    <span className="text-white font-semibold text-xs uppercase tracking-widest">
                      Website Activity
                    </span>
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                    Notifications 🔔
                  </h1>
                  <p className="text-brand-purple-200 font-semibold">
                    All activity from the main website in real time
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-brand-purple-950/60 border border-brand-gold-400/40">
                    <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold">Total</p>
                    <p className="text-2xl font-heading font-black text-white">{allNotifications.length}</p>
                  </div>
                  {unreadCount > 0 && (
                    <div className="px-4 py-2 rounded-2xl bg-brand-purple-950/60 border border-red-400/40">
                      <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold">Unread</p>
                      <p className="text-2xl font-heading font-black text-white">{unreadCount}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SiteNotificationsClient initialNotifications={allNotifications} />
        </div>
      </div>
    </div>
  );
}