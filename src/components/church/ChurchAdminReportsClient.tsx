// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN REPORTS CLIENT – Analytics and reporting
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Stats {
  totalMembers: number;
  approvedMembers: number;
  pendingMembers: number;
  totalVisitors: number;
  totalDonations: number;
  totalDonationAmount: number;
  totalServices: number;
  totalAttendance: number;
  avgAttendance: number;
  totalDevotionals: number;
  totalPrayerRequests: number;
  answeredPrayers: number;
  totalTestimonies: number;
  totalQuestions: number;
  answeredQuestions: number;
  totalDepartments: number;
  totalPastoralNotes: number;
  totalAnnouncements: number;
}

function formatAmount(n: number) {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 0 });
}

export default function ChurchAdminReportsClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const supabase = createClient();

      const [
        members, approved, pending, visitors, donations, services,
        devotionals, prayers, answeredPrayers, testimonies,
        questions, answeredQ, departments, pastoral, announcements,
      ] = await Promise.all([
        supabase.from("tfam_members").select("id", { count: "exact", head: true }),
        supabase.from("tfam_members").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("tfam_members").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tfam_visitors").select("id", { count: "exact", head: true }),
        supabase.from("tfam_donations").select("amount"),
        supabase.from("tfam_services").select("total_attendance"),
        supabase.from("tfam_devotionals").select("id", { count: "exact", head: true }),
        supabase.from("tfam_member_prayers").select("id", { count: "exact", head: true }),
        supabase.from("tfam_member_prayers").select("id", { count: "exact", head: true }).eq("is_answered", true),
        supabase.from("tfam_member_testimonies").select("id", { count: "exact", head: true }),
        supabase.from("tfam_pastor_questions").select("id", { count: "exact", head: true }),
        supabase.from("tfam_pastor_questions").select("id", { count: "exact", head: true }).eq("status", "answered"),
        supabase.from("tfam_departments").select("id", { count: "exact", head: true }),
        supabase.from("tfam_pastoral_notes").select("id", { count: "exact", head: true }),
        supabase.from("tfam_member_announcements").select("id", { count: "exact", head: true }),
      ]);

      const donationData = donations.data || [];
      const totalDonationAmount = donationData.reduce(
        (sum: number, d: { amount: number }) => sum + Number(d.amount), 0
      );

      const serviceData = services.data || [];
      const totalAttendance = serviceData.reduce(
        (sum: number, s: { total_attendance: number }) => sum + s.total_attendance, 0
      );
      const avgAttendance = serviceData.length > 0
        ? Math.round(totalAttendance / serviceData.length)
        : 0;

      setStats({
        totalMembers: members.count || 0,
        approvedMembers: approved.count || 0,
        pendingMembers: pending.count || 0,
        totalVisitors: visitors.count || 0,
        totalDonations: donationData.length,
        totalDonationAmount,
        totalServices: serviceData.length,
        totalAttendance,
        avgAttendance,
        totalDevotionals: devotionals.count || 0,
        totalPrayerRequests: prayers.count || 0,
        answeredPrayers: answeredPrayers.count || 0,
        totalTestimonies: testimonies.count || 0,
        totalQuestions: questions.count || 0,
        answeredQuestions: answeredQ.count || 0,
        totalDepartments: departments.count || 0,
        totalPastoralNotes: pastoral.count || 0,
        totalAnnouncements: announcements.count || 0,
      });
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading reports..." />;
  if (!stats) return null;

  const REPORT_SECTIONS = [
    {
      title: "👥 Membership",
      items: [
        { label: "Total Members", value: stats.totalMembers },
        { label: "Approved", value: stats.approvedMembers },
        { label: "Pending", value: stats.pendingMembers },
        { label: "Visitors", value: stats.totalVisitors },
      ],
    },
    {
      title: "💰 Giving",
      items: [
        { label: "Total Records", value: stats.totalDonations },
        { label: "Total Amount", value: formatAmount(stats.totalDonationAmount) },
      ],
    },
    {
      title: "✅ Attendance",
      items: [
        { label: "Services Recorded", value: stats.totalServices },
        { label: "Total Attendance", value: stats.totalAttendance },
        { label: "Average / Service", value: stats.avgAttendance },
      ],
    },
    {
      title: "📖 Spiritual",
      items: [
        { label: "Devotionals", value: stats.totalDevotionals },
        { label: "Prayer Requests", value: stats.totalPrayerRequests },
        { label: "Answered Prayers", value: stats.answeredPrayers },
        { label: "Testimonies", value: stats.totalTestimonies },
      ],
    },
    {
      title: "⛪ Ministry",
      items: [
        { label: "Departments", value: stats.totalDepartments },
        { label: "Pastoral Notes", value: stats.totalPastoralNotes },
        { label: "Announcements", value: stats.totalAnnouncements },
        { label: "Pastor Q&A", value: `${stats.answeredQuestions}/${stats.totalQuestions}` },
      ],
    },
  ];

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Reports</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Church Analytics
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Complete overview of your church data.
          </p>
        </div>
      </div>

      {/* ── Report Sections ── */}
      {REPORT_SECTIONS.map((section) => (
        <div key={section.title}>
          <h2 className="text-white font-heading font-bold text-base mb-3">
            {section.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl"
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-white font-black text-2xl">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}