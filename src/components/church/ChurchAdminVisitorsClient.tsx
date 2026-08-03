// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN VISITORS CLIENT – Track first timers and follow-up
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Visitor {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  how_did_you_hear: string | null;
  visit_date: string;
  assigned_to: string | null;
  follow_up_status: string;
  follow_up_notes: string | null;
  converted_to_member: boolean;
  created_at: string;
}

const FOLLOW_UP_STATUSES = [
  { value: "new", label: "🆕 New", color: "bg-blue-500/20 text-blue-300 border-blue-400/40" },
  { value: "contacted", label: "📞 Contacted", color: "bg-brand-purple-950/60 text-white/80 border-brand-gold-400/40" },
  { value: "visited", label: "🏠 Visited", color: "bg-blue-500/20 text-blue-300 border-blue-400/40" },
  { value: "joined", label: "✅ Joined Church", color: "bg-green-500/20 text-green-300 border-green-400/40" },
  { value: "lost", label: "❌ Lost Interest", color: "bg-red-500/20 text-red-300 border-red-400/40" },
];

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function ChurchAdminVisitorsClient() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "", phone: "", email: "", address: "",
    how_did_you_hear: "", assigned_to: "",
    visit_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => { loadVisitors(); }, []);

  const loadVisitors = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_visitors")
        .select("*")
        .order("created_at", { ascending: false });
      setVisitors(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const resetForm = () => {
    setFormData({
      full_name: "", phone: "", email: "", address: "",
      how_did_you_hear: "", assigned_to: "",
      visit_date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) { toast.error("Name required"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_visitors").insert({
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        how_did_you_hear: formData.how_did_you_hear.trim() || null,
        assigned_to: formData.assigned_to.trim() || null,
        visit_date: formData.visit_date,
      });
      if (error) { toast.error(error.message); setIsSubmitting(false); return; }
      toast.success("🆕 Visitor added!");
      resetForm();
      loadVisitors();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const updateFollowUp = async (id: string, newStatus: string) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      await supabase.from("tfam_visitors").update({
        follow_up_status: newStatus,
        converted_to_member: newStatus === "joined",
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, follow_up_status: newStatus, converted_to_member: newStatus === "joined" }
            : v
        )
      );
      toast.success("Updated!");
    } catch { toast.error("Failed"); }
    finally { setBusyId(null); }
  };

  const deleteVisitor = async (id: string) => {
    if (!confirm("Delete this visitor?")) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      await supabase.from("tfam_visitors").delete().eq("id", id);
      setVisitors((prev) => prev.filter((v) => v.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
    finally { setBusyId(null); }
  };

  const stats = {
    total: visitors.length,
    new: visitors.filter((v) => v.follow_up_status === "new").length,
    contacted: visitors.filter((v) => v.follow_up_status === "contacted").length,
    joined: visitors.filter((v) => v.follow_up_status === "joined").length,
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading visitors..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Visitors</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            🆕 First-Time Visitors
          </h1>
          <p className="text-brand-purple-200 text-sm mb-4">
            Track visitors and follow-up progress.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Add Visitor
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total },
          { label: "New", value: stats.new },
          { label: "Contacted", value: stats.contacted },
          { label: "Joined", value: stats.joined },
        ].map((s) => (
          <div
            key={s.label}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">
              {s.label}
            </p>
            <p className="text-3xl md:text-4xl font-heading font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Visitors List ── */}
      {visitors.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-4xl mb-4">🆕</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No visitors recorded yet</h3>
          <p className="text-brand-purple-200 text-sm">Click &ldquo;Add Visitor&rdquo; after each service</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visitors.map((visitor) => {
            const isBusy = busyId === visitor.id;
            const statusInfo = FOLLOW_UP_STATUSES.find((s) => s.value === visitor.follow_up_status) || FOLLOW_UP_STATUSES[0];
            return (
              <div
                key={visitor.id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl"
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="font-black text-white text-lg">{visitor.full_name}</p>
                  <div className="text-xs text-brand-purple-200 space-y-0.5 mt-1">
                    {visitor.phone && <p>📱 {visitor.phone}</p>}
                    {visitor.email && <p>📧 {visitor.email}</p>}
                    <p>📅 Visited: {formatDate(visitor.visit_date)}</p>
                    {visitor.how_did_you_hear && <p>📊 Heard via: {visitor.how_did_you_hear}</p>}
                    {visitor.assigned_to && <p>👤 Assigned to: {visitor.assigned_to}</p>}
                  </div>
                </div>

                {/* Actions — full width on mobile */}
                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                  <select
                    value={visitor.follow_up_status}
                    onChange={(e) => updateFollowUp(visitor.id, e.target.value)}
                    disabled={isBusy}
                    className="w-full px-3 py-3 rounded-xl bg-brand-purple-950/60 border border-brand-gold-400/40 text-white text-sm font-bold focus:outline-none disabled:opacity-50"
                  >
                    {FOLLOW_UP_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteVisitor(visitor.id)}
                    disabled={isBusy}
                    className="w-full py-3 rounded-xl bg-red-500/20 text-red-300 text-sm font-bold border border-red-400/40 disabled:opacity-50 active:scale-95 transition-all"
                  >
                    🗑️ Delete Visitor
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add Visitor Modal — KEEP bg-white — slides up mobile ── */}
      {showForm && (
        <>
          <div
            onClick={resetForm}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    🆕 Add Visitor
                  </h2>
                  <button
                    onClick={resetForm}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Visit Date</label>
                  <input
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    How Did They Hear About Us?
                  </label>
                  <input
                    type="text"
                    value={formData.how_did_you_hear}
                    onChange={(e) => setFormData({ ...formData, how_did_you_hear: e.target.value })}
                    placeholder="Friend, Social Media, Flyer..."
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Assigned To (Follow-up)
                  </label>
                  <input
                    type="text"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    placeholder="Name of assigned worker"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "🆕 Add Visitor"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}