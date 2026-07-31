// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN GIVING CLIENT — Verify + notify members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyMember } from "@/lib/notifications";

interface Donation {
  id: string;
  member_id: string | null;
  member_name: string;
  amount: number;
  category: string;
  payment_method: string;
  payment_status: string;
  payment_proof_url: string | null;
  notes: string | null;
  admin_note: string | null;
  receipt_number: string | null;
  submitted_by_member: boolean;
  donation_date: string;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
}

type ActiveTab = "pending" | "confirmed" | "queried" | "manual";

const CATEGORIES = ["tithe", "offering", "first_fruit", "building_fund", "missions", "welfare", "special_seed", "other"];

function formatAmount(n: number) {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 0 });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ChurchAdminGivingClient() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [queryId, setQueryId] = useState<string | null>(null);
  const [queryNote, setQueryNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofModal, setProofModal] = useState<string | null>(null);

  const [manualForm, setManualForm] = useState({
    member_name: "", amount: "", category: "tithe",
    payment_method: "bank_transfer", notes: "",
    donation_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => { loadDonations(); }, []);

  const loadDonations = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("tfam_donations").select("*").order("created_at", { ascending: false });
      setDonations(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const confirmDonation = async (id: string) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const receiptNum = `TFAM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      await supabase.from("tfam_donations").update({
        payment_status: "confirmed",
        verified_at: new Date().toISOString(),
        verified_by: "Admin",
        receipt_number: receiptNum,
        admin_note: null,
      }).eq("id", id);

      // Get donation details for notification
      const donation = donations.find((d) => d.id === id);
      if (donation && donation.member_id) {
        await notifyMember({
          memberId: donation.member_id,
          title: "✅ Giving Confirmed!",
          message: `Your ${formatAmount(Number(donation.amount))} ${donation.category.replace(/_/g, " ")} has been verified. Receipt: ${receiptNum}. God bless you!`,
          type: "giving",
          link: "/member/giving-history",
        });
      }

      setDonations((prev) => prev.map((d) => d.id === id ? { ...d, payment_status: "confirmed", verified_at: new Date().toISOString(), receipt_number: receiptNum, admin_note: null } : d));
      toast.success("✅ Donation confirmed and member notified!");
    } catch { toast.error("Failed"); }
    finally { setBusyId(null); }
  };

  const sendQuery = async () => {
    if (!queryId || !queryNote.trim()) { toast.error("Enter a message"); return; }
    setBusyId(queryId);
    try {
      const supabase = createClient();
      await supabase.from("tfam_donations").update({
        payment_status: "queried",
        admin_note: queryNote.trim(),
      }).eq("id", queryId);

      // Notify member
      const donation = donations.find((d) => d.id === queryId);
      if (donation && donation.member_id) {
        await notifyMember({
          memberId: donation.member_id,
          title: "❓ Giving Requires Attention",
          message: `Your ${formatAmount(Number(donation.amount))} submission has been queried. Admin says: "${queryNote.trim().substring(0, 100)}${queryNote.trim().length > 100 ? "..." : ""}"`,
          type: "giving",
          link: "/member/giving-history",
        });
      }

      setDonations((prev) => prev.map((d) => d.id === queryId ? { ...d, payment_status: "queried", admin_note: queryNote.trim() } : d));
      toast.success("❓ Query sent to member");
      setQueryId(null);
      setQueryNote("");
    } catch { toast.error("Failed"); }
    finally { setBusyId(null); }
  };

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!manualForm.member_name.trim() || !manualForm.amount || Number(manualForm.amount) <= 0) {
      toast.error("Name and valid amount required"); return;
    }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const receiptNum = `TFAM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      await supabase.from("tfam_donations").insert({
        member_name: manualForm.member_name.trim(),
        amount: Number(manualForm.amount),
        category: manualForm.category,
        payment_method: manualForm.payment_method,
        payment_status: "confirmed",
        notes: manualForm.notes.trim() || null,
        donation_date: manualForm.donation_date,
        submitted_by_member: false,
        receipt_number: receiptNum,
        verified_at: new Date().toISOString(),
        verified_by: "Admin",
      });
      toast.success("💰 Donation recorded!");
      setManualForm({ member_name: "", amount: "", category: "tithe", payment_method: "bank_transfer", notes: "", donation_date: new Date().toISOString().split("T")[0] });
      loadDonations();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteDonation = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_donations").delete().eq("id", id);
      setDonations((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const pending = donations.filter((d) => d.payment_status === "pending");
  const confirmed = donations.filter((d) => d.payment_status === "confirmed");
  const queried = donations.filter((d) => d.payment_status === "queried");
  const totalConfirmed = confirmed.reduce((sum, d) => sum + Number(d.amount), 0);

  const TABS = [
    { id: "pending", label: "📥 Pending", count: pending.length, alert: pending.length > 0 },
    { id: "confirmed", label: "✅ Confirmed", count: confirmed.length, alert: false },
    { id: "queried", label: "❓ Queried", count: queried.length, alert: false },
    { id: "manual", label: "➕ Manual Record", count: null, alert: false },
  ];

  const currentList = activeTab === "pending" ? pending : activeTab === "confirmed" ? confirmed : activeTab === "queried" ? queried : [];

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Giving Management
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Giving Management
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Verify member submissions and record donations</p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30 flex-wrap">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{formatAmount(totalConfirmed)}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Confirmed</p>
            </div>
            <div className="text-center">
              <p className={`font-black text-2xl ${pending.length > 0 ? "text-amber-300" : "text-white"}`}>{pending.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{donations.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
          </div>
        </div>
      </div>

      {pending.length > 0 && activeTab !== "pending" && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 border-2 border-amber-400/60 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-3xl animate-pulse">💰</div>
            <div className="flex-1">
              <p className="font-black text-white text-lg">{pending.length} giving submission{pending.length > 1 ? "s" : ""} awaiting verification!</p>
              <p className="text-white/80 font-semibold text-sm">Members are waiting for confirmation</p>
            </div>
            <button onClick={() => setActiveTab("pending")} className="px-4 py-2 rounded-full bg-white text-amber-700 font-black text-sm flex-shrink-0">
              Review Now
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`relative rounded-2xl overflow-hidden p-3 transition-all text-left ${
              activeTab === tab.id
                ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
                : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40 hover:border-brand-gold-400/70"
            }`}
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="font-black text-white text-xs">{tab.label}</p>
            {tab.count !== null && (
              <p className={`font-black text-lg ${tab.alert ? "text-amber-300" : "text-white"}`}>{tab.count}</p>
            )}
          </button>
        ))}
      </div>

      {activeTab !== "manual" && (
        <div className="space-y-3">
          {currentList.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
                No {activeTab} records
              </h3>
            </div>
          ) : (
            currentList.map((d) => (
              <div key={d.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white border border-brand-gold-400/30 capitalize">
                        {d.category.replace(/_/g, " ")}
                      </span>
                      {d.submitted_by_member && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40">
                          📱 Member Submitted
                        </span>
                      )}
                    </div>

                    <p className="font-black text-white text-lg">{d.member_name}</p>
                    <p className="text-white font-black text-2xl">{formatAmount(Number(d.amount))}</p>
                    <p className="text-brand-purple-200 font-semibold text-xs mt-1">📅 {formatDate(d.donation_date)}</p>

                    {d.notes && <p className="text-brand-purple-300 text-sm mt-2">📝 {d.notes}</p>}
                    {d.admin_note && <p className="text-amber-300 text-sm mt-2">💬 Admin: {d.admin_note}</p>}
                    {d.receipt_number && <p className="text-green-300 text-xs mt-1">🧾 {d.receipt_number}</p>}
                  </div>

                  {d.payment_proof_url && (
                    <button onClick={() => setProofModal(d.payment_proof_url)} className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.payment_proof_url} alt="Proof" className="w-16 h-16 rounded-xl object-cover border-2 border-brand-gold-400/40 hover:border-brand-gold-400 transition-colors" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30 mt-3 flex-wrap">
                  {d.payment_status === "pending" && (
                    <>
                      <button onClick={() => confirmDonation(d.id)} disabled={busyId === d.id}
                        className="px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-black transition-all disabled:opacity-50">
                        ✅ Confirm
                      </button>
                      <button onClick={() => { setQueryId(d.id); setQueryNote(""); }}
                        className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-all">
                        ❓ Query
                      </button>
                    </>
                  )}
                  {d.payment_status === "queried" && (
                    <button onClick={() => confirmDonation(d.id)} disabled={busyId === d.id}
                      className="px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-black transition-all disabled:opacity-50">
                      ✅ Confirm Now
                    </button>
                  )}
                  {d.payment_proof_url && (
                    <button onClick={() => setProofModal(d.payment_proof_url)}
                      className="px-3 py-1.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30">
                      🖼️ View Proof
                    </button>
                  )}
                  <button onClick={() => deleteDonation(d.id)}
                    className="px-3 py-1.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "manual" && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h2 className="font-black text-white text-lg mb-4">➕ Record Giving Manually</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black text-white mb-2">Member Name <span className="text-red-400">*</span></label>
              <input type="text" value={manualForm.member_name} onChange={(e) => setManualForm({ ...manualForm, member_name: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" required />
            </div>
            <div>
              <label className="block text-sm font-black text-white mb-2">Amount (₦) <span className="text-red-400">*</span></label>
              <input type="number" min="1" value={manualForm.amount} onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-white mb-2">Category</label>
                <select value={manualForm.category} onChange={(e) => setManualForm({ ...manualForm, category: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold capitalize">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-black text-white mb-2">Date</label>
                <input type="date" value={manualForm.donation_date} onChange={(e) => setManualForm({ ...manualForm, donation_date: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-black text-white mb-2">Notes (Optional)</label>
              <textarea value={manualForm.notes} onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                rows={2} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-lg shadow-gold hover:scale-105 transition-all disabled:opacity-50">
              {isSubmitting ? "Recording..." : "💰 Record Giving"}
            </button>
          </form>
        </div>
      )}

      {queryId && (
        <>
          <div onClick={() => { setQueryId(null); setQueryNote(""); }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto">
              <div className="p-6 border-b-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">❓ Query Donation</h2>
                  <button onClick={() => { setQueryId(null); setQueryNote(""); }} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm">Send a message to the member about this donation:</p>
                <textarea value={queryNote} onChange={(e) => setQueryNote(e.target.value)}
                  rows={4} placeholder="e.g. Your proof image is unclear. Please resubmit a clearer screenshot."
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                <div className="flex gap-3">
                  <button onClick={() => { setQueryId(null); setQueryNote(""); }}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button onClick={sendQuery} disabled={busyId === queryId || !queryNote.trim()}
                    className="flex-1 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-black transition-all disabled:opacity-50">
                    {busyId === queryId ? "Sending..." : "❓ Send Query"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {proofModal && (
        <>
          <div onClick={() => setProofModal(null)} className="fixed inset-0 bg-black/80 z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto max-w-2xl w-full">
              <div className="flex justify-end mb-2">
                <button onClick={() => setProofModal(null)} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={proofModal} alt="Payment Proof" className="w-full rounded-2xl border-4 border-white/20" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}