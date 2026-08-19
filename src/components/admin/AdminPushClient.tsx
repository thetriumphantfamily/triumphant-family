// ───────────────────────────────────────────────────────────────
// ADMIN PUSH CLIENT — Compose + send notifications
// ───────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  total: number;
  members: number;
  students: number;
  anonymous: number;
}

export default function AdminPushClient() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "members" | "students" | "anonymous">("all");
  const [link, setLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [stats, setStats] = useState<Stats>({ total: 0, members: 0, students: 0, anonymous: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("fcm_tokens")
        .select("user_type")
        .eq("is_active", true);

      if (data) {
        const members = data.filter((t) => t.user_type === "member").length;
        const students = data.filter((t) => t.user_type === "student").length;
        const anonymous = data.filter((t) => t.user_type === "anonymous").length;
        setStats({ total: data.length, members, students, anonymous });
      }
    } catch (err) {
      console.error("Load stats error:", err);
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          target,
          link: link.trim() || "/",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send");
      }

      toast.success(
        `✅ Sent to ${result.successCount}/${result.totalTokens} devices`,
        { duration: 5000 }
      );

      // Reset form
      setTitle("");
      setMessage("");
      setLink("");
      loadStats();
    } catch (err: any) {
      console.error("Send error:", err);
      toast.error(err.message || "Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Push Notifications
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            🔔 Send Notifications
          </h1>
          <p className="text-brand-purple-200 text-sm md:text-base">
            Send instant push notifications to members, students, or everyone
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-3xl mb-2">📱</div>
          <p className="text-white font-black text-3xl mb-1">{stats.total}</p>
          <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total Devices</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-3xl mb-2">👥</div>
          <p className="text-white font-black text-3xl mb-1">{stats.members}</p>
          <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Members</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-3xl mb-2">🎓</div>
          <p className="text-white font-black text-3xl mb-1">{stats.students}</p>
          <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">TDA Students</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-3xl mb-2">🌐</div>
          <p className="text-white font-black text-3xl mb-1">{stats.anonymous}</p>
          <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Website Guests</p>
        </div>
      </div>

      {/* Compose Form */}
      <form onSubmit={handleSend} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10 space-y-5">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-widest">
              📢 Send To <span className="text-brand-gold-400">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: "all", label: "Everyone", count: stats.total, icon: "🌍" },
                { value: "members", label: "Members Only", count: stats.members, icon: "👥" },
                { value: "students", label: "TDA Students", count: stats.students, icon: "🎓" },
                { value: "anonymous", label: "Guests Only", count: stats.anonymous, icon: "🌐" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTarget(opt.value as any)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    target === opt.value
                      ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 border-brand-gold-400 text-brand-purple-900 shadow-gold"
                      : "bg-brand-purple-950/60 border-brand-gold-400/30 text-white hover:border-brand-gold-400"
                  }`}
                >
                  <div className="text-2xl mb-1">{opt.icon}</div>
                  <p className="font-black text-xs">{opt.label}</p>
                  <p className={`text-[10px] ${target === opt.value ? "text-brand-purple-800" : "text-brand-purple-300"}`}>
                    {opt.count} device{opt.count !== 1 ? "s" : ""}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-widest">
              🔤 Title <span className="text-brand-gold-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={65}
              placeholder="E.g., New Sermon Available!"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white font-semibold"
              required
            />
            <p className="text-brand-purple-300 text-xs mt-1">{title.length}/65 characters</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-widest">
              💬 Message <span className="text-brand-gold-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={240}
              rows={3}
              placeholder="E.g., Prophet Olayiwole's Sunday message is now available. Watch now to be blessed!"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white resize-none"
              required
            />
            <p className="text-brand-purple-300 text-xs mt-1">{message.length}/240 characters</p>
          </div>

          {/* Optional Link */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-widest">
              🔗 Link (Optional)
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/sermons"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white"
            />
            <p className="text-brand-purple-300 text-xs mt-1">
              Where users go when they tap the notification. Leave empty for home page.
            </p>
          </div>

          {/* Preview */}
          {(title || message) && (
            <div className="rounded-2xl bg-brand-purple-950/60 border border-brand-gold-400/30 p-4">
              <p className="text-brand-purple-300 text-xs font-black uppercase tracking-widest mb-2">
                📱 Preview
              </p>
              <div className="bg-white rounded-xl p-3 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-purple-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">🔔</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-black text-sm">{title || "Title here"}</p>
                    <p className="text-gray-700 text-xs mt-0.5 line-clamp-2">{message || "Message here"}</p>
                    <p className="text-gray-500 text-[10px] mt-1">The Triumphant Family</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSending || !title.trim() || !message.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              `🚀 Send to ${
                target === "all"
                  ? `${stats.total} devices`
                  : target === "members"
                  ? `${stats.members} members`
                  : target === "students"
                  ? `${stats.students} students`
                  : `${stats.anonymous} guests`
              }`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}