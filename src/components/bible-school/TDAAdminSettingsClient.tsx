// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN SETTINGS CLIENT – School portal configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

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
    school_name: "", school_tagline: "", school_scripture: "",
    welcome_message: "", portal_notice: "", current_batch: "",
    school_admin_password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("tda_settings").select("setting_key, setting_value");
      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((item) => { settingsMap[item.setting_key] = item.setting_value || ""; });
        setSettings({
          school_name: settingsMap.school_name || "Triumphant Disciples Academy",
          school_tagline: settingsMap.school_tagline || "Rightly Dividing the Word of Truth",
          school_scripture: settingsMap.school_scripture || "",
          welcome_message: settingsMap.welcome_message || "",
          portal_notice: settingsMap.portal_notice || "",
          current_batch: settingsMap.current_batch || "Class of 2026",
          school_admin_password: settingsMap.school_admin_password || "",
        });
      }
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const updateField = (key: keyof Settings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from("tda_settings").update({
          setting_value: value, updated_at: new Date().toISOString(),
        }).eq("setting_key", key);
      }
      toast.success("✅ All settings saved!");
      setHasChanges(false);
      const session = localStorage.getItem("tda_admin_session");
      if (session) {
        const parsed = JSON.parse(session);
        parsed.password = settings.school_admin_password;
        localStorage.setItem("tda_admin_session", JSON.stringify(parsed));
      }
    } catch { toast.error("Failed to save settings"); }
    finally { setSaving(false); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading settings..." />;

  return (
    <div className="pb-32 space-y-4">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Settings</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            ⚙️ School Settings
          </h1>
          <p className="text-brand-purple-200 text-sm">
            Configure your Bible School portal settings.
          </p>
        </div>
      </div>

      {/* ── SECTION 1: SCHOOL IDENTITY ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-black text-white text-base mb-4 flex items-center gap-2">
          🏫 School Identity
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-black text-white/80 mb-2">School Name</label>
            <input type="text" value={settings.school_name} onChange={(e) => updateField("school_name", e.target.value)}
              placeholder="Triumphant Disciples Academy"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
          </div>
          <div>
            <label className="block text-xs font-black text-white/80 mb-2">School Tagline</label>
            <input type="text" value={settings.school_tagline} onChange={(e) => updateField("school_tagline", e.target.value)}
              placeholder="Rightly Dividing the Word of Truth"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
          </div>
          <div>
            <label className="block text-xs font-black text-white/80 mb-2">Current Batch</label>
            <input type="text" value={settings.current_batch} onChange={(e) => updateField("current_batch", e.target.value)}
              placeholder="Class of 2026"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
          </div>
        </div>
      </div>

      {/* ── SECTION 2: SCRIPTURE OF THE WEEK ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-black text-white text-base mb-4 flex items-center gap-2">
          📖 Scripture of the Week
        </h2>
        <textarea
          value={settings.school_scripture}
          onChange={(e) => updateField("school_scripture", e.target.value)}
          placeholder='"Study to show yourself approved unto God..." — 2 Timothy 2:15'
          rows={4}
          className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold"
        />
        <p className="text-brand-purple-200 text-xs mt-2 font-semibold">
          Include the scripture reference. This appears on every student&rsquo;s dashboard.
        </p>
      </div>

      {/* ── SECTION 3: WELCOME MESSAGE ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-black text-white text-base mb-4 flex items-center gap-2">
          💬 Welcome Message
        </h2>
        <textarea
          value={settings.welcome_message}
          onChange={(e) => updateField("welcome_message", e.target.value)}
          placeholder="Welcome to the Triumphant Disciples Academy..."
          rows={5}
          className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold"
        />
        <p className="text-brand-purple-200 text-xs mt-2 font-semibold">
          Shown to students when they first login.
        </p>
      </div>

      {/* ── SECTION 4: PORTAL NOTICE ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-black text-white text-base mb-4 flex items-center gap-2">
          📢 Portal Notice
        </h2>
        <input
          type="text"
          value={settings.portal_notice}
          onChange={(e) => updateField("portal_notice", e.target.value)}
          placeholder="Welcome to the new academic session!"
          className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
        />
        <p className="text-brand-purple-200 text-xs mt-2 font-semibold">
          Keep this short — 1 line is best.
        </p>
      </div>

      {/* ── SECTION 5: ADMIN PASSWORD ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-red-400/60 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
        <h2 className="font-black text-white text-base mb-4 flex items-center gap-2">
          🔐 Admin Password
        </h2>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={settings.school_admin_password}
            onChange={(e) => updateField("school_admin_password", e.target.value)}
            placeholder="Enter new admin password"
            className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-xl"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <p className="text-brand-purple-200 text-xs mt-2 font-semibold">
          ⚠️ Changing this will require the new password on next login.
        </p>
      </div>

      {/* ── STICKY SAVE BAR ── */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 bg-brand-purple-900 border-t-4 border-brand-gold-400 shadow-2xl">
        <div className="p-4 flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            {hasChanges ? (
              <>
                <span className="w-3 h-3 rounded-full bg-brand-gold-400 animate-pulse" />
                <p className="text-white font-black text-sm">Unsaved changes</p>
              </>
            ) : (
              <>
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <p className="text-white font-semibold text-sm">All changes saved</p>
              </>
            )}
          </div>
          <button
            onClick={saveAll}
            disabled={!hasChanges || saving}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-black transition-all ${
              hasChanges && !saving
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold active:scale-95"
                : "bg-brand-purple-950/60 text-white/40 border border-brand-gold-400/20 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : "💾 Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}