// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN SETTINGS CLIENT — School portal configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Settings {
  school_name: string;
  school_tagline: string;
  school_scripture: string;
  welcome_message: string;
  portal_notice: string;
  current_batch: string;
  school_admin_password: string;
}

export default function TDAAdminSettingsClient() {
  const [settings, setSettings] = useState<Settings>({
    school_name: "",
    school_tagline: "",
    school_scripture: "",
    welcome_message: "",
    portal_notice: "",
    current_batch: "",
    school_admin_password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_settings")
        .select("setting_key, setting_value");

      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((item) => {
          settingsMap[item.setting_key] = item.setting_value || "";
        });

        setSettings({
          school_name: settingsMap.school_name || "Triumphant Disciples Academy",
          school_tagline:
            settingsMap.school_tagline || "Rightly Dividing the Word of Truth",
          school_scripture: settingsMap.school_scripture || "",
          welcome_message: settingsMap.welcome_message || "",
          portal_notice: settingsMap.portal_notice || "",
          current_batch: settingsMap.current_batch || "Class of 2026",
          school_admin_password: settingsMap.school_admin_password || "",
        });
      }

      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const updateField = (key: keyof Settings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const saveAll = async () => {
    setSaving(true);

    try {
      const supabase = createClient();

      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from("tda_settings")
          .update({
            setting_value: value,
            updated_at: new Date().toISOString(),
          })
          .eq("setting_key", key);

        if (error) {
          console.error(`Error updating ${key}:`, error);
        }
      }

      toast.success("✅ All settings saved!", {
        style: {
          background: "#16a34a",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
      });

      setHasChanges(false);

      // Update local admin session password if changed
      const session = localStorage.getItem("tda_admin_session");
      if (session) {
        const parsed = JSON.parse(session);
        parsed.password = settings.school_admin_password;
        localStorage.setItem("tda_admin_session", JSON.stringify(parsed));
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          ⚙️ School Settings
        </h1>
        <p className="text-gray-600 text-sm">
          Configure your Bible School portal settings
        </p>
      </div>

      {/* ━━━ SECTION 1: SCHOOL IDENTITY ━━━ */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-brand-purple-50 border-b-2 border-brand-purple-100 p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏫</span>
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-purple-900 mb-1">
                School Identity
              </h2>
              <p className="text-gray-600 text-sm">
                Name and branding of your Bible School
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-brand-purple-900 mb-2">
              School Name
            </label>
            <input
              type="text"
              value={settings.school_name}
              onChange={(e) => updateField("school_name", e.target.value)}
              placeholder="Triumphant Disciples Academy"
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-purple-900 mb-2">
              School Tagline
            </label>
            <input
              type="text"
              value={settings.school_tagline}
              onChange={(e) => updateField("school_tagline", e.target.value)}
              placeholder="Rightly Dividing the Word of Truth"
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-purple-900 mb-2">
              Current Batch
            </label>
            <input
              type="text"
              value={settings.current_batch}
              onChange={(e) => updateField("current_batch", e.target.value)}
              placeholder="Class of 2026"
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* ━━━ SECTION 2: SCRIPTURE OF THE WEEK ━━━ */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-brand-gold-50 border-b-2 border-brand-gold-200 p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-purple-900 mb-1">
                Scripture of the Week
              </h2>
              <p className="text-gray-600 text-sm">
                Displayed on the student dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <textarea
            value={settings.school_scripture}
            onChange={(e) => updateField("school_scripture", e.target.value)}
            placeholder='"Study to show yourself approved unto God..." — 2 Timothy 2:15'
            rows={4}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            Include the scripture reference. This appears on every student&rsquo;s dashboard.
          </p>
        </div>
      </div>

      {/* ━━━ SECTION 3: WELCOME MESSAGE ━━━ */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-green-50 border-b-2 border-green-200 p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💬</span>
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-purple-900 mb-1">
                Welcome Message
              </h2>
              <p className="text-gray-600 text-sm">
                Shown to students when they first login
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <textarea
            value={settings.welcome_message}
            onChange={(e) => updateField("welcome_message", e.target.value)}
            placeholder="Welcome to the Triumphant Disciples Academy..."
            rows={5}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
          />
        </div>
      </div>

      {/* ━━━ SECTION 4: PORTAL NOTICE ━━━ */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-blue-50 border-b-2 border-blue-200 p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📢</span>
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-purple-900 mb-1">
                Portal Notice
              </h2>
              <p className="text-gray-600 text-sm">
                Short notice/banner displayed on the portal
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <input
            type="text"
            value={settings.portal_notice}
            onChange={(e) => updateField("portal_notice", e.target.value)}
            placeholder="Welcome to the new academic session!"
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-2">
            Keep this short — 1 line is best.
          </p>
        </div>
      </div>

      {/* ━━━ SECTION 5: ADMIN PASSWORD ━━━ */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-red-50 border-b-2 border-red-200 p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔐</span>
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-purple-900 mb-1">
                Admin Password
              </h2>
              <p className="text-gray-600 text-sm">
                Change the Bible School admin login password
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={settings.school_admin_password}
              onChange={(e) =>
                updateField("school_admin_password", e.target.value)
              }
              placeholder="Enter new admin password"
              className="w-full p-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <p className="text-xs text-red-600 mt-2 font-semibold">
            ⚠️ Changing this will require the new password on next login
          </p>
        </div>
      </div>

      {/* ━━━ STICKY SAVE BAR ━━━ */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 bg-brand-purple-900 border-t-4 border-brand-gold-400 shadow-2xl">
        <div className="p-4 flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            {hasChanges ? (
              <>
                <span className="w-3 h-3 rounded-full bg-brand-gold-400 animate-pulse" />
                <p className="text-white font-bold text-sm">
                  Unsaved changes
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
            disabled={!hasChanges || saving}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${
              hasChanges && !saving
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