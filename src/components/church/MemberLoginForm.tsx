// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER LOGIN FORM — Church member login with status checking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function MemberLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "pending" | "rejected" | "error";
    title: string;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const supabase = createClient();

      // Find member by email
      const { data: member, error: memberError } = await supabase
        .from("tfam_members")
        .select("*")
        .eq("email", formData.email.trim().toLowerCase())
        .single();

      if (memberError || !member) {
        toast.error("Email not found. Please register first.");
        setIsSubmitting(false);
        return;
      }

      // Check status
      if (member.status === "pending") {
        setStatusMessage({
          type: "pending",
          title: "⏳ Registration Pending",
          message: "Your membership registration is currently being reviewed by the church admin. You will be notified once approved. Thank you for your patience!",
        });
        setIsSubmitting(false);
        return;
      }

      if (member.status === "rejected") {
        setStatusMessage({
          type: "rejected",
          title: "❌ Registration Not Approved",
          message: "Your membership was not approved. Please contact the church administrator for more information.",
        });
        setIsSubmitting(false);
        return;
      }

      if (member.status !== "approved") {
        setStatusMessage({
          type: "error",
          title: "⚠️ Account Issue",
          message: "There is an issue with your account. Please contact the administrator.",
        });
        setIsSubmitting(false);
        return;
      }

      // Save member session
      const session = {
        id: member.id,
        member_id: member.member_id,
        full_name: member.full_name,
        email: member.email,
        photo_url: member.photo_url,
        department: member.department,
        loggedInAt: new Date().toISOString(),
      };

      localStorage.setItem("tfam_member_session", JSON.stringify(session));

      toast.success(`Welcome back, ${member.full_name}!`, {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
      });

      setTimeout(() => {
        router.push("/member/dashboard");
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ━━━ STATUS MESSAGE ━━━
  if (statusMessage) {
    const bgColor =
      statusMessage.type === "pending"
        ? "from-yellow-500 to-yellow-600"
        : statusMessage.type === "rejected"
        ? "from-red-500 to-red-600"
        : "from-gray-500 to-gray-600";

    return (
      <div className="max-w-md mx-auto">
        <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 md:p-8 border-2 border-brand-gold-400/40 shadow-2xl text-center">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${bgColor} shadow-lg mb-4`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {statusMessage.type === "pending" ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </div>

          <h2 className="font-heading text-xl md:text-2xl font-bold text-white mb-3">
            {statusMessage.title}
          </h2>

          <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed mb-6">
            {statusMessage.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setStatusMessage(null)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-bold hover:border-brand-gold-400 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ━━━ LOGIN FORM ━━━
  return (
    <div className="max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 md:p-8 border-2 border-brand-gold-400/40 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Email Address <span className="text-brand-gold-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Password <span className="text-brand-gold-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Your password"
                className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base lg:text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </>
            ) : (
              <>
                🔓 Login to Portal
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Scripture */}
        <div className="mt-6 pt-6 border-t border-brand-gold-400/30 text-center">
          <p className="text-brand-gold-400 text-sm italic font-medium">
            &ldquo;Behold, how good and how pleasant it is for brethren to dwell together in unity!&rdquo;
          </p>
          <p className="text-brand-purple-200 text-xs mt-1">— Psalm 133:1</p>
        </div>
      </form>
    </div>
  );
}