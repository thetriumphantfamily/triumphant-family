"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        }
      );

      if (error) throw error;

      setEmailSent(true);
      toast.success("Password reset email sent!", {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not send reset email. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-purple-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-magenta-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo/logo.png"
              alt="The Triumphant Family"
              width={80}
              height={80}
              className="mx-auto"
              unoptimized
            />
          </Link>
          <h1 className="text-2xl font-heading font-bold text-white mt-4">
            Reset Password
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {emailSent ? (
            // Success state
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Check Your Email!
              </h2>
              <p className="text-gray-500 mb-6">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-bold text-brand-purple-600">
                  {email}
                </span>
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Click the link in the email to reset your password. If you
                don&apos;t see it, check your spam folder.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-brand-purple-600 hover:text-brand-purple-700 font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            // Form state
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-500 text-sm">
                  Enter your admin email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="thetriumphantgrace@gmail.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none transition-colors text-gray-900"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-purple-600 to-brand-purple-700 hover:from-brand-purple-700 hover:to-brand-purple-800 text-white font-bold shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-purple-600 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}