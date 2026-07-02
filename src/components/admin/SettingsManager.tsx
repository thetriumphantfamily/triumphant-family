// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETTINGS MANAGER — Interactive site settings management
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

// ━━━ Setting groups (organized by category) ━━━
const SETTING_GROUPS = [
  {
    title: "🔴 Live Streaming",
    description: "Control live stream status and links",
    accent: "red",
    keys: ["is_live_streaming", "youtube_live_id", "youtube_channel", "facebook_live_url"],
  },
  {
    title: "🏛️ Ministry Info",
    description: "Core ministry details",
    accent: "purple",
    keys: ["ministry_name", "ministry_tagline"],
  },
  {
    title: "📅 Service Times",
    description: "Weekly service schedule",
    accent: "blue",
    keys: ["sunday_service_time", "wednesday_service_time"],
  },
  {
    title: "📞 Contact Info",
    description: "How people can reach you",
    accent: "green",
    keys: ["contact_email", "contact_phone", "whatsapp_number", "physical_address"],
  },
  {
    title: "🌐 Social Media",
    description: "Ministry social profiles",
    accent: "pink",
    keys: ["facebook_page", "instagram_profile"],
  },
  {
    title: "💰 Bank Details",
    description: "For giving and offerings",
    accent: "gold",
    keys: ["bank_name", "account_number", "account_holder"],
  },
];

const ACCENT_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  red:    { bg: "bg-red-50",         border: "border-red-200",    text: "text-red-700",    icon: "bg-gradient-to-br from-red-500 to-red-600" },
  purple: { bg: "bg-brand-purple-50", border: "border-brand-purple-200", text: "text-brand-purple-700", icon: "bg-gradient-to-br from-brand-purple-500 to-brand-purple-700" },
  blue:   { bg: "bg-blue-50",        border: "border-blue-200",   text: "text-blue-700",   icon: "bg-gradient-to-br from-blue-500 to-blue-600" },
  green:  { bg: "bg-green-50",       border: "border-green-200",  text: "text-green-700",  icon: "bg-gradient-to-br from-green-500 to-green-600" },
  pink:   { bg: "bg-pink-50",        border: "border-pink-200",   text: "text-pink-700",   icon: "bg-gradient-to-br from-pink-500 to-pink-600" },
  gold:   { bg: "bg-brand-gold-50",  border: "border-brand-gold-200", text: "text-brand-gold-700", icon: "bg-gradient-to-br from-brand-gold-400 to-brand-gold-500" },
};

// ━━━ Human-friendly labels ━━━
const KEY_LABELS: Record<string, string> = {
  is_live_streaming:      "Currently Live?",
  youtube_live_id:        "YouTube Live Video ID",
  youtube_channel:        "YouTube Channel URL",
  facebook_live_url:      "Facebook Live URL",
  ministry_name:          "Ministry Name",
  ministry_tagline:       "Ministry Tagline",
  sunday_service_time:    "Sunday Service Time",
  wednesday_service_time: "Wednesday Service Time",
  contact_email:          "Contact Email",
  contact_phone:          "Contact Phone",
  whatsapp_number:        "WhatsApp Number",
  physical_address:       "Physical Address",
  facebook_page:          "Facebook Page URL",
  instagram_profile:      "Instagram Profile URL",
  bank_name:              "Bank Name",
  account_number:         "Account Number",
  account_holder:         "Account Holder Name",
};

export default function SettingsManager({
  initialSettings,
}: {
  initialSettings: Setting[];
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);

  // ━━━ Get setting by key ━━━
  const getSetting = (key: string) => settings.find((s) => s.key === key);

  // ━━━ Toggle boolean setting (like is_live_streaming) ━━━
  const toggleBoolean = async (key: string) => {
    const setting = getSetting(key);
    if (!setting) return;

    const newValue = setting.value === "true" ? "false" : "true";
    setBusyKey(key);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("site_settings")
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq("key", key);

      if (error) throw error;

      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value: newValue } : s))
      );

      if (key === "is_live_streaming") {
        toast.success(
          newValue === "true"
            ? "🔴 You are now LIVE!"
            : "⭕ Live stream ended",
          {
            style: {
              background: newValue === "true" ? "#dc2626" : "#6B1F8A",
              color: "#fff",
              border: "1px solid #FFC72C",
            },
            duration: 4000,
          }
        );
      } else {
        toast.success("Setting updated");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update setting");
    } finally {
      setBusyKey(null);
    }
  };

  // ━━━ Save text setting ━━━
  const saveSetting = async (key: string) => {
    setBusyKey(key);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("site_settings")
        .update({ value: editValue, updated_at: new Date().toISOString() })
        .eq("key", key);

      if (error) throw error;

      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value: editValue } : s))
      );
      setEditingKey(null);
      setEditValue("");
      toast.success("Setting saved");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not save setting");
    } finally {
      setBusyKey(null);
    }
  };

  // ━━━ Start editing ━━━
  const startEdit = (setting: Setting) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  // ━━━ Cancel edit ━━━
  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  return (
    <div className="space-y-6">
      {SETTING_GROUPS.map((group) => {
        const colors = ACCENT_COLORS[group.accent];
        const groupSettings = group.keys
          .map((k) => getSetting(k))
          .filter((s): s is Setting => s !== undefined);

        if (groupSettings.length === 0) return null;

        return (
          <div
            key={group.title}
            className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden"
          >
            {/* Group Header */}
            <div className={`${colors.bg} ${colors.border} border-b-2 p-6`}>
              <h2 className={`font-heading text-2xl font-bold ${colors.text} mb-1`}>
                {group.title}
              </h2>
              <p className="text-gray-600 text-sm">{group.description}</p>
            </div>

            {/* Settings List */}
            <div className="p-6 space-y-4">
              {groupSettings.map((setting) => {
                const isEditing = editingKey === setting.key;
                const isBusy = busyKey === setting.key;
                const isBoolean =
                  setting.value === "true" || setting.value === "false";
                const label = KEY_LABELS[setting.key] || setting.key;

                return (
                  <div
                    key={setting.key}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-brand-purple-900 mb-1">
                          {label}
                        </p>
                        {setting.description && (
                          <p className="text-gray-500 text-xs mb-2">
                            {setting.description}
                          </p>
                        )}

                        {/* Editing view (text) */}
                        {isEditing && !isBoolean && (
                          <div className="mt-3">
                            {setting.value.length > 100 ? (
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={3}
                                className="w-full p-3 rounded-lg border-2 border-brand-purple-300 focus:border-brand-purple-500 focus:outline-none text-gray-700 text-sm"
                              />
                            ) : (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-brand-purple-300 focus:border-brand-purple-500 focus:outline-none text-gray-700 text-sm"
                              />
                            )}
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => saveSetting(setting.key)}
                                disabled={isBusy}
                                className="px-4 py-2 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white text-sm font-bold transition-all disabled:opacity-50"
                              >
                                {isBusy ? "Saving..." : "💾 Save"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* View mode */}
                        {!isEditing && !isBoolean && (
                          <p className="text-gray-700 text-sm break-all">
                            {setting.value || <span className="text-gray-400 italic">Not set</span>}
                          </p>
                        )}

                        {/* Boolean toggle */}
                        {isBoolean && (
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => toggleBoolean(setting.key)}
                              disabled={isBusy}
                              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors disabled:opacity-50 ${
                                setting.value === "true"
                                  ? "bg-red-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                                  setting.value === "true"
                                    ? "translate-x-9"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span className={`font-bold text-sm ${
                              setting.value === "true"
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}>
                              {setting.value === "true" ? "🔴 YES (Live)" : "⭕ NO (Offline)"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Edit button (only for non-boolean) */}
                      {!isEditing && !isBoolean && (
                        <button
                          onClick={() => startEdit(setting)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold transition-all flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </div>
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
            <svg className="w-5 h-5 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-brand-purple-900 mb-1">
              💡 Live Streaming Tip
            </p>
            <p className="text-brand-purple-700 text-sm">
              To go live: (1) Start your YouTube live stream, (2) Copy the video
              ID from the YouTube URL (part after v=), (3) Paste it as YouTube
              Live Video ID, (4) Toggle &ldquo;Currently Live?&rdquo; to YES. The
              live banner will appear across the website immediately!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}