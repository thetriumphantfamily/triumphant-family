// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBERSHIP LANDING PAGE — Choose Register or Login
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership | The Triumphant Family",
  description:
    "Join The Triumphant Family Ministry or login to your member portal. Access giving, prayer requests, devotionals, sermons and more.",
};

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 py-16 md:py-24 px-4">
      <div className="container-custom max-w-5xl">
        {/* Back to Website */}
        <div className="mb-8">
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

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Membership
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Membership
            </span>
          </h1>

          <p className="text-brand-purple-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Join our family or access your member portal to give, submit prayer requests, read devotionals, and grow with us.
          </p>
        </div>

        {/* Two Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* NEW MEMBER CARD */}
          <Link href="/join-church" className="group">
            <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  👤
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
                  <span className="text-brand-gold-300 text-xs font-black uppercase tracking-widest">
                    New Here
                  </span>
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                  Become a Member
                </h2>

                <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed mb-6">
                  Register today and become part of The Triumphant Family. Get access to giving, prayer requests, devotionals, and more.
                </p>

                <ul className="space-y-2 mb-8">
                  <li className="flex items-center gap-2 text-brand-purple-200 text-sm">
                    <span className="text-brand-gold-400">✓</span>
                    <span>Complete registration form</span>
                  </li>
                  <li className="flex items-center gap-2 text-brand-purple-200 text-sm">
                    <span className="text-brand-gold-400">✓</span>
                    <span>Get your unique Member ID</span>
                  </li>
                  <li className="flex items-center gap-2 text-brand-purple-200 text-sm">
                    <span className="text-brand-gold-400">✓</span>
                    <span>Access member portal</span>
                  </li>
                </ul>

                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold group-hover:scale-105 transition-all">
                  Register Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* EXISTING MEMBER CARD */}
          <Link href="/member/login" className="group">
            <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  🔑
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
                  <span className="text-brand-gold-300 text-xs font-black uppercase tracking-widest">
                    Already a Member
                  </span>
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                  Member Login
                </h2>

                <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed mb-6">
                  Welcome back! Login to your portal to access giving, prayers, devotionals, and all member features.
                </p>

                <ul className="space-y-2 mb-8">
                  <li className="flex items-center gap-2 text-brand-purple-200 text-sm">
                    <span className="text-brand-gold-400">✓</span>
                    <span>Personal dashboard</span>
                  </li>
                  <li className="flex items-center gap-2 text-brand-purple-200 text-sm">
                    <span className="text-brand-gold-400">✓</span>
                    <span>Give &amp; track history</span>
                  </li>
                  <li className="flex items-center gap-2 text-brand-purple-200 text-sm">
                    <span className="text-brand-gold-400">✓</span>
                    <span>Daily devotionals</span>
                  </li>
                </ul>

                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold group-hover:scale-105 transition-all">
                  Login Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom info */}
        <div className="text-center mt-12">
          <p className="text-brand-purple-200 text-sm">
            Need help? Contact us at{" "}
            <a href="mailto:thetriumphantgrace@gmail.com" className="text-brand-gold-400 font-bold hover:underline">
              thetriumphantgrace@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}