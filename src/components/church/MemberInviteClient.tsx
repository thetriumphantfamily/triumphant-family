// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER INVITE FRIENDS — Hybrid: Quick share + Optional tracking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Invite {
  id: string;
  invited_name: string;
  invited_phone: string | null;
  invited_email: string | null;
  invite_method: string;
  status: string;
  notes: string | null;
  joined_at: string | null;
  created_at: string;
}

type ActiveTab = "share" | "track";

const CHURCH_URL = "https://triumphantfamily.vercel.app";
const CHURCH_NAME = "The Triumphant Family";
const CHURCH_LOCATION = "1, Arifanla Bus Stop, Akute, Ogun State";
const CHURCH_SUNDAY = "Sundays at 8:00 AM";
const CHURCH_WEDNESDAY = "Wednesdays at 9:00 AM";

const INVITE_MESSAGES = [
  {
    id: "general",
    label: "🙏 General Invitation",
    text: `Hello dear friend! 🙏\n\nI want to invite you to join me at ${CHURCH_NAME}!\n\n📍 ${CHURCH_LOCATION}\n⏰ ${CHURCH_SUNDAY}\n⏰ ${CHURCH_WEDNESDAY}\n\nExpect prayers, prophetic declarations, healings, and life-changing encounters with the Holy Spirit.\n\n${CHURCH_URL}\n\nSee you there! God bless you. ✝️`,
  },
  {
    id: "sunday",
    label: "⛪ This Sunday",
    text: `Hi! 🙏\n\nI'd love to have you join me this Sunday at ${CHURCH_NAME}!\n\n📅 This Sunday at 8:00 AM\n📍 ${CHURCH_LOCATION}\n\nCome experience powerful worship, the Word of God, and encounter His presence.\n\n${CHURCH_URL}\n\nSee you Sunday! ✨`,
  },
  {
    id: "prayer",
    label: "🙌 Prayer Service",
    text: `Peace be upon you! 🙏\n\nIf you need a breakthrough, healing, or divine intervention, come with me to our Midweek Prayer Service.\n\n📅 Wednesdays at 9:00 AM\n📍 ${CHURCH_LOCATION}\n\nMountains are moving. Chains are breaking. Come!\n\n${CHURCH_URL}\n\nGod bless you 🙏`,
  },
  {
    id: "encounter",
    label: "✨ Holy Spirit Encounter",
    text: `Beloved! ✨\n\nGod is doing wonderful things at ${CHURCH_NAME}. Prophetic declarations, healings, deliverances happening every service.\n\nCome and encounter God for yourself!\n\n📍 ${CHURCH_LOCATION}\n⏰ Sundays 8AM | Wednesdays 9AM\n\n${CHURCH_URL}\n\nBe blessed! ✝️`,
  },
];

const INVITE_METHODS = [
  { value: "whatsapp", label: "💚 WhatsApp" },
  { value: "sms", label: "💬 SMS" },
  { value: "email", label: "📧 Email" },
  { value: "in_person", label: "🤝 In Person" },
  { value: "facebook", label: "📘 Facebook" },
  { value: "other", label: "📋 Other" },
];

const INVITE_STATUSES = [
  { value: "sent", label: "📨 Invited", color: "bg-blue-500/20 text-blue-300 border-blue-400/40" },
  { value: "contacted", label: "📞 Talking", color: "bg-amber-500/20 text-amber-300 border-amber-400/40" },
  { value: "attending", label: "⛪ Attending", color: "bg-purple-500/20 text-purple-300 border-purple-400/40" },
  { value: "joined", label: "✅ Joined", color: "bg-green-500/20 text-green-300 border-green-400/40" },
  { value: "not_interested", label: "❌ Not Interested", color: "bg-gray-500/20 text-gray-300 border-gray-400/40" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

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

export default function MemberInviteClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("share");
  const [selectedMessage, setSelectedMessage] = useState(INVITE_MESSAGES[0]);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Track invite form
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    invited_name: "",
    invited_phone: "",
    invited_email: "",
    invite_method: "whatsapp",
    notes: "",
  });

  useEffect(() => { loadEverything(); }, []);

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
        const { data } = await supabase
          .from("tfam_invites")
          .select("*")
          .eq("member_id", foundId)
          .order("created_at", { ascending: false });
        setInvites(data || []);
      } catch (err) { console.error(err); }
    }

    setLoading(false);
  };

  const shareWhatsApp = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(CHURCH_URL)}`;
    window.open(url, "_blank");
  };

  const shareEmail = (text: string) => {
    const subject = encodeURIComponent(`Join me at ${CHURCH_NAME}!`);
    const body = encodeURIComponent(text);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("📋 Copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(CHURCH_URL);
    toast.success("🔗 Church link copied!");
  };

  const handleTrackInvite = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.invited_name.trim()) { toast.error("Enter name"); return; }
    if (!memberId) { toast.error("Please login"); return; }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_invites").insert({
        member_id: memberId,
        invited_name: formData.invited_name.trim(),
        invited_phone: formData.invited_phone.trim() || null,
        invited_email: formData.invited_email.trim() || null,
        invite_method: formData.invite_method,
        notes: formData.notes.trim() || null,
        status: "sent",
      });

      if (error) { toast.error(error.message); setIsSubmitting(false); return; }

      toast.success("✅ Invite tracked!");
      setFormData({ invited_name: "", invited_phone: "", invited_email: "", invite_method: "whatsapp", notes: "" });
      setShowForm(false);
      loadEverything();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const payload: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (newStatus === "joined") payload.joined_at = new Date().toISOString();

      await supabase.from("tfam_invites").update(payload).eq("id", id);
      setInvites((prev) => prev.map((i) => i.id === id ? { ...i, status: newStatus, joined_at: newStatus === "joined" ? new Date().toISOString() : i.joined_at } : i));

      if (newStatus === "joined") {
        toast.success("🎉 Praise God! Another soul added to the kingdom!");
      } else {
        toast.success("Updated");
      }
    } catch { toast.error("Failed"); }
  };

  const deleteInvite = async (id: string) => {
    if (!confirm("Delete this invite record?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_invites").delete().eq("id", id);
      setInvites((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const firstName = memberName.split(" ")[0] || "";
  const joinedCount = invites.filter((i) => i.status === "joined").length;
  const attendingCount = invites.filter((i) => i.status === "attending").length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🎁</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Invite Friends
            </span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Bring Someone to Christ
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">
            Share the good news. Invite family and friends to experience God&apos;s presence!
          </p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30 flex-wrap">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{invites.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Invited</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{attendingCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Attending</p>
            </div>
            <div className="text-center">
              <p className="text-brand-gold-400 font-black text-2xl">{joinedCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Joined 🎉</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
            <p className="text-brand-gold-400 italic text-sm">
              &ldquo;Go ye therefore, and teach all nations...&rdquo;
            </p>
            <p className="text-brand-purple-300 text-xs mt-1 font-semibold">— Matthew 28:19</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab("share")}
          className={`relative rounded-2xl overflow-hidden p-4 transition-all text-left ${
            activeTab === "share"
              ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
              : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40 hover:border-brand-gold-400/70"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-lg">📤</div>
            <div>
              <p className="font-black text-white text-sm">Quick Share</p>
              <p className="text-brand-purple-200 text-xs">WhatsApp, Facebook, Email</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("track")}
          className={`relative rounded-2xl overflow-hidden p-4 transition-all text-left ${
            activeTab === "track"
              ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
              : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40 hover:border-brand-gold-400/70"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-lg">📋</div>
            <div>
              <p className="font-black text-white text-sm">Track Invites</p>
              <p className="text-brand-purple-200 text-xs">{invites.length} tracked</p>
            </div>
          </div>
        </button>
      </div>

      {/* SHARE TAB */}
      {activeTab === "share" && (
        <div className="space-y-4">
          {/* Message Templates */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <h2 className="font-black text-white text-lg mb-4">📝 Choose a Message</h2>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {INVITE_MESSAGES.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3 rounded-xl text-left transition-all text-sm font-bold ${
                    selectedMessage.id === msg.id
                      ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                      : "bg-brand-purple-950/60 text-white border border-brand-gold-400/30 hover:border-brand-gold-400"
                  }`}
                >
                  {msg.label}
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30 mb-4">
              <p className="text-brand-gold-300 text-xs font-black uppercase tracking-widest mb-2">Preview</p>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.text}</p>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => shareWhatsApp(selectedMessage.text)}
                className="px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black text-sm shadow-lg transition-all hover:scale-105"
              >
                💚 WhatsApp
              </button>
              <button
                onClick={shareFacebook}
                className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg transition-all hover:scale-105"
              >
                📘 Facebook
              </button>
              <button
                onClick={() => shareEmail(selectedMessage.text)}
                className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-lg transition-all hover:scale-105"
              >
                📧 Email
              </button>
              <button
                onClick={() => copyText(selectedMessage.text)}
                className="px-4 py-3 rounded-xl bg-brand-purple-950/60 text-white font-black text-sm border-2 border-brand-gold-400/40 hover:border-brand-gold-400 transition-all"
              >
                {copied ? "✅ Copied" : "📋 Copy Text"}
              </button>
            </div>
          </div>

          {/* Church Link */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <h2 className="font-black text-white text-lg mb-4">🔗 Church Website Link</h2>
            <div className="flex items-center gap-3 bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
              <p className="flex-1 text-white font-semibold text-sm truncate">{CHURCH_URL}</p>
              <button
                onClick={copyLink}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all flex-shrink-0"
              >
                📋 Copy
              </button>
            </div>
          </div>

          {/* Track Prompt */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl text-center">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="text-3xl mb-3">📊</div>
            <p className="text-white font-black text-lg mb-2">Want to track your invites?</p>
            <p className="text-brand-purple-200 text-sm mb-4">
              Log the people you invite and celebrate when they join!
            </p>
            <button
              onClick={() => setActiveTab("track")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
            >
              📋 Track My Invites
            </button>
          </div>
        </div>
      )}

      {/* TRACK TAB */}
      {activeTab === "track" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
            >
              ➕ Log New Invite
            </button>
          </div>

          {invites.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-5xl mb-4">📋</div>
              <h2 className="font-heading text-xl font-bold text-white mb-2">No Invites Tracked Yet</h2>
              <p className="text-brand-purple-200 text-sm mb-4">
                Log the people you invite to keep track of your evangelism journey.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => {
                const statusInfo = INVITE_STATUSES.find((s) => s.value === invite.status);
                const methodInfo = INVITE_METHODS.find((m) => m.value === invite.invite_method);
                return (
                  <div key={invite.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${invite.status === "joined" ? "border-green-400" : "border-brand-gold-400/40"} p-5 shadow-xl`}>
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {statusInfo && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      )}
                      {methodInfo && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-purple-950/60 text-white border border-brand-gold-400/30">
                          {methodInfo.label}
                        </span>
                      )}
                      <span className="text-brand-purple-300 text-xs font-semibold">{timeAgo(invite.created_at)}</span>
                    </div>

                    <p className="font-black text-white text-lg">{invite.invited_name}</p>
                    {invite.invited_phone && <p className="text-brand-purple-200 text-xs">📱 {invite.invited_phone}</p>}
                    {invite.invited_email && <p className="text-brand-purple-200 text-xs">📧 {invite.invited_email}</p>}
                    {invite.notes && <p className="text-brand-purple-300 text-sm mt-2">📝 {invite.notes}</p>}
                    {invite.joined_at && (
                      <p className="text-green-300 text-xs mt-2 font-black">
                        🎉 Joined on {new Date(invite.joined_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30 mt-3 flex-wrap">
                      <select
                        value={invite.status}
                        onChange={(e) => updateStatus(invite.id, e.target.value)}
                        className="px-3 py-1.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/40"
                      >
                        {INVITE_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      <button onClick={() => deleteInvite(invite.id)} className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">🗑️ Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Track Form Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">📋 Log New Invite</h2>
                  <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleTrackInvite} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Their Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.invited_name} onChange={(e) => setFormData({ ...formData, invited_name: e.target.value })} placeholder="e.g. Brother John" required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input type="tel" value={formData.invited_phone} onChange={(e) => setFormData({ ...formData, invited_phone: e.target.value })} placeholder="+234..." className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input type="email" value={formData.invited_email} onChange={(e) => setFormData({ ...formData, invited_email: e.target.value })} placeholder="Optional" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">How Did You Invite?</label>
                  <select value={formData.invite_method} onChange={(e) => setFormData({ ...formData, invite_method: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900">
                    {INVITE_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} placeholder="e.g. Cousin, works at bank..." className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "📋 Save Invite"}
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