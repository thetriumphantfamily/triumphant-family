// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN MEMBERS CLIENT — Approve/reject/manage members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
      const { data } = await supabase.from("tfam_members").select("*").order("created_at", { ascending: false });
      setMembers(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const updateStatus = async (id: string, newStatus: "approved" | "rejected" | "pending") => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_members").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) { toast.error("Failed"); setBusyId(null); return; }
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, status: newStatus } : m));
      if (selectedMember?.id === id) setSelectedMember({ ...selectedMember, status: newStatus });
      toast.success(newStatus === "approved" ? "✅ Member approved!" : newStatus === "rejected" ? "❌ Rejected" : "⏳ Reset");
    } catch (err) { toast.error("Failed"); }
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
    } catch (err) { toast.error("Failed"); }
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

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading members...</p></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">👥 Manage Members</h1>
        <p className="text-gray-600 text-sm">Approve registrations, view profiles, manage member records</p>
      </div>

      {/* Stats — Brand themed cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "border-brand-purple-200" },
          { label: "Pending", value: stats.pending, color: "border-yellow-200", badge: stats.pending > 0 },
          { label: "Approved", value: stats.approved, color: "border-green-200" },
          { label: "Rejected", value: stats.rejected, color: "border-red-200" },
        ].map((stat) => (
          <div key={stat.label} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${stat.color} p-5 shadow-xl`}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            {stat.badge && (
              <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-white text-[9px] font-bold">NEW</span>
              </div>
            )}
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{stat.label}</p>
            <p className="text-4xl font-heading font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input type="text" placeholder="Search by name, email, ID, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white" />
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as FilterType[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all capitalize ${filter === f ? "bg-brand-purple-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"}`}>
            {f === "all" ? "All" : f} ({f === "all" ? stats.total : stats[f]})
          </button>
        ))}
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">{searchQuery ? "No members match" : "No members yet"}</h3>
          <p className="text-gray-500">{searchQuery ? "Try a different search" : "Members will appear here once they register"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const isBusy = busyId === member.id;
            const statusColor = member.status === "approved" ? "bg-green-100 text-green-700 border-green-300" : member.status === "rejected" ? "bg-red-100 text-red-700 border-red-300" : "bg-yellow-100 text-yellow-700 border-yellow-300";

            return (
              <div key={member.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-5 shadow-xl hover:shadow-2xl transition-all cursor-pointer" onClick={() => setSelectedMember(member)}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-start gap-3 mb-3">
                  {member.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo_url} alt={member.full_name} className="w-14 h-14 rounded-xl object-cover border-2 border-brand-gold-400 flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-xl flex-shrink-0">{member.full_name.charAt(0)}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{member.full_name}</p>
                    <p className="text-xs text-brand-gold-400">{member.member_id}</p>
                    <p className="text-xs text-brand-purple-200">{member.department || "No dept"}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusColor}`}>{member.status}</span>
                </div>

                <div className="text-xs text-brand-purple-200 space-y-1 mb-3">
                  <p className="truncate">📧 {member.email}</p>
                  <p>📱 {member.phone}</p>
                  <p>📅 Joined {formatDate(member.created_at)}</p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30">
                  {member.status === "pending" && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(member.id, "approved"); }} disabled={isBusy} className="flex-1 px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all disabled:opacity-50">✅ Approve</button>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(member.id, "rejected"); }} disabled={isBusy} className="flex-1 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all disabled:opacity-50">❌ Reject</button>
                    </>
                  )}
                  {member.status === "approved" && (
                    <button onClick={(e) => { e.stopPropagation(); updateStatus(member.id, "rejected"); }} disabled={isBusy} className="flex-1 px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold transition-all disabled:opacity-50">🚫 Deactivate</button>
                  )}
                  {member.status === "rejected" && (
                    <button onClick={(e) => { e.stopPropagation(); updateStatus(member.id, "approved"); }} disabled={isBusy} className="flex-1 px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all disabled:opacity-50">✅ Re-approve</button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); setSelectedMember(member); }} className="px-3 py-1.5 rounded-full bg-brand-gold-400/20 text-brand-gold-300 text-xs font-bold transition-all">👁️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ MEMBER DETAIL MODAL ━━━ */}
      {selectedMember && (
        <>
          <div onClick={() => setSelectedMember(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {selectedMember.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedMember.photo_url} alt={selectedMember.full_name} className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-gold-400" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-2xl">{selectedMember.full_name.charAt(0)}</div>
                    )}
                    <div>
                      <h2 className="font-heading text-xl font-bold text-brand-purple-900">{selectedMember.full_name}</h2>
                      <p className="text-sm text-brand-gold-600 font-semibold">{selectedMember.member_id}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedMember(null)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${selectedMember.status === "approved" ? "bg-green-100 text-green-700 border-green-300" : selectedMember.status === "rejected" ? "bg-red-100 text-red-700 border-red-300" : "bg-yellow-100 text-yellow-700 border-yellow-300"}`}>{selectedMember.status}</span>
                </div>

                {/* Info Sections */}
                {[
                  { title: "👤 Personal", icon: "👤", fields: [
                    { label: "Email", value: selectedMember.email },
                    { label: "Phone", value: selectedMember.phone },
                    { label: "Gender", value: selectedMember.gender },
                    { label: "Date of Birth", value: selectedMember.date_of_birth ? formatDate(selectedMember.date_of_birth) : null },
                    { label: "Marital Status", value: selectedMember.marital_status },
                  ]},
                  { title: "📍 Location", icon: "📍", fields: [
                    { label: "Address", value: selectedMember.address },
                    { label: "City", value: selectedMember.city },
                    { label: "State", value: selectedMember.state },
                  ]},
                  { title: "⛪ Church", icon: "⛪", fields: [
                    { label: "Department", value: selectedMember.department },
                    { label: "Baptism", value: selectedMember.baptism_status?.replace(/_/g, " ") },
                    { label: "Date Joined", value: selectedMember.date_joined ? formatDate(selectedMember.date_joined) : null },
                  ]},
                ].map((section) => (
                  <div key={section.title} className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">{section.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {section.fields.map((field) => (
                        <div key={field.label}>
                          <p className="text-gray-500 text-xs">{field.label}</p>
                          <p className="font-semibold text-gray-800 capitalize">{field.value || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <p className="text-xs text-gray-500 text-center">Registered on {formatDate(selectedMember.created_at)}</p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-100">
                  {selectedMember.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(selectedMember.id, "approved")} disabled={busyId === selectedMember.id} className="flex-1 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-all disabled:opacity-50">✅ Approve</button>
                      <button onClick={() => updateStatus(selectedMember.id, "rejected")} disabled={busyId === selectedMember.id} className="flex-1 px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-all disabled:opacity-50">❌ Reject</button>
                    </>
                  )}
                  {selectedMember.status === "approved" && (
                    <button onClick={() => updateStatus(selectedMember.id, "rejected")} disabled={busyId === selectedMember.id} className="flex-1 px-6 py-3 rounded-full bg-red-100 hover:bg-red-200 text-red-700 font-bold transition-all disabled:opacity-50">🚫 Deactivate</button>
                  )}
                  {selectedMember.status === "rejected" && (
                    <button onClick={() => updateStatus(selectedMember.id, "approved")} disabled={busyId === selectedMember.id} className="flex-1 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-all disabled:opacity-50">✅ Re-approve</button>
                  )}
                  <button onClick={() => deleteMember(selectedMember.id, selectedMember.full_name)} disabled={busyId === selectedMember.id} className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all disabled:opacity-50">🗑️ Delete</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}