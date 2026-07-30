// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER GIVING HISTORY CLIENT — View all personal donations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Donation {
  id: string;
  amount: number;
  category: string;
  payment_method: string;
  payment_reference: string | null;
  payment_status: string;
  notes: string | null;
  donation_date: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  tithe: "💰 Tithe",
  offering: "🙏 Offering",
  seed_faith: "🌱 Seed Faith",
  building_fund: "🏛️ Building Fund",
  missions: "🌍 Missions",
  welfare: "💝 Welfare",
  special_project: "⭐ Special Project",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  pending_verification: "bg-blue-100 text-blue-700 border-blue-300",
  verified: "bg-green-100 text-green-700 border-green-300",
  rejected: "bg-red-100 text-red-700 border-red-300",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function MemberGivingHistoryClient() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      const supabase = createClient();

      const { data } = await supabase
        .from("tfam_donations")
        .select("*")
        .eq("member_id", sessionData.id)
        .order("donation_date", { ascending: false });

      setDonations(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter((d) =>
    filter === "all" ? true : d.category === filter
  );

  const totalGiving = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalTithe = donations.filter((d) => d.category === "tithe").reduce((sum, d) => sum + d.amount, 0);
  const totalOffering = donations.filter((d) => d.category === "offering").reduce((sum, d) => sum + d.amount, 0);

  const uniqueCategories = Array.from(new Set(donations.map((d) => d.category)));

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading giving history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          📊 My Giving History
        </h1>
        <p className="text-gray-600 text-sm">
          Track all your tithes, offerings, and donations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
          <div className="bg-brand-purple-50 border-b-2 border-brand-purple-100 p-4">
            <p className="text-xs text-brand-purple-600 uppercase tracking-widest font-semibold">Total Giving</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-bold text-brand-purple-900">{formatAmount(totalGiving)}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
          <div className="bg-brand-gold-50 border-b-2 border-brand-gold-100 p-4">
            <p className="text-xs text-brand-gold-600 uppercase tracking-widest font-semibold">Total Tithe</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-bold text-brand-purple-900">{formatAmount(totalTithe)}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
          <div className="bg-green-50 border-b-2 border-green-100 p-4">
            <p className="text-xs text-green-600 uppercase tracking-widest font-semibold">Total Offering</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-bold text-brand-purple-900">{formatAmount(totalOffering)}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      {uniqueCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === "all"
                ? "bg-brand-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            All ({donations.length})
          </button>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat
                  ? "bg-brand-purple-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* Give CTA */}
      <div className="flex justify-center">
        <Link
          href="/member/give"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
        >
          💰 Record New Giving
        </Link>
      </div>

      {/* Donations List */}
      {filteredDonations.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple-100 mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No giving records yet
          </h3>
          <p className="text-gray-500 mb-4">
            Your giving history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDonations.map((donation) => {
            const statusColor = STATUS_COLORS[donation.payment_status] || STATUS_COLORS.pending;

            return (
              <div
                key={donation.id}
                className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-purple-100 text-brand-purple-700 text-xs font-bold">
                        {CATEGORY_LABELS[donation.category] || donation.category}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${statusColor}`}>
                        {donation.payment_status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      📅 {formatDate(donation.donation_date)}
                      {donation.payment_reference && ` • Ref: ${donation.payment_reference}`}
                    </p>

                    {donation.notes && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{donation.notes}</p>
                    )}
                  </div>

                  <p className="text-2xl font-bold text-brand-purple-900 flex-shrink-0">
                    {formatAmount(donation.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}