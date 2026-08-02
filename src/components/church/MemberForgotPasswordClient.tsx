// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER FORGOT PASSWORD CLIENT — Verify email + phone, then set new password
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";

type Step = "verify" | "reset" | "success";

interface MemberData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

// Smart phone normalization
// Removes spaces, +, -, () and standardizes Nigerian numbers
function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/[^\d]/g, "");

  // If starts with 234, keep it (country code)
  // If starts with 0, replace with 234 (Nigerian mobile)
  // If starts with something else, add 234 if it looks like Nigerian
  if (cleaned.startsWith("234")) {
    return cleaned;
  } else if (cleaned.startsWith("0")) {
    return "234" + cleaned.substring(1);
  } else if (cleaned.length === 10) {
    // Looks like Nigerian number without country code or leading 0
    return "234" + cleaned;
  }

  return cleaned;
}

export default function MemberForgotPasswordClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("verify");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedMember, setVerifiedMember] = useState<MemberData | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !phone.trim()) {
      toast.error("Enter both email and phone");
      return;
    }

    setIsVerifying(true);
    try {
      const supabase = createClient();
      const emailClean = email.trim().toLowerCase();
      const phoneClean = normalizePhone(phone);

      const { data: members } = await supabase
        .from("tfam_members")
        .select("id, full_name, email, phone")
        .eq("email", emailClean);

      if (!members || members.length === 0) {
        toast.error("No member found with this email");
        setIsVerifying(false);
        return;
      }

      // Find member with matching phone (compare normalized)
      const match = members.find((m) => {
        const dbPhoneClean = normalizePhone(m.phone);
        return dbPhoneClean === phoneClean;
      });

      if (!match) {
        toast.error("Email and phone number do not match our records");
        setIsVerifying(false);
        return;
      }

      setVerifiedMember(match);
      setStep("reset");
      toast.success("✅ Identity verified! Set your new password.");
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!verifiedMember) {
      toast.error("Session expired. Please verify again.");
      setStep("verify");
      return;
    }

    setIsResetting(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tfam_members")
        .update({
          password: newPassword,
          updated_at: new Date().toISOString(),
        })
        .eq("id", verifiedMember.id);

      if (error) {
        toast.error("Failed to reset password");
        setIsResetting(false);
        return;
      }

      await notifyAdmin({
        title: "🔐 Password Reset",
        message: `${verifiedMember.full_name} (${verifiedMember.email}) reset their password.`,
        type: "password_reset",
        link: "/admin/church/members",
      });

      setStep("success");
      toast.success("🎉 Password reset successfully!");

      setTimeout(() => {
        router.push("/member/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 md:p-8 border-2 border-brand-gold-400/40 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {step === "verify" && (
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-xl">
                🔐
              </div>
              <div>
                <h2 className="font-heading text-lg font-black text-white">Verify Your Identity</h2>
                <p className="text-brand-purple-200 text-xs">Step 1 of 2</p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Registered Email <span className="text-brand-gold-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-white text-gray-900 focus:border-brand-gold-400 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Registered Phone Number <span className="text-brand-gold-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 XXX XXX XXXX or 080..."
                  required
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-white text-gray-900 focus:border-brand-gold-400 focus:outline-none font-semibold"
                />
                <p className="text-brand-purple-300 text-xs mt-1">
                  Any format works: +2348012345678, 2348012345678, or 08012345678
                </p>
              </div>

              <div className="bg-blue-500/20 border-2 border-blue-400/40 rounded-xl p-3">
                <p className="text-white text-xs font-semibold">
                  🔒 We use both your email and phone to verify your identity before allowing password reset.
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "🔐 Verify Identity"
                )}
              </button>
            </form>
          </div>
        )}

        {step === "reset" && verifiedMember && (
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 shadow-lg flex items-center justify-center text-xl">
                ✅
              </div>
              <div>
                <h2 className="font-heading text-lg font-black text-white">Verified!</h2>
                <p className="text-brand-purple-200 text-xs">Step 2 of 2 — Set new password</p>
              </div>
            </div>

            <div className="bg-green-500/20 border-2 border-green-400/60 rounded-xl p-4 mb-6">
              <p className="text-white text-sm">
                Welcome back, <strong className="text-brand-gold-400">{verifiedMember.full_name.split(" ")[0]}</strong>! Please set a new password below.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  New Password <span className="text-brand-gold-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 bg-white text-gray-900 focus:border-brand-gold-400 focus:outline-none font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Confirm New Password <span className="text-brand-gold-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                    className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 bg-white text-gray-900 focus:border-brand-gold-400 focus:outline-none font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isResetting ? "Resetting..." : "🔐 Reset Password"}
              </button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="relative z-10 text-center py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h2 className="font-heading text-2xl font-bold text-white mb-3">
              🎉 Password Reset Successful!
            </h2>

            <p className="text-brand-purple-100 text-sm mb-6">
              Your password has been reset successfully. You will be redirected to the login page in 3 seconds...
            </p>

            <a
              href="/member/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
            >
              Go to Login Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}