// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER LOGIN PAGE — Church member login (with logo + back button)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MemberLoginForm from "@/components/church/MemberLoginForm";

export const metadata: Metadata = {
  title: "Member Login | The Triumphant Family",
  description: "Login to your member portal at The Triumphant Family Ministry.",
};

export default function MemberLoginPage() {
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

          {/* LOGO */}
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
                  Member Portal
                </span>
              </div>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Welcome{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                Back
              </span>
            </h1>

            <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
              Login to access your member portal, giving, attendance, and more.
            </p>

            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Login Form */}
          <MemberLoginForm />

          {/* Register link */}
          <div className="text-center mt-8">
            <p className="text-brand-purple-100 text-sm">
              New member?{" "}
              <Link href="/join-church" className="text-brand-gold-400 font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}