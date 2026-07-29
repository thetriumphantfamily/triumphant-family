// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA REGISTER PAGE — Student registration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Metadata } from "next";
import Link from "next/link";
import TDARegisterForm from "@/components/bible-school/TDARegisterForm";

export const metadata: Metadata = {
  title: "Register | Triumphant Disciples Academy",
  description:
    "Register for the Triumphant Disciples Academy Bible School programme. Fill in your details and start your discipleship journey.",
};

export default function TDARegisterPage() {
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
            <Link
              href="/bible-school"
              className="hover:text-brand-gold-400 transition-colors"
            >
              Bible School
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
            <span className="text-brand-gold-400 font-semibold">Register</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-10 max-w-2xl mx-auto">
            {/* Gold icon */}
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
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">
                  Student Registration
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                Academy
              </span>
            </h1>

            <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
              Fill in your details below to begin your discipleship journey.
              Your registration will be reviewed and approved by our team.
            </p>

            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Registration Form */}
          <TDARegisterForm />

          {/* Login link */}
          <div className="text-center mt-8">
            <p className="text-brand-purple-100 text-sm">
              Already registered?{" "}
              <Link
                href="/bible-school/login"
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