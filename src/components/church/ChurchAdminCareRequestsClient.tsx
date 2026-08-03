// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN CARE REQUESTS – Respond to member care requests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyMember } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface CareRequest {
  id: string;
  member_id: string | null;
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
  member?: { full_name: string; email: string; phone: string } | null;
}

type ActiveTab = "pending" | "in_progress" | "completed" | "all";

const REQUEST_TYPES = [
  { value: "hospital_visit", label: "🏥 Hospital Visit" },
  { value: "home_visit", label: "🏠 Home Visit" },
  { value: "counseling", label: "💬 Counseling" },
  { value: "bereavement", label: "🕊️ Bereavement" },
  { value: "marriage_counseling", label: "💍 Marriage Counseling" },
  { value: "prayer_visit", label: "🙏 Prayer Visit" },
  { value: "general", label: "📋 General" },
];

function timeAgo(d: string): string {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function ChurchAdminCareRequestsClient() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("pending");
  const [selectedReq, setSelectedReq] = useState<CareRequest | null>(null);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState<string>("in_progress");
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_care_requests")
        .select("*, member:tfam_members(full_name, email, phone)")
        .order("created_at", { ascending: false });
      setRequests((data as CareRequest[]) || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const openResponse = (req: CareRequest) => {
    setSelectedReq(req);
    setResponseText(req.admin_response || "");
    setNewStatus(req.status === "pending" ? "in_progress" : req.status);
  };

  const sendResponse = async () => {
    if (!selectedReq) return;
    setIsResponding(true);
    try {
      const supabase = createClient();
      await supabase.from("tfam_care_requests").update({
        admin_response: responseText.trim() || null,
        status: newStatus,
        responded_at: responseText.trim() ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }).eq("id", selectedReq.id);

      if (selectedReq.member_id) {
        const statusLabel = newStatus === "completed"
          ? "✅ Completed"
          : newStatus === "in_progress"
          ? "🔄 In Progress"
          : "Updated";
        await notifyMember({
          memberId: selectedReq.member_id,
          title: `💗 Care Request ${statusLabel}`,
          message: responseText.trim()
            ? `Pastor responded to "${selectedReq.subject}": ${responseText.substring(0, 100)}${responseText.length > 100 ? "..." : ""}`
            : `Your request "${selectedReq.subject}" status: ${statusLabel}`,
          type: "care_request",
          link: "/member/request-care",
        });
      }

      toast.success("✅ Response sent!");
      setSelectedReq(null);
      setResponseText("");
      loadRequests();
    } catch { toast.error("Failed"); }
    finally { setIsResponding(false); }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_care_requests").delete().eq("id", id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selectedReq?.id === id) setSelectedReq(null);
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const inProgress = requests.filter((r) => r.status === "in_progress");
  const completed = requests.filter((r) => r.status === "completed");
  const urgentCount = requests.filter(
    (r) => r.urgency === "urgent" && r.status !== "completed"
  ).length;

  const TABS = [
    { id: "pending", label: "⏳ Pending", count: pending.length },
    { id: "in_progress", label: "🔄 In Progress", count: inProgress.length },
    { id: "completed", label: "✅ Completed", count: completed.length },
    { id: "all", label: "📋 All", count: requests.length },
  ];

  const currentList =
    activeTab === "pending" ? pending :
    activeTab === "in_progress" ? inProgress :
    activeTab === "completed" ? completed : requests;

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
            <span className="text-white font-black text-xs uppercase tracking-widest">Care Requests</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Member Care Requests
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Respond to hospital visits, counseling, and other care needs.
          </p>
          <div className="flex gap-4 flex-wrap pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{urgentCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Urgent</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{pending.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{completed.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Urgent Alert ── */}
      {urgentCount > 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-red-400/60 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
          <div className="flex items-center gap-4">
            <div className="text-3xl animate-pulse">🚨</div>
            <div className="flex-1">
              <p className="font-black text-white text-base">
                {urgentCount} URGENT request{urgentCount > 1 ? "s" : ""}!
              </p>
              <p className="text-brand-purple-200 text-sm">Members need immediate attention.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`relative rounded-2xl overflow-hidden p-3 transition-all text-left ${
              activeTab === tab.id
                ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
                : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40"
            }`}
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="font-black text-white text-xs">{tab.label}</p>
            <p className="font-black text-lg text-white">{tab.count}</p>
          </button>
        ))}
      </div>

      {/* ── Requests List ── */}
      {currentList.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-4xl mb-4">💗</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            No {activeTab.replace("_", " ")} requests
          </h3>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((req) => {
            const typeInfo = REQUEST_TYPES.find((t) => t.value === req.request_type);
            const isUrgent = req.urgency === "urgent";
            return (
              <div
                key={req.id}
                onClick={() => openResponse(req)}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  isUrgent ? "border-red-400/60" :
                  req.status === "completed" ? "border-green-400/40" :
                  "border-brand-gold-400/40"
                } p-5 shadow-xl cursor-pointer active:scale-95 transition-all`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {isUrgent && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white animate-pulse">
                      🚨 URGENT
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white border border-brand-gold-400/30">
                    {typeInfo?.label || req.request_type}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${
                    req.status === "completed"
                      ? "bg-green-500/20 text-green-300 border-green-400/40"
                      : req.status === "in_progress"
                      ? "bg-blue-500/20 text-blue-300 border-blue-400/40"
                      : "bg-brand-purple-950/60 text-white border-brand-gold-400/40"
                  }`}>
                    {req.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-brand-purple-200 text-xs font-semibold">
                    {timeAgo(req.created_at)}
                  </span>
                </div>

                {/* Member */}
                {req.member && (
                  <p className="text-white font-black text-sm mb-1">
                    👤 {req.member.full_name}
                  </p>
                )}

                <p className="font-black text-white text-base mb-1">{req.subject}</p>
                <p className="text-white font-semibold text-sm line-clamp-2">{req.message}</p>

                {req.contact_phone && (
                  <p className="text-brand-purple-200 text-xs mt-2">📱 {req.contact_phone}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Response Modal — KEEP bg-white — slides up mobile ── */}
      {selectedReq && (
        <>
          <div
            onClick={() => setSelectedReq(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    💗 Care Request
                  </h2>
                  <button
                    onClick={() => setSelectedReq(null)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Request Details — white bg OK in modal */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  {selectedReq.member && (
                    <div className="mb-3 pb-3 border-b border-gray-200">
                      <p className="text-brand-purple-900 font-black text-sm">
                        👤 {selectedReq.member.full_name}
                      </p>
                      <p className="text-gray-600 text-xs">📧 {selectedReq.member.email}</p>
                      <p className="text-gray-600 text-xs">📱 {selectedReq.member.phone}</p>
                    </div>
                  )}
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Subject</p>
                  <p className="text-brand-purple-900 font-black text-base mb-3">
                    {selectedReq.subject}
                  </p>
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Details</p>
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{selectedReq.message}</p>
                  {selectedReq.contact_phone && (
                    <p className="text-gray-600 text-xs mt-3">
                      📱 Preferred Contact: {selectedReq.contact_phone}
                    </p>
                  )}
                  {selectedReq.preferred_time && (
                    <p className="text-gray-600 text-xs">
                      🕐 Preferred Time: {selectedReq.preferred_time}
                    </p>
                  )}
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="in_progress">🔄 In Progress</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>

                {/* Response */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Response (Optional)
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={5}
                    placeholder="Write your response, plan of action, or update to the member..."
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>

                {/* Action Buttons — full width stacked */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={sendResponse}
                    disabled={isResponding}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isResponding ? "Saving..." : "✅ Update & Notify Member"}
                  </button>
                  <button
                    onClick={() => deleteRequest(selectedReq.id)}
                    className="w-full py-4 rounded-xl bg-red-600 text-white font-black active:scale-95 transition-all"
                  >
                    🗑️ Delete Request
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