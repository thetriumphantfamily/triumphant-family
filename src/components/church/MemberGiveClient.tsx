// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER GIVE CLIENT — Bank transfer with proof submission + admin notification
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useState, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";

const CATEGORIES = [
  { value: "tithe", label: "Tithe" },
  { value: "offering", label: "Offering" },
  { value: "first_fruit", label: "First Fruit" },
  { value: "building_fund", label: "Building Fund" },
  { value: "missions", label: "Missions" },
  { value: "welfare", label: "Welfare" },
  { value: "special_seed", label: "Special Seed" },
  { value: "other", label: "Other" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatAmount(n: number) {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 0 });
}

export default function MemberGiveClient() {
  const [memberName, setMemberName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    category: "tithe",
    donation_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
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
                setMemberName(parsed.full_name);
                if (parsed.id) setMemberId(parsed.id);
                break;
              }
            }
          } catch {
            // not JSON
          }
        }
      }
    } catch {
      // ignore
    }
  };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB");
      return;
    }
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const copyAccount = () => {
    navigator.clipboard.writeText("1027481531");
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let proofUrl: string | null = null;

      if (proofFile) {
        const fileName = `giving-proof/${Date.now()}-${proofFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("tfam-members")
          .upload(fileName, proofFile);

        if (uploadError) {
          toast.error("Failed to upload proof");
          setIsSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("tfam-members")
          .getPublicUrl(fileName);

        proofUrl = urlData.publicUrl;
      }

      const receiptNumber = `TFAM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const { error } = await supabase.from("tfam_donations").insert({
        member_id: memberId || null,
        member_name: memberName || "Anonymous",
        amount: Number(formData.amount),
        category: formData.category,
        payment_method: "bank_transfer",
        payment_status: "pending",
        payment_proof_url: proofUrl,
        notes: formData.notes.trim() || null,
        donation_date: formData.donation_date,
        submitted_by_member: true,
        receipt_number: receiptNumber,
      });

      if (error) {
        toast.error(error.message);
        setIsSubmitting(false);
        return;
      }

      // 🔔 NOTIFY ADMIN
      await notifyAdmin({
        title: "💰 New Giving Submission",
        message: `${memberName || "A member"} submitted ${formatAmount(Number(formData.amount))} — ${formData.category.replace(/_/g, " ")}. Awaiting verification.`,
        type: "giving",
        link: "/admin/church/giving",
      });

      setShowSuccess(true);
      toast.success("🙏 Giving submitted for verification!");
    } catch {
      toast.error("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "tithe",
      donation_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setProofFile(null);
    setProofPreview(null);
    setShowSuccess(false);
  };

  const firstName = memberName.split(" ")[0] || "";

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Give
            </span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}
            {firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Give to The Triumphant Family
          </h1>
          <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
            <p className="text-brand-purple-200 italic text-sm">
              &ldquo;Give, and it shall be given unto you; good measure, pressed down, and shaken together.&rdquo;
            </p>
            <p className="text-brand-purple-300 text-xs mt-1 font-semibold">— Luke 6:38</p>
          </div>
        </div>
      </div>

      {/* Success State */}
      {showSuccess && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/60 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">
            Giving Submitted Successfully!
          </h2>
          <p className="text-brand-purple-200 text-sm mb-4">
            Your giving has been submitted for verification. Admin will confirm your payment and you will see it in your giving history.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
            >
              💰 Give Again
            </button>
            <a
              href="/member/giving-history"
              className="px-6 py-3 rounded-full bg-brand-purple-950/60 text-white font-bold border border-brand-gold-400/40 hover:border-brand-gold-400 transition-colors text-center"
            >
              📋 View Giving History
            </a>
          </div>
        </div>
      )}

      {!showSuccess && (
        <>
          {/* Bank Details */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <h2 className="font-black text-white text-lg mb-4">🏦 Bank Transfer Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
                <div>
                  <p className="text-brand-purple-300 text-xs font-semibold uppercase tracking-widest">Bank</p>
                  <p className="text-white font-bold text-lg">UBA</p>
                </div>
                <div className="text-3xl">🏦</div>
              </div>
              <div className="flex items-center justify-between bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
                <div>
                  <p className="text-brand-purple-300 text-xs font-semibold uppercase tracking-widest">Account Number</p>
                  <p className="text-white font-black text-2xl tracking-wider">1027481531</p>
                </div>
                <button
                  onClick={copyAccount}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all"
                >
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
                <p className="text-brand-purple-300 text-xs font-semibold uppercase tracking-widest">Account Name</p>
                <p className="text-white font-bold text-sm">THE TRIUMPHANT FAMILY OF THE GLEAM OF SALVATION A.P</p>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <h2 className="font-black text-white text-lg mb-2">📤 Submit Payment Proof</h2>
            <p className="text-brand-purple-200 text-sm mb-6">
              After transferring, fill this form so we can verify your payment
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-white mb-2">
                  Amount (₦) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 50000"
                  required
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-white mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-white mb-2">Date of Transfer</label>
                  <input
                    type="date"
                    value={formData.donation_date}
                    onChange={(e) => setFormData({ ...formData, donation_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-white mb-2">Payment Proof (Screenshot)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofChange}
                    className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-brand-gold-400 file:text-brand-purple-900 file:font-bold file:text-xs"
                  />
                </div>
                {proofPreview && (
                  <div className="mt-3 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proofPreview}
                      alt="Payment proof"
                      className="w-full max-w-xs rounded-xl border-2 border-brand-gold-400/40"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProofFile(null);
                        setProofPreview(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-brand-purple-900/80 text-white flex items-center justify-center text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-black text-white mb-2">Note (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Any additional info..."
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-lg shadow-gold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? "Submitting..." : "✅ Submit for Verification"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}