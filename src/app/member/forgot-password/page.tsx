// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER FORGOT PASSWORD PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MemberForgotPasswordClient from "@/components/church/MemberForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password | The Triumphant Family",
  description: "Reset your member account password at The Triumphant Family Ministry.",
};

export default function MemberForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      <section className="relative pt-8 pb-14 lg:pt-10 lg:pb-20 overflow-hidden">
        <div className="relative z-10 container-custom">

          {/* Back to Website */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-bold text-sm hover:border-brand-gold-400 hover:bg-brand-purple-950/80 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Website
            </Link>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex flex-col items-center gap-3">
              <Image
                src="/images/logo/logo.png"
                alt="The Triumphant Family"
                width={90}
                height={90}
                unoptimized
                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
                priority
              />
              <div className="text-center">
                <p className="font-heading font-bold text-white text-lg md:text-xl">
                  The Triumphant Family
                </p>
                <p className="text-brand-gold-400 text-xs md:text-sm font-semibold uppercase tracking-widest">
                  The Gleam of Salvation Apostolic Ministry
                </p>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-black text-sm uppercase tracking-widest">
                  Reset Password
                </span>
              </div>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Forgot Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                Password?
              </span>
            </h1>

            <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
              Verify your identity with your email and phone number to reset your password.
            </p>

            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Form */}
          <MemberForgotPasswordClient />

          {/* Login link */}
          <div className="text-center mt-8">
            <p className="text-brand-purple-100 text-sm">
              Remember your password?{" "}
              <Link href="/member/login" className="text-brand-gold-400 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}