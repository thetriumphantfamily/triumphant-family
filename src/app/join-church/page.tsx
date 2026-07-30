// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOIN CHURCH PAGE — Membership registration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Metadata } from "next";
import Link from "next/link";
import MemberRegisterForm from "@/components/church/MemberRegisterForm";

export const metadata: Metadata = {
  title: "Become a Member | The Triumphant Family",
  description:
    "Join The Triumphant Family Ministry. Register as a member and become part of our growing family of believers.",
};

export default function JoinChurchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      <section className="relative pt-10 pb-14 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="relative z-10 container-custom">

          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200 mb-6">
            <Link href="/" className="hover:text-brand-gold-400 transition-colors">
              Home
            </Link>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-brand-gold-400 font-semibold">Become a Member</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-5">
              <svg
                className="w-8 h-8 lg:w-10 lg:h-10 text-brand-purple-900"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>

            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">
                  Church Membership
                </span>
              </div>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Become a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                Member
              </span>
            </h1>

            <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
              Join The Triumphant Family and become part of our growing
              community of believers. Fill in your details below to register.
            </p>

            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Registration Form */}
          <MemberRegisterForm />

          {/* Login link */}
          <div className="text-center mt-8">
            <p className="text-brand-purple-100 text-sm">
              Already a member?{" "}
              <Link
                href="/member/login"
                className="text-brand-gold-400 font-bold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}