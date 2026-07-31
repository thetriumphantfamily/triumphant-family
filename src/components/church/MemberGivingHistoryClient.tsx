// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER GIVING HISTORY CLIENT — View donations + resubmit queried ones
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Donation {
  id: string;
  amount: number;
  category: string;
  payment_status: string;
  payment_proof_url: string | null;
  notes: string | null;
  admin_note: string | null;
  receipt_number: string | null;
  donation_date: string;
  verified_at: string | null;
  created_at: string;
}

function formatAmount(n: number) {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 0 });
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getStatusInfo(status: string) {
  switch (status) {
    case "confirmed":
      return { label: "✅ Confirmed", color: "bg-green-500/20 text-green-300 border-green-400/40" };
    case "queried":
      return { label: "❓ Queried", color: "bg-amber-500/20 text-amber-300 border-amber-400/40" };
    default:
      return { label: "⏳ Pending", color: "bg-blue-500/20 text-blue-300 border-blue-400/40" };
  }
}

export default function MemberGivingHistoryClient() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");

  // Resubmit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editProofFile, setEditProofFile] = useState<File | null>(null);
  const [editProofPreview, setEditProofPreview] = useState<string | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);

  useEffect(() => {
    loadMemberAndDonations();
  }, []);

  const loadMemberAndDonations = async () => {
    let foundId = "";
    let foundName = "";

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) {
                foundName = parsed.full_name;
                if (parsed.id) foundId = parsed.id;
                break;
              }
            }
          } catch { /* not JSON */ }
        }
      }
    } catch { /* ignore */ }

    setMemberId(foundId);
    setMemberName(foundName);

    if (foundId) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("tfam_donations")
          .select("*")
          .eq("member_id", foundId)
          .order("donation_date", { ascending: false });
        setDonations(data || []);
      } catch (err) {
        console.error(err);
      }
    }

    setLoading(false);
  };

  const openResubmit = (d: Donation) => {
    setEditingId(d.id);
    setEditAmount(String(d.amount));
    setEditNotes(d.notes || "");
    setEditProofFile(null);
    setEditProofPreview(null);
  };

  const closeResubmit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditNotes("");
    setEditProofFile(null);
    setEditProofPreview(null);
  };

  const handleEditProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB");
      return;
    }
    setEditProofFile(file);
    setEditProofPreview(URL.createObjectURL(file));
  };

  const handleResubmit = async () => {
    if (!editingId) return;
    if (!editAmount || Number(editAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsResubmitting(true);

    try {
      const supabase = createClient();
      let newProofUrl: string | null = null;

      // Upload new proof if provided
      if (editProofFile) {
        const fileName = `giving-proof/${Date.now()}-${editProofFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("tfam-members")
          .upload(fileName, editProofFile);

        if (uploadError) {
          toast.error("Failed to upload new proof");
          setIsResubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("tfam-members")
          .getPublicUrl(fileName);

        newProofUrl = urlData.publicUrl;
      }

      // Update the donation
      const updatePayload: Record<string, unknown> = {
        amount: Number(editAmount),
        notes: editNotes.trim() || null,
        payment_status: "pending",
        admin_note: null,
      };

      if (newProofUrl) {
        updatePayload.payment_proof_url = newProofUrl;
      }

      const { error } = await supabase
        .from("tfam_donations")
        .update(updatePayload)
        .eq("id", editingId);

      if (error) {
        toast.error(error.message);
        setIsResubmitting(false);
        return;
      }

      // Update local state
      setDonations((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? {
                ...d,
                amount: Number(editAmount),
                notes: editNotes.trim() || null,
                payment_status: "pending",
                admin_note: null,
                payment_proof_url: newProofUrl || d.payment_proof_url,
              }
            : d
        )
      );

      toast.success("✅ Resubmitted for verification!");
      closeResubmit();
    } catch {
      toast.error("Failed to resubmit");
    } finally {
      setIsResubmitting(false);
    }
  };

  const totalGiven = donations
    .filter((d) => d.payment_status === "confirmed")
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const pendingCount = donations.filter((d) => d.payment_status === "pending").length;
  const queriedCount = donations.filter((d) => d.payment_status === "queried").length;
  const firstName = memberName.split(" ")[0] || "";

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">💰</div>
          <p className="text-gray-500">Loading giving history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ━━━ BRAND HEADER ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Giving History
            </span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Your Giving Record
          </h1>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30 flex-wrap">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{formatAmount(totalGiven)}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Confirmed</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{donations.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Records</p>
            </div>
            {pendingCount > 0 && (
              <div className="text-center">
                <p className="text-blue-300 font-black text-2xl">{pendingCount}</p>
                <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Pending</p>
              </div>
            )}
            {queriedCount > 0 && (
              <div className="text-center">
                <p className="text-amber-300 font-black text-2xl">{queriedCount}</p>
                <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Queried</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ━━━ NO DONATIONS ━━━ */}
      {donations.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">💰</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">No Giving Records Yet</h2>
          <p className="text-brand-purple-200 text-sm mb-4">Your giving history will appear here after you submit</p>
          <a href="/member/give" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all">
            💰 Give Now
          </a>
        </div>
      )}

      {/* ━━━ DONATIONS LIST ━━━ */}
      {donations.length > 0 && (
        <div className="space-y-3">
          {donations.map((d) => {
            const statusInfo = getStatusInfo(d.payment_status);
            const isEditing = editingId === d.id;

            return (
              <div key={d.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                d.payment_status === "confirmed" ? "border-green-400/40" :
                d.payment_status === "queried" ? "border-amber-400/40" :
                "border-brand-gold-400/40"
              } p-5 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* ━━━ NORMAL VIEW ━━━ */}
                {!isEditing && (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-purple-950/60 text-white border border-brand-gold-400/30 capitalize">
                            {d.category.replace(/_/g, " ")}
                          </span>
                        </div>

                        <p className="text-white font-black text-2xl">{formatAmount(Number(d.amount))}</p>
                        <p className="text-brand-purple-200 font-semibold text-xs mt-1">📅 {formatDate(d.donation_date)}</p>

                        {d.notes && <p className="text-brand-purple-300 text-sm mt-2">📝 {d.notes}</p>}

                        {/* Admin Query Note */}
                        {d.payment_status === "queried" && d.admin_note && (
                          <div className="mt-3 bg-amber-500/10 border border-amber-400/30 rounded-xl p-3">
                            <p className="text-amber-300 text-xs font-black uppercase tracking-widest mb-1">Admin Message:</p>
                            <p className="text-white font-semibold text-sm">{d.admin_note}</p>
                          </div>
                        )}

                        {d.payment_status === "confirmed" && d.verified_at && (
                          <p className="text-green-300 text-xs font-semibold mt-2">
                            ✅ Verified on {new Date(d.verified_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        )}

                        {d.payment_status === "confirmed" && d.receipt_number && (
                          <p className="text-brand-purple-200 text-xs font-semibold mt-1">🧾 Receipt: {d.receipt_number}</p>
                        )}
                      </div>

                      {d.payment_proof_url && (
                        <a href={d.payment_proof_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={d.payment_proof_url} alt="Proof" className="w-16 h-16 rounded-xl object-cover border-2 border-brand-gold-400/40 hover:border-brand-gold-400 transition-colors" />
                        </a>
                      )}
                    </div>

                    {/* Resubmit Button for Queried */}
                    {d.payment_status === "queried" && (
                      <div className="pt-3 border-t border-amber-400/30 mt-3">
                        <button
                          onClick={() => openResubmit(d)}
                          className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all"
                        >
                          ✏️ Edit & Resubmit
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* ━━━ EDIT/RESUBMIT VIEW ━━━ */}
                {isEditing && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-400/40">
                        ✏️ Editing & Resubmitting
                      </span>
                    </div>

                    {d.admin_note && (
                      <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3">
                        <p className="text-amber-300 text-xs font-black uppercase tracking-widest mb-1">Admin said:</p>
                        <p className="text-white font-semibold text-sm">{d.admin_note}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-black text-white mb-2">Amount (₦)</label>
                      <input
                        type="number"
                        min="1"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-white mb-2">Upload New Proof (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditProof}
                        className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-brand-gold-400 file:text-brand-purple-900 file:font-bold file:text-xs"
                      />
                      {editProofPreview && (
                        <div className="mt-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={editProofPreview} alt="New proof" className="w-full max-w-xs rounded-xl border-2 border-brand-gold-400/40" />
                        </div>
                      )}
                      {!editProofPreview && d.payment_proof_url && (
                        <p className="text-brand-purple-300 text-xs mt-2 font-semibold">
                          Current proof will be kept if you don&apos;t upload a new one
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-black text-white mb-2">Note (Optional)</label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={2}
                        placeholder="Any additional info for admin..."
                        className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={closeResubmit}
                        className="flex-1 px-4 py-3 rounded-full bg-brand-purple-950/60 text-white font-bold border border-brand-gold-400/40 hover:border-brand-gold-400 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleResubmit}
                        disabled={isResubmitting}
                        className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50"
                      >
                        {isResubmitting ? "Resubmitting..." : "✅ Resubmit for Verification"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}