// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN SETTINGS CLIENT – Church configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface SettingRow {
  setting_key: string;
  setting_value: string;
}

export default function ChurchAdminSettingsClient() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("tfam_church_settings").select("*");
      const map: Record<string, string> = {};
      (data || []).forEach((row: SettingRow) => {
        map[row.setting_key] = row.setting_value || "";
      });
      setSettings(map);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from("tfam_church_settings")
          .upsert(
            { setting_key: key, setting_value: value, updated_at: new Date().toISOString() },
            { onConflict: "setting_key" }
          );
      }
      toast.success("✅ Settings saved!");
    } catch { toast.error("Failed to save"); }
    finally { setIsSaving(false); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading settings..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Settings</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Church Settings
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Configure your church management system.
          </p>
        </div>
      </div>

      {/* ── Settings Cards ── */}
      <div className="space-y-4">

        {/* Welcome Message */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-black text-white text-base mb-1">📝 Welcome Message</h3>
          <p className="text-brand-purple-200 text-sm mb-3">Shown to members when they log in.</p>
          <textarea
            value={settings.welcome_message || ""}
            onChange={(e) => updateSetting("welcome_message", e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold"
          />
        </div>

        {/* Church Name */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-black text-white text-base mb-1">⛪ Church Name</h3>
          <p className="text-brand-purple-200 text-sm mb-3">Display name used across the system.</p>
          <input
            type="text"
            value={settings.church_name || ""}
            onChange={(e) => updateSetting("church_name", e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
          />
        </div>

        {/* Membership Approval */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-black text-white text-base mb-1">👥 Membership Approval</h3>
          <p className="text-brand-purple-200 text-sm mb-3">
            Require admin approval for new member registrations.
          </p>
          <label
            className="flex items-center gap-3 cursor-pointer"
            onClick={() =>
              updateSetting(
                "membership_approval_required",
                settings.membership_approval_required === "true" ? "false" : "true"
              )
            }
          >
            <div className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.membership_approval_required === "true"
                ? "bg-green-500"
                : "bg-brand-purple-950/80 border border-brand-gold-400/40"
            }`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                settings.membership_approval_required === "true" ? "translate-x-7" : "translate-x-1"
              }`} />
            </div>
            <span className="text-white font-bold text-sm">
              {settings.membership_approval_required === "true"
                ? "Approval Required"
                : "Auto-Approve"}
            </span>
          </label>
        </div>

        {/* Admin Password */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-black text-white text-base mb-1">🔐 Admin Password</h3>
          <p className="text-brand-purple-200 text-sm mb-3">
            Change the church management admin password.
          </p>
          <input
            type="text"
            value={settings.church_admin_password || ""}
            onChange={(e) => updateSetting("church_admin_password", e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
          />
        </div>
      </div>

      {/* ── Save Button — full width mobile ── */}
      <button
        onClick={saveSettings}
        disabled={isSaving}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold active:scale-95 transition-all disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "💾 Save All Settings"}
      </button>
    </div>
  );
}