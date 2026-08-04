// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETTINGS MANAGER — Full site control with organized sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

const SECTIONS = [
  { icon: "📺", title: "Live Streams", description: "Control live stream URLs, orientation, and ON/OFF status", keys: ["is_live_streaming", "youtube_live_url", "youtube_orientation", "facebook_live_url", "facebook_orientation"] },
  { icon: "📢", title: "Announcement Banner", description: "Push a message across the entire website instantly", keys: ["show_banner", "banner_message", "banner_color"] },
  { icon: "📅", title: "Event Settings", description: "Update event dates and messages shown on Live page", keys: ["event_start_date", "pre_live_message"] },
  { icon: "📱", title: "Contact & Social", description: "WhatsApp, email, phone, and social media links", keys: ["whatsapp_number", "contact_email", "contact_phone", "church_address", "facebook_url", "instagram_url", "youtube_url"] },
  { icon: "🛕", title: "Ministry Info", description: "Ministry name and tagline", keys: ["site_name", "site_tagline"] },
  { icon: "🕐", title: "Service Times", description: "Weekly service schedule", keys: ["sunday_service_time", "midweek_service_time"] },
  { icon: "💰", title: "Bank Details", description: "Ministry bank account for giving", keys: ["bank_name", "account_name", "account_number"] },
];

const KEY_LABELS: Record<string, string> = {
  is_live_streaming: "🔴 We Are LIVE Right Now?",
  youtube_live_url: "YouTube Live URL (embed format)",
  youtube_orientation: "YouTube Orientation",
  facebook_live_url: "Facebook Live URL (embed format)",
  facebook_orientation: "Facebook Orientation",
  show_banner: "Show Announcement Banner?",
  banner_message: "Banner Message",
  banner_color: "Banner Color",
  event_start_date: "Event Start Date",
  pre_live_message: "Pre-Live Message",
  whatsapp_number: "WhatsApp Number (no + or spaces)",
  contact_email: "Contact Email",
  contact_phone: "Contact Phone",
  church_address: "Church Address",
  facebook_url: "Facebook Page URL",
  instagram_url: "Instagram Profile URL",
  youtube_url: "YouTube Channel URL",
  site_name: "Ministry Name",
  site_tagline: "Ministry Tagline",
  sunday_service_time: "Sunday Service Time",
  midweek_service_time: "Wednesday Service Time",
  bank_name: "Bank Name",
  account_name: "Account Name",
  account_number: "Account Number",
};

const BOOLEAN_KEYS = ["is_live_streaming", "show_banner"];

const DROPDOWN_OPTIONS: Record<string, { value: string; label: string }[]> = {
  youtube_orientation: [
    { value: "landscape", label: "🖥️ Landscape (16:9) — Normal videos" },
    { value: "vertical", label: "📱 Vertical (9:16) — Shorts/Reels" },
  ],
  facebook_orientation: [
    { value: "landscape", label: "🖥️ Landscape (16:9) — Normal videos" },
    { value: "vertical", label: "📱 Vertical (9:16) — Shorts/Reels" },
  ],
  banner_color: [
    { value: "info", label: "ℹ️ Info (Teal) — General information" },
    { value: "warning", label: "⚠️ Warning (Gold) — Important reminders" },
    { value: "success", label: "✅ Success (Green) — Good news" },
    { value: "alert", label: "🚨 Alert (Red) — Urgent messages" },
  ],
};

export default function SettingsManager({ initialSettings }: { initialSettings: Setting[] }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const getValue = (key: string): string => {
    if (key in pendingChanges) return pendingChanges[key];
    const setting = settings.find((s) => s.key === key);
    return setting?.value || "";
  };

  const updateValue = (key: string, value: string) => {
    setPendingChanges((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBoolean = (key: string) => {
    const currentValue = getValue(key);
    updateValue(key, currentValue === "true" ? "false" : "true");
  };

  const saveAll = async () => {
    if (Object.keys(pendingChanges).length === 0) { toast("No changes to save", { icon: "ℹ️" }); return; }
    setSaving(true);
    try {
      const supabase = createClient();
      for (const [key, value] of Object.entries(pendingChanges)) {
        const { error } = await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
        if (error) throw error;
      }
      setSettings((prev) => prev.map((s) => s.key in pendingChanges ? { ...s, value: pendingChanges[s.key] } : s));
      setPendingChanges({});
      toast.success(`✅ Saved ${Object.keys(pendingChanges).length} change(s)!`, { duration: 3000 });
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("❌ Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="pb-32">
      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            {/* Section Header */}
            <div className="relative z-10 p-6 border-b border-brand-gold-400/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{section.icon}</span>
                <div>
                  <h2 className="font-heading text-xl font-black text-white mb-0.5">{section.title}</h2>
                  <p className="text-brand-purple-200 font-semibold text-sm">{section.description}</p>
                </div>
              </div>
            </div>

            {/* Section Fields */}
            <div className="relative z-10 p-6 space-y-4">
              {section.keys.map((key) => {
                const label = KEY_LABELS[key] || key;
                const value = getValue(key);
                const isBoolean = BOOLEAN_KEYS.includes(key);
                const isDropdown = key in DROPDOWN_OPTIONS;
                const isLongText = key === "banner_message" || key === "pre_live_message" || key === "church_address";
                const isChanged = key in pendingChanges;

                return (
                  <div key={key} className={`p-4 rounded-2xl border-2 transition-all ${isChanged ? "border-brand-gold-400 bg-brand-purple-950/60" : "border-brand-gold-400/30 bg-brand-purple-950/40"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <label className="font-black text-white text-sm">{label}</label>
                      {isChanged && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black">MODIFIED</span>
                      )}
                    </div>

                    {/* BOOLEAN TOGGLE */}
                    {isBoolean && (
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleBoolean(key)} className={`relative inline-flex h-9 w-20 items-center rounded-full transition-colors ${value === "true" ? "bg-red-600" : "bg-brand-purple-950/60 border border-brand-gold-400/40"}`}>
                          <span className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform shadow-md ${value === "true" ? "translate-x-12" : "translate-x-1"}`} />
                        </button>
                        <span className={`font-black text-sm ${value === "true" ? "text-red-400" : "text-brand-purple-300"}`}>
                          {value === "true" ? "🔴 YES (ON)" : "⭕ NO (OFF)"}
                        </span>
                      </div>
                    )}

                    {/* DROPDOWN */}
                    {isDropdown && (
                      <select value={value} onChange={(e) => updateValue(key, e.target.value)} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold">
                        {DROPDOWN_OPTIONS[key].map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-brand-purple-900">{opt.label}</option>
                        ))}
                      </select>
                    )}

                    {/* LONG TEXT */}
                    {!isBoolean && !isDropdown && isLongText && (
                      <textarea value={value} onChange={(e) => updateValue(key, e.target.value)} rows={3} placeholder={`Enter ${label.toLowerCase()}...`} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold resize-none" />
                    )}

                    {/* SHORT TEXT */}
                    {!isBoolean && !isDropdown && !isLongText && (
                      <input type="text" value={value} onChange={(e) => updateValue(key, e.target.value)} placeholder={`Enter ${label.toLowerCase()}...`} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Help note */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="relative z-10 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <div>
              <p className="font-black text-white mb-2">💡 Live Streaming Quick Guide</p>
              <ul className="text-brand-purple-200 font-semibold text-sm space-y-1 list-disc pl-4">
                <li><strong className="text-white">YouTube URL format:</strong> <code className="bg-brand-purple-950/60 px-1.5 py-0.5 rounded text-xs text-brand-gold-400">https://www.youtube.com/embed/VIDEO_ID</code></li>
                <li><strong className="text-white">Facebook URL format:</strong> <code className="bg-brand-purple-950/60 px-1.5 py-0.5 rounded text-xs text-brand-gold-400">https://www.facebook.com/plugins/video.php?href=...</code></li>
                <li>Toggle &ldquo;We Are LIVE&rdquo; ON when your stream starts</li>
                <li>Turn it OFF after the service ends</li>
                <li>Announcement banner shows on ALL pages when enabled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ STICKY SAVE BAR ━━━ */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 bg-brand-purple-900 border-t-4 border-brand-gold-400 shadow-2xl">
        <div className="p-4 flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            {hasPendingChanges ? (
              <><span className="w-3 h-3 rounded-full bg-brand-gold-400 animate-pulse" /><p className="text-white font-black text-sm">{Object.keys(pendingChanges).length} unsaved change(s)</p></>
            ) : (
              <><span className="w-3 h-3 rounded-full bg-green-400" /><p className="text-white font-semibold text-sm">All changes saved</p></>
            )}
          </div>
          <button
            onClick={saveAll}
            disabled={!hasPendingChanges || saving}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-black transition-all ${hasPendingChanges && !saving ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold hover:scale-105" : "bg-brand-purple-950/60 text-brand-purple-400 cursor-not-allowed border border-brand-gold-400/20"}`}
          >
            {saving ? (
              <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Saving...</>
            ) : (
              <><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>💾 Save All Settings</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}