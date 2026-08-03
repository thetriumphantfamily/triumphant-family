// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER REQUEST CARE – Submit pastoral care requests + notify admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface CareRequest {
  id: string;
  request_type: string;
  subject: string;
  message: string;
  urgency: string;
  contact_phone: string | null;
  preferred_time: string | null;
  status: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
}

const REQUEST_TYPES = [
  { value: "hospital_visit", label: "🏥 Hospital Visit", desc: "Pastor to visit me in hospital" },
  { value: "home_visit", label: "🏠 Home Visit", desc: "Pastor to visit my home" },
  { value: "counseling", label: "💬 Counseling", desc: "Personal counseling session" },
  { value: "bereavement", label: "🕊️ Bereavement", desc: "Support during loss" },
  { value: "marriage_counseling", label: "💍 Marriage Counseling", desc: "Marriage counseling" },
  { value: "prayer_visit", label: "🙏 Prayer Visit", desc: "Personal prayer session" },
  { value: "general", label: "📋 General Request", desc: "Other pastoral needs" },
];

const URGENCY_LEVELS = [
  { value: "urgent", label: "🔴 Urgent", color: "bg-red-500/20 text-red-300 border-red-400/40" },
  { value: "normal", label: "⚪ Normal", color: "bg-brand-purple-950/60 text-white/80 border-brand-gold-400/40" },
  { value: "low", label: "🟢 Low Priority", color: "bg-green-500/20 text-green-300 border-green-400/40" },
];

function timeAgo(d: string): string {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberRequestCareClient() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [formData, setFormData] = useState({
    request_type: "general",
    subject: "",
    message: "",
    urgency: "normal",
    contact_phone: "",
    preferred_time: "",
  });

  useEffect(() => {
    loadEverything();
  }, []);

  const loadEverything = async () => {
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
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }

    setMemberId(foundId);
    setMemberName(foundName);

    if (foundId) {
      try {
        const supabase = createClient();

        const { data: memberData } = await supabase
          .from("tfam_members")
          .select("phone")
          .eq("id", foundId)
          .single();

        if (memberData?.phone) {
          setMemberPhone(memberData.phone);
          setFormData((prev) => ({ ...prev, contact_phone: memberData.phone }));
        }

        const { data } = await supabase
          .from("tfam_care_requests")
          .select("*")
          .eq("member_id", foundId)
          .order("created_at", { ascending: false });

        setRequests(data || []);
      } catch (err) { console.error(err); }
    }

    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    if (!memberId) { toast.error("Please login again"); return; }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_care_requests").insert({
        member_id: memberId,
        request_type: formData.request_type,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        urgency: formData.urgency,
        contact_phone: formData.contact_phone.trim() || null,
        preferred_time: formData.preferred_time.trim() || null,
        status: "pending",
      });

      if (error) { toast.error(error.message); setIsSubmitting(false); return; }

      const typeLabel = REQUEST_TYPES.find((t) => t.value === formData.request_type)?.label || "Care Request";
      await notifyAdmin({
        title: `${formData.urgency === "urgent" ? "🚨 URGENT" : "💗"} ${typeLabel}`,
        message: `${memberName || "A member"} submitted: "${formData.subject.substring(0, 80)}${formData.subject.length > 80 ? "..." : ""}"`,
        type: "care_request",
        link: "/admin/church/care-requests",
      });

      toast.success("🙏 Request submitted! Pastor will respond soon.");
      setFormData({
        request_type: "general",
        subject: "",
        message: "",
        urgency: "normal",
        contact_phone: memberPhone,
        preferred_time: "",
      });
      setShowForm(false);
      loadEverything();
    } catch { toast.error("Failed to submit"); }
    finally { setIsSubmitting(false); }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_care_requests").delete().eq("id", id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const firstName = memberName.split(" ")[0] || "";
  const pending = requests.filter((r) => r.status === "pending").length;
  const completed = requests.filter((r) => r.status === "completed").length;

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading care requests..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest">
              Pastoral Care
            </span>
          </div>
          <p className="text-white/80 font-semibold text-base mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            Request Pastoral Care
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Need a hospital visit, counseling, or prayer? Let us know.
          </p>
          <div className="flex gap-4 flex-wrap pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{requests.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{pending}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{completed}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── New Request Button — full width mobile ── */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
      >
        ➕ New Care Request
      </button>

      {/* ── Empty State ── */}
      {requests.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">💗</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">No Care Requests Yet</h2>
          <p className="text-brand-purple-200 text-sm mb-4">
            Need pastoral support? Don&apos;t hesitate to reach out. Pastor is here for you.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Submit First Request
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const typeInfo = REQUEST_TYPES.find((t) => t.value === req.request_type);
            const urgencyInfo = URGENCY_LEVELS.find((u) => u.value === req.urgency);
            return (
              <div
                key={req.id}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  req.status === "completed"
                    ? "border-green-400/40"
                    : req.status === "in_progress"
                    ? "border-blue-400/40"
                    : "border-brand-gold-400/40"
                } p-5 shadow-xl`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white/80 border border-brand-gold-400/30">
                    {typeInfo?.label || req.request_type}
                  </span>
                  {urgencyInfo && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${urgencyInfo.color}`}>
                      {urgencyInfo.label}
                    </span>
                  )}
                  {req.status === "completed" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                      ✅ Completed
                    </span>
                  ) : req.status === "in_progress" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40">
                      🔄 In Progress
                    </span>
                  ) : req.status === "cancelled" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white/50 border border-brand-gold-400/20">
                      ❌ Cancelled
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white/80 border border-brand-gold-400/40">
                      ⏳ Pending
                    </span>
                  )}
                  <span className="text-brand-purple-300 text-xs font-semibold">
                    {timeAgo(req.created_at)}
                  </span>
                </div>

                {/* Subject + Message */}
                <p className="font-black text-white text-base mb-2">{req.subject}</p>
                <p className="text-white/80 font-semibold text-sm leading-relaxed whitespace-pre-wrap">
                  {req.message}
                </p>

                {/* Contact Details */}
                {req.contact_phone && (
                  <p className="text-brand-purple-300 text-xs mt-2">
                    📱 Contact: {req.contact_phone}
                  </p>
                )}
                {req.preferred_time && (
                  <p className="text-brand-purple-300 text-xs">
                    🕐 Preferred: {req.preferred_time}
                  </p>
                )}

                {/* Pastor Response */}
                {req.admin_response && (
                  <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
                    <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-green-400/40">
                      <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">
                        💬 Pastor&apos;s Response
                      </p>
                      <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-wrap">
                        {req.admin_response}
                      </p>
                      {req.responded_at && (
                        <p className="text-white/50 text-xs mt-2 font-semibold">
                          📅 Responded on{" "}
                          {new Date(req.responded_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Cancel Button — full width mobile */}
                {req.status === "pending" && (
                  <div className="pt-3 border-t border-brand-gold-400/30 mt-3">
                    <button
                      onClick={() => deleteRequest(req.id)}
                      className="w-full py-3 rounded-xl bg-brand-purple-950/60 text-white/70 text-sm font-bold border border-brand-gold-400/30 active:scale-95 transition-all"
                    >
                      🗑️ Cancel Request
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Form Modal — KEEP bg-white — slides up on mobile ── */}
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    💗 Request Pastoral Care
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
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
                    Type of Care Needed <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.request_type}
                    onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  >
                    {REQUEST_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label} — {t.desc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  >
                    {URGENCY_LEVELS.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief subject"
                    required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    placeholder="Please describe your situation and what you need..."
                    required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="Your phone"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <input
                    type="text"
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    placeholder="e.g. Weekends, Mornings"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "💗 Submit Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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