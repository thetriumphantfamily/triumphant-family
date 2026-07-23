// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETTINGS MANAGER — Full site control with 8 organized sections
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

// ━━━ 8 organized sections ━━━
const SECTIONS = [
  {
    icon: "📺",
    title: "Live Streams",
    description: "Control live stream URLs, orientation, and ON/OFF status",
    accent: "red",
    keys: [
      "is_live_streaming",
      "youtube_live_url",
      "youtube_orientation",
      "facebook_live_url",
      "facebook_orientation",
    ],
  },
  {
    icon: "📢",
    title: "Announcement Banner",
    description: "Push a message across the entire website instantly",
    accent: "gold",
    keys: ["show_banner", "banner_message", "banner_color"],
  },
  {
    icon: "📅",
    title: "Event Settings",
    description: "Update event dates and messages shown on Live page",
    accent: "purple",
    keys: ["event_start_date", "pre_live_message"],
  },
  {
    icon: "📱",
    title: "Contact & Social",
    description: "WhatsApp, email, phone, and social media links",
    accent: "green",
    keys: [
      "whatsapp_number",
      "contact_email",
      "contact_phone",
      "church_address",
      "facebook_url",
      "instagram_url",
      "youtube_url",
    ],
  },
  {
    icon: "🏛️",
    title: "Ministry Info",
    description: "Ministry name and tagline",
    accent: "purple",
    keys: ["site_name", "site_tagline"],
  },
  {
    icon: "🕐",
    title: "Service Times",
    description: "Weekly service schedule",
    accent: "blue",
    keys: ["sunday_service_time", "midweek_service_time"],
  },
  {
    icon: "💰",
    title: "Bank Details",
    description: "Ministry bank account for giving",
    accent: "green",
    keys: ["bank_name", "account_name", "account_number"],
  },
];

// ━━━ Human-friendly labels ━━━
const KEY_LABELS: Record<string, string> = {
  // Live Streams
  is_live_streaming: "🔴 We Are LIVE Right Now?",
  youtube_live_url: "YouTube Live URL (embed format)",
  youtube_orientation: "YouTube Orientation",
  facebook_live_url: "Facebook Live URL (embed format)",
  facebook_orientation: "Facebook Orientation",

  // Banner
  show_banner: "Show Announcement Banner?",
  banner_message: "Banner Message",
  banner_color: "Banner Color",

  // Event
  event_start_date: "Event Start Date",
  pre_live_message: "Pre-Live Message",

  // Contact
  whatsapp_number: "WhatsApp Number (no + or spaces)",
  contact_email: "Contact Email",
  contact_phone: "Contact Phone",
  church_address: "Church Address",
  facebook_url: "Facebook Page URL",
  instagram_url: "Instagram Profile URL",
  youtube_url: "YouTube Channel URL",

  // Ministry
  site_name: "Ministry Name",
  site_tagline: "Ministry Tagline",

  // Times
  sunday_service_time: "Sunday Service Time",
  midweek_service_time: "Wednesday Service Time",

  // Bank
  bank_name: "Bank Name",
  account_name: "Account Name",
  account_number: "Account Number",
};

// ━━━ Fields that are booleans (toggles) ━━━
const BOOLEAN_KEYS = ["is_live_streaming", "show_banner"];

// ━━━ Fields that are dropdowns ━━━
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

// ━━━ Accent colors for section headers ━━━
const ACCENT_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  red: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
  },
  gold: {
    bg: "bg-brand-gold-50",
    border: "border-brand-gold-300",
    text: "text-brand-purple-900",
  },
  purple: {
    bg: "bg-brand-purple-50",
    border: "border-brand-purple-300",
    text: "text-brand-purple-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-700",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-700",
  },
};

export default function SettingsManager({
  initialSettings,
}: {
  initialSettings: Setting[];
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>(
    {}
  );
  const [saving, setSaving] = useState(false);

  // ━━━ Get current value (pending change OR saved value) ━━━
  const getValue = (key: string): string => {
    if (key in pendingChanges) return pendingChanges[key];
    const setting = settings.find((s) => s.key === key);
    return setting?.value || "";
  };

  // ━━━ Update pending change ━━━
  const updateValue = (key: string, value: string) => {
    setPendingChanges((prev) => ({ ...prev, [key]: value }));
  };

  // ━━━ Toggle boolean ━━━
  const toggleBoolean = (key: string) => {
    const currentValue = getValue(key);
    const newValue = currentValue === "true" ? "false" : "true";
    updateValue(key, newValue);
  };

  // ━━━ Save all pending changes at once ━━━
  const saveAll = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast("No changes to save", { icon: "ℹ️" });
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();

      // Update each pending change
      for (const [key, value] of Object.entries(pendingChanges)) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value, updated_at: new Date().toISOString() })
          .eq("key", key);

        if (error) throw error;
      }

      // Update local state
      setSettings((prev) =>
        prev.map((s) =>
          s.key in pendingChanges ? { ...s, value: pendingChanges[s.key] } : s
        )
      );

      setPendingChanges({});

      toast.success(
        `✅ Saved ${Object.keys(pendingChanges).length} change(s)!`,
        {
          style: {
            background: "#16a34a",
            color: "#fff",
            border: "1px solid #FFC72C",
          },
          duration: 3000,
        }
      );

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
      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const colors = ACCENT_COLORS[section.accent];

          return (
            <div
              key={section.title}
              className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden"
            >
              {/* Section Header */}
              <div className={`${colors.bg} ${colors.border} border-b-2 p-6`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <h2
                      className={`font-heading text-2xl font-bold ${colors.text} mb-1`}
                    >
                      {section.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Fields */}
              <div className="p-6 space-y-5">
                {section.keys.map((key) => {
                  const label = KEY_LABELS[key] || key;
                  const value = getValue(key);
                  const isBoolean = BOOLEAN_KEYS.includes(key);
                  const isDropdown = key in DROPDOWN_OPTIONS;
                  const isLongText =
                    key === "banner_message" ||
                    key === "pre_live_message" ||
                    key === "church_address";
                  const isChanged = key in pendingChanges;

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isChanged
                          ? "border-brand-gold-400 bg-brand-gold-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <label className="block mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-brand-purple-900">
                            {label}
                          </span>
                          {isChanged && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-gold-400 text-brand-purple-900 font-bold">
                              MODIFIED
                            </span>
                          )}
                        </div>
                      </label>

                      {/* BOOLEAN TOGGLE */}
                      {isBoolean && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleBoolean(key)}
                            className={`relative inline-flex h-9 w-20 items-center rounded-full transition-colors ${
                              value === "true" ? "bg-red-600" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform shadow-md ${
                                value === "true" ? "translate-x-12" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`font-bold ${
                              value === "true" ? "text-red-600" : "text-gray-500"
                            }`}
                          >
                            {value === "true" ? "🔴 YES (ON)" : "⭕ NO (OFF)"}
                          </span>
                        </div>
                      )}

                      {/* DROPDOWN */}
                      {isDropdown && (
                        <select
                          value={value}
                          onChange={(e) => updateValue(key, e.target.value)}
                          className="w-full p-3 rounded-lg border-2 border-brand-purple-300 focus:border-brand-purple-500 focus:outline-none text-gray-700 bg-white"
                        >
                          {DROPDOWN_OPTIONS[key].map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* LONG TEXT */}
                      {!isBoolean && !isDropdown && isLongText && (
                        <textarea
                          value={value}
                          onChange={(e) => updateValue(key, e.target.value)}
                          rows={3}
                          placeholder={`Enter ${label.toLowerCase()}...`}
                          className="w-full p-3 rounded-lg border-2 border-brand-purple-300 focus:border-brand-purple-500 focus:outline-none text-gray-700 bg-white"
                        />
                      )}

                      {/* SHORT TEXT */}
                      {!isBoolean && !isDropdown && !isLongText && (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateValue(key, e.target.value)}
                          placeholder={`Enter ${label.toLowerCase()}...`}
                          className="w-full p-3 rounded-lg border-2 border-brand-purple-300 focus:border-brand-purple-500 focus:outline-none text-gray-700 bg-white"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Help note */}
        <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-brand-purple-900"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-brand-purple-900 mb-1">
                💡 Live Streaming Quick Guide
              </p>
              <ul className="text-brand-purple-700 text-sm space-y-1 list-disc pl-4">
                <li>
                  <strong>YouTube URL format:</strong>{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded text-xs">
                    https://www.youtube.com/embed/VIDEO_ID
                  </code>
                </li>
                <li>
                  <strong>Facebook URL format:</strong>{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded text-xs">
                    https://www.facebook.com/plugins/video.php?href=...
                  </code>
                </li>
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
              <>
                <span className="w-3 h-3 rounded-full bg-brand-gold-400 animate-pulse" />
                <p className="text-white font-bold text-sm">
                  {Object.keys(pendingChanges).length} unsaved change(s)
                </p>
              </>
            ) : (
              <>
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <p className="text-white font-semibold text-sm">
                  All changes saved
                </p>
              </>
            )}
          </div>

          <button
            onClick={saveAll}
            disabled={!hasPendingChanges || saving}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${
              hasPendingChanges && !saving
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold hover:shadow-gold-lg hover:scale-105"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                💾 Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}