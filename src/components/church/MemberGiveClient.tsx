// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER GIVE CLIENT — Bank transfer giving with proof upload
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const GIVING_CATEGORIES = [
  { value: "tithe", label: "💰 Tithe", description: "10% of your income" },
  { value: "offering", label: "🙏 Offering", description: "Free-will giving" },
  { value: "seed_faith", label: "🌱 Seed Faith", description: "Special seed offering" },
  { value: "building_fund", label: "🏛️ Building Fund", description: "Church building project" },
  { value: "missions", label: "🌍 Missions", description: "Supporting evangelism" },
  { value: "welfare", label: "💝 Welfare", description: "Helping those in need" },
  { value: "special_project", label: "⭐ Special Project", description: "Designated giving" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function MemberGiveClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [memberId, setMemberId] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [memberDbId, setMemberDbId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    category: "tithe",
    payment_reference: "",
    notes: "",
  });

  useEffect(() => {
    const session = localStorage.getItem("tfam_member_session");
    if (session) {
      const parsed = JSON.parse(session);
      setMemberId(parsed.member_id);
      setMemberName(parsed.full_name);
      setMemberDbId(parsed.id);
    }
  }, []);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText("1027481531");
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large! Max 5 MB");
      return;
    }

    setSelectedFile(file);
  };

  const resetForm = () => {
    setFormData({ amount: "", category: "tithe", payment_reference: "", notes: "" });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let proofUrl = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `proof-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("tfam-members")
          .upload(`payment-proofs/${fileName}`, selectedFile);

        if (uploadError) {
          toast.error("Failed to upload proof");
          setIsSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("tfam-members")
          .getPublicUrl(`payment-proofs/${fileName}`);

        proofUrl = publicUrl;
      }

      const { error } = await supabase.from("tfam_donations").insert({
        member_id: memberDbId,
        member_name: memberName,
        amount: parseFloat(formData.amount),
        category: formData.category,
        payment_method: "bank_transfer",
        payment_reference: formData.payment_reference.trim() || null,
        payment_proof_url: proofUrl,
        payment_status: proofUrl ? "pending_verification" : "pending",
        notes: formData.notes.trim() || null,
        donation_date: new Date().toISOString().split("T")[0],
      });

      if (error) {
        toast.error(`Failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("🎉 Giving recorded! Thank you for your generosity.", {
        style: { background: "#6B1F8A", color: "#fff", border: "1px solid #FFC72C" },
        duration: 5000,
      });

      resetForm();
    } catch (err) {
      console.error("Give error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          💰 Give to the Ministry
        </h1>
        <p className="text-gray-600 text-sm">
          Every seed sown advances the Kingdom of God
        </p>
      </div>

      {/* Scripture */}
      <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📖</span>
          </div>
          <div>
            <p className="text-brand-purple-800 text-sm italic leading-relaxed">
              &ldquo;Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.&rdquo;
            </p>
            <p className="text-brand-purple-600 text-xs font-semibold mt-1">— 2 Corinthians 9:7</p>
          </div>
        </div>
      </div>

      {/* Bank Account Card */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-b-2 border-brand-gold-400/40 p-6">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏦</span>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Bank Transfer Details</h2>
              <p className="text-brand-purple-200 text-xs">Transfer to this account and record your giving below</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
              <p className="text-brand-gold-400 text-[10px] uppercase tracking-widest font-semibold">Bank Name</p>
              <p className="text-white font-bold">UBA (United Bank for Africa)</p>
            </div>

            <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
              <p className="text-brand-gold-400 text-[10px] uppercase tracking-widest font-semibold">Account Name</p>
              <p className="text-white font-bold text-sm">THE TRIUMPHANT FAMILY OF THE GLEAM OF SALVATION A.P</p>
            </div>

            <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30 flex items-center justify-between">
              <div>
                <p className="text-brand-gold-400 text-[10px] uppercase tracking-widest font-semibold">Account Number</p>
                <p className="text-white font-bold text-2xl tracking-wider">1027481531</p>
              </div>
              <button
                onClick={copyAccountNumber}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-sm shadow-gold hover:scale-105 transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6">
          <h3 className="font-heading font-bold text-brand-purple-900 mb-3">How to Give:</h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "Transfer your desired amount to the account above" },
              { step: "2", text: "Click 'Record My Giving' below" },
              { step: "3", text: "Enter your amount and upload proof (optional)" },
              { step: "4", text: "Admin will verify and confirm your donation" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-purple-100 flex items-center justify-center text-brand-purple-900 font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <p className="text-gray-700 text-sm pt-1">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Record Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
            >
              💰 Record My Giving
            </button>
          )}
        </div>
      </div>

      {/* ━━━ GIVING FORM ━━━ */}
      {showForm && (
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
          <div className="bg-green-50 border-b-2 border-green-100 p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-purple-900">Record Your Giving</h2>
                <p className="text-gray-600 text-xs">Fill in the details after your transfer</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Amount (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 10000"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 text-xl font-bold"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GIVING_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`flex items-start gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                      formData.category === cat.value
                        ? "border-brand-gold-400 bg-brand-gold-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-lg">{cat.label.split(" ")[0]}</span>
                    <div>
                      <p className={`text-sm font-bold ${formData.category === cat.value ? "text-brand-purple-900" : "text-gray-700"}`}>
                        {cat.label.split(" ").slice(1).join(" ")}
                      </p>
                      <p className="text-xs text-gray-500">{cat.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Reference */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Transfer Reference (Optional)</label>
              <input
                type="text"
                value={formData.payment_reference}
                onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
                placeholder="Bank transaction reference number"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
              />
            </div>

            {/* Payment Proof */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Upload Payment Proof (Optional)</label>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" id="payment-proof" />
              <label
                htmlFor="payment-proof"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 font-bold cursor-pointer transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {selectedFile ? "Change File" : "Upload Screenshot/Receipt"}
              </label>
              <p className="text-xs text-gray-500 mt-2">Screenshot of transfer or bank receipt • Max 5 MB</p>

              {selectedFile && (
                <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 font-semibold">✅ {selectedFile.name}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special notes for this giving..."
                rows={3}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Recording..." : "🎉 Record Giving"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Giving History Link */}
      <div className="text-center">
        <Link
          href="/member/giving-history"
          className="inline-flex items-center gap-2 text-brand-purple-600 hover:text-brand-purple-700 font-bold text-sm"
        >
          📊 View My Giving History →
        </Link>
      </div>
    </div>
  );
}