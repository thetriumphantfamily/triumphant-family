// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN MEMBERS CLIENT – Approve/reject/manage + notify members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyMember } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Member {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string | null;
  date_of_birth: string | null;
  marital_status: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  photo_url: string | null;
  department: string | null;
  baptism_status: string | null;
  date_joined: string | null;
  status: string;
  created_at: string;
}

type FilterType = "all" | "pending" | "approved" | "rejected";

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function ChurchAdminMembersClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_members")
        .select("*")
        .order("created_at", { ascending: false });
      setMembers(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const updateStatus = async (id: string, newStatus: "approved" | "rejected" | "pending") => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tfam_members")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) { toast.error("Failed"); setBusyId(null); return; }

      const member = members.find((m) => m.id === id);
      if (member) {
        if (newStatus === "approved") {
          await notifyMember({
            memberId: id,
            title: "🎉 Welcome to The Triumphant Family!",
            message: `Congratulations! Your membership has been approved. You can now login and access all member features. God bless you!`,
            type: "member_registration",
            link: "/member/dashboard",
          });
        } else if (newStatus === "rejected") {
          await notifyMember({
            memberId: id,
            title: "⚠️ Membership Status Update",
            message: `Your membership registration requires attention. Please contact the church for more information.`,
            type: "member_registration",
            link: "/member/profile",
          });
        }
      }

      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, status: newStatus } : m));
      if (selectedMember?.id === id) setSelectedMember({ ...selectedMember, status: newStatus });

      toast.success(
        newStatus === "approved" ? "✅ Member approved and notified!"
          : newStatus === "rejected" ? "❌ Member status updated"
          : "⏳ Status reset"
      );
    } catch { toast.error("Failed"); }
    finally { setBusyId(null); }
  };

  const deleteMember = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name}?`)) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      await supabase.from("tfam_members").delete().eq("id", id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setSelectedMember(null);
      toast.success("🗑️ Deleted");
    } catch { toast.error("Failed"); }
    finally { setBusyId(null); }
  };

  const filteredMembers = members.filter((m) => {
    const matchesFilter = filter === "all" || m.status === filter;
    const matchesSearch = !searchQuery ||
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.member_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: members.length,
    pending: members.filter((m) => m.status === "pending").length,
    approved: members.filter((m) => m.status === "approved").length,
    rejected: members.filter((m) => m.status === "rejected").length,
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading members..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Members</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            👥 Manage Members
          </h1>
          <p className="text-brand-purple-200 text-sm">
            Approve registrations, view profiles, manage member records.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "border-brand-gold-400/40" },
          { label: "Pending", value: stats.pending, color: "border-brand-gold-400/60", badge: stats.pending > 0 },
          { label: "Approved", value: stats.approved, color: "border-green-400/40" },
          { label: "Rejected", value: stats.rejected, color: "border-red-400/40" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${stat.color} p-4 shadow-xl`}
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            {stat.badge && (
              <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-white text-[9px] font-bold">NEW</span>
              </div>
            )}
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">
              {stat.label}
            </p>
            <p className="text-3xl md:text-4xl font-heading font-bold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email, ID, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all capitalize ${
              filter === f
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-brand-purple-950/60 text-white/80 border border-brand-gold-400/40"
            }`}
          >
            {f === "all" ? "All" : f} ({f === "all" ? stats.total : stats[f as keyof typeof stats]})
          </button>
        ))}
      </div>

      {/* ── Members Grid ── */}
      {filteredMembers.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-4xl mb-4">👥</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {searchQuery ? "No members match" : "No members yet"}
          </h3>
          <p className="text-brand-purple-200 text-sm">
            {searchQuery ? "Try a different search" : "Members will appear here once they register"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const isBusy = busyId === member.id;
            return (
              <div
                key={member.id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-5 shadow-xl transition-all cursor-pointer active:scale-95"
                onClick={() => setSelectedMember(member)}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-start gap-3 mb-3">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.full_name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-brand-gold-400/40 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-purple-950/80 border-2 border-brand-gold-400/40 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate text-sm">{member.full_name}</p>
                    <p className="text-xs text-white/60">{member.member_id}</p>
                    <p className="text-xs text-brand-purple-200">{member.department || "No dept"}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black capitalize flex-shrink-0 ${
                    member.status === "approved"
                      ? "bg-green-500/20 text-green-300 border border-green-400/40"
                      : member.status === "rejected"
                      ? "bg-red-500/20 text-red-300 border border-red-400/40"
                      : "bg-brand-purple-950/60 text-white/80 border border-brand-gold-400/40"
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="text-xs text-brand-purple-200 space-y-0.5 mb-3">
                  <p className="truncate">📧 {member.email}</p>
                  <p>📱 {member.phone}</p>
                  <p>📅 Joined {formatDate(member.created_at)}</p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30">
                  {member.status === "pending" && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(member.id, "approved"); }}
                        disabled={isBusy}
                        className="flex-1 py-2 rounded-xl bg-green-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(member.id, "rejected"); }}
                        disabled={isBusy}
                        className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {member.status === "approved" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus(member.id, "rejected"); }}
                      disabled={isBusy}
                      className="flex-1 py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30 disabled:opacity-50"
                    >
                      🚫 Deactivate
                    </button>
                  )}
                  {member.status === "rejected" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus(member.id, "approved"); }}
                      disabled={isBusy}
                      className="flex-1 py-2 rounded-xl bg-green-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all"
                    >
                      ✅ Re-approve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MEMBER DETAIL MODAL — KEEP bg-white — slides up mobile ── */}
      {selectedMember && (
        <>
          <div
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {selectedMember.photo_url ? (
                      <img
                        src={selectedMember.photo_url}
                        alt={selectedMember.full_name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-brand-purple-100 flex items-center justify-center text-brand-purple-900 font-bold text-2xl">
                        {selectedMember.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                        {selectedMember.full_name}
                      </h2>
                      <p className="text-sm text-brand-purple-600 font-semibold">
                        {selectedMember.member_id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black capitalize ${
                    selectedMember.status === "approved"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : selectedMember.status === "rejected"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}>
                    {selectedMember.status}
                  </span>
                </div>

                {/* Info Sections */}
                {[
                  {
                    title: "👤 Personal",
                    fields: [
                      { label: "Email", value: selectedMember.email },
                      { label: "Phone", value: selectedMember.phone },
                      { label: "Gender", value: selectedMember.gender },
                      { label: "Date of Birth", value: selectedMember.date_of_birth ? formatDate(selectedMember.date_of_birth) : null },
                      { label: "Marital Status", value: selectedMember.marital_status },
                    ],
                  },
                  {
                    title: "📍 Location",
                    fields: [
                      { label: "Address", value: selectedMember.address },
                      { label: "City", value: selectedMember.city },
                      { label: "State", value: selectedMember.state },
                    ],
                  },
                  {
                    title: "⛪ Church",
                    fields: [
                      { label: "Department", value: selectedMember.department },
                      { label: "Baptism", value: selectedMember.baptism_status?.replace(/_/g, " ") },
                      { label: "Date Joined", value: selectedMember.date_joined ? formatDate(selectedMember.date_joined) : null },
                    ],
                  },
                ].map((section) => (
                  <div key={section.title} className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="font-bold text-brand-purple-900 mb-3 text-xs uppercase tracking-widest">
                      {section.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {section.fields.map((field) => (
                        <div key={field.label}>
                          <p className="text-gray-500 text-xs">{field.label}</p>
                          <p className="font-semibold text-gray-800 capitalize">
                            {field.value || "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <p className="text-xs text-gray-500 text-center">
                  Registered on {formatDate(selectedMember.created_at)}
                </p>

                {/* Action Buttons — full width stacked mobile */}
                <div className="flex flex-col gap-3 pt-4 border-t-2 border-gray-100">
                  {selectedMember.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(selectedMember.id, "approved")}
                        disabled={busyId === selectedMember.id}
                        className="w-full py-4 rounded-xl bg-green-600 text-white font-black disabled:opacity-50 active:scale-95 transition-all"
                      >
                        ✅ Approve Member
                      </button>
                      <button
                        onClick={() => updateStatus(selectedMember.id, "rejected")}
                        disabled={busyId === selectedMember.id}
                        className="w-full py-4 rounded-xl bg-red-500 text-white font-black disabled:opacity-50 active:scale-95 transition-all"
                      >
                        ❌ Reject Member
                      </button>
                    </>
                  )}
                  {selectedMember.status === "approved" && (
                    <button
                      onClick={() => updateStatus(selectedMember.id, "rejected")}
                      disabled={busyId === selectedMember.id}
                      className="w-full py-4 rounded-xl bg-brand-purple-100 text-brand-purple-900 font-black disabled:opacity-50"
                    >
                      🚫 Deactivate Member
                    </button>
                  )}
                  {selectedMember.status === "rejected" && (
                    <button
                      onClick={() => updateStatus(selectedMember.id, "approved")}
                      disabled={busyId === selectedMember.id}
                      className="w-full py-4 rounded-xl bg-green-600 text-white font-black disabled:opacity-50 active:scale-95 transition-all"
                    >
                      ✅ Re-approve Member
                    </button>
                  )}
                  <button
                    onClick={() => deleteMember(selectedMember.id, selectedMember.full_name)}
                    disabled={busyId === selectedMember.id}
                    className="w-full py-4 rounded-xl bg-red-600 text-white font-black disabled:opacity-50 active:scale-95 transition-all"
                  >
                    🗑️ Permanently Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}