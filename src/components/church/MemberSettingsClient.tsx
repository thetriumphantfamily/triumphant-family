// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER SETTINGS CLIENT – Change password + preferences
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Member {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone: string;
  password?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberSettingsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    try {
      let foundId = "";

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.id) {
                foundId = parsed.id;
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }

      if (!foundId) {
        toast.error("Please login first");
        router.push("/member/login");
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_members")
        .select("id, member_id, full_name, email, phone, password")
        .eq("id", foundId)
        .single();

      if (data) setMember(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!member) return;

    if (!currentPassword.trim()) {
      toast.error("Enter your current password");
      return;
    }
    if (currentPassword !== member.password) {
      toast.error("Current password is incorrect");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password must be different from current");
      return;
    }

    setIsChangingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tfam_members")
        .update({ password: newPassword, updated_at: new Date().toISOString() })
        .eq("id", member.id);

      if (error) {
        toast.error("Failed to change password");
        setIsChangingPassword(false);
        return;
      }

      setMember({ ...member, password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await notifyAdmin({
        title: "🔐 Password Changed",
        message: `${member.full_name} (${member.email}) changed their password from settings.`,
        type: "password_change",
        link: "/admin/church/members",
      });

      toast.success("✅ Password changed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!member) return;

    if (deletePassword !== member.password) {
      toast.error("Incorrect password. Cannot delete account.");
      return;
    }

    if (!confirm("Are you ABSOLUTELY sure? This action cannot be undone. All your data will be permanently deleted.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const supabase = createClient();

      await notifyAdmin({
        title: "⚠️ Member Deleted Account",
        message: `${member.full_name} (${member.email}) permanently deleted their account.`,
        type: "account_deletion",
        link: "/admin/church/members",
      });

      await supabase.from("tfam_members").delete().eq("id", member.id);
      localStorage.clear();
      toast.success("Account deleted. Goodbye!");
      setTimeout(() => { router.push("/"); }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
      setIsDeleting(false);
    }
  };

  const firstName = member?.full_name?.split(" ")[0] || "";

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading settings..." />;

  // ✅ NOT FOUND
  if (!member) {
    return (
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-10 shadow-xl text-center">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <p className="text-white font-bold">Member not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest">
              Settings
            </span>
          </div>
          <p className="text-white/80 font-semibold text-base mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            Account Settings
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Manage your password and account preferences.
          </p>
        </div>
      </div>

      {/* ── Account Info ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-black text-white text-base mb-4">📋 Account Information</h2>
        <div className="space-y-3">
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Full Name
            </p>
            <p className="text-white font-bold">{member.full_name}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Member ID
            </p>
            <p className="text-white font-black">{member.member_id}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Email
            </p>
            <p className="text-white font-bold break-all">{member.email}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Phone
            </p>
            <p className="text-white font-bold">{member.phone}</p>
          </div>
        </div>
        <p className="text-white/50 text-xs mt-4">
          💡 To edit your details, go to{" "}
          <a
            href="/member/profile"
            className="text-white/80 font-bold hover:text-white underline"
          >
            My Profile
          </a>
        </p>
      </div>

      {/* ── Change Password ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-black text-white text-base mb-1">🔐 Change Password</h2>
        <p className="text-brand-purple-200 text-sm mb-4">
          Update your account password for better security.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-black text-white/80 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-lg"
              >
                {showCurrent ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-black text-white/80 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-lg"
              >
                {showNew ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-black text-white/80 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                minLength={6}
                className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-lg"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit — full width mobile */}
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold active:scale-95 transition-all disabled:opacity-50"
          >
            {isChangingPassword ? "Changing..." : "🔐 Change Password"}
          </button>
        </form>
      </div>

      {/* ── Quick Links ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-black text-white text-base mb-4">🔗 Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/member/profile"
            className="flex items-center gap-3 p-4 rounded-xl bg-brand-purple-950/60 border border-brand-gold-400/30 active:scale-95 transition-all"
          >
            <span className="text-2xl">👤</span>
            <div>
              <p className="text-white font-bold text-sm">Edit Profile</p>
              <p className="text-brand-purple-300 text-xs">Update personal info</p>
            </div>
          </a>
          <a
            href="/member/notifications"
            className="flex items-center gap-3 p-4 rounded-xl bg-brand-purple-950/60 border border-brand-gold-400/30 active:scale-95 transition-all"
          >
            <span className="text-2xl">🔔</span>
            <div>
              <p className="text-white font-bold text-sm">Notifications</p>
              <p className="text-brand-purple-300 text-xs">View updates</p>
            </div>
          </a>
          <a
            href="/member/id-card"
            className="flex items-center gap-3 p-4 rounded-xl bg-brand-purple-950/60 border border-brand-gold-400/30 active:scale-95 transition-all"
          >
            <span className="text-2xl">🪪</span>
            <div>
              <p className="text-white font-bold text-sm">ID Card</p>
              <p className="text-brand-purple-300 text-xs">Digital member ID</p>
            </div>
          </a>
          <a
            href="/member/dashboard"
            className="flex items-center gap-3 p-4 rounded-xl bg-brand-purple-950/60 border border-brand-gold-400/30 active:scale-95 transition-all"
          >
            <span className="text-2xl">🏠</span>
            <div>
              <p className="text-white font-bold text-sm">Dashboard</p>
              <p className="text-brand-purple-300 text-xs">Back to overview</p>
            </div>
          </a>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-red-400/60 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
        <h2 className="font-black text-white text-base mb-2">⚠️ Danger Zone</h2>
        <p className="text-brand-purple-200 text-sm mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 rounded-xl bg-red-500/20 text-red-300 font-bold text-sm border-2 border-red-400/40 active:scale-95 transition-all"
          >
            🗑️ Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-red-500/20 border-2 border-red-400/60 rounded-xl p-4">
              <p className="text-white text-sm font-bold mb-2">
                ⚠️ This will permanently delete:
              </p>
              <ul className="text-white/80 text-xs space-y-1 list-disc pl-5">
                <li>Your account and profile</li>
                <li>All your giving records</li>
                <li>Your prayer requests and testimonies</li>
                <li>Your attendance history</li>
                <li>All notifications and messages</li>
              </ul>
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your password"
                className="w-full p-3 rounded-xl border-2 border-red-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-red-400 focus:outline-none font-semibold"
              />
            </div>
            {/* Buttons — full width stacked mobile */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                className="w-full py-4 rounded-xl bg-red-500 text-white font-black text-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "🗑️ Yes, Delete My Account"}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); }}
                className="w-full py-4 rounded-xl bg-brand-purple-950/60 text-white font-bold text-sm border border-brand-gold-400/40"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}